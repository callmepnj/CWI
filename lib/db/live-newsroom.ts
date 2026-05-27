import { posts, type ArticleSource } from "@/data/posts";
import { getFileVisual, unansweredFiles } from "@/data/unanswered-files";
import { assessAiishness } from "@/lib/ai/aiishness";
import { getPool } from "@/lib/db";
import { ensureAdminDatabase } from "@/lib/db/admin";
import { optionalUuid, requireUuid } from "@/lib/db/ids";
import { site } from "@/lib/site";

export type LiveNewsroomStatus =
  | "Verified"
  | "Source-backed"
  | "Reported"
  | "Developing"
  | "Opinion/Analysis"
  | "Satire/Context"
  | "Unverified"
  | "Public Advisory"
  | "Correction"
  | "Archived";

export type LiveNewsroomSource = ArticleSource;

export type LiveNewsroomTimelineItem = {
  date: string;
  title: string;
  summary: string;
};

export type LiveNewsroomSourceTrailItem = {
  name: string;
  type: string;
  date: string;
  url: string;
  supports: string;
  doesNotProve: string;
};

export type LiveNewsroomClaimTrackerItem = {
  claim: string;
  topic: string;
  firstSeen: string;
  source: string;
  status: LiveNewsroomStatus | "False/Misleading" | "Needs context" | "Blocked";
  evidenceLevel: string;
  cwiNote: string;
};

export type LiveNewsroomCorrectionItem = {
  date: string;
  whatChanged: string;
  whyChanged: string;
  note: string;
};

export type LiveNewsroomItem = {
  id: string;
  title: string;
  slug: string;
  category: string;
  type: string;
  summary: string;
  body: Array<{ heading: string; paragraphs: string[] }>;
  verificationStatus: LiveNewsroomStatus;
  riskLevel: string;
  sourceCount: number;
  sources: LiveNewsroomSource[];
  whatHappened: string;
  whatChanged: string;
  whatWeKnow: string;
  whatWeDontKnow: string[];
  whatRemainsUnclear: string;
  timeline: LiveNewsroomTimelineItem[];
  beforeYouShare: string[];
  editorNote: string;
  aiishnessScore: number;
  claimTracker: LiveNewsroomClaimTrackerItem[];
  sourceTrail: LiveNewsroomSourceTrailItem[];
  correctionHistory: LiveNewsroomCorrectionItem[];
  regionTags: string[];
  topicTags: string[];
  cwiContext: string;
  tags: string[];
  heroImage: string;
  thumbnailImage: string;
  ogImage: string;
  altText: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  relatedItems: string[];
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  status: string;
};

type LiveNewsroomRow = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  type: string | null;
  summary: string | null;
  body: unknown;
  verification_status: string | null;
  risk_level: string | null;
  source_count: number | null;
  sources_json: unknown;
  what_happened: string | null;
  what_changed: string | null;
  what_we_know: string | null;
  what_we_dont_know: string | null;
  what_remains_unclear: string | null;
  timeline_json: unknown;
  before_you_share: string | null;
  editor_note: string | null;
  aiishness_score: number | null;
  claim_tracker_json: unknown;
  source_trail_json: unknown;
  correction_history_json: unknown;
  region_tags_json: unknown;
  topic_tags_json: unknown;
  cwi_context: string | null;
  tags_json: unknown;
  hero_image: string | null;
  thumbnail_image: string | null;
  og_image: string | null;
  alt_text: string | null;
  published_at: string | null;
  updated_at: string | null;
  author: string | null;
  related_items_json: unknown;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  status: string | null;
};

export async function saveLiveNewsroomItemFromDraft(input: {
  approval: Record<string, unknown>;
  articleDraft: Record<string, unknown>;
}) {
  await ensureAdminDatabase();
  const articleDraftId = requireUuid(input.articleDraft.id, "articleDraftId");
  const approvalQueueId = optionalUuid(input.approval.id);
  const draft = asRecord(input.articleDraft.draft);
  const nestedBody = asRecord(draft.body);
  const title = asText(input.articleDraft.title, asText(draft.title, "CWI Live Newsroom update"));
  const slug = slugify(asText(input.articleDraft.slug, asText(draft.slug, title)));
  const category = asText(input.articleDraft.category, asText(draft.category, "Live Newsroom"));
  const verificationStatus = normalizeStatus(asText(input.approval.verification_status, asText(input.articleDraft.verification_status, "Developing")));
  const riskLevel = asText(input.approval.risk_level, "Medium");
  const sourceCount = Number(input.approval.source_count ?? input.articleDraft.source_count ?? 0);
  const sections = extractSections(draft);
  const researchSources = await latestResearchSources(input.articleDraft.research_pack_id);
  const draftSources = extractSources(draft.sources || nestedBody.sources);
  const sources = draftSources.length ? draftSources : researchSources;
  const fallbackSummary = sections[0]?.paragraphs[0] || "CWI Live Newsroom update approved for public publication.";
  const summary = asText(input.approval.summary, asText(draft.summary, fallbackSummary));
  const timeline = normalizeTimeline(draft.timeline || nestedBody.timeline);
  const tags = normalizeStringArray(draft.tags).length
    ? normalizeStringArray(draft.tags)
    : ["Cockroach Watch India", "CWI Live Newsroom", category];
  const relatedItems = normalizeStringArray(draft.relatedArticles || draft.related_items);
  const seo = await latestSeoForDraft(articleDraftId);
  const image = await latestImageForApproval(input.approval.image_pack_id);
  const canonicalUrl = asText(seo?.canonical_url, `${site.url}/live-newsroom/${slug}`);
  const whatHappened = asText(draft.whatHappened || nestedBody.whatHappened, sections.find((section) => section.heading === "What happened")?.paragraphs.join("\n\n") || summary);
  const whatChanged = asText(
    draft.whatChanged || nestedBody.whatChanged,
    sections.find((section) => section.heading === "What changed")?.paragraphs.join("\n\n") ||
      latestTimelineSummary(timeline) ||
      "No material change has been recorded yet. CWI will update this page when new verified context is reviewed."
  );
  const whatWeKnow = asText(draft.whatWeKnow || nestedBody.whatWeKnow, sections.find((section) => section.heading === "What we know")?.paragraphs.join("\n\n") || summary);
  const whatWeDontKnow = normalizeStringArray(draft.whatWeDontKnow || draft.what_we_dont_know || nestedBody.whatWeDontKnow || nestedBody.what_we_dont_know);
  const whatRemainsUnclear = asText(
    draft.whatRemainsUnclear || nestedBody.whatRemainsUnclear,
    sections.find((section) => section.heading === "What remains unclear")?.paragraphs.join("\n\n") ||
      "CWI is keeping this update open for corrections, official clarification, and additional verified context."
  );
  const beforeYouShare = normalizeStringArray(draft.beforeYouShare || draft.before_you_share || nestedBody.beforeYouShare);
  const sourceTrail = normalizeSourceTrail(draft.sourceTrail || draft.source_trail_json || nestedBody.sourceTrail, sources, timeline, title);
  const claimTracker = normalizeClaimTracker(draft.claimTracker || draft.claim_tracker_json, title, category, verificationStatus, sourceCount, sources, whatRemainsUnclear, timeline[0]?.date || new Date().toISOString().slice(0, 10));
  const correctionHistory = normalizeCorrectionHistory(draft.correctionHistory || draft.correction_history_json);
  const regionTags = normalizeStringArray(draft.regionTags || draft.region_tags_json);
  const topicTags = normalizeStringArray(draft.topicTags || draft.topic_tags_json).length
    ? normalizeStringArray(draft.topicTags || draft.topic_tags_json)
    : tags;
  const editorNote = asText(
    draft.editorNote || draft.editor_note,
    verificationStatus === "Developing" || verificationStatus === "Reported"
      ? "CWI is keeping this page updated because some details are moving faster than confirmed information."
      : ""
  );
  const aiishnessScore = Number(
    draft.aiishnessScore ??
      draft.aiishness_score ??
      assessAiishness({
        contentType: "live_newsroom_item",
        contentId: articleDraftId,
        pageUrl: canonicalUrl,
        title,
        text: `${summary}\n${sections.flatMap((section) => section.paragraphs).join("\n")}`
      }).score
  );

  const result = await getPool().query<{ id: string }>(
    `
      with updated as (
        update live_newsroom_items
        set approval_queue_id = $2,
            title = $3,
            slug = $4,
            category = $5,
            type = $6,
            summary = $7,
            body = $8,
            verification_status = $9,
            risk_level = $10,
            source_count = $11,
            sources_json = $12,
            what_happened = $13,
            what_changed = $14,
            what_we_know = $15,
            what_we_dont_know = $16,
            what_remains_unclear = $17,
            timeline_json = $18,
            before_you_share = $19,
            editor_note = $20,
            aiishness_score = $21,
            claim_tracker_json = $22,
            source_trail_json = $23,
            correction_history_json = $24,
            region_tags_json = $25,
            topic_tags_json = $26,
            cwi_context = $27,
            tags_json = $28,
            hero_image = $29,
            thumbnail_image = $30,
            og_image = $31,
            alt_text = $32,
            updated_at = now(),
            author = $33,
            related_items_json = $34,
            seo_title = $35,
            seo_description = $36,
            canonical_url = $37,
            status = 'published',
            metadata = $38
        where article_draft_id = $1
        returning id
      ),
      inserted as (
        insert into live_newsroom_items (
          article_draft_id, approval_queue_id, title, slug, category, type, summary,
          body, verification_status, risk_level, source_count, sources_json,
          what_happened, what_changed, what_we_know, what_we_dont_know, what_remains_unclear, timeline_json,
          before_you_share, editor_note, aiishness_score, claim_tracker_json, source_trail_json,
          correction_history_json, region_tags_json, topic_tags_json, cwi_context, tags_json, hero_image, thumbnail_image, og_image, alt_text,
          author, related_items_json, seo_title, seo_description, canonical_url, status, metadata
        )
        select $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
          $31, $32, $33, $34, $35, $36, $37, 'published', $38
        where not exists (select 1 from updated)
        returning id
      )
      select id from updated
      union all
      select id from inserted
    `,
    [
      articleDraftId,
      approvalQueueId,
      title,
      slug,
      category,
      "live_newsroom_update",
      summary,
      JSON.stringify(sections),
      verificationStatus,
      riskLevel,
      sourceCount,
      JSON.stringify(sources),
      whatHappened,
      whatChanged,
      whatWeKnow,
      whatWeDontKnow.length ? whatWeDontKnow.join("\n") : whatRemainsUnclear,
      whatRemainsUnclear,
      JSON.stringify(timeline),
      beforeYouShare.length ? beforeYouShare.join("\n") : defaultBeforeYouShare.join("\n"),
      editorNote,
      aiishnessScore,
      JSON.stringify(claimTracker),
      JSON.stringify(sourceTrail),
      JSON.stringify(correctionHistory),
      JSON.stringify(regionTags),
      JSON.stringify(topicTags),
      asText(draft.cwiContext || draft.disclaimer, cwiContext),
      JSON.stringify(tags),
      image?.heroImage || `${site.url}/opengraph-image`,
      image?.thumbnailImage || image?.heroImage || `${site.url}/opengraph-image`,
      image?.ogImage || image?.heroImage || `${site.url}/opengraph-image`,
      image?.altText || `${title} - CWI Live Newsroom visual`,
      "Cockroach Watch India Editorial Desk",
      JSON.stringify(relatedItems),
      asText(seo?.seo_title, `${title} - CWI Live Newsroom | Cockroach Watch India`),
      asText(seo?.meta_description, `Cockroach Watch India Live Newsroom explains ${title}, what is known, what remains unclear, and why CWI is tracking this public-interest update.`),
      canonicalUrl,
      JSON.stringify({ approvalQueueId, articleDraftId, source: "CWI Publish Gate", aiishnessScore })
    ]
  );

  return { id: result.rows[0].id, slug, url: canonicalUrl };
}

export async function getPublishedLiveNewsroomItems(limit = 80) {
  await ensureAdminDatabase();
  const result = await getPool().query<LiveNewsroomRow>(
    `
      select id::text, title, slug, category, type, summary, body, verification_status,
        risk_level, source_count, sources_json, what_happened, what_changed, what_we_know,
        what_we_dont_know, what_remains_unclear, timeline_json, before_you_share,
        editor_note, aiishness_score, claim_tracker_json, source_trail_json,
        correction_history_json, region_tags_json, topic_tags_json, cwi_context, tags_json, hero_image,
        thumbnail_image, og_image, alt_text, published_at::text, updated_at::text,
        author, related_items_json, seo_title, seo_description, canonical_url, status
      from live_newsroom_items
      where status = 'published'
      order by published_at desc
      limit $1
    `,
    [limit]
  );

  return result.rows.map(rowToLiveNewsroomItem);
}

export async function getPublishedLiveNewsroomItem(slug: string) {
  await ensureAdminDatabase();
  const result = await getPool().query<LiveNewsroomRow>(
    `
      select id::text, title, slug, category, type, summary, body, verification_status,
        risk_level, source_count, sources_json, what_happened, what_changed, what_we_know,
        what_we_dont_know, what_remains_unclear, timeline_json, before_you_share,
        editor_note, aiishness_score, claim_tracker_json, source_trail_json,
        correction_history_json, region_tags_json, topic_tags_json, cwi_context, tags_json, hero_image,
        thumbnail_image, og_image, alt_text, published_at::text, updated_at::text,
        author, related_items_json, seo_title, seo_description, canonical_url, status
      from live_newsroom_items
      where slug = $1 and status = 'published'
      order by published_at desc
      limit 1
    `,
    [slug]
  );

  return result.rows[0] ? rowToLiveNewsroomItem(result.rows[0]) : null;
}

const neetCbseStudentHelpItem: LiveNewsroomItem = {
  id: "cwi-live-neet-ug-2026-re-exam-stress-cbse-revaluation-student-help",
  title: "NEET UG 2026 Re-Exam Stress: Official Updates, CBSE Re-Evaluation Issues and What Students Should Do Now",
  slug: "neet-ug-2026-re-exam-stress-cbse-revaluation-student-help",
  category: "Public Advisory",
  type: "public_advisory",
  summary:
    "NEET UG 2026 aspirants and CBSE board students are facing stress around re-exam updates, answer-sheet access, re-evaluation confusion and misinformation. Students should rely on official NTA and CBSE notices, keep records, and seek support if exam stress becomes heavy.",
  body: [
    {
      heading: "Latest NEET UG 2026 official updates",
      paragraphs: [
        "The official NTA NEET website has listed notices and activity links related to NEET UG 2026, including re-examination, refund of examination fee, provisional answer keys, present address and exam city updation, and confirmation page download.",
        "Students should check neet.nta.nic.in regularly for the latest official notice. Do not depend on screenshots unless the same notice can be opened directly from the official NTA NEET website or an official NTA link."
      ]
    },
    {
      heading: "Why NEET students are stressed",
      paragraphs: [
        "NEET is not a one-day exam for most aspirants. Many students prepare for years, some repeat the exam, and families often spend heavily on coaching, hostel fees, travel and study material.",
        "Uncertainty around a re-exam can affect sleep, concentration and confidence. Social media misinformation can make this worse because fake dates, edited circulars and unverified claims travel faster than official clarifications.",
        "Students should not treat rumours as official updates. During uncertainty, the aim should be to protect routine, revision and mental health."
      ]
    },
    {
      heading: "Responsible note on student distress",
      paragraphs: [
        "Some news reports have linked the NEET controversy and re-exam uncertainty with severe distress among aspirants, including reported student deaths. This should be discussed carefully, without details, images, blame or speculation.",
        "No exam is bigger than a student's life. Students feeling overwhelmed should speak to a parent, teacher, friend, counsellor, or call a mental health helpline."
      ]
    },
    {
      heading: "CBSE re-evaluation and scanned answer sheet issues",
      paragraphs: [
        "CBSE Class 10 and Class 12 students are also dealing with post-result stress. Students and parents have reported concerns such as portal crashes, payment failures, unclear scanned answer sheets, missing or incorrect answer-sheet concerns, fake circulars, deadline confusion and anxiety after result declaration.",
        "The official CBSE website has posted notices related to extension of date for obtaining scanned copies of Class XII answer books, post-result declaration facilities, Know About On Screen Marking, and Class XII 2026 result-related updates.",
        "Students should use only cbse.gov.in and official CBSE portals. If a circular is not available on the official CBSE website, students should verify it through their school before taking action."
      ]
    },
    {
      heading: "What is CBSE OSM?",
      paragraphs: [
        "CBSE OSM means On Screen Marking. In this system, answer books are scanned and evaluated digitally by examiners on a computer screen.",
        "It does not mean computers check answers automatically. Teachers and examiners still evaluate the answers. CBSE's official OSM circular says the Board decided to introduce On-Screen Marking for evaluation of Class XII answer books beginning with the 2026 examinations."
      ]
    },
    {
      heading: "Student checklist for NEET aspirants",
      paragraphs: [
        "Check only the official NTA NEET website. Save PDFs or screenshots of official notices. Do not trust WhatsApp forwards. Keep admit card and application details ready. Make a short revision plan instead of restarting everything.",
        "Sleep properly before study sessions. Avoid comparing marks constantly. Talk to someone if anxiety becomes too much. Contact NTA helpdesk only through official channels."
      ]
    },
    {
      heading: "Student checklist for CBSE students",
      paragraphs: [
        "Check official CBSE notices. Keep roll number and school details ready. Save payment receipts. Do not submit duplicate requests unless officially advised.",
        "If an answer sheet is unclear, follow the official process. Avoid fake circulars and edited screenshots. Discuss serious concerns with school authorities."
      ]
    },
    {
      heading: "Mental health help for students",
      paragraphs: [
        "If a student feels hopeless, panicked, unable to sleep, or has thoughts of self-harm, they should immediately contact a trusted adult or professional support.",
        "Tele MANAS is India's national tele-mental health support service. The helpline numbers are 14416 and 1800-891-4416. PIB says Tele MANAS provides 24x7 tele-mental health support and counselling access across India.",
        "If there is immediate danger, contact local emergency services or go to the nearest hospital."
      ]
    },
    {
      heading: "For parents",
      paragraphs: [
        "Parents should avoid comparing their child with others. A line like everything depends on this exam can increase fear. Instead, help the student verify official updates, organise documents and maintain a simple routine.",
        "Watch for changes in sleep, appetite, isolation, panic, hopelessness or sudden withdrawal. Encourage breaks, counselling and honest conversation. Remind the child that exams can be repeated, but life cannot."
      ]
    },
    {
      heading: "For schools and coaching centres",
      paragraphs: [
        "Schools and coaching centres should share only official notices. They should stop rumour-spreading, provide counselling support, create small revision support groups and train teachers to identify distress signs.",
        "Institutions should also display Tele MANAS helpline information clearly. During exam uncertainty, communication should be calm, verified and student-first."
      ]
    },
    {
      heading: "FAQ",
      paragraphs: [
        "Where can students check official NEET UG 2026 updates? Students should check neet.nta.nic.in, the official NTA NEET website.",
        "What should students do if they are confused about NEET re-exam updates? They should wait for official NTA notices, save verified PDFs and avoid acting on social media rumours.",
        "Where can CBSE students check re-evaluation and scanned answer sheet notices? Students should check cbse.gov.in and official CBSE portals.",
        "What is CBSE OSM? OSM means On Screen Marking. Answer books are scanned and evaluated digitally by examiners on a screen.",
        "What should students do if exam stress becomes overwhelming? They should speak to a trusted adult, school counsellor or mental health professional. They can also call Tele MANAS at 14416 or 1800-891-4416.",
        "What should parents avoid saying during exam uncertainty? Parents should avoid comparison, blame and statements suggesting that one exam decides the child's whole life."
      ]
    },
    {
      heading: "Conclusion",
      paragraphs: [
        "Students should follow official updates, avoid rumours, take one step at a time, and seek help when stress becomes too heavy. No exam result or re-exam is worth risking mental health."
      ]
    }
  ],
  verificationStatus: "Source-backed",
  riskLevel: "Medium",
  sourceCount: 7,
  sources: [
    {
      name: "NTA NEET official website",
      outlet: "National Testing Agency",
      url: "https://neet.nta.nic.in/",
      type: "Official source",
      note: "Lists NEET UG 2026 latest news, public notices and candidate activity links."
    },
    {
      name: "NTA NEET Public Notices",
      outlet: "National Testing Agency",
      url: "https://neet.nta.nic.in/public-notices/",
      type: "Official source",
      note: "Lists official NEET UG 2026 public notices including re-examination and answer-key notices."
    },
    {
      name: "Present Address and Exam City Updation Window for NEET(UG) 2026",
      outlet: "National Testing Agency",
      url: "https://neet.nta.nic.in/present-address-and-exam-city-update-window-for-neetug-2026/",
      type: "Official source",
      note: "Official NTA page for present address and exam city updation window."
    },
    {
      name: "CBSE official website",
      outlet: "Central Board of Secondary Education",
      url: "https://www.cbse.gov.in/cbsenew/cbse.html",
      type: "Official source",
      note: "Lists CBSE notices on scanned copies, post-result facilities, OSM and result-related updates."
    },
    {
      name: "Introduction of On-Screen Marking for Class XII Examinations",
      outlet: "Central Board of Secondary Education",
      url: "https://www.cbse.gov.in/cbsenew/documents/OSM_Class%20XII_09022026.pdf",
      type: "Official source",
      note: "CBSE circular explaining the introduction of On-Screen Marking for Class XII answer books."
    },
    {
      name: "Tele-MANAS initiative launch",
      outlet: "Press Information Bureau",
      url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1866498",
      type: "Official source",
      note: "PIB release describing Tele MANAS and the 14416 national tele-mental health helpline."
    },
    {
      name: "NEET re-exam stress takes emotional toll on aspirants",
      outlet: "Times of India",
      url: "https://timesofindia.indiatimes.com/city/jaipur/neet-ug-cancellation-re-exam-stress-takes-emotional-toll-on-aspirants-in-kota-jaipur-and-sikar/amp_articleshow/131145260.cms",
      type: "News report",
      note: "Used only for broad context on stress among aspirants; personal details are intentionally not repeated."
    }
  ],
  whatHappened:
    "NEET UG 2026 re-exam notices, answer-key updates, fee refund activity and exam city/address updates have increased uncertainty for aspirants. At the same time, CBSE students are navigating scanned answer sheet and post-result processes after Class XII result-related notices.",
  whatChanged:
    "CWI is publishing this student-first guide after official NTA and CBSE notices appeared alongside growing public concern about exam stress, misinformation and post-result confusion.",
  whatWeKnow:
    "Official NTA pages list NEET UG 2026 notices and candidate activity links. CBSE's official site lists scanned answer book, post-result facility and OSM notices. PIB lists Tele MANAS as a 24x7 tele-mental health support service with helpline 14416 and 1800-891-4416.",
  whatWeDontKnow: [
    "Whether any future NEET UG 2026 timeline changes will be issued by NTA.",
    "Whether individual CBSE portal or scanned answer sheet complaints have been resolved in specific cases.",
    "Whether social media claims about new dates or procedures are genuine unless they appear on official portals."
  ],
  whatRemainsUnclear:
    "Students still need to monitor official NTA and CBSE portals for current instructions. CWI is not treating screenshots, forwards or unofficial claims as updates.",
  timeline: [
    {
      date: "09 Feb 2026",
      title: "CBSE OSM circular",
      summary: "CBSE issued a circular on introducing On-Screen Marking for Class XII answer books beginning with the 2026 examinations."
    },
    {
      date: "12 May 2026",
      title: "NTA NEET public notices listed",
      summary: "The NTA NEET site listed public notices related to NEET UG 2026, including re-examination and fee refund information."
    },
    {
      date: "15 May 2026",
      title: "NEET exam city/address update page",
      summary: "NTA published the present address and exam city updation window page for NEET UG 2026."
    },
    {
      date: "May 2026",
      title: "CBSE post-result notices",
      summary: "CBSE listed notices related to scanned copies of Class XII answer books and post-result declaration facilities."
    }
  ],
  beforeYouShare: [
    "Check whether the NEET or CBSE notice opens from the official website.",
    "Do not forward screenshots without verifying the source link.",
    "Do not share personal details, roll numbers or private student information publicly.",
    "If a student is distressed, share help resources instead of rumours."
  ],
  editorNote:
    "CWI is keeping this update focused on official links, student safety and practical next steps. Details about reported student deaths are intentionally not repeated.",
  aiishnessScore: 12,
  claimTracker: [
    {
      claim: "NTA has listed NEET UG 2026 public notices and candidate activity links.",
      topic: "NEET UG 2026",
      firstSeen: "2026-05-27",
      source: "NTA NEET official website",
      status: "Verified",
      evidenceLevel: "Official source",
      cwiNote: "Students should check neet.nta.nic.in for current instructions."
    },
    {
      claim: "CBSE introduced On-Screen Marking for Class XII answer books beginning with the 2026 examinations.",
      topic: "CBSE OSM 2026",
      firstSeen: "2026-02-09",
      source: "CBSE OSM circular",
      status: "Verified",
      evidenceLevel: "Official source",
      cwiNote: "OSM means digital evaluation by examiners on screen, not automatic computer marking."
    },
    {
      claim: "Tele MANAS provides national tele-mental health support through 14416 and 1800-891-4416.",
      topic: "Student mental health",
      firstSeen: "2022-10-10",
      source: "PIB Tele-MANAS release",
      status: "Verified",
      evidenceLevel: "Official source",
      cwiNote: "Students in distress should contact trusted adults and professional support."
    }
  ],
  sourceTrail: [
    {
      name: "NTA NEET official website",
      type: "Official source",
      date: "May 2026",
      url: "https://neet.nta.nic.in/",
      supports: "Shows latest NEET UG 2026 notices and candidate activity links.",
      doesNotProve: "It does not validate social media screenshots unless they match the official site."
    },
    {
      name: "NTA NEET Public Notices",
      type: "Official source",
      date: "May 2026",
      url: "https://neet.nta.nic.in/public-notices/",
      supports: "Shows official public notice titles related to NEET UG 2026.",
      doesNotProve: "It does not prove claims not listed in official notices."
    },
    {
      name: "CBSE official website",
      type: "Official source",
      date: "May 2026",
      url: "https://www.cbse.gov.in/cbsenew/cbse.html",
      supports: "Shows CBSE notices on scanned copies, post-result facilities and OSM.",
      doesNotProve: "It does not resolve individual student complaints unless CBSE issues case-specific instructions."
    },
    {
      name: "CBSE OSM circular",
      type: "Official source",
      date: "09 Feb 2026",
      url: "https://www.cbse.gov.in/cbsenew/documents/OSM_Class%20XII_09022026.pdf",
      supports: "Explains On-Screen Marking for Class XII answer books.",
      doesNotProve: "It does not mean computers automatically evaluate subjective answers."
    },
    {
      name: "PIB Tele-MANAS release",
      type: "Official source",
      date: "10 Oct 2022",
      url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1866498",
      supports: "Confirms the Tele MANAS helpline number 14416 and 24x7 support model.",
      doesNotProve: "It does not replace emergency medical or local emergency services."
    }
  ],
  correctionHistory: [],
  regionTags: ["National"],
  topicTags: ["Education", "NEET UG 2026", "CBSE", "Student mental health", "Public Advisory"],
  cwiContext:
    "CWI is treating this as a student-safety and source-verification advisory. The focus is official links, practical checklists and mental health support, not panic.",
  tags: [
    "NEET UG 2026",
    "NEET re-exam",
    "NTA NEET",
    "CBSE re-evaluation",
    "CBSE scanned answer sheet",
    "CBSE OSM",
    "student mental health",
    "Tele MANAS"
  ],
  heroImage: "/brand/banner.png",
  thumbnailImage: "/brand/banner.png",
  ogImage: "/brand/banner.png",
  altText: "NEET UG 2026 re-exam stress and CBSE re-evaluation support guide for Indian students and parents",
  publishedAt: "2026-05-27",
  updatedAt: "2026-05-27",
  author: "Cockroach Watch India Editorial Desk",
  relatedItems: ["cockroach-watch-india", "about-cockroach-watch-india", "manipur-violence"],
  seoTitle: "NEET UG 2026 Re-Exam Stress: NTA Updates, CBSE Re-Evaluation Issues & Student Help",
  seoDescription:
    "NEET UG 2026 re-exam and CBSE re-evaluation updates have increased stress among students. Check official NTA and CBSE updates, student checklist, and mental health help resources.",
  canonicalUrl: `${site.url}/live-newsroom/neet-ug-2026-re-exam-stress-cbse-revaluation-student-help`,
  status: "published"
};

export function getLiveNewsroomFallbackItems(limit = 80): LiveNewsroomItem[] {
  const watchItems = posts.slice(0, 12).map((post) => ({
    id: `watch-${post.slug}`,
    title: post.title,
    slug: post.slug,
    category: post.category,
    type: "archived_context",
    summary: post.summary,
    body: post.sections,
    verificationStatus: normalizeStatus(post.verificationStatus),
    riskLevel: "Low",
    sourceCount: post.sources.length,
    sources: post.sources,
    whatHappened: sectionText(post.sections, "What happened") || post.summary,
    whatChanged: "This is archived context. Current updates now appear in the Live Newsroom.",
    whatWeKnow: sectionText(post.sections, "What we know") || post.content[0] || post.summary,
    whatWeDontKnow: [sectionText(post.sections, "What remains unclear") || "Whether newer public records have changed the context since this archive item was prepared."],
    whatRemainsUnclear: sectionText(post.sections, "What remains unclear") || "This archive item remains open for corrections and newer records.",
    timeline: [{ date: post.date, title: "Archive publication", summary: post.summary }],
    beforeYouShare: defaultBeforeYouShare,
    editorNote: "",
    aiishnessScore: 0,
    claimTracker: buildClaimTracker(post.title, post.category, normalizeStatus(post.verificationStatus), post.sources.length, post.sources, sectionText(post.sections, "What remains unclear"), post.date),
    sourceTrail: buildSourceTrail(post.sources, [{ date: post.date, title: "Archive publication", summary: post.summary }], post.title),
    correctionHistory: [],
    regionTags: ["National"],
    topicTags: post.tags,
    cwiContext,
    tags: post.tags,
    heroImage: post.ogImage,
    thumbnailImage: post.ogImage,
    ogImage: post.ogImage,
    altText: post.imageAlt,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    author: post.author,
    relatedItems: post.relatedSlugs,
    seoTitle: `${post.title} - CWI Live Newsroom | Cockroach Watch India`,
    seoDescription: post.seoDescription,
    canonicalUrl: `${site.url}/live-newsroom/${post.slug}`,
    status: "published"
  }));

  const unansweredItems = unansweredFiles.map((file) => {
    const visual = getFileVisual(file);
    return {
      id: `unanswered-${file.slug}`,
      title: file.title,
      slug: file.slug,
      category: "India Unanswered Files",
      type: "india_unanswered_file",
      summary: file.summary,
      body: [
        { heading: "Short answer", paragraphs: [file.unansweredQuestion] },
        ...file.sections.map((section) => ({ heading: section.heading, paragraphs: [section.body] }))
      ],
      verificationStatus: "Source-backed" as LiveNewsroomStatus,
      riskLevel: "Medium",
      sourceCount: file.sourceCount,
      sources: file.sources.map((source) => ({
        name: source.name,
        outlet: source.publisher,
        url: source.url,
        type: source.type === "Official response" ? "Official source" : source.type === "Explainer" ? "Feature" : "News report",
        note: source.note
      })) as ArticleSource[],
      whatHappened: file.sections[0]?.body || file.summary,
      whatChanged: "This file is now grouped inside Live Newsroom so updates, corrections, and source trails are easier to follow.",
      whatWeKnow: file.groundReality,
      whatWeDontKnow: file.unansweredQuestions.slice(0, 5),
      whatRemainsUnclear: file.unansweredQuestion,
      timeline: file.timeline.slice(0, 8).map((item) => ({ date: item.date, title: item.title, summary: item.summary })),
      beforeYouShare: defaultBeforeYouShare,
      editorNote: "CWI keeps this file open because official records, court updates, and public reporting can change the picture over time.",
      aiishnessScore: 0,
      claimTracker: buildClaimTracker(file.title, "India Unanswered Files", "Source-backed", file.sourceCount, file.sources.map((source) => ({
        name: source.name,
        outlet: source.publisher,
        url: source.url,
        type: source.type === "Official response" ? "Official source" : source.type === "Explainer" ? "Feature" : "News report",
        note: source.note
      })) as ArticleSource[], file.unansweredQuestion, "2026-05-26"),
      sourceTrail: buildSourceTrail(file.sources.map((source) => ({
        name: source.name,
        outlet: source.publisher,
        url: source.url,
        type: source.type === "Official response" ? "Official source" : source.type === "Explainer" ? "Feature" : "News report",
        note: source.note
      })) as ArticleSource[], file.timeline.slice(0, 8).map((item) => ({ date: item.date, title: item.title, summary: item.summary })), file.title),
      correctionHistory: [],
      regionTags: file.location ? [file.location] : ["National"],
      topicTags: ["India Unanswered Files", file.category],
      cwiContext,
      tags: ["India Unanswered Files", file.category],
      heroImage: file.heroImage || visual.src,
      thumbnailImage: file.thumbnailImage || visual.src,
      ogImage: file.ogImage || visual.src,
      altText: file.altText || visual.alt,
      publishedAt: "2026-05-24",
      updatedAt: "2026-05-26",
      author: "Cockroach Watch India Editorial Desk",
      relatedItems: [],
      seoTitle: `${file.title} - CWI India Unanswered Files`,
      seoDescription: file.seoDescription,
      canonicalUrl: `${site.url}/live-newsroom/${file.slug}`,
      status: "published"
    };
  });

  return [neetCbseStudentHelpItem, ...watchItems, ...unansweredItems].slice(0, limit);
}

export function getLiveNewsroomFallbackItem(slug: string) {
  return getLiveNewsroomFallbackItems(120).find((item) => item.slug === slug) ?? null;
}

function rowToLiveNewsroomItem(row: LiveNewsroomRow): LiveNewsroomItem {
  const sections = normalizeSections(row.body);
  const summary = asText(row.summary, sections[0]?.paragraphs[0] || "CWI Live Newsroom update.");
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: asText(row.category, "Live Newsroom"),
    type: asText(row.type, "live_newsroom_update"),
    summary,
    body: sections,
    verificationStatus: normalizeStatus(row.verification_status),
    riskLevel: asText(row.risk_level, "Medium"),
    sourceCount: Number(row.source_count ?? 0),
    sources: extractSources(row.sources_json),
    whatHappened: asText(row.what_happened, summary),
    whatChanged: asText(row.what_changed, "No material change has been recorded yet. CWI will update this page when new verified context is reviewed."),
    whatWeKnow: asText(row.what_we_know, summary),
    whatWeDontKnow: normalizeTextList(row.what_we_dont_know).length
      ? normalizeTextList(row.what_we_dont_know)
      : [asText(row.what_remains_unclear, "What remains unknown is listed for editorial review.")],
    whatRemainsUnclear: asText(row.what_remains_unclear, "CWI is tracking corrections, official clarifications, and new verified updates."),
    timeline: normalizeTimeline(row.timeline_json),
    beforeYouShare: normalizeTextList(row.before_you_share).length ? normalizeTextList(row.before_you_share) : defaultBeforeYouShare,
    editorNote: asText(row.editor_note),
    aiishnessScore: Number(row.aiishness_score ?? 0),
    claimTracker: normalizeClaimTracker(row.claim_tracker_json, row.title, asText(row.category, "Live Newsroom"), normalizeStatus(row.verification_status), Number(row.source_count ?? 0), extractSources(row.sources_json), asText(row.what_remains_unclear), dateOnly(row.published_at)),
    sourceTrail: normalizeSourceTrail(row.source_trail_json, extractSources(row.sources_json), normalizeTimeline(row.timeline_json), row.title),
    correctionHistory: normalizeCorrectionHistory(row.correction_history_json),
    regionTags: normalizeStringArray(row.region_tags_json),
    topicTags: normalizeStringArray(row.topic_tags_json),
    cwiContext: asText(row.cwi_context, cwiContext),
    tags: normalizeStringArray(row.tags_json),
    heroImage: asText(row.hero_image, `${site.url}/opengraph-image`),
    thumbnailImage: asText(row.thumbnail_image, asText(row.hero_image, `${site.url}/opengraph-image`)),
    ogImage: asText(row.og_image, asText(row.hero_image, `${site.url}/opengraph-image`)),
    altText: asText(row.alt_text, `${row.title} - CWI Live Newsroom visual`),
    publishedAt: dateOnly(row.published_at),
    updatedAt: dateOnly(row.updated_at || row.published_at),
    author: asText(row.author, "Cockroach Watch India Editorial Desk"),
    relatedItems: normalizeStringArray(row.related_items_json),
    seoTitle: asText(row.seo_title, `${row.title} - CWI Live Newsroom | Cockroach Watch India`),
    seoDescription: asText(row.seo_description, summary.slice(0, 155)),
    canonicalUrl: asText(row.canonical_url, `${site.url}/live-newsroom/${row.slug}`),
    status: asText(row.status, "published")
  };
}

async function latestSeoForDraft(articleDraftId: string) {
  const result = await getPool().query<{
    seo_title: string | null;
    meta_description: string | null;
    canonical_url: string | null;
  }>(
    `
      select seo_title, meta_description, canonical_url
      from seo_packs
      where article_draft_id = $1
      order by created_at desc
      limit 1
    `,
    [articleDraftId]
  );
  return result.rows[0] ?? null;
}

async function latestResearchSources(researchPackId: unknown) {
  const id = optionalUuid(researchPackId);
  if (!id) return [];

  const result = await getPool().query<{ source_list: unknown }>(
    `select source_list from research_packs where id = $1 limit 1`,
    [id]
  );
  return extractSources(result.rows[0]?.source_list);
}

async function latestImageForApproval(imagePackId: unknown) {
  const id = optionalUuid(imagePackId);
  if (!id) return null;

  const result = await getPool().query<{ metadata: unknown; path: string | null; alt_text: string | null }>(
    `select metadata, path, alt_text from image_library where id = $1 limit 1`,
    [id]
  );
  const metadata = asRecord(result.rows[0]?.metadata);
  return {
    heroImage: asText(metadata.heroImage, asText(result.rows[0]?.path)),
    thumbnailImage: asText(metadata.thumbnailImage, asText(metadata.heroImage, asText(result.rows[0]?.path))),
    ogImage: asText(metadata.ogImage, asText(metadata.heroImage, asText(result.rows[0]?.path))),
    altText: asText(metadata.altText, asText(result.rows[0]?.alt_text))
  };
}

const cwiContext =
  "CWI keeps this page open for source updates, corrections, and clearer context as stronger information becomes available.";

const defaultBeforeYouShare = [
  "Check the date before sharing.",
  "Look for the original source, not only reposts.",
  "Do not post phone numbers, addresses, or private data.",
  "Send CWI a source if you have one."
];

function extractSections(value: unknown) {
  const direct = normalizeSections(value);
  if (direct.length) return direct;

  const record = asRecord(value);
  const nested = asRecord(record.body);
  const sections = [
    ["Short answer", record.shortAnswer || nested.shortAnswer],
    ["What happened", record.whatHappened || nested.whatHappened],
    ["What we know", record.whatWeKnow || nested.whatWeKnow],
    ["What remains unclear", record.whatRemainsUnclear || nested.whatRemainsUnclear],
    ["Why it matters", record.whyItMatters || nested.whyItMatters],
    ["CWI context", record.cwiContext || record.disclaimer || nested.cwiContext]
  ]
    .map(([heading, body]) => ({ heading: String(heading), paragraphs: splitParagraphs(asText(body)) }))
    .filter((section) => section.paragraphs.length > 0);

  return sections.length ? sections : [{ heading: "CWI Live Newsroom", paragraphs: ["This approved CWI update is available for public review."] }];
}

function normalizeSections(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const record = asRecord(item);
      const heading = asText(record.heading || record.title, "CWI Live Newsroom");
      const paragraphs = Array.isArray(record.paragraphs)
        ? record.paragraphs.map((paragraph) => asText(paragraph)).filter(Boolean)
        : splitParagraphs(asText(record.body || record.text || record.content));
      return { heading, paragraphs };
    })
    .filter((section) => section.paragraphs.length > 0);
}

function extractSources(value: unknown): ArticleSource[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      const record = asRecord(item);
      const url = asText(record.url || record.href || record.sourceUrl);
      return {
        name: asText(record.name || record.title, url || `Source ${index + 1}`),
        outlet: asText(record.publisher || record.outlet || record.platform || record.sourceDomain, url ? hostFromUrl(url) : "CWI source"),
        url: url || site.url,
        type: "Reference" as const,
        note: asText(record.note || record.description || record.reliability, "Source saved in the CWI research pack.")
      };
    })
    .filter((source) => source.name);
}

function normalizeTimeline(value: unknown): LiveNewsroomTimelineItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const record = asRecord(item);
      return {
        date: asText(record.date || record.publishedAt || record.time, "Developing"),
        title: asText(record.title || record.event, "Source update"),
        summary: asText(record.summary || record.description || record.body)
      };
    })
    .filter((item) => item.summary);
}

function normalizeSourceTrail(
  value: unknown,
  fallbackSources: ArticleSource[],
  timeline: LiveNewsroomTimelineItem[],
  topic: string
): LiveNewsroomSourceTrailItem[] {
  if (Array.isArray(value)) {
    const trail = value
      .map((item) => {
        const record = asRecord(item);
        const url = asText(record.url || record.href || record.sourceUrl);
        return {
          name: asText(record.name || record.sourceName || record.title, url ? hostFromUrl(url) : "Source"),
          type: asText(record.type || record.sourceType, "Reference"),
          date: asText(record.date || record.publishedDate || record.publishedAt, "Date not listed"),
          url: url || site.url,
          supports: asText(record.supports || record.whatThisSourceSupports || record.note, `This source is part of the source trail for ${topic}.`),
          doesNotProve: asText(record.doesNotProve || record.whatThisSourceDoesNotProve, "It does not prove claims outside its own reporting or statement.")
        };
      })
      .filter((item) => item.name);
    if (trail.length) return trail;
  }

  return buildSourceTrail(fallbackSources, timeline, topic);
}

function buildSourceTrail(sources: ArticleSource[], timeline: LiveNewsroomTimelineItem[], topic: string): LiveNewsroomSourceTrailItem[] {
  return sources.slice(0, 8).map((source, index) => ({
    name: source.name,
    type: source.type || "Reference",
    date: timeline[index]?.date || "Date not listed",
    url: source.url,
    supports: source.note || `Source used for CWI review of ${topic}.`,
    doesNotProve: "It does not prove claims that are not stated in the source itself."
  }));
}

function normalizeClaimTracker(
  value: unknown,
  topic: string,
  category: string,
  status: LiveNewsroomStatus,
  sourceCount: number,
  sources: ArticleSource[],
  cwiNote: string,
  firstSeen: string
): LiveNewsroomClaimTrackerItem[] {
  if (Array.isArray(value)) {
    const claims = value
      .map((item) => {
        const record = asRecord(item);
        return {
          claim: asText(record.claim || record.title, topic),
          topic: asText(record.topic, category),
          firstSeen: asText(record.firstSeen || record.first_seen || record.date, firstSeen),
          source: asText(record.source || record.sourceName, sources[0]?.name || "Source pending review"),
          status: normalizeClaimStatus(record.status || status),
          evidenceLevel: asText(record.evidenceLevel || record.evidence_level, sourceCount > 2 ? "Multiple sources" : "Single source"),
          cwiNote: asText(record.cwiNote || record.cwi_note || record.note, cwiNote)
        };
      })
      .filter((claim) => claim.claim);
    if (claims.length) return claims;
  }

  return buildClaimTracker(topic, category, status, sourceCount, sources, cwiNote, firstSeen);
}

function buildClaimTracker(
  topic: string,
  category: string,
  status: LiveNewsroomStatus,
  sourceCount: number,
  sources: ArticleSource[],
  cwiNote: string,
  firstSeen: string
): LiveNewsroomClaimTrackerItem[] {
  return [
    {
      claim: topic,
      topic: category,
      firstSeen,
      source: sources[0]?.name || "Source pending review",
      status,
      evidenceLevel: sourceCount > 2 ? "Multiple visible sources" : sourceCount > 0 ? "Visible source trail" : "Sources awaited",
      cwiNote: cwiNote || "CWI is separating what is known from what still needs stronger sourcing."
    }
  ];
}

function normalizeCorrectionHistory(value: unknown): LiveNewsroomCorrectionItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const record = asRecord(item);
      return {
        date: asText(record.date || record.correctionDate || record.updatedAt, "Date not listed"),
        whatChanged: asText(record.whatChanged || record.what_changed, "Correction note saved."),
        whyChanged: asText(record.whyChanged || record.why_changed, "Editorial update."),
        note: asText(record.note || record.sourceNote, "Reviewed by CWI Editorial Desk.")
      };
    })
    .filter((item) => item.whatChanged);
}

function normalizeTextList(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => asText(item)).filter(Boolean);
  return asText(value)
    .split(/\n+|;\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => asText(item)).filter(Boolean);
}

function normalizeClaimStatus(value: unknown): LiveNewsroomClaimTrackerItem["status"] {
  const status = asText(value);
  if (["False/Misleading", "Needs context", "Blocked"].includes(status)) return status as LiveNewsroomClaimTrackerItem["status"];
  return normalizeStatus(status);
}

function normalizeStatus(value: unknown): LiveNewsroomStatus {
  const status = asText(value);
  const map: Record<string, LiveNewsroomStatus> = {
    Verified: "Verified",
    "Source-backed": "Source-backed",
    Developing: "Developing",
    Reported: "Reported",
    Claimed: "Reported",
    "Opinion/Analysis": "Opinion/Analysis",
    "Satire/Context": "Satire/Context",
    Unverified: "Unverified",
    "Public Advisory": "Public Advisory",
    Correction: "Correction",
    Archived: "Archived"
  };
  return map[status] ?? "Developing";
}

function latestTimelineSummary(timeline: LiveNewsroomTimelineItem[]) {
  const latest = timeline[0];
  return latest ? `${latest.title}: ${latest.summary}` : "";
}

function sectionText(sections: Array<{ heading: string; paragraphs: string[] }>, heading: string) {
  return sections.find((section) => section.heading.toLowerCase() === heading.toLowerCase())?.paragraphs.join("\n\n") ?? "";
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function asText(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function splitParagraphs(value: string) {
  return value
    .split(/\n{2,}|\r{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function dateOnly(value: string | null) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function hostFromUrl(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return "CWI source";
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90) || "cwi-live-newsroom-update";
}
