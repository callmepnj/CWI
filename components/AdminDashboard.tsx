"use client";

import { useEffect, useState } from "react";
import type React from "react";
import {
  Activity,
  Bot,
  ClipboardCheck,
  Database,
  FileSearch,
  FileText,
  HeartHandshake,
  ImageIcon,
  KeyRound,
  LinkIcon,
  LogOut,
  MessageSquare,
  Newspaper,
  PauseCircle,
  RefreshCcw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  WalletCards
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardLabel } from "@/components/ui/card";

type AdminRecord = Record<string, unknown>;

type AdminData = {
  budget: {
    monthlyCapInr: number;
    dailyCapInr: number;
    estimatedMonthlyCost: number;
    safeMode: boolean;
  };
  counts: Record<string, number>;
  agents: AdminRecord[];
  approvals: AdminRecord[];
  researchPacks: AdminRecord[];
  articleDrafts: AdminRecord[];
  seoPacks: AdminRecord[];
  socialPacks: AdminRecord[];
  uiuxAudits: AdminRecord[];
  manualLinks: AdminRecord[];
  sources: AdminRecord[];
  keywords: AdminRecord[];
  dailyBriefings: AdminRecord[];
  health: AdminRecord;
  reports: AdminRecord[];
  comments: AdminRecord[];
  latestPublicArticles: AdminRecord[];
  latestUnansweredFiles: AdminRecord[];
};

const sections = [
  ["overview", "Overview", Activity],
  ["agents", "Agent Control Center", Bot],
  ["approval", "Approval Queue", ClipboardCheck],
  ["manual-link", "Manual Link", LinkIcon],
  ["research-packs", "Research Packs", FileSearch],
  ["articles", "Articles", Newspaper],
  ["seo-packs", "SEO Packs", TrendingUp],
  ["social-packs", "Social Packs", MessageSquare],
  ["images", "Images", ImageIcon],
  ["uiux-fixes", "UI/UX Fixes", Sparkles],
  ["reports", "Reports", FileText],
  ["comments", "Comments", MessageSquare],
  ["sources", "Sources", Database],
  ["keywords", "Keywords", KeyRound],
  ["daily-briefing", "Daily Briefing", HeartHandshake],
  ["system-health", "System Health", ShieldCheck],
  ["settings", "Settings", Settings]
] as const;

const agentActions = [
  ["daily-workflow", "Run Daily Workflow"],
  ["research-only", "Run Research Only"],
  ["verify", "Run Verify"],
  ["article-draft", "Generate Article Draft"],
  ["seo-check", "Generate SEO Pack"],
  ["social-pack", "Generate Social Pack"],
  ["image-pack", "Generate Image Pack"],
  ["uiux-audit", "Run UI/UX Audit"],
  ["system-health", "Check System Health"],
  ["stop-non-essential", "Stop Non-Essential Tasks"]
] as const;

export function AdminDashboard({ activeSection }: { activeSection: string }) {
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [degradedMessage, setDegradedMessage] = useState("");
  const [pending, setPending] = useState("");

  const safeSection = sections.some(([id]) => id === activeSection) ? activeSection : "overview";

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setError("");
    const response = await fetch("/api/admin/dashboard").catch(() => null);
    const json = await response?.json().catch(() => null);

    if (!response?.ok || !json?.ok) {
      setError(json?.error ?? "Admin dashboard could not load.");
      return;
    }

    setDegradedMessage(json.degraded ? json.error ?? "Admin dashboard is in setup mode." : "");
    setData(json.data);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => undefined);
    window.location.href = "/admin/login";
  }

  async function runAction(action: string) {
    setPending(action);
    setMessage("");
    setError("");

    const { endpoint, body } = actionRequest(action);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).catch(() => null);
    const json = await response?.json().catch(() => null);
    setPending("");

    if (!response?.ok || !json?.ok) {
      setError(json?.error ?? json?.message ?? "Agent action failed.");
      return;
    }

    setMessage(json.message ?? "Agent action completed.");
    await loadDashboard();
  }

  async function updateApproval(id: string, status: string) {
    setPending(`${id}:${status}`);
    setMessage("");
    setError("");

    const response = await fetch("/api/approval/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    }).catch(() => null);
    const json = await response?.json().catch(() => null);
    setPending("");

    if (!response?.ok || !json?.ok) {
      setError(json?.error ?? "Approval update failed.");
      return;
    }

    setMessage(`Approval queue updated: ${status}`);
    await loadDashboard();
  }

  async function publishApproval(id: string) {
    setPending(`${id}:publish`);
    setMessage("");
    setError("");

    const response = await fetch("/api/ai/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approvalQueueId: id })
    }).catch(() => null);
    const json = await response?.json().catch(() => null);
    setPending("");

    if (!response?.ok || !json?.ok) {
      setError(json?.error ?? "Publish AI failed.");
      return;
    }

    setMessage(json.message ?? "Publish AI completed.");
    await loadDashboard();
  }

  async function updateComment(source: string, id: string, status: string) {
    setPending(`${id}:${status}`);
    setMessage("");
    setError("");

    const response = await fetch("/api/admin/comments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source, id, status })
    }).catch(() => null);
    const json = await response?.json().catch(() => null);
    setPending("");

    if (!response?.ok || !json?.ok) {
      setError(json?.error ?? "Comment update failed.");
      return;
    }

    setMessage(`Comment marked ${status}.`);
    await loadDashboard();
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-royal">Private CWI Admin</p>
          <h1 className="mt-2 font-display text-4xl font-black uppercase leading-tight tracking-[-0.05em] text-ink sm:text-6xl">
            CWI AI Operating System
          </h1>
          <p className="mt-4 max-w-3xl text-lg font-semibold leading-8 text-ink/70">
            Agents prepare everything. Human approves everything. No article, caption, source update, UI fix, or website change publishes automatically.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={loadDashboard}>
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
          <Button type="button" variant="ghost" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-line bg-white p-3 shadow-card">
            {sections.map(([id, label, Icon]) => (
              <Link
                key={id}
                href={id === "overview" ? "/admin" : `/admin/${id}`}
                className={`mb-1 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black uppercase tracking-[0.08em] transition last:mb-0 ${
                  safeSection === id ? "bg-royal text-white shadow-soft" : "text-ink/64 hover:bg-skywash hover:text-royal"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>
          <Card>
            <CardLabel>Budget guardrail</CardLabel>
            <p className="text-3xl font-black text-ink">₹{number(data?.budget.estimatedMonthlyCost ?? 0)}</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-ink/68">
              Monthly cap: ₹{number(data?.budget.monthlyCapInr ?? 8000)}. Daily target: ₹{number(data?.budget.dailyCapInr ?? 250)}.
            </p>
            {data?.budget.safeMode ? (
              <p className="mt-3 rounded-2xl bg-urgent/10 p-3 text-sm font-bold text-urgent">
                Safe mode recommended: pause images and non-urgent AI calls.
              </p>
            ) : null}
          </Card>
        </aside>

        <div className="space-y-6">
          {message ? <p className="rounded-2xl bg-leaf/10 p-4 text-sm font-bold text-[#047766]">{message}</p> : null}
          {degradedMessage ? <p className="rounded-2xl border border-saffron/30 bg-saffron/15 p-4 text-sm font-bold leading-6 text-[#8A5B00]">{degradedMessage}</p> : null}
          {error ? <p className="rounded-2xl bg-urgent/10 p-4 text-sm font-bold text-urgent">{error}</p> : null}
          {!data ? (
            <Card>
              <CardLabel>Loading</CardLabel>
              <p className="font-bold text-ink/70">Loading CWI AI OS dashboard...</p>
            </Card>
          ) : (
            <AdminSection
              section={safeSection}
              data={data}
              pending={pending}
              runAction={runAction}
              refresh={loadDashboard}
              updateApproval={updateApproval}
              publishApproval={publishApproval}
              updateComment={updateComment}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function AdminSection({
  section,
  data,
  pending,
  runAction,
  refresh,
  updateApproval,
  publishApproval,
  updateComment
}: {
  section: string;
  data: AdminData;
  pending: string;
  runAction: (action: string) => Promise<void>;
  refresh: () => Promise<void>;
  updateApproval: (id: string, status: string) => Promise<void>;
  publishApproval: (id: string) => Promise<void>;
  updateComment: (source: string, id: string, status: string) => Promise<void>;
}) {
  if (section === "agents") return <AgentsSection data={data} pending={pending} runAction={runAction} />;
  if (section === "approval") return <ApprovalSection data={data} pending={pending} updateApproval={updateApproval} publishApproval={publishApproval} />;
  if (section === "manual-link") return <ManualLinkSection onComplete={refresh} />;
  if (section === "research-packs") return <RecordList title="Research Packs" records={data.researchPacks} fields={["topic", "category", "source_confidence", "status", "source_count"]} />;
  if (section === "articles") return <RecordList title="Articles" records={data.articleDrafts} fields={["title", "slug", "category", "verification_status", "approval_status", "publish_status"]} />;
  if (section === "seo-packs") return <RecordList title="SEO Packs" records={data.seoPacks} fields={["seo_title", "meta_description", "canonical_url", "sitemap_status", "approval_status"]} />;
  if (section === "social-packs") return <SocialPacksSection records={data.socialPacks} />;
  if (section === "images") return <RecordList title="Images" records={[]} fields={["topic", "path", "alt_text", "quality_status", "approval_status"]} empty="Image packs appear here when CWI Image AI prepares or imports visuals." />;
  if (section === "uiux-fixes") return <RecordList title="UI/UX Fixes" records={data.uiuxAudits} fields={["page", "issue", "severity", "suggested_text", "fix_status"]} />;
  if (section === "reports") return <ReportsSection records={data.reports} />;
  if (section === "comments") return <CommentsSection records={data.comments} pending={pending} updateComment={updateComment} />;
  if (section === "sources") return <RecordList title="Sources" records={data.sources} fields={["name", "source_type", "url", "trust_level", "active", "notes"]} />;
  if (section === "keywords") return <RecordList title="Keywords" records={data.keywords} fields={["keyword", "keyword_group", "priority", "active"]} />;
  if (section === "daily-briefing") return <DailyBriefingSection data={data} pending={pending} runAction={runAction} />;
  if (section === "system-health") return <SystemHealthSection data={data} pending={pending} runAction={runAction} />;
  if (section === "settings") return <SettingsSection data={data} />;
  return <OverviewSection data={data} pending={pending} runAction={runAction} />;
}

function OverviewSection({ data, pending, runAction }: { data: AdminData; pending: string; runAction: (action: string) => Promise<void> }) {
  const metrics = [
    ["Total articles", data.counts.totalArticles, Newspaper],
    ["Pending approvals", data.counts.pendingApprovals, ClipboardCheck],
    ["Reports received", data.counts.reportsReceived, FileText],
    ["Research packs", data.counts.researchPacksReady, FileSearch],
    ["SEO packs", data.counts.seoPacksReady, TrendingUp],
    ["Social packs", data.counts.socialPacksReady, MessageSquare],
    ["UI/UX issues", data.counts.uiuxIssuesFound, Sparkles],
    ["Monthly cost", `₹${number(data.budget.estimatedMonthlyCost)}`, WalletCards]
  ] as const;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value, Icon]) => (
          <Card key={label}>
            <Icon className="h-5 w-5 text-royal" />
            <p className="mt-4 font-mono text-[0.7rem] font-black uppercase tracking-[0.14em] text-ink/50">{label}</p>
            <p className="mt-1 text-3xl font-black text-ink">{value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardLabel>Quick actions</CardLabel>
        <div className="flex flex-wrap gap-3">
          {agentActions.map(([action, label]) => (
            <Button key={action} type="button" variant={action === "stop-non-essential" ? "outline" : "default"} disabled={pending === action} onClick={() => runAction(action)}>
              {action === "stop-non-essential" ? <PauseCircle className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              {pending === action ? "Running..." : label}
            </Button>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <PreviewList title="Ready for approval" records={data.approvals} fields={["topic", "type", "verification_status", "risk_level", "status"]} />
        <PreviewList title="Latest reports" records={data.reports} fields={["type", "city", "state", "message", "status"]} />
        <PreviewList title="Latest Watch Desk articles" records={data.latestPublicArticles} fields={["title", "category", "href"]} />
        <PreviewList title="Latest Unanswered Files" records={data.latestUnansweredFiles} fields={["title", "category", "href"]} />
      </div>
    </>
  );
}

function AgentsSection({ data, pending, runAction }: { data: AdminData; pending: string; runAction: (action: string) => Promise<void> }) {
  return (
    <>
      <Card>
        <CardLabel>Agent Control Center</CardLabel>
        <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em] text-ink">Run controlled workflows</h2>
        <p className="mt-3 leading-7 text-ink/70">
          Every action creates drafts, packs, logs, or approval cards. Nothing updates the public website unless an approval item is explicitly approved and then published manually.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {agentActions.map(([action, label]) => (
            <Button key={action} type="button" variant={action === "stop-non-essential" ? "outline" : "default"} disabled={pending === action} onClick={() => runAction(action)}>
              {pending === action ? "Running..." : label}
            </Button>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        {data.agents.map((agent) => (
          <Card key={text(agent.id)}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardLabel>{text(agent.status)}</CardLabel>
                <h3 className="font-display text-2xl font-black uppercase tracking-[-0.03em] text-ink">{text(agent.name)}</h3>
                <p className="mt-3 leading-7 text-ink/70">{text(agent.role)}</p>
              </div>
              <Bot className="h-6 w-6 text-royal" />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <MiniMetric label="Last run" value={formatDate(agent.last_run_at)} />
              <MiniMetric label="Tasks completed" value={text(agent.tasks_completed)} />
              <MiniMetric label="Failed tasks" value={text(agent.failed_tasks)} />
              <MiniMetric label="Cost estimate" value={`₹${number(Number(agent.cost_estimate_inr ?? 0))}`} />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

function ApprovalSection({
  data,
  pending,
  updateApproval,
  publishApproval
}: {
  data: AdminData;
  pending: string;
  updateApproval: (id: string, status: string) => Promise<void>;
  publishApproval: (id: string) => Promise<void>;
}) {
  return (
    <div className="space-y-5">
      <Card>
        <CardLabel>Approval rule</CardLabel>
        <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em] text-ink">No auto-publish</h2>
        <p className="mt-3 leading-7 text-ink/70">
          Approve, reject, request changes, save for later, or archive. Publish AI may prepare files only after approval.
        </p>
      </Card>
      {data.approvals.length === 0 ? (
        <Card><p className="font-bold text-ink/64">No approval cards yet.</p></Card>
      ) : (
        data.approvals.map((item) => (
          <Card key={text(item.id)}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardLabel>{text(item.type)}</CardLabel>
                <h3 className="font-display text-3xl font-black uppercase tracking-[-0.03em] text-ink">{text(item.topic)}</h3>
                <p className="mt-3 leading-7 text-ink/70">{text(item.summary)}</p>
              </div>
              <span className="rounded-full bg-skywash px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-royal ring-1 ring-royal/15">
                {text(item.status)}
              </span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-5">
              <MiniMetric label="Verification" value={text(item.verification_status)} />
              <MiniMetric label="Risk" value={text(item.risk_level)} />
              <MiniMetric label="Sources" value={text(item.source_count)} />
              <MiniMetric label="Article" value={item.article_draft_id ? "Ready" : "Not attached"} />
              <MiniMetric label="SEO/Social" value={`${item.seo_pack_id ? "SEO" : "-"} / ${item.social_pack_id ? "Social" : "-"}`} />
            </div>
            <p className="mt-4 rounded-2xl bg-paper p-4 text-sm font-semibold leading-6 text-ink/70">{text(item.suggested_action)}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Approve Publish", "Approve Social Only", "Approve Article Only", "Request Changes", "Rejected", "Save for Later", "Archived"].map((status) => (
                <Button key={status} type="button" size="sm" variant={status.startsWith("Approve") ? "default" : "outline"} disabled={pending === `${text(item.id)}:${status}`} onClick={() => updateApproval(text(item.id), status)}>
                  {status}
                </Button>
              ))}
              <Button type="button" size="sm" disabled={pending === `${text(item.id)}:publish`} onClick={() => publishApproval(text(item.id))}>
                {pending === `${text(item.id)}:publish` ? "Publishing..." : "Run Publish AI"}
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}

function ManualLinkSection({ onComplete }: { onComplete: () => Promise<void> }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setError("");
    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/ai/manual-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: formData.get("url"),
        topic: formData.get("topic"),
        platform: formData.get("platform"),
        creatorSource: formData.get("creatorSource"),
        notes: formData.get("notes"),
        priority: formData.get("priority"),
        contentType: formData.get("contentType")
      })
    }).catch(() => null);
    const json = await response?.json().catch(() => null);
    setPending(false);

    if (!response?.ok || !json?.ok) {
      setError(json?.error ?? "Manual link could not be processed.");
      return;
    }

    form.reset();
    setMessage("Manual link processed. Research, verification, article, SEO, social, and image packs were sent to approval queue.");
    await onComplete();
  }

  return (
    <Card>
      <CardLabel>Manual Link Processor</CardLabel>
      <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em] text-ink">Process a source without paid APIs</h2>
      <p className="mt-3 leading-7 text-ink/70">
        Paste a URL from Instagram, X, YouTube, Reddit, Bluesky, a news article, official statement, or public website. The system extracts low-cost metadata, creates packs, and sends everything to approval.
      </p>
      <form onSubmit={submit} className="mt-6 grid gap-4">
        <AdminInput name="url" label="URL" required placeholder="https://..." />
        <div className="grid gap-4 md:grid-cols-2">
          <AdminInput name="topic" label="Topic" placeholder="CJP update, Manipur update, NEET source..." />
          <AdminInput name="platform" label="Platform" placeholder="Instagram, X, YouTube, Reddit, news..." />
          <AdminInput name="creatorSource" label="Creator / source" placeholder="Source name or public handle" />
          <AdminSelect name="priority" label="Priority" options={["normal", "high", "urgent", "low"]} />
          <AdminSelect name="contentType" label="Content type" options={["manual link", "Watch Desk", "Public Advisory", "Social Pack", "India Unanswered Files", "Civic Issue"]} />
        </div>
        <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-ink/65">
          Notes
          <textarea name="notes" rows={5} className="rounded-2xl border border-line bg-paper px-4 py-3 normal-case tracking-normal outline-none focus:border-royal" />
        </label>
        <Button type="submit" disabled={pending} className="w-fit">
          <Search className="h-4 w-4" />
          {pending ? "Processing..." : "Process Manual Link"}
        </Button>
        {message ? <p className="rounded-2xl bg-leaf/10 p-3 text-sm font-bold text-[#047766]">{message}</p> : null}
        {error ? <p className="rounded-2xl bg-urgent/10 p-3 text-sm font-bold text-urgent">{error}</p> : null}
      </form>
    </Card>
  );
}

function DailyBriefingSection({ data, pending, runAction }: { data: AdminData; pending: string; runAction: (action: string) => Promise<void> }) {
  return (
    <>
      <Card>
        <CardLabel>Daily Command Briefing</CardLabel>
        <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em] text-ink">Generate briefing</h2>
        <p className="mt-3 leading-7 text-ink/70">
          Includes top topics, reports, article priorities, social packs, SEO tasks, UI/UX issues, risks, cost warning, and approval items.
        </p>
        <Button type="button" className="mt-5" disabled={pending === "daily-briefing"} onClick={() => runAction("daily-briefing")}>
          {pending === "daily-briefing" ? "Generating..." : "Generate Daily Briefing"}
        </Button>
      </Card>
      <RecordList title="Briefing archive" records={data.dailyBriefings} fields={["briefing_date", "top_topics", "risks_to_avoid", "status", "created_at"]} />
    </>
  );
}

function SystemHealthSection({ data, pending, runAction }: { data: AdminData; pending: string; runAction: (action: string) => Promise<void> }) {
  const health = data.health;
  return (
    <>
      <Card>
        <CardLabel>System Health AI</CardLabel>
        <div className="grid gap-3 md:grid-cols-3">
          <MiniMetric label="Website" value={text(health.website_status)} />
          <MiniMetric label="Database" value={text(health.database_status)} />
          <MiniMetric label="Sitemap" value={text(health.sitemap_status)} />
          <MiniMetric label="Robots" value={text(health.robots_status)} />
          <MiniMetric label="Old URL check" value={text(health.old_url_check)} />
          <MiniMetric label="Pending approvals" value={text(health.pending_approvals)} />
          <MiniMetric label="Daily AI usage" value={`₹${number(Number(health.daily_ai_usage_inr ?? 0))}`} />
          <MiniMetric label="Monthly usage" value={`₹${number(Number(health.monthly_budget_usage_inr ?? data.budget.estimatedMonthlyCost))}`} />
          <MiniMetric label="Failed tasks" value={text(health.failed_tasks)} />
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="button" disabled={pending === "seo-check"} onClick={() => runAction("seo-check")}>Run SEO Check</Button>
          <Button type="button" variant="outline" disabled={pending === "stop-non-essential"} onClick={() => runAction("stop-non-essential")}>Stop Non-Essential Tasks</Button>
        </div>
      </Card>
    </>
  );
}

function SettingsSection({ data }: { data: AdminData }) {
  return (
    <Card>
      <CardLabel>Settings</CardLabel>
      <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em] text-ink">Low-cost operating rules</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <MiniMetric label="Monthly budget cap" value={`₹${number(data.budget.monthlyCapInr)}`} />
        <MiniMetric label="Daily target cap" value={`₹${number(data.budget.dailyCapInr)}`} />
        <MiniMetric label="Auto-publish" value="Disabled" />
        <MiniMetric label="Discovery sources" value="RSS, manual links, YouTube RSS, sitemaps, user reports" />
      </div>
      <p className="mt-5 leading-7 text-ink/70">
        No paid X API, Instagram API, paid crawler, hardcoded credentials, or automatic high-volume crawling is required. Expensive calls should be paused when budget pressure is high.
      </p>
    </Card>
  );
}

function SocialPacksSection({ records }: { records: AdminRecord[] }) {
  return (
    <div className="grid gap-5">
      <Card>
        <CardLabel>Social Packs</CardLabel>
        <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em] text-ink">Captions ready for approval</h2>
        <p className="mt-3 leading-7 text-ink/70">Every platform pack includes credit, risk note, website line, and approval status.</p>
      </Card>
      {records.map((record) => (
        <Card key={text(record.id)}>
          <CardLabel>{text(record.approval_status)}</CardLabel>
          <div className="grid gap-4 md:grid-cols-2">
            {["instagram_caption", "facebook_caption", "x_caption", "reddit_title", "youtube_shorts_title", "bluesky_caption", "discord_announcement", "risk_note"].map((field) => (
              <MiniMetric key={field} label={field.replace(/_/g, " ")} value={text(record[field]).slice(0, 280)} />
            ))}
          </div>
        </Card>
      ))}
      {records.length === 0 ? <Card><p className="font-bold text-ink/64">No social packs yet.</p></Card> : null}
    </div>
  );
}

function ReportsSection({ records }: { records: AdminRecord[] }) {
  return <RecordList title="Reports / Submissions" records={records} fields={["type", "name", "contact", "city", "state", "source_url", "message", "status"]} />;
}

function CommentsSection({
  records,
  pending,
  updateComment
}: {
  records: AdminRecord[];
  pending: string;
  updateComment: (source: string, id: string, status: string) => Promise<void>;
}) {
  return (
    <div className="grid gap-5">
      <Card>
        <CardLabel>Comment moderation</CardLabel>
        <p className="leading-7 text-ink/70">Approve only real comments. Reject hate, threats, doxxing, spam, harassment, or unverified allegations presented as fact.</p>
      </Card>
      {records.map((comment) => (
        <Card key={`${text(comment.source)}-${text(comment.id)}`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardLabel>{text(comment.source)} / {text(comment.status)}</CardLabel>
              <h3 className="font-display text-2xl font-black uppercase tracking-[-0.03em] text-ink">{text(comment.article)}</h3>
              <p className="mt-3 text-sm font-black uppercase tracking-[0.1em] text-ink/50">{text(comment.name)}</p>
              <p className="mt-3 leading-7 text-ink/72">{text(comment.comment)}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {["approved", "rejected", "spam", "pending"].map((status) => (
              <Button key={status} type="button" size="sm" variant={status === "approved" ? "default" : "outline"} disabled={pending === `${text(comment.id)}:${status}`} onClick={() => updateComment(text(comment.source), text(comment.id), status)}>
                {status}
              </Button>
            ))}
          </div>
        </Card>
      ))}
      {records.length === 0 ? <Card><p className="font-bold text-ink/64">No comments yet.</p></Card> : null}
    </div>
  );
}

function RecordList({ title, records, fields, empty }: { title: string; records: AdminRecord[]; fields: string[]; empty?: string }) {
  return (
    <div className="grid gap-5">
      <Card>
        <CardLabel>{records.length} records</CardLabel>
        <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em] text-ink">{title}</h2>
      </Card>
      {records.length === 0 ? (
        <Card><p className="font-bold text-ink/64">{empty ?? `No ${title.toLowerCase()} records yet.`}</p></Card>
      ) : (
        records.map((record, index) => (
          <Card key={text(record.id) || `${title}-${index}`}>
            <div className="grid gap-3 md:grid-cols-2">
              {fields.map((field) => (
                <MiniMetric key={field} label={field.replace(/_/g, " ")} value={formatValue(record[field])} />
              ))}
            </div>
          </Card>
        ))
      )}
    </div>
  );
}

function PreviewList({ title, records, fields }: { title: string; records: AdminRecord[]; fields: string[] }) {
  return (
    <Card>
      <CardLabel>{records.length} items</CardLabel>
      <h2 className="font-display text-2xl font-black uppercase tracking-[-0.03em] text-ink">{title}</h2>
      <div className="mt-5 grid gap-3">
        {records.slice(0, 6).map((record, index) => (
          <div key={text(record.id) || `${title}-${index}`} className="rounded-2xl border border-line bg-paper p-4">
            {fields.map((field) => (
              <p key={field} className="text-sm leading-6 text-ink/70">
                <strong className="font-black uppercase text-ink">{field.replace(/_/g, " ")}:</strong> {formatValue(record[field]).slice(0, 180)}
              </p>
            ))}
          </div>
        ))}
        {records.length === 0 ? <p className="font-bold text-ink/54">No items yet.</p> : null}
      </div>
    </Card>
  );
}

function AdminInput({ name, label, placeholder, required }: { name: string; label: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-ink/65">
      {label}
      <input name={name} required={required} placeholder={placeholder} className="rounded-2xl border border-line bg-paper px-4 py-3 normal-case tracking-normal outline-none focus:border-royal" />
    </label>
  );
}

function AdminSelect({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-ink/65">
      {label}
      <select name={name} className="rounded-2xl border border-line bg-paper px-4 py-3 normal-case tracking-normal outline-none focus:border-royal">
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-4">
      <p className="font-mono text-[0.65rem] font-black uppercase tracking-[0.14em] text-royal">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold leading-6 text-ink/72">{value || "-"}</p>
    </div>
  );
}

function formatValue(value: unknown) {
  if (value === null || value === undefined) return "-";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value);
}

function formatDate(value: unknown) {
  if (!value || typeof value !== "string") return "Not run";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function text(value: unknown) {
  return formatValue(value);
}

function number(value: number) {
  return Math.round(value).toLocaleString("en-IN");
}

function actionRequest(action: string) {
  const defaultTopic = "CWI priority public-interest update";

  if (action === "daily-workflow" || action === "daily-briefing") {
    return { endpoint: "/api/ai/command", body: {} };
  }

  if (action === "research-only") {
    return {
      endpoint: "/api/ai/research",
      body: { topic: defaultTopic, notes: "Admin-triggered research-only workflow." }
    };
  }

  if (action === "verify") {
    return { endpoint: "/api/ai/verify", body: {} };
  }

  if (action === "article-draft") {
    return { endpoint: "/api/ai/article", body: {} };
  }

  if (action === "seo-check") {
    return { endpoint: "/api/ai/seo", body: { topic: "CWI SEO system check" } };
  }

  if (action === "social-pack") {
    return { endpoint: "/api/ai/social", body: { topic: "CWI source-backed update" } };
  }

  if (action === "image-pack") {
    return { endpoint: "/api/ai/image", body: { topic: "CWI source-backed update" } };
  }

  if (action === "uiux-audit") {
    return { endpoint: "/api/ai/uiux", body: { page: "Homepage", notes: "Admin-triggered UI/UX audit." } };
  }

  if (action === "system-health") {
    return { endpoint: "/api/ai/health", body: {} };
  }

  return { endpoint: "/api/admin/agent-actions", body: { action } };
}
