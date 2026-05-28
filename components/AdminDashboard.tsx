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
import { Button } from "@/components/ui/button";
import { Card, CardLabel } from "@/components/ui/card";
import { AdminLiveNewsroom } from "@/components/AdminLiveNewsroom";

type AdminRecord = Record<string, unknown>;

type AdminData = {
  budget: {
    monthlyCapInr: number;
    dailyCapInr: number;
    estimatedMonthlyCost: number;
    safeMode: boolean;
  };
  ai: {
    provider: string;
    model: string;
    configured: boolean;
    productionReady: boolean;
    message: string;
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
  workflows: AdminRecord[];
  memoryNodes: AdminRecord[];
  memoryClaims: AdminRecord[];
  verificationGates: AdminRecord[];
  qualityScores: AdminRecord[];
  trendRadarItems: AdminRecord[];
  latestPublicArticles: AdminRecord[];
  latestUnansweredFiles: AdminRecord[];
};

const sections = [
  ["overview", "Overview", Activity],
  ["live-newsroom", "Live Newsroom", Newspaper],
  ["agents", "Agent Control Center", Bot],
  ["workflows", "Workflows", Activity],
  ["approval", "Approval Queue", ClipboardCheck],
  ["manual-link", "Manual Link", LinkIcon],
  ["source-memory", "Source Memory", Database],
  ["trend-radar", "Trend Radar", Search],
  ["quality-scores", "Quality Scores", ShieldCheck],
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
  ["sync-memory", "Sync Source Memory"],
  ["trend-radar", "Run Trend Radar"],
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

type SectionId = (typeof sections)[number][0];

export function AdminDashboard({ activeSection }: { activeSection: string }) {
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [degradedMessage, setDegradedMessage] = useState("");
  const [pending, setPending] = useState("");
  const [progress, setProgress] = useState<{ label: string; detail: string; percent: number } | null>(null);
  const [currentSection, setCurrentSection] = useState(activeSection);

  const safeSection = normalizeSection(currentSection);

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    setCurrentSection(activeSection);
  }, [activeSection]);

  useEffect(() => {
    function handlePopState() {
      setCurrentSection(sectionFromPath(window.location.pathname));
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!pending) {
      return;
    }

    const timer = window.setInterval(() => {
      setProgress((current) => {
        if (!current || current.percent >= 92) {
          return current;
        }

        const nextPercent = current.percent + Math.max(1, Math.round((92 - current.percent) * 0.14));
        return { ...current, percent: Math.min(92, nextPercent) };
      });
    }, 700);

    return () => window.clearInterval(timer);
  }, [pending]);

  async function loadDashboard(force = false) {
    setError("");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    let timedOut = false;
    const response = await fetch(`/api/admin/dashboard${force ? "?force=1" : ""}`, {
      signal: controller.signal,
      cache: "no-store"
    }).catch((fetchError: unknown) => {
      timedOut = fetchError instanceof DOMException && fetchError.name === "AbortError";
      return null;
    });
    window.clearTimeout(timeout);
    const json = await response?.json().catch(() => null);

    if (!response?.ok || !json?.ok) {
      setError(
        timedOut
          ? "Admin dashboard data timed out after 15 seconds. Refresh once; if it repeats, check Vercel DATABASE_URL and Supabase pooler status."
          : json?.error ?? "Admin dashboard could not load."
      );
      return;
    }

    setDegradedMessage(json.degraded ? json.error ?? "Admin dashboard is in setup mode." : "");
    setData(json.data);
  }

  function changeSection(section: SectionId) {
    setCurrentSection(section);
    const path = section === "overview" ? "/admin" : `/admin/${section}`;
    window.history.pushState(null, "", path);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => undefined);
    window.location.href = "/admin/login";
  }

  async function runAction(action: string) {
    setPending(action);
    startProgress(`Running ${actionLabel(action)}`, "CWI bot is preparing output for review.");
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
      failProgress("Agent action failed.");
      return;
    }

    setMessage(json.message ?? "Agent action completed.");
    finishProgress("Agent action completed.");
    await loadDashboard(true);
  }

  async function updateApproval(id: string, status: string) {
    setPending(`${id}:${status}`);
    startProgress(`Updating approval: ${status}`, "Saving approval status.");
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
      failProgress("Approval update failed.");
      return;
    }

    setMessage(`Approval queue updated: ${status}`);
    updateApprovalInState(json.data);
    finishProgress("Approval updated.");
  }

  async function publishApproval(id: string) {
    setPending(`${id}:publish`);
    startProgress("Publishing approved article", "Publish AI is saving the article and opening the public Watch Desk route.");
    setMessage("");
    setError("");

    const { response, json } = await requestPublish(id);
    setPending("");

    if (!response?.ok || !json?.ok) {
      setError(json?.error ?? "Publish AI failed.");
      failProgress("Publish AI failed.");
      return;
    }

    showPublishSuccess(json);
    markApprovalPublished(id);
    finishProgress("Public Watch Desk route is ready.");
    await loadDashboard(true);
  }

  async function approveAndPublish(item: AdminRecord) {
    const id = text(item.id);
    setPending(`${id}:approved`);
    startProgress("Approving and publishing", "Saving approval, preparing any missing article draft, and opening the public Watch Desk route.");
    setMessage("");
    setError("");

    const approvalResponse = await fetch("/api/approval/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "approved" })
    }).catch(() => null);
    const approvalJson = await approvalResponse?.json().catch(() => null);

    if (!approvalResponse?.ok || !approvalJson?.ok) {
      setPending("");
      setError(approvalJson?.error ?? "Approval update failed.");
      failProgress("Approval update failed.");
      return;
    }

    updateApprovalInState(approvalJson.data);
    setProgress((current) =>
      current ? { ...current, detail: "Approval saved. Publish AI is writing the public article row.", percent: Math.max(current.percent, 52) } : current
    );

    const { response, json } = await requestPublish(id);
    setPending("");

    if (!response?.ok || !json?.ok) {
      setError(json?.error ?? "Publish AI failed after approval.");
      failProgress("Publish AI failed.");
      return;
    }

    showPublishSuccess(json);
    markApprovalPublished(id);
    finishProgress("Approved article is public.");
    await loadDashboard(true);
  }

  async function requestPublish(id: string) {
    const response = await fetch("/api/ai/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approvalQueueId: id })
    }).catch(() => null);
    const json = await response?.json().catch(() => null);
    return { response, json };
  }

  function showPublishSuccess(json: { message?: string; data?: { articleUrl?: unknown; generatedArticleDraft?: unknown } }) {
    const articleUrl = text(json.data?.articleUrl);
    const generated = json.data?.generatedArticleDraft ? " Publish AI generated the missing draft first." : "";
    setMessage(articleUrl ? `${json.message ?? "Publish AI completed."}${generated} Public URL: ${articleUrl}` : json.message ?? "Publish AI completed.");
  }

  async function generateArticleForApproval(item: AdminRecord) {
    const id = text(item.id);
    setPending(`${id}:article`);
    startProgress("Generating article draft", "Article AI is drafting from the research and verification pack.");
    setMessage("");
    setError("");

    const response = await fetch("/api/ai/article", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        approvalQueueId: id,
        researchPackId: item.research_pack_id,
        verificationReportId: item.verification_report_id
      })
    }).catch(() => null);
    const json = await response?.json().catch(() => null);
    setPending("");

    if (!response?.ok || !json?.ok) {
      setError(json?.error ?? "Article draft could not be generated for this approval item.");
      failProgress("Article draft generation failed.");
      return;
    }

    setMessage(json.message ?? "Article draft attached. Review it, then use Approve & Publish.");
    updateApprovalInState(json.data?.updatedApproval);
    finishProgress("Article draft attached.");
  }

  async function updateComment(source: string, id: string, status: string) {
    setPending(`${id}:${status}`);
    startProgress(`Moderating comment: ${status}`, "Saving comment moderation decision.");
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
      failProgress("Comment update failed.");
      return;
    }

    setMessage(`Comment marked ${status}.`);
    finishProgress("Comment moderation saved.");
    await loadDashboard(true);
  }

  function startProgress(label: string, detail: string) {
    setProgress({ label, detail, percent: 8 });
  }

  function finishProgress(detail: string) {
    setProgress((current) => (current ? { ...current, detail, percent: 100 } : current));
    window.setTimeout(() => setProgress(null), 900);
  }

  function failProgress(detail: string) {
    setProgress((current) => (current ? { ...current, detail, percent: 100 } : current));
    window.setTimeout(() => setProgress(null), 1400);
  }

  function updateApprovalInState(updated: unknown) {
    const updatedRecord = updated && typeof updated === "object" ? (updated as AdminRecord) : null;
    const updatedId = text(updatedRecord?.id);

    if (!updatedRecord || !updatedId) {
      return;
    }

    setData((current) => {
      if (!current) return current;

      return {
        ...current,
        approvals: current.approvals.map((item) =>
          text(item.id) === updatedId ? { ...item, ...updatedRecord } : item
        )
      };
    });
  }

  function markApprovalPublished(id: string) {
    setData((current) => {
      if (!current) return current;

      return {
        ...current,
        approvals: current.approvals.map((item) =>
          text(item.id) === id ? { ...item, status: "published" } : item
        )
      };
    });
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
          <Button type="button" variant="outline" onClick={() => loadDashboard(true)}>
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
              <button
                key={id}
                type="button"
                onClick={() => changeSection(id)}
                className={`mb-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-black uppercase tracking-[0.08em] transition last:mb-0 ${
                  safeSection === id ? "bg-royal text-white shadow-soft" : "text-ink/64 hover:bg-skywash hover:text-royal"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
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
          {progress ? <ProgressNotice progress={progress} /> : null}
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
              refresh={() => loadDashboard(true)}
              updateApproval={updateApproval}
              publishApproval={publishApproval}
              approveAndPublish={approveAndPublish}
              generateArticleForApproval={generateArticleForApproval}
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
  approveAndPublish,
  generateArticleForApproval,
  updateComment
}: {
  section: string;
  data: AdminData;
  pending: string;
  runAction: (action: string) => Promise<void>;
  refresh: () => Promise<void>;
  updateApproval: (id: string, status: string) => Promise<void>;
  publishApproval: (id: string) => Promise<void>;
  approveAndPublish: (item: AdminRecord) => Promise<void>;
  generateArticleForApproval: (item: AdminRecord) => Promise<void>;
  updateComment: (source: string, id: string, status: string) => Promise<void>;
}) {
  if (section === "live-newsroom") return <AdminLiveNewsroom section={section} />;
  if (section === "agents") return <AgentsSection data={data} pending={pending} runAction={runAction} />;
  if (section === "workflows") {
    return (
      <RecordList
        title="Agent Workflows"
        records={data.workflows}
        fields={["workflow_type", "topic", "status", "current_step", "progress_percent", "public_url", "error_message"]}
      />
    );
  }
  if (section === "approval") {
    return (
      <ApprovalSection
        data={data}
        pending={pending}
        updateApproval={updateApproval}
        publishApproval={publishApproval}
        approveAndPublish={approveAndPublish}
        generateArticleForApproval={generateArticleForApproval}
      />
    );
  }
  if (section === "manual-link") return <ManualLinkSection onComplete={refresh} />;
  if (section === "source-memory") return <SourceMemorySection data={data} pending={pending} runAction={runAction} />;
  if (section === "trend-radar") return <TrendRadarSection data={data} pending={pending} runAction={runAction} />;
  if (section === "quality-scores") return <QualityScoresSection data={data} />;
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
    ["Memory nodes", data.counts.memoryNodes ?? 0, Database],
    ["Active workflows", data.counts.activeWorkflows ?? 0, Activity],
    ["Radar items", data.counts.trendRadarItems ?? 0, Search],
    ["Quality reviews", data.counts.qualityReviews ?? 0, ShieldCheck],
    ["Monthly cost", `₹${number(data.budget.estimatedMonthlyCost)}`, WalletCards],
    ["AI provider", data.ai.configured ? data.ai.provider : "Not configured", Bot]
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
        <PreviewList title="Trend radar" records={data.trendRadarItems} fields={["topic", "trend_type", "priority_score", "suggested_action"]} />
        <PreviewList title="Recent workflows" records={data.workflows} fields={["workflow_type", "topic", "status", "progress_percent"]} />
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

function SourceMemorySection({ data, pending, runAction }: { data: AdminData; pending: string; runAction: (action: string) => Promise<void> }) {
  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardLabel>CWI Memory</CardLabel>
            <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em] text-ink">Source memory and knowledge graph</h2>
            <p className="mt-3 leading-7 text-ink/70">
              Public articles, Unanswered Files, research packs, approvals, and corrections are indexed into reusable source memory.
            </p>
          </div>
          <Button type="button" disabled={pending === "sync-memory"} onClick={() => runAction("sync-memory")}>
            <Database className="h-4 w-4" />
            {pending === "sync-memory" ? "Syncing..." : "Sync Memory"}
          </Button>
        </div>
      </Card>
      <RecordList title="Knowledge Graph Nodes" records={data.memoryNodes} fields={["node_type", "label", "confidence_score", "source_count", "mention_count", "summary"]} />
      <RecordList title="Memory Claims" records={data.memoryClaims} fields={["topic", "claim_text", "status", "confidence_score", "risk_level", "source_count"]} />
    </div>
  );
}

function TrendRadarSection({ data, pending, runAction }: { data: AdminData; pending: string; runAction: (action: string) => Promise<void> }) {
  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardLabel>CWI Radar</CardLabel>
            <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em] text-ink">Trend radar</h2>
            <p className="mt-3 leading-7 text-ink/70">
              Manual links, reports, keywords, comments, Watch Desk posts, and Unanswered Files are ranked into daily topic leads.
            </p>
          </div>
          <Button type="button" disabled={pending === "trend-radar"} onClick={() => runAction("trend-radar")}>
            <Search className="h-4 w-4" />
            {pending === "trend-radar" ? "Scanning..." : "Run Radar"}
          </Button>
        </div>
      </Card>
      <RecordList
        title="Radar Items"
        records={data.trendRadarItems}
        fields={["topic", "trend_type", "priority_score", "evidence_count", "suggested_action", "why_it_matters", "status"]}
      />
    </div>
  );
}

function QualityScoresSection({ data }: { data: AdminData }) {
  return (
    <div className="grid gap-5">
      <RecordList
        title="Verification Gates"
        records={data.verificationGates}
        fields={["topic", "status", "can_draft", "confidence_score", "source_count", "official_source_available", "legal_risk"]}
      />
      <RecordList
        title="Quality Scores"
        records={data.qualityScores}
        fields={[
          "topic",
          "status",
          "factual_accuracy_score",
          "source_strength_score",
          "legal_risk_score",
          "seo_score",
          "readability_score",
          "cwi_voice_score",
          "publish_readiness_score"
        ]}
      />
    </div>
  );
}

function ApprovalSection({
  data,
  pending,
  updateApproval,
  publishApproval,
  approveAndPublish,
  generateArticleForApproval
}: {
  data: AdminData;
  pending: string;
  updateApproval: (id: string, status: string) => Promise<void>;
  publishApproval: (id: string) => Promise<void>;
  approveAndPublish: (item: AdminRecord) => Promise<void>;
  generateArticleForApproval: (item: AdminRecord) => Promise<void>;
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
        data.approvals.map((item) => {
          const status = normalizeApprovalStatus(text(item.status));
          const articleReady = Boolean(item.article_draft_id);
          const canGenerateArticle = Boolean(item.research_pack_id) && !articleReady;
          const canPublish = status === "approved" && (articleReady || Boolean(item.research_pack_id));

          return (
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
            {!articleReady && item.research_pack_id ? (
              <p className="mt-3 rounded-2xl border border-saffron/30 bg-saffron/10 p-3 text-sm font-bold leading-6 text-[#8A5B00]">
                No article draft is attached yet. Publish AI can generate the missing draft from this card&apos;s research pack after approval.
              </p>
            ) : !articleReady ? (
              <p className="mt-3 rounded-2xl border border-saffron/30 bg-saffron/10 p-3 text-sm font-bold leading-6 text-[#8A5B00]">
                Publish AI is unavailable because no article draft or research pack is attached. Approve it as social/research only, or create a full article workflow first.
              </p>
            ) : status !== "approved" ? (
              <p className="mt-3 rounded-2xl border border-line bg-skywash p-3 text-sm font-bold leading-6 text-royal">
                Use Approve & Publish to approve this card and publish it in one controlled step.
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-2">
              {approvalActions.map((action) => {
                const pendingKey = pending === `${text(item.id)}:${action.status}`;
                const isPublishAction = action.status === "approved";
                return (
                  <Button
                    key={action.status}
                    type="button"
                    size="sm"
                    variant={isPublishAction ? "default" : "outline"}
                    disabled={pendingKey || (isPublishAction && !canPublish)}
                    onClick={() => (isPublishAction ? approveAndPublish(item) : updateApproval(text(item.id), action.status))}
                  >
                    {pendingKey && isPublishAction ? "Publishing..." : action.label}
                  </Button>
                );
              })}
              {canGenerateArticle ? (
                <Button type="button" size="sm" variant="outline" disabled={pending === `${text(item.id)}:article`} onClick={() => generateArticleForApproval(item)}>
                  {pending === `${text(item.id)}:article` ? "Generating..." : "Generate Article Draft"}
                </Button>
              ) : null}
              <Button type="button" size="sm" disabled={!canPublish || pending === `${text(item.id)}:publish`} onClick={() => publishApproval(text(item.id))}>
                {pending === `${text(item.id)}:publish` ? "Publishing..." : "Run Publish AI"}
              </Button>
            </div>
          </Card>
          );
        })
      )}
    </div>
  );
}

const approvalActions = [
  { label: "Approve & Publish", status: "approved" },
  { label: "Approve Social Only", status: "approved_social_only" },
  { label: "Approve Article Only", status: "approved_article_only" },
  { label: "Request Changes", status: "changes_requested" },
  { label: "Reject", status: "rejected" },
  { label: "Save for Later", status: "waiting_for_approval" },
  { label: "Archive", status: "archived" }
] as const;

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
        <MiniMetric label="AI provider" value={data.ai.provider} />
        <MiniMetric label="AI model" value={data.ai.model} />
        <MiniMetric label="AI configured" value={data.ai.configured ? "Yes" : "No"} />
        <MiniMetric label="Production AI ready" value={data.ai.productionReady ? "Yes" : "No"} />
      </div>
      <p className={`mt-5 rounded-2xl p-4 text-sm font-bold leading-6 ${data.ai.productionReady ? "bg-leaf/10 text-[#047766]" : "bg-saffron/15 text-[#8A5B00]"}`}>
        {data.ai.message}
      </p>
      <p className="mt-5 leading-7 text-ink/70">
        No paid X API, Instagram API, paid crawler, hardcoded credentials, or automatic high-volume crawling is required. Expensive calls should be paused when budget pressure is high.
      </p>
    </Card>
  );
}

function ProgressNotice({ progress }: { progress: { label: string; detail: string; percent: number } }) {
  return (
    <Card className="border-royal/20 bg-gradient-to-br from-white to-skywash">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <CardLabel>Bot progress</CardLabel>
          <h2 className="font-display text-2xl font-black uppercase tracking-[-0.03em] text-ink">{progress.label}</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-ink/68">{progress.detail}</p>
        </div>
        <p className="font-display text-4xl font-black text-royal">{progress.percent}%</p>
      </div>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-white ring-1 ring-royal/15">
        <div
          className="h-full rounded-full bg-gradient-to-r from-royal via-leaf to-saffron transition-all duration-500"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
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

function actionLabel(action: string) {
  const match = agentActions.find(([id]) => id === action);
  return match?.[1] ?? action.replace(/-/g, " ");
}

function normalizeApprovalStatus(value: string) {
  const normalized = value.trim().toLowerCase().replace(/[-\s]+/g, "_");
  const statusMap: Record<string, string> = {
    approve: "approved",
    approved: "approved",
    approve_publish: "approved",
    "approve_&_publish": "approved",
    approved_publish: "approved",
    approved_article_only: "approved_article_only",
    approved_social_only: "approved_social_only",
    request_changes: "changes_requested",
    changes_requested: "changes_requested",
    reject: "rejected",
    rejected: "rejected",
    save_for_later: "waiting_for_approval",
    waiting_for_approval: "waiting_for_approval",
    published: "published",
    archive: "archived",
    archived: "archived"
  };

  return statusMap[normalized] ?? normalized;
}

function normalizeSection(value: string): SectionId {
  const match = sections.find(([id]) => id === value)?.[0];
  return match ?? "overview";
}

function sectionFromPath(pathname: string): SectionId {
  const section = pathname.split("/").filter(Boolean)[1] ?? "overview";
  return normalizeSection(section);
}
