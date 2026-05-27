import { ensureAdminDatabase } from "@/lib/db/admin";
import { getPool } from "@/lib/db";
import { requireUuid } from "@/lib/db/ids";

export type SupporterNoteStatus = "pending" | "approved" | "rejected" | "hidden";
export type AmountDisplayMode = "hidden" | "exact" | "range";

export type PublicSupporterNote = {
  id: string;
  displayName: string;
  handle: string;
  amountLabel: string;
  comment: string;
  supporterBadge: string;
  createdAt: string;
  approvedAt: string;
};

export type AdminSupporterNote = PublicSupporterNote & {
  amount: string;
  amountDisplayMode: AmountDisplayMode;
  amountRange: string;
  consentToDisplay: boolean;
  paymentVerified: boolean;
  status: SupporterNoteStatus;
  adminNotes: string;
  updatedAt: string;
};

type SupporterNoteRow = {
  id: string;
  display_name: string | null;
  handle: string | null;
  amount: string | null;
  amount_display_mode: string | null;
  amount_range: string | null;
  comment: string;
  supporter_badge: string | null;
  consent_to_display: boolean | null;
  payment_verified: boolean | null;
  status: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
};

export async function getApprovedSupporterNotes(limit = 24): Promise<PublicSupporterNote[]> {
  await ensureAdminDatabase();
  const result = await getPool().query<SupporterNoteRow>(
    `
      select id::text, display_name, handle, amount::text, amount_display_mode, amount_range,
        comment, supporter_badge, consent_to_display, payment_verified, status,
        null::text as admin_notes, created_at::text, updated_at::text, approved_at::text
      from supporter_notes
      where status = 'approved'
        and consent_to_display = true
        and payment_verified = true
      order by approved_at desc nulls last, created_at desc
      limit $1
    `,
    [limit]
  );

  return result.rows.map(rowToPublicNote);
}

export async function getAdminSupporterNotes(limit = 120): Promise<AdminSupporterNote[]> {
  await ensureAdminDatabase();
  const result = await getPool().query<SupporterNoteRow>(
    `
      select id::text, display_name, handle, amount::text, amount_display_mode, amount_range,
        comment, supporter_badge, consent_to_display, payment_verified, status,
        admin_notes, created_at::text, updated_at::text, approved_at::text
      from supporter_notes
      order by created_at desc
      limit $1
    `,
    [limit]
  );

  return result.rows.map(rowToAdminNote);
}

export async function createPublicSupporterNote(input: {
  displayName?: string;
  handle?: string;
  amount?: string;
  amountDisplayMode?: string;
  comment?: string;
  consentToDisplay?: boolean;
  confirmation?: boolean;
}) {
  await ensureAdminDatabase();

  if (!input.consentToDisplay || !input.confirmation) {
    throw new Error("Consent and confirmation are required.");
  }

  const comment = clean(input.comment, 320);
  if (comment.length < 3) {
    throw new Error("Supporter note is required.");
  }

  const amount = normalizeAmount(input.amount);
  const amountDisplayMode = normalizeAmountDisplayMode(input.amountDisplayMode);
  const amountRange = amount ? amountRangeFor(Number(amount)) : "";

  const result = await getPool().query<SupporterNoteRow>(
    `
      insert into supporter_notes (
        display_name, handle, amount, amount_display_mode, amount_range, comment,
        supporter_badge, consent_to_display, payment_verified, status
      )
      values ($1, $2, $3, $4, $5, $6, 'Supporter', true, false, 'pending')
      returning id::text, display_name, handle, amount::text, amount_display_mode, amount_range,
        comment, supporter_badge, consent_to_display, payment_verified, status,
        admin_notes, created_at::text, updated_at::text, approved_at::text
    `,
    [clean(input.displayName, 80), clean(input.handle, 80), amount, amountDisplayMode, amountRange, comment]
  );

  return rowToAdminNote(result.rows[0]);
}

export async function createAdminSupporterNote(input: Record<string, unknown>) {
  await ensureAdminDatabase();
  const amount = normalizeAmount(asText(input.amount));
  const amountDisplayMode = normalizeAmountDisplayMode(asText(input.amountDisplayMode || input.amount_display_mode));
  const status = normalizeStatus(asText(input.status));
  const paymentVerified = Boolean(input.paymentVerified ?? input.payment_verified);
  const consentToDisplay = Boolean(input.consentToDisplay ?? input.consent_to_display);
  const approvedAt = status === "approved" && paymentVerified && consentToDisplay ? "now()" : null;

  const result = await getPool().query<SupporterNoteRow>(
    `
      insert into supporter_notes (
        display_name, handle, amount, amount_display_mode, amount_range, comment,
        supporter_badge, consent_to_display, payment_verified, status, admin_notes, approved_at
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, case when $12::boolean then now() else null end)
      returning id::text, display_name, handle, amount::text, amount_display_mode, amount_range,
        comment, supporter_badge, consent_to_display, payment_verified, status,
        admin_notes, created_at::text, updated_at::text, approved_at::text
    `,
    [
      clean(asText(input.displayName || input.display_name), 80),
      clean(asText(input.handle), 80),
      amount,
      amountDisplayMode,
      amount ? amountRangeFor(Number(amount)) : "",
      clean(asText(input.comment), 320),
      normalizeBadge(asText(input.supporterBadge || input.supporter_badge)),
      consentToDisplay,
      paymentVerified,
      status,
      clean(asText(input.adminNotes || input.admin_notes), 500),
      Boolean(approvedAt)
    ]
  );

  return rowToAdminNote(result.rows[0]);
}

export async function updateAdminSupporterNote(input: Record<string, unknown>) {
  await ensureAdminDatabase();
  const id = requireUuid(asText(input.id), "supporterNoteId");
  const amount = normalizeAmount(asText(input.amount));
  const status = normalizeStatus(asText(input.status));
  const amountDisplayMode = normalizeAmountDisplayMode(asText(input.amountDisplayMode || input.amount_display_mode));
  const paymentVerified = Boolean(input.paymentVerified ?? input.payment_verified);
  const consentToDisplay = Boolean(input.consentToDisplay ?? input.consent_to_display);

  const result = await getPool().query<SupporterNoteRow>(
    `
      update supporter_notes
      set display_name = $2,
          handle = $3,
          amount = $4,
          amount_display_mode = $5,
          amount_range = $6,
          comment = $7,
          supporter_badge = $8,
          consent_to_display = $9,
          payment_verified = $10,
          status = $11,
          admin_notes = $12,
          approved_at = case
            when $11 = 'approved' and $9 = true and $10 = true then coalesce(approved_at, now())
            else approved_at
          end,
          updated_at = now()
      where id = $1
      returning id::text, display_name, handle, amount::text, amount_display_mode, amount_range,
        comment, supporter_badge, consent_to_display, payment_verified, status,
        admin_notes, created_at::text, updated_at::text, approved_at::text
    `,
    [
      id,
      clean(asText(input.displayName || input.display_name), 80),
      clean(asText(input.handle), 80),
      amount,
      amountDisplayMode,
      amount ? amountRangeFor(Number(amount)) : "",
      clean(asText(input.comment), 320),
      normalizeBadge(asText(input.supporterBadge || input.supporter_badge)),
      consentToDisplay,
      paymentVerified,
      status,
      clean(asText(input.adminNotes || input.admin_notes), 500)
    ]
  );

  return result.rows[0] ? rowToAdminNote(result.rows[0]) : null;
}

function rowToPublicNote(row: SupporterNoteRow): PublicSupporterNote {
  const displayName = cleanDisplayName(row.display_name || row.handle || "CWI Supporter");
  const handle = cleanHandle(row.handle || "");
  return {
    id: row.id,
    displayName,
    handle,
    amountLabel: publicAmountLabel(row.amount, normalizeAmountDisplayMode(row.amount_display_mode), row.amount_range || ""),
    comment: clean(row.comment, 320),
    supporterBadge: normalizeBadge(row.supporter_badge || "Supporter"),
    createdAt: row.created_at,
    approvedAt: row.approved_at || row.created_at
  };
}

function rowToAdminNote(row: SupporterNoteRow): AdminSupporterNote {
  const publicNote = rowToPublicNote(row);
  return {
    ...publicNote,
    amount: row.amount || "",
    amountDisplayMode: normalizeAmountDisplayMode(row.amount_display_mode),
    amountRange: row.amount_range || "",
    consentToDisplay: Boolean(row.consent_to_display),
    paymentVerified: Boolean(row.payment_verified),
    status: normalizeStatus(row.status || "pending"),
    adminNotes: row.admin_notes || "",
    updatedAt: row.updated_at
  };
}

function publicAmountLabel(amount: string | null, mode: AmountDisplayMode, range: string) {
  if (mode === "exact" && amount) return `₹${Number(amount).toLocaleString("en-IN")}`;
  if (mode === "range" && range) return range;
  return "Amount hidden";
}

function amountRangeFor(amount: number) {
  if (amount < 50) return "Under ₹50";
  if (amount < 100) return "₹50-₹99";
  if (amount < 200) return "₹100-₹199";
  if (amount < 500) return "₹200-₹499";
  return "₹500+";
}

function normalizeAmount(value: unknown) {
  const text = asText(value).trim();
  if (!text) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(text)) throw new Error("Amount must be numeric.");
  const amount = Number(text);
  if (!Number.isFinite(amount) || amount < 1) throw new Error("Amount must be INR 1 or more.");
  return amount.toFixed(2);
}

function normalizeAmountDisplayMode(value: unknown): AmountDisplayMode {
  const mode = asText(value).trim().toLowerCase();
  if (mode === "exact" || mode === "range") return mode;
  return "hidden";
}

function normalizeStatus(value: string): SupporterNoteStatus {
  const status = value.trim().toLowerCase();
  if (status === "approved" || status === "rejected" || status === "hidden") return status;
  return "pending";
}

function normalizeBadge(value: string) {
  const allowed = new Set([
    "Supporter",
    "Early Supporter",
    "Live Newsroom Backer",
    "Archive Supporter",
    "Source Check Supporter",
    "Public Advisory Supporter"
  ]);
  return allowed.has(value) ? value : "Supporter";
}

function cleanDisplayName(value: string) {
  const cleaned = clean(value, 80);
  return cleaned || "CWI Supporter";
}

function cleanHandle(value: string) {
  return clean(value, 80).replace(/[^\w@.\- ]/g, "").trim();
}

function clean(value: unknown, maxLength: number) {
  return asText(value).replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function asText(value: unknown) {
  return typeof value === "string" ? value : value === null || value === undefined ? "" : String(value);
}
