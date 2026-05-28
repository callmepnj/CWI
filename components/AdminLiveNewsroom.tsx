"use client";

import type React from "react";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  Archive,
  CheckCircle,
  Clock3,
  EyeOff,
  FilePlus2,
  FileText,
  ListChecks,
  Plus,
  Send,
  ShieldCheck,
  Star,
  TableProperties
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardLabel } from "@/components/ui/card";
import {
  claimTrackerItems,
  corrections,
  liveNewsroomItems,
  publicAdvisories,
  sources,
  type LiveNewsroomItem
} from "@/data/live-newsroom";

interface AdminLiveNewsroomProps {
  section?: string;
}

type AdminTab = "daily" | "items" | "verification" | "advisories" | "sources" | "corrections";

const tabs: Array<[AdminTab, string]> = [
  ["daily", "Daily controls"],
  ["items", "Live updates"],
  ["verification", "Verification Desk"],
  ["advisories", "Advisories"],
  ["sources", "Source Ledger"],
  ["corrections", "Corrections"]
];

const dailyControls = [
  ["Set Today's Top 3", "Choose the three priority records for today's public homepage.", Star],
  ["Set Lead Story", "Pin one approved item as the newsroom lead story.", FileText],
  ["Add What Changed Today item", "Create a short timeline log with change type and source count.", Clock3],
  ["Add Live Update", "Draft a compact update for the latest feed.", Plus],
  ["Add Verification Desk claim", "Open a claim-check record with known, unclear, and source-gap fields.", ShieldCheck],
  ["Add Public Advisory", "Write a calm reader caution before screenshots or links spread.", AlertCircle],
  ["Add India Unanswered File priority", "Promote up to six priority files for the homepage shelf.", Archive],
  ["Add Source Ledger entry", "Log what a source supports and what it does not prove.", TableProperties],
  ["Add Correction", "Create a correction or clarification record for approval.", FilePlus2]
] as const;

const itemActions = [
  "Mark item NEW TODAY",
  "Mark item UPDATED TODAY",
  "Mark item SOURCE REQUEST OPEN",
  "Hide item from Live Newsroom",
  "Send to Approval Queue"
] as const;

export function AdminLiveNewsroom({ section: _section }: AdminLiveNewsroomProps) {
  void _section;
  const [activeTab, setActiveTab] = useState<AdminTab>("daily");
  const [message, setMessage] = useState("No public newsroom changes are saved until they pass approval.");

  const approvedItems = useMemo(
    () => liveNewsroomItems.filter((item) => item.approvalStatus === "approved" && !item.hiddenFromLiveNewsroom),
    []
  );

  function queueAction(action: string, subject?: string) {
    const target = subject ? ` for ${subject}` : "";
    setMessage(`${action}${target} was prepared for the approval queue. Publishing remains blocked until approval.`);
  }

  return (
    <div className="space-y-6">
      <Card className="border-cwi-green/25 bg-cwi-cream/80 before:from-cwi-saffron before:via-cwi-green before:to-cwi-saffron">
        <CardLabel className="bg-cwi-green/10 text-cwi-green ring-cwi-green/20">Live Newsroom</CardLabel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em] text-ink">Daily publishing desk</h2>
            <p className="mt-3 leading-7 text-ink/70">
              Manage the daily homepage order, source gaps, labels, and correction path. Nothing publishes to the public Live Newsroom without approval.
            </p>
          </div>
          <div className="rounded-2xl border border-cwi-green/25 bg-white p-4 text-sm font-bold text-cwi-green">
            <CheckCircle className="mb-2 h-5 w-5" /> Publish after approval only
          </div>
        </div>
        <div className="mt-5 rounded-2xl border border-cwi-saffron/35 bg-white p-4 text-sm font-bold leading-6 text-cwi-brown">
          {message}
        </div>
      </Card>

      <div className="flex gap-2 overflow-x-auto border-b border-line pb-2">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-black uppercase tracking-[0.08em] transition ${
              activeTab === id ? "bg-cwi-green text-white" : "bg-white text-ink/60 hover:bg-cwi-cream hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "daily" ? <DailyControls queueAction={queueAction} /> : null}
      {activeTab === "items" ? <ItemsPanel items={approvedItems} queueAction={queueAction} /> : null}
      {activeTab === "verification" ? <VerificationPanel /> : null}
      {activeTab === "advisories" ? <AdvisoryPanel /> : null}
      {activeTab === "sources" ? <SourcesPanel /> : null}
      {activeTab === "corrections" ? <CorrectionsPanel /> : null}
    </div>
  );
}

function DailyControls({ queueAction }: { queueAction: (action: string, subject?: string) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {dailyControls.map(([title, description, Icon]) => (
        <Card key={title} className="rounded-2xl before:bg-cwi-saffron">
          <Icon className="h-5 w-5 text-cwi-green" />
          <h3 className="mt-4 font-display text-xl font-black text-ink">{title}</h3>
          <p className="mt-2 min-h-14 text-sm leading-6 text-ink/65">{description}</p>
          <Button type="button" size="sm" variant="outline" className="mt-4 normal-case tracking-normal" onClick={() => queueAction(title)}>
            <Send className="h-4 w-4" /> Send to Approval Queue
          </Button>
        </Card>
      ))}
    </div>
  );
}

function ItemsPanel({ items, queueAction }: { items: LiveNewsroomItem[]; queueAction: (action: string, subject?: string) => void }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="rounded-2xl before:bg-cwi-green">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <div className="mb-2 flex flex-wrap gap-2">
                {item.isLeadStory ? <Badge>Lead Story</Badge> : null}
                {item.topStoryRank ? <Badge>Top {item.topStoryRank}</Badge> : null}
                <Badge>{item.status}</Badge>
                {item.labels.map((label) => <Badge key={label}>{label}</Badge>)}
              </div>
              <h3 className="font-display text-2xl font-black text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/65">{item.summary}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <MiniMetric label="Sources" value={`${item.sourceTrail.length}`} />
                <MiniMetric label="Correction" value={item.correctionOpen ? "Open" : "Closed"} />
                <MiniMetric label="Source request" value={item.sourceRequestOpen ? "Open" : "Closed"} />
                <MiniMetric label="Approval" value={item.approvalStatus} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {itemActions.map((action) => (
                <Button key={action} type="button" size="sm" variant="outline" className="normal-case tracking-normal" onClick={() => queueAction(action, item.title)}>
                  {action === "Hide item from Live Newsroom" ? <EyeOff className="h-4 w-4" /> : <ListChecks className="h-4 w-4" />}
                  {action}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function VerificationPanel() {
  return (
    <RecordGrid
      title="Verification Desk claims"
      empty="No verification claims are logged."
      records={claimTrackerItems.map((claim) => ({
        title: claim.claim,
        meta: `${claim.status} / ${claim.sources.length} sources`,
        body: claim.cwiNote,
        footer: claim.sourceGap ? `Source gap: ${claim.sourceGap}` : "No open source gap."
      }))}
    />
  );
}

function AdvisoryPanel() {
  return (
    <RecordGrid
      title="Public advisories"
      empty="No advisories are logged."
      records={publicAdvisories.map((advisory) => ({
        title: advisory.title,
        meta: advisory.type,
        body: advisory.warning,
        footer: `Reader action: ${advisory.whatToRead}`
      }))}
    />
  );
}

function SourcesPanel() {
  return (
    <RecordGrid
      title="Source Ledger entries"
      empty="No sources are logged."
      records={sources.map((source) => ({
        title: source.name,
        meta: source.type,
        body: source.supports || "Source context logged.",
        footer: source.doesNotProve ? `Does not prove: ${source.doesNotProve}` : "Limits not recorded."
      }))}
    />
  );
}

function CorrectionsPanel() {
  return (
    <RecordGrid
      title="Corrections & clarifications"
      empty="No public corrections have been logged yet."
      records={corrections.map((correction) => ({
        title: correction.itemTitle,
        meta: correction.status,
        body: correction.whatChanged,
        footer: correction.whyChanged
      }))}
    />
  );
}

function RecordGrid({
  title,
  empty,
  records
}: {
  title: string;
  empty: string;
  records: Array<{ title: string; meta: string; body: string; footer: string }>;
}) {
  return (
    <div className="space-y-4">
      <Card className="rounded-2xl before:bg-cwi-saffron">
        <CardLabel className="bg-cwi-saffron/15 text-cwi-brown ring-cwi-saffron/25">{title}</CardLabel>
        <p className="leading-7 text-ink/70">Review records here, then send edits to approval before public publishing.</p>
      </Card>
      {records.length === 0 ? (
        <Card className="rounded-2xl"><p className="font-bold text-ink/60">{empty}</p></Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {records.map((record) => (
            <Card key={`${record.title}-${record.meta}`} className="rounded-2xl before:bg-cwi-green">
              <Badge>{record.meta}</Badge>
              <h3 className="mt-3 font-display text-xl font-black text-ink">{record.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/68">{record.body}</p>
              <p className="mt-4 rounded-2xl bg-cwi-cream p-3 text-xs font-bold leading-5 text-cwi-brown">{record.footer}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-cwi-green/20 bg-cwi-green/10 px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-wide text-cwi-green">
      {children}
    </span>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-3">
      <div className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-ink/45">{label}</div>
      <div className="mt-1 text-sm font-black text-ink">{value}</div>
    </div>
  );
}
