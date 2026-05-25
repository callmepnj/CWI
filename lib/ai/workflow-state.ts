import { getPool } from "@/lib/db";
import { ensureAdminDatabase } from "@/lib/db/admin";
import { optionalUuid } from "@/lib/db/ids";

export const workflowSteps = [
  ["researching", "Researching"],
  ["verifying", "Verifying"],
  ["drafting", "Drafting"],
  ["seo", "SEO"],
  ["social", "Social"],
  ["awaiting_approval", "Awaiting Approval"],
  ["publishing", "Publishing"],
  ["published", "Published"],
  ["public_url_checked", "Public URL Checked"]
] as const;

type WorkflowStepKey = (typeof workflowSteps)[number][0];

export async function createWorkflow(input: { workflowType: string; topic: string; payload?: unknown }) {
  await ensureAdminDatabase();
  const result = await getPool().query<{ id: string }>(
    `
      insert into cwi_agent_workflows (workflow_type, topic, status, current_step, progress_percent, input)
      values ($1, $2, 'running', 'researching', 1, $3)
      returning id;
    `,
    [input.workflowType, input.topic, JSON.stringify(input.payload ?? {})]
  );
  const workflowId = result.rows[0].id;

  for (const [stepKey, label] of workflowSteps) {
    await getPool().query(
      `
        insert into cwi_agent_workflow_steps (workflow_id, step_key, label, status, progress_percent)
        values ($1, $2, $3, 'queued', $4)
        on conflict (workflow_id, step_key) do nothing;
      `,
      [workflowId, stepKey, label, progressForStep(stepKey, "queued")]
    );
  }

  await setWorkflowStep(workflowId, "researching", "running");
  return workflowId;
}

export async function setWorkflowStep(workflowId: string | undefined, stepKey: WorkflowStepKey, status: "queued" | "running" | "completed" | "failed", output?: unknown, error?: string) {
  const safeWorkflowId = optionalUuid(workflowId);
  if (!safeWorkflowId) return;

  await ensureAdminDatabase();
  const progress = progressForStep(stepKey, status);
  await getPool().query(
    `
      update cwi_agent_workflow_steps
      set status = $3,
          progress_percent = $4,
          output = coalesce($5::jsonb, output),
          error_message = nullif($6, ''),
          started_at = case when $3 = 'running' then coalesce(started_at, now()) else started_at end,
          completed_at = case when $3 in ('completed', 'failed') then now() else completed_at end,
          updated_at = now()
      where workflow_id = $1 and step_key = $2;
    `,
    [safeWorkflowId, stepKey, status, progress, output === undefined ? null : JSON.stringify(output), error ?? ""]
  );
  await getPool().query(
    `
      update cwi_agent_workflows
      set current_step = $2,
          status = case when $3 = 'failed' then 'failed' else status end,
          progress_percent = greatest(progress_percent, $4),
          error_message = case when $3 = 'failed' then nullif($5, '') else error_message end,
          updated_at = now()
      where id = $1;
    `,
    [safeWorkflowId, stepKey, status, progress, error ?? ""]
  );
}

export async function completeWorkflow(input: { workflowId?: string; approvalQueueId?: string; articleDraftId?: string; publicUrl?: string; output?: unknown }) {
  const workflowId = optionalUuid(input.workflowId);
  if (!workflowId) return;

  await ensureAdminDatabase();
  await getPool().query(
    `
      update cwi_agent_workflows
      set status = 'completed',
          current_step = 'public_url_checked',
          progress_percent = 100,
          approval_queue_id = coalesce($2, approval_queue_id),
          article_draft_id = coalesce($3, article_draft_id),
          public_url = coalesce(nullif($4, ''), public_url),
          output = $5,
          updated_at = now(),
          completed_at = now()
      where id = $1;
    `,
    [workflowId, optionalUuid(input.approvalQueueId), optionalUuid(input.articleDraftId), input.publicUrl ?? "", JSON.stringify(input.output ?? {})]
  );
  await setWorkflowStep(workflowId, "public_url_checked", "completed");
}

export async function markWorkflowAwaitingApproval(input: { workflowId?: string; approvalQueueId?: string; articleDraftId?: string; output?: unknown }) {
  const workflowId = optionalUuid(input.workflowId);
  if (!workflowId) return;

  await ensureAdminDatabase();
  await setWorkflowStep(workflowId, "awaiting_approval", "completed", input.output);
  await getPool().query(
    `
      update cwi_agent_workflows
      set status = 'awaiting_approval',
          current_step = 'awaiting_approval',
          progress_percent = greatest(progress_percent, 66),
          approval_queue_id = coalesce($2, approval_queue_id),
          article_draft_id = coalesce($3, article_draft_id),
          output = coalesce($4::jsonb, output),
          updated_at = now()
      where id = $1;
    `,
    [
      workflowId,
      optionalUuid(input.approvalQueueId),
      optionalUuid(input.articleDraftId),
      input.output === undefined ? null : JSON.stringify(input.output)
    ]
  );
}

export async function failWorkflow(workflowId: string | undefined, error: string) {
  const safeWorkflowId = optionalUuid(workflowId);
  if (!safeWorkflowId) return;

  await ensureAdminDatabase();
  await getPool().query(
    `
      update cwi_agent_workflows
      set status = 'failed',
          error_message = $2,
          updated_at = now(),
          completed_at = now()
      where id = $1;
    `,
    [safeWorkflowId, error]
  );
}

function progressForStep(stepKey: WorkflowStepKey, status: string) {
  const index = workflowSteps.findIndex(([key]) => key === stepKey);
  const base = Math.max(0, index) * 11;
  if (status === "queued") return base;
  if (status === "running") return Math.min(94, base + 5);
  if (stepKey === "public_url_checked" && status === "completed") return 100;
  return Math.min(98, base + 11);
}
