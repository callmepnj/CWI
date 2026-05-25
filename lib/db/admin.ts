import { ensureAdminOsTables, getPool } from "@/lib/db";

export async function ensureAdminDatabase() {
  await ensureAdminOsTables();
}

export async function getMonthCostInr() {
  await ensureAdminDatabase();
  const result = await getPool().query<{ cost: string }>(
    `select coalesce(sum(estimated_cost_inr), 0)::numeric(10,2)::text as cost from cost_usage_logs where created_at >= date_trunc('month', now());`
  );
  return Number(result.rows[0]?.cost ?? 0);
}

export async function getDayCostInr() {
  await ensureAdminDatabase();
  const result = await getPool().query<{ cost: string }>(
    `select coalesce(sum(estimated_cost_inr), 0)::numeric(10,2)::text as cost from cost_usage_logs where created_at >= current_date;`
  );
  return Number(result.rows[0]?.cost ?? 0);
}
