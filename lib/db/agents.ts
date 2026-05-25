import { ensureAdminDatabase } from "@/lib/db/admin";
import { getPool } from "@/lib/db";
import { requireUuid } from "@/lib/db/ids";

type AgentTaskInput = {
  agentName: string;
  taskType: string;
  input: unknown;
  status?: "queued" | "running" | "completed" | "failed";
  costEstimate?: number;
};

export async function createAgentTask(input: AgentTaskInput) {
  await ensureAdminDatabase();
  const result = await getPool().query<{ id: string }>(
    `
      insert into agent_tasks (
        agent_id, agent_name, title, task_type, status, input, input_json,
        cost_estimate_inr, cost_estimate
      )
      values ($1, $2, $3, $4, $5, $6, $6, $7, $7)
      returning id;
    `,
    [
      slugAgent(input.agentName),
      input.agentName,
      `${input.agentName}: ${input.taskType}`,
      input.taskType,
      input.status ?? "running",
      JSON.stringify(input.input ?? {}),
      input.costEstimate ?? 0
    ]
  );
  return result.rows[0].id;
}

export async function completeAgentTask(taskId: string, output: unknown, costEstimate = 0) {
  await ensureAdminDatabase();
  const agentTaskId = requireUuid(taskId, "taskId");
  const pool = getPool();
  await pool.query(
    `
      update agent_tasks
      set status = 'completed',
          output = $2,
          output_json = $2,
          cost_estimate_inr = $3,
          cost_estimate = $3,
          completed_at = now(),
          updated_at = now()
      where id = $1;
    `,
    [agentTaskId, JSON.stringify(output ?? {}), costEstimate]
  );
  await pool.query(
    `
      insert into cost_usage_logs (task_id, agent_id, usage_type, estimated_cost_inr)
      select $1, agent_id, task_type, $2 from agent_tasks where id = $1;
    `,
    [agentTaskId, costEstimate]
  );
}

export async function failAgentTask(taskId: string, error: string, output: unknown = {}) {
  await ensureAdminDatabase();
  const agentTaskId = requireUuid(taskId, "taskId");
  await getPool().query(
    `
      update agent_tasks
      set status = 'failed',
          error = $2,
          error_message = $2,
          output = $3,
          output_json = $3,
          completed_at = now(),
          updated_at = now()
      where id = $1;
    `,
    [agentTaskId, error, JSON.stringify(output ?? {})]
  );
}

export function slugAgent(name: string) {
  return name
    .toLowerCase()
    .replace(/^cwi\s+/, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
