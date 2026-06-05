type Item = {
  n: number;
  title: string;
  slug: string;
  category: string;
  summary: string;
  shortAnswer: string;
  whatHappened: string;
  whyItMatters: string;
  whatWeKnow: string[];
  whatRemainsUnclear: string[];
  timeline: Array<{ date: string; title: string; summary: string }>;
  sources: Array<{ name: string; headline: string; date: string; link: string; supports: string }>;
  verificationStatus: string;
  riskLevel: string;
  tags: string[];
  relatedItems: string[];
};

const author = "Cockroach Watch India Editorial Desk";
const updatedAt = "2026-06-05";
const cwiContext = "Cockroach Watch India - CWI is tracking this through the CWI Live Newsroom as part of its public archive on youth voice, student issues, public accountability, civic memory, and India's unanswered questions.";
const verificationNote = "This Live Newsroom item is based on publicly available reporting and source material available at the time of publication. CWI will update this page if official clarification, corrections, or new verified sources become available.";
const correctionCta = "Have a correction, source, document, or verified update? Submit it to CWI.";
const officialUrl = "https://cockroachwatchindia.online";
const submitUrl = `${officialUrl}/submit`;
const ids = ["11111111-1111-4111-8111-11111111111", "22222222-2222-4222-8222-22222222222", "33333333-3333-4333-8333-33333333333"];

const items: Item[] = [
  {
    n: 0,
    title: "CBSE Class 12 OSM Controversy 2026 - What Students Are Questioning",
    slug: "cbse-class-12-osm-controversy-2026",
    category: "Students / Exam Accountability",
    summary: "CBSE's Class 12 on-screen marking rollout has become a student-accountability issue after the 2026 results. The controversy is separate from paper-leak rumours: the core question is whether digital evaluation, scanned answer sheets, grievance redressal, and official communication were handled clearly enough.",
    shortAnswer: "This is not a confirmed paper leak story. It is a source-backed controversy around CBSE's 2026 Class 12 on-screen marking system, student complaints after results, and the Education Ministry reportedly seeking information from CBSE.",
    whatHappened: "CBSE introduced on-screen marking for Class 12 answer sheets from the 2026 board cycle. After results were announced on May 13, students and families raised concerns reported by media about low marks, scanned answer-sheet quality, partial evaluation claims, and limited clarity on post-result verification. The issue later became part of a wider student accountability conversation around exam systems.",
    whyItMatters: "For students, a board-result dispute is not just a technical grievance. It can affect college admissions, scholarship chances, family spending on coaching or applications, emotional pressure at home, and trust in public institutions. When a new evaluation system is rolled out, students need clear grievance channels and transparent official explanations.",
    whatWeKnow: ["CBSE issued an official February 2026 circular about Class 12 on-screen marking.", "Multiple education and news outlets reported student and teacher concerns after the May 2026 results.", "The Indian Express reported that the Education Ministry sought a report from CBSE.", "The OSM controversy should not be mixed with unverified paper-leak rumours unless official sources connect them."],
    whatRemainsUnclear: ["How many students were materially affected remains unclear.", "Whether specific disputed scores were corrected after review needs case-level confirmation.", "The full internal audit trail of OSM evaluation is not public.", "Future changes to verification or re-evaluation rules need official clarification."],
    timeline: [{ date: "2026-02-09", title: "CBSE circular", summary: "CBSE issued an official circular on Class 12 on-screen marking." }, { date: "2026-05-13", title: "Results announced", summary: "Class 12 results were announced; student complaints began circulating after results." }, { date: "2026-05-24", title: "Ministry report coverage", summary: "Indian Express reported the Education Ministry sought a report from CBSE." }, { date: "2026-05-30", title: "Controversy explainer", summary: "The Week published context on the Class 12 OSM controversy." }],
    sources: [{ name: "CBSE", headline: "OSM Class XII circular", date: "2026-02-09", link: "https://www.cbse.gov.in/cbsenew/documents/OSM_Class%20XII_09022026.pdf", supports: "Official source for CBSE's on-screen marking rollout." }, { name: "The Indian Express", headline: "Education Ministry seeks report from CBSE on OSM complaints", date: "2026-05-24", link: "https://indianexpress.com/article/education/cbse-board-class-10th-12th-osm-education-ministry-seeks-report-cbse-gov-in-10705136/lite/", supports: "Supports ministry-reporting and student complaint context." }, { name: "The Week", headline: "CBSE Class 12 OSM controversy", date: "2026-05-30", link: "https://www.theweek.in/news/india/2026/05/30/cbse-class-12-osm-controversy.html", supports: "Supports public controversy timeline and student concern framing." }, { name: "NewsOnAir", headline: "CBSE to introduce on-screen marking for Class 12 from 2026 exams", date: "2026-02-10", link: "https://www.newsonair.gov.in/cbse-to-introduce-on-screen-marking-for-class-12-from-2026-exams/", supports: "Supports public announcement of the OSM change." }],
    verificationStatus: "Source-backed",
    riskLevel: "Medium",
    tags: ["CBSE", "Class 12", "OSM", "student issues", "exam accountability"],
    relatedItems: ["cockroach-janta-party-what-is-cjp-june-6-protest", "jee-advanced-2026-data-exposure-cloud-storage"]
  },
  {
    n: 1,
    title: "Cockroach Janta Party, CJP and the June 6 Delhi Protest - What Is Source-Backed",
    slug: "cockroach-janta-party-what-is-cjp-june-6-protest",
    category: "Youth Voice / Civic Movement",
    summary: "The Cockroach Janta Party story moved from viral satire to a wider youth and exam-accountability conversation. Source-backed reporting covers its launch, platform restrictions, press activity, student issues, Sonam Wangchuk's reported support, and a June 6 Delhi protest call, while several operational details still need official confirmation.",
    shortAnswer: "CJP is being tracked as a developing youth, satire, digital-rights, and exam-accountability story. CWI is separating source-backed facts from claims that still need official clarification, especially around protest permission, online restrictions, and exact student-impact numbers.",
    whatHappened: "After a Supreme Court-related remark became a flashpoint online, Abhijeet Dipke's Cockroach Janta Party emerged as a viral satirical-public response. In the following days, national and international outlets covered the movement, reports of its X account being withheld in India, website access issues, and preparations around a June 6 gathering in Delhi connected to NEET and broader exam-accountability demands.",
    whyItMatters: "The CJP story matters because it shows how student frustration, exam uncertainty, satire, online restriction claims, and public protest language can converge quickly. For young people, exam controversies mean lost time, money spent by families, pressure from admissions cycles, and deeper questions about accountability when institutions do not communicate clearly.",
    whatWeKnow: ["Major outlets including AP, Al Jazeera, Hindustan Times, Indian Express, MediaNama, and The Week reported on CJP or its online restrictions.", "MediaNama reported X withholding action in India, and Hindustan Times reported Delhi High Court proceedings around restoration of the X account.", "Indian Express, Hindustan Times, New Indian Express, and LiveMint reported on June 6 protest plans or related support statements.", "Sonam Wangchuk's reported support is source-backed in media coverage, but the exact attendance and protest outcome were not known at draft time."],
    whatRemainsUnclear: ["Delhi Police permission status and any local restrictions need official confirmation.", "Exact crowd size, attendance list, police action, or detention claims cannot be stated before verified reporting.", "Claims about hacking, deportation, or account compromise need direct platform or official confirmation.", "Campaign counts and petition numbers should remain attributed unless official source URLs are added."],
    timeline: [{ date: "2026-05-15", title: "Triggering remark enters public conversation", summary: "The cockroach remark became a viral political-satire reference point." }, { date: "2026-05-16", title: "CJP launch reported", summary: "Abhijeet Dipke's Cockroach Janta Party entered public discussion." }, { date: "2026-05-21", title: "Platform restrictions coverage", summary: "Reports emerged about CJP's X account being withheld in India and website access issues." }, { date: "2026-06-06", title: "Delhi protest call", summary: "June 6 Jantar Mantar protest call remained a developing, verification-sensitive event." }],
    sources: [{ name: "Associated Press", headline: "Cockroach Janta Party coverage", date: "2026-05-23", link: "https://apnews.com/article/9e8be82b182e32feda4fee42d52de75b", supports: "International reporting context on CJP's rise." }, { name: "Al Jazeera", headline: "Cockroach Janta Party founder says Indian government took website down", date: "2026-05-23", link: "https://www.aljazeera.com/amp/economy/2026/5/23/cockroach-janta-partys-founder-says-indian-government-took-website-down", supports: "Attributed account of website-access claims and founder framing." }, { name: "MediaNama", headline: "X withholds Cockroach Janta Party account in India days after launch", date: "2026-05-21", link: "https://www.medianama.com/2026/05/223-x-withholds-cockroach-janta-party-account-india-days-after-launch/", supports: "Platform restriction context." }, { name: "The Indian Express", headline: "NEET paper leak: Abhijeet Dipke to land in Delhi on June 6; Sonam Wangchuk lends support", date: "2026-06-04", link: "https://indianexpress.com/article/india/neet-paper-leak-abhijeet-dipke-to-land-in-delhi-on-june-6-sonam-wangchuk-lends-support-to-cockroach-janata-party-10721153/lite/", supports: "June 6 protest and support-statement reporting." }, { name: "LiveMint", headline: "CJP gears up for June 6 protest at Delhi's Jantar Mantar", date: "2026-06-04", link: "https://www.livemint.com/news/india/cjp-gears-up-for-june-6-protest-at-delhis-jantar-mantar-whats-on-agenda-whos-attending-5-points-11780571236382.html?openSearch=true", supports: "Agenda and protest-plan reporting." }],
    verificationStatus: "Developing",
    riskLevel: "Medium",
    tags: ["CJP", "Cockroach Janta Party", "June 6", "NEET", "student protest", "digital rights"],
    relatedItems: ["cbse-class-12-osm-controversy-2026", "jee-advanced-2026-data-exposure-cloud-storage"]
  },
  {
    n: 2,
    title: "JEE Advanced 2026 Data Exposure - What IIT Roorkee Acknowledged",
    slug: "jee-advanced-2026-data-exposure-cloud-storage",
    category: "Students / Digital Rights",
    summary: "A 16-year-old cybersecurity researcher reportedly flagged public access to JEE Advanced 2026 candidate records and admit-card PDFs through a cloud-storage configuration issue. IIT Roorkee acknowledged the issue, thanked the researcher, and said corrective action was taken, while misuse, duration, and notification details remain unclear.",
    shortAnswer: "This is a source-backed digital-rights and exam-security update. Reporting says IIT Roorkee acknowledged a cloud-storage issue after a teen researcher flagged exposed JEE Advanced 2026 data, but CWI is treating impact and misuse claims with high caution until official clarification expands.",
    whatHappened: "After JEE Advanced 2026 results, researcher Rylen Anil reportedly found cloud storage linked to the results portal that exposed candidate-related files. Media reports said IIT Roorkee acknowledged the configuration issue and described access as read-only, meaning no record alteration was indicated in the reported response.",
    whyItMatters: "Exam data can include personal, academic, and application-linked information. If such data is exposed, students may face privacy risks, spam, impersonation attempts, harassment, or anxiety during admissions. Public exam bodies and host institutions need strong security review, responsible disclosure channels, and clear communication when student data is involved.",
    whatWeKnow: ["Multiple outlets reported the disclosure and IIT Roorkee's response.", "Reports attributed the discovery to 16-year-old cybersecurity researcher Rylen Anil.", "IIT Roorkee reportedly said corrective action was taken and described the issue as read-only.", "No source reviewed by CWI confirms data alteration or a broader cyberattack."],
    whatRemainsUnclear: ["How long the files were publicly accessible remains unclear.", "Whether any third party downloaded or misused data is not established by the cited sources.", "Whether all affected candidates were directly notified needs official clarification.", "Whether an independent security audit or government inquiry has been ordered is not confirmed."],
    timeline: [{ date: "2026-06-01", title: "JEE Advanced result period", summary: "The reported exposure relates to the results portal and candidate records after the 2026 result cycle." }, { date: "2026-06-02", title: "Researcher flags issue", summary: "Media reports attribute the disclosure to teen cybersecurity researcher Rylen Anil." }, { date: "2026-06-02", title: "IIT Roorkee response reported", summary: "IIT Roorkee reportedly acknowledged the configuration issue and corrective action." }, { date: "2026-06-03", title: "National coverage expands", summary: "Several outlets reported the data-exposure concern and institutional response." }],
    sources: [{ name: "Hindustan Times", headline: "16-year-old Rylen Anil flags data issues on JEE Advanced results site", date: "2026-06-03", link: "https://www.hindustantimes.com/india-news/16-year-old-rylen-anil-flags-data-issues-on-jee-advanced-results-site-iit-roorkee-says-thank-you-takes-corrective-action-101780453586849.html", supports: "Researcher disclosure and IIT Roorkee response." }, { name: "Telangana Today / PTI", headline: "IIT Roorkee acknowledges cloud storage glitch in JEE Advanced 2026 results portal", date: "2026-06-03", link: "https://telanganatoday.com/iit-roorkee-acknowledges-cloud-storage-glitch-in-jee-advanced-2026-results-portal", supports: "Acknowledgement and cloud-storage framing." }, { name: "Economic Times Education / PTI", headline: "IIT Roorkee acknowledges glitch after teen flags JEE Advanced 2026 data exposure", date: "2026-06-03", link: "https://education.economictimes.indiatimes.com/news/higher-education/iit-roorkee-acknowledges-glitch-after-teen-flags-jee-advanced-2026-data-exposure/131507103", supports: "Reported institutional response and data-exposure context." }, { name: "Financial Express", headline: "Teen researcher claims exposure of over 3 lakh JEE Advanced records", date: "2026-06-03", link: "https://www.financialexpress.com/jobs-career/education-teen-researcher-claims-exposure-of-over-3-lakh-jee-advanced-records-iit-roorkee-responds-4257697/", supports: "Attributed record-count claim and caution-sensitive impact reporting." }],
    verificationStatus: "Source-backed",
    riskLevel: "High caution",
    tags: ["JEE Advanced", "IIT Roorkee", "student data", "digital rights", "exam accountability"],
    relatedItems: ["cbse-class-12-osm-controversy-2026", "cockroach-janta-party-what-is-cjp-june-6-protest"]
  }
];

export function getPendingLiveNewsroomApprovals() {
  return items.map((item) => ({
    id: id(item, 6),
    topic: item.title,
    type: "Live Newsroom Draft",
    item_type: "live_newsroom_update",
    content_destination: "live_newsroom",
    summary: item.summary,
    verification_status: item.verificationStatus,
    risk_level: item.riskLevel,
    source_count: item.sources.length,
    research_pack_id: id(item, 1),
    verification_report_id: id(item, 2),
    article_draft_id: id(item, 3),
    seo_pack_id: id(item, 4),
    social_pack_id: id(item, 5),
    status: "waiting_for_approval",
    suggested_action: "Review source pack, approve only after human editorial check, then publish.",
    admin_notes: "Code-backed pending Live Newsroom package from extracted 30 May to 5 June research. Not public until approved.",
    notes: "Pending source-pack draft. No auto-publish.",
    created_at: timestamp(),
    updated_at: timestamp()
  }));
}

export function getPendingLiveNewsroomResearchPacks() {
  return items.map((item) => ({
    id: id(item, 1),
    topic: item.title,
    category: item.category,
    content_destination: "live_newsroom",
    date_range: "2026-05-30 to 2026-06-05",
    source_list: item.sources,
    source_count: item.sources.length,
    summary: item.summary,
    what_happened: item.whatHappened,
    what_we_know: item.whatWeKnow.join("\n"),
    what_remains_unclear: item.whatRemainsUnclear.join("\n"),
    timeline: item.timeline,
    key_facts: item.whatWeKnow,
    public_reaction: item.whyItMatters,
    source_confidence: item.verificationStatus,
    risks: item.whatRemainsUnclear,
    suggested_article_angle: item.shortAnswer,
    suggested_social_angle: "Safety-first CWI Live Newsroom caption with source-backed language and correction CTA.",
    status: "Research Ready - Pending Approval",
    created_at: timestamp(),
    updated_at: timestamp()
  }));
}

export function getPendingLiveNewsroomVerificationReports() {
  return items.map((item) => ({
    id: id(item, 2),
    research_pack_id: id(item, 1),
    content_destination: "live_newsroom",
    verification_status: item.verificationStatus,
    risk_level: item.riskLevel,
    unsafe_claims: item.whatRemainsUnclear,
    safer_wording: [
      "Use according to, reportedly, source-backed, developing, and official clarification awaited where applicable.",
      "Do not state exact impact counts, permission status, data misuse, or protest outcomes as confirmed without official/source-backed updates."
    ],
    source_gaps: item.whatRemainsUnclear,
    publish_recommendation: "Human approval required before public publication.",
    human_review_required: true,
    created_at: timestamp(),
    updated_at: timestamp()
  }));
}

export function getPendingLiveNewsroomArticleDrafts() {
  return items.map((item) => ({
    id: id(item, 3),
    research_pack_id: id(item, 1),
    content_destination: "live_newsroom",
    title: item.title,
    slug: item.slug,
    category: item.category,
    draft: buildDraft(item),
    verification_status: item.verificationStatus,
    source_count: item.sources.length,
    approval_status: "Waiting for Approval",
    publish_status: "Not published",
    created_at: timestamp(),
    updated_at: timestamp()
  }));
}

export function getPendingLiveNewsroomSeoPacks() {
  return items.map((item) => ({
    id: id(item, 4),
    article_draft_id: id(item, 3),
    content_destination: "live_newsroom",
    seo_title: seoTitle(item),
    meta_description: seoDescription(item),
    canonical_url: canonicalUrl(item.slug),
    open_graph_json: { title: seoTitle(item), description: seoDescription(item), url: canonicalUrl(item.slug), type: "article", images: [`${officialUrl}/opengraph-image`] },
    twitter_json: { card: "summary_large_image", title: seoTitle(item), description: seoDescription(item) },
    schema_json: {
      NewsArticle: { headline: item.title, author, datePublished: updatedAt, dateModified: updatedAt, url: canonicalUrl(item.slug) },
      BlogPosting: { headline: item.title, author, datePublished: updatedAt, dateModified: updatedAt, url: canonicalUrl(item.slug) },
      BreadcrumbList: { itemListElement: [{ position: 1, name: "Home", item: officialUrl }, { position: 2, name: "CWI Live Newsroom", item: `${officialUrl}/live-newsroom` }, { position: 3, name: item.title, item: canonicalUrl(item.slug) }] }
    },
    internal_links: ["/live-newsroom", "/india-unanswered-files", "/submit"],
    sitemap_status: "Pending approval - do not add until published",
    approval_status: "Waiting for Approval",
    created_at: timestamp(),
    updated_at: timestamp()
  }));
}

export function getPendingLiveNewsroomSocialPacks() {
  return items.map((item) => ({
    id: id(item, 5),
    article_draft_id: id(item, 3),
    content_destination: "live_newsroom",
    instagram_caption: `${item.shortAnswer}\n\nRead the source-backed CWI explainer after approval: ${canonicalUrl(item.slug)}`,
    x_thread: [item.shortAnswer, `What remains unclear: ${item.whatRemainsUnclear[0]}`, `Sources: ${item.sources.map((source) => source.name).join(", ")}.`, `Corrections and verified updates: ${submitUrl}`],
    reddit_post: `${item.title}\n\n${item.summary}\n\n${correctionCta} ${submitUrl}`,
    youtube_short_script: `CWI Live Newsroom update: ${item.shortAnswer} What remains unclear: ${item.whatRemainsUnclear[0]}`,
    bluesky_post: `${item.title} - ${item.verificationStatus}. ${item.shortAnswer}`,
    discord_post: `Pending CWI Live Newsroom draft: ${item.title}\nVerification: ${item.verificationStatus}\nRisk: ${item.riskLevel}\nSources: ${item.sources.length}`,
    approval_status: "Waiting for Approval",
    created_at: timestamp(),
    updated_at: timestamp()
  }));
}

function buildDraft(item: Item) {
  return {
    title: item.title,
    slug: item.slug,
    category: item.category,
    type: "live_newsroom_update",
    summary: item.summary,
    shortAnswer: item.shortAnswer,
    body: [
      { heading: "Short Answer", paragraphs: [item.shortAnswer] },
      { heading: "What Happened", paragraphs: [item.whatHappened] },
      { heading: "Why It Matters", paragraphs: [item.whyItMatters] },
      { heading: "What We Know", paragraphs: item.whatWeKnow },
      { heading: "What Remains Unclear", paragraphs: item.whatRemainsUnclear },
      { heading: "CWI Context", paragraphs: [cwiContext] },
      { heading: "Timeline", paragraphs: item.timeline.map((entry) => `${entry.date}: ${entry.title} - ${entry.summary}`) },
      { heading: "Sources and Further Reading", paragraphs: item.sources.map((source) => `${source.name} - ${source.headline} (${source.date}). ${source.supports} ${source.link}`) },
      { heading: "Verification Note", paragraphs: [verificationNote] },
      { heading: "Submit Correction", paragraphs: [`${correctionCta} ${submitUrl}`] }
    ],
    whatHappened: item.whatHappened,
    whyItMatters: item.whyItMatters,
    whatWeKnow: item.whatWeKnow,
    whatRemainsUnclear: item.whatRemainsUnclear.join("\n"),
    whatWeDontKnow: item.whatRemainsUnclear,
    timeline: item.timeline,
    sources: item.sources.map((source) => ({ title: source.headline, name: source.name, outlet: source.name, date: source.date, url: source.link, description: source.supports })),
    sourceTrail: item.sources.map((source) => ({ name: source.name, type: "source", date: source.date, url: source.link, supports: source.supports, doesNotProve: "Does not independently prove unsourced claims, exact impact counts, or future outcomes." })),
    beforeYouShare: ["Do not turn developing claims into confirmed claims.", "Check official clarifications and latest source updates before sharing."],
    cwiContext,
    verificationNote,
    correctionCta,
    submitUrl,
    tags: item.tags,
    author,
    relatedArticles: item.relatedItems,
    seoTitle: seoTitle(item),
    seoDescription: seoDescription(item),
    canonicalUrl: canonicalUrl(item.slug),
    heroImage: "/brand/logo.png",
    thumbnailImage: "/brand/logo.png",
    ogImage: `${officialUrl}/opengraph-image`,
    altText: `${item.title} - CWI Live Newsroom pending draft`,
    publishedAt: updatedAt,
    updatedAt,
    status: "pending_approval"
  };
}

function id(item: Item, suffix: number) {
  return `${ids[item.n]}${suffix}`;
}

function timestamp() {
  return `${updatedAt}T09:00:00.000Z`;
}

function seoTitle(item: Item) {
  return `${item.title} - CWI Live Newsroom | Cockroach Watch India`;
}

function seoDescription(item: Item) {
  return `Cockroach Watch India Live Newsroom explains ${item.title}, what is known, what remains unclear, and why CWI is tracking this public-interest update.`;
}

function canonicalUrl(slug: string) {
  return `${officialUrl}/live-newsroom/${slug}`;
}
