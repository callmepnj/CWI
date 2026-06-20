import type { PendingNewsroomRecord } from "@/data/live-newsroom-pending";

const canonical = "https://cockroachwatchindia.online/live-newsroom/bharat-tiwari-encounter-case-explained";
const publishedDate = "2026-06-20";
const updatedDate = "2026-06-20T18:00:00+05:30";

const sourceTable = [
  {
    sourceName: "The Indian Express",
    title: "'I'll show them madness': Bihar man livestreams 2-day encounter, dies",
    date: "18 June 2026",
    url: "https://indianexpress.com/article/cities/patna/madness-bihar-man-livestreams-encounter-police-gunshots-death-10745527/",
    supports:
      "Bharat Bhushan Tiwari's age/location context, two-day standoff, Facebook Live reference, PMCH death, police mental-health statement, and the reported statement that he was willing to lay down his weapon if demands were met.",
    reliabilityNote:
      "Established national newspaper. Useful for chronology and police/public context; does not independently prove what happened after the livestream ended."
  },
  {
    sourceName: "Times of India",
    title: "Bhojpur man's live-streamed challenge to cops ends fatally",
    date: "18 June 2026",
    url: "https://timesofindia.indiatimes.com/city/patna/bhojpur-mans-live-streamed-challenge-to-cops-ends-fatally/articleshow/131809847.cms",
    supports:
      "Police press-release version: 9 am information, alleged firing, STF cordon, self-defence claim, leg injuries, PMCH death, pistol/cartridge recovery, and June 16 viral video details.",
    reliabilityNote:
      "Established media report quoting/attributing police version. It records official claims but does not settle disputed family allegations."
  },
  {
    sourceName: "ThePrint / PTI",
    title: "4 policemen suspended in Bihar's Bhojpur after viral video shows failure to act against armed man",
    date: "18 June 2026",
    url: "https://theprint.in/india/4-policemen-suspended-in-bihars-bhojpur-after-viral-video-shows-failure-to-act-against-armed-man/2963861/",
    supports:
      "Suspension of Shahpur SHO Rajesh Kumar Malakar and three other personnel, departmental review, June 16 failure-to-act allegation, June 17 encounter and police self-defence claim.",
    reliabilityNote:
      "PTI wire carried by ThePrint. Useful for official-action reporting; still needs underlying suspension order/FIR for primary verification."
  },
  {
    sourceName: "Navbharat Times",
    title: "Bharat Tiwari Encounter Case: father, brother and village head named in FIR; Ara MP says 'Encounter Raj'",
    date: "20 June 2026",
    url: "https://navbharattimes.indiatimes.com/state/bihar/ara/bharat-tiwari-encounter-case-fir-against-father-brother-and-village-head-arrah-mp-sudama-prasad/articleshow/131870586.cms",
    supports:
      "Reported FIRs against father, brother and Bilauti panchayat head; father's surrender allegation; claim of no earlier criminal case; Ara MP Sudama Prasad's visit and Jawaniya rehabilitation context.",
    reliabilityNote:
      "Established Hindi media report. Useful for reported family/political claims; allegations remain contested until official records or inquiry findings are public."
  },
  {
    sourceName: "Live Hindustan",
    title: "Bharat Tiwari Encounter: MP Sudama Prasad visits family, questions police action",
    date: "19 June 2026",
    url: "https://www.livehindustan.com/videos/bihar/bhojpur-bharat-tiwari-encounter-controversy-sudama-prasad-alleges-police-murder-demands-compensation-and-government-job-201781883168866.html",
    supports:
      "Sudama Prasad's reported visit, demand for impartial investigation, Rs 50 lakh compensation and a government job for a family member.",
    reliabilityNote:
      "Local/national Hindi news video page. Useful for public-representative reaction; not a substitute for inquiry findings."
  },
  {
    sourceName: "Social News XYZ / IANS-style report",
    title: "Villagers protest after youth's death in encounter in Bihar's Bhojpur; family questions police action",
    date: "18 June 2026",
    url: "https://www.socialnews.xyz/2026/06/18/villagers-protest-after-youths-death-in-encounter-in-bihars-bhojpur-family-questions-police-action/",
    supports:
      "Reported protests, family dispute of police version, Shahpur police/STF operation, hospital transfer route and demand for impartial investigation.",
    reliabilityNote:
      "Syndicated/local report. Useful as secondary support; primary police, hospital and magistrial records remain needed."
  },
  {
    sourceName: "Times of India",
    title: "Erosion by Ganga ravages Bhojpur village, 50 houses lost in 7 days",
    date: "July 2025",
    url: "https://timesofindia.indiatimes.com/city/patna/erosion-by-ganga-ravages-bhojpur-village-50-houses-lost-in-7-days/articleshow/122862787.cms",
    supports:
      "Independent context on Jawaniya village erosion, displaced families, administrative relief measures and Ara MP Sudama Prasad's demand for permanent embankment/compensation.",
    reliabilityNote:
      "Established media context source. It supports the existence of Jawaniya erosion concerns, not every claim about Bharat Tiwari's role."
  },
  {
    sourceName: "CWI editor-supplied research dossier",
    title: "CWI Newsroom Exclusive Investigation Report: Bharat Bhushan Tiwari complete case dossier",
    date: "20 June 2026",
    url: "https://cockroachwatchindia.online/live-newsroom",
    supports:
      "Editor-supplied compilation of claims, timelines, alleged family statements, public reaction and open questions for CWI review.",
    reliabilityNote:
      "Internal research lead, not a primary public source. Used to identify lines of inquiry; claims are included only when backed by named reporting or clearly labelled contested."
  }
];

const timeline = [
  {
    date: "Before June 2026",
    event:
      "According to reported local and political accounts, Bharat Bhushan Tiwari had been raising issues linked to Jawaniya village erosion/displacement and rehabilitation demands. Independent reporting confirms Jawaniya faced severe Ganga erosion in 2025, but CWI still needs primary records of every representation attributed to him.",
    source: "Navbharat Times; Times of India Jawaniya erosion context; CWI dossier",
    verificationLabel: "Reported / context verified separately"
  },
  {
    date: "16 June 2026",
    event:
      "A viral video reportedly showed Tiwari armed and confronting police near his under-construction house in Bilauti. Police later faced departmental action for not taking effective control during this earlier incident.",
    source: "Times of India; ThePrint/PTI",
    verificationLabel: "Reported / police-attributed"
  },
  {
    date: "Night of 16 June 2026",
    event:
      "The Indian Express reported that Bhojpur Police said Tiwari was mentally unwell and that efforts were underway to take him into safe custody and arrange mental-health treatment.",
    source: "The Indian Express",
    verificationLabel: "Reported police statement"
  },
  {
    date: "17 June 2026",
    event:
      "Police said they received information around 9 am that Tiwari was armed, firing in the air and posing a public-safety threat. The police/STF operation ended with Tiwari sustaining gunshot injuries and later dying at PMCH Patna.",
    source: "Times of India; Indian Express; ThePrint/PTI",
    verificationLabel: "Police version reported"
  },
  {
    date: "17-18 June 2026",
    event:
      "Family members and villagers reportedly disputed the police version, alleging that Tiwari had thrown away the weapon or surrendered before being shot. CWI treats this as a serious allegation requiring independent inquiry, not as established fact.",
    source: "Indian Awaaz; Navbharat Times; Social News XYZ",
    verificationLabel: "Family allegation / contested"
  },
  {
    date: "18 June 2026",
    event:
      "Protests were reported in Bhojpur after his death. PTI/ThePrint reported four personnel including the Shahpur SHO were suspended after departmental review of the June 16 response.",
    source: "ThePrint/PTI; Indian Awaaz; Social News XYZ",
    verificationLabel: "Reported"
  },
  {
    date: "19-20 June 2026",
    event:
      "Ara MP Sudama Prasad visited the family and demanded impartial investigation, compensation and a government job for a family member. Navbharat Times reported FIRs against Tiwari's father, brother and panchayat head, while local anger continued.",
    source: "Live Hindustan; Navbharat Times",
    verificationLabel: "Reported political/legal development"
  }
];

const whatRemainsUnclear = [
  "Was there independent video, CCTV, bodycam or unedited Facebook Live evidence covering the exact moment before shots were fired?",
  "Was there a verified surrender attempt, and what happened after the livestream stopped?",
  "What does the post-mortem report say about number of bullets, distance, trajectory and cause of death?",
  "Has an official magisterial or judicial inquiry been ordered, and what is its current status?",
  "What is the exact police FIR version, and has the family complaint been registered as an FIR?",
  "Were weapons recovered, and has forensic/ballistic verification been publicly reported?",
  "Was due process followed under encounter-death guidelines and any mental-health intervention protocol?",
  "What is the status of suspended officers, FIRs against protesters/family members and any independent probe?"
];

const fullArticleDraft = `# Bharat Tiwari Encounter Case: What We Know, What Is Alleged, and What Still Needs Answers

## Short Answer
Bharat Bhushan Tiwari, a young man from Bilauti village in Bhojpur district, Bihar, died after a reported police/STF encounter on 17 June 2026. His death has triggered serious public questions because his family and supporters reportedly allege that he had surrendered or thrown away his weapon before being shot. Police reports say he was armed, had fired at police and public safety was at risk. CWI is separating the police version, family allegations, protest reaction and verified source trail because the claims remain contested.

## Why CWI Is Tracking This
CWI is tracking this case because it involves public accountability, police encounter transparency, due process, citizen rights and the need to separate verified facts from viral claims.

Cockroach Watch India - CWI is documenting this case as part of its public memory work on accountability, state power, due process, and unanswered civic questions.

## Who Was Bharat Tiwari?
Bharat Bhushan Tiwari was reported as a resident of Bilauti village under Shahpur police station limits in Bhojpur district, Bihar. Indian Express reported his age as 28, while other reports describe him as around 30.

According to Navbharat Times, Ara MP Sudama Prasad said Tiwari had been raising issues related to Jawaniya village erosion victims and rehabilitation. Times of India separately reported in 2025 that Jawaniya village in Shahpur block faced severe Ganga river erosion, with houses, temples and public infrastructure affected, and that local relief and permanent embankment demands were raised. This supports the public-issue context, but CWI still needs primary records of every petition, representation or complaint attributed to Tiwari.

Family and supporter accounts reportedly describe him as someone who spoke on local social issues. Police/media reports also describe him as armed during the June 16-17 incidents and allegedly firing or threatening police. CWI is not glorifying or demonising him. The record must hold both things at once: public-work claims require documentation, and police allegations require official evidence and due process.

## What Happened?
According to Times of India and ThePrint/PTI, a June 16 viral video showed Tiwari armed and confronting police near his under-construction house. ThePrint/PTI reported that four policemen including Shahpur SHO Rajesh Kumar Malakar were later suspended after a departmental review found they failed to act effectively during that earlier incident.

The Indian Express reported that less than a day before the fatal encounter, Bhojpur Police said Tiwari was mentally unwell and that steps were being taken to move him to safe custody and arrange mental-health treatment. This makes the next day's police response a major accountability question.

On 17 June, Times of India reported, citing the Bhojpur SP office press release, that police received information around 9 am that Tiwari was moving with a pistol, firing in the air and posing a threat to public safety. Police said a team with STF personnel went to Bilauti, repeatedly asked him to surrender and fired in self-defence after he allegedly opened fire at them. Tiwari sustained gunshot injuries, was taken for treatment and later died at PMCH Patna.

Family members and villagers have reportedly disputed the police version. Reports including Navbharat Times and Indian Awaaz say relatives alleged that Tiwari had thrown away his weapon or surrendered before he was shot. CWI does not treat this allegation as proven. It is a serious claim that needs independent video, forensic, medical and legal scrutiny.

After the death, protests were reported in Bhojpur. Navbharat Times later reported three FIRs, including cases naming Tiwari's father, brother and the Bilauti panchayat head in connection with obstruction/public-order allegations. Live Hindustan reported that Ara MP Sudama Prasad visited the family and demanded an impartial inquiry, Rs 50 lakh compensation and a government job for one family member.

## Police Version / Official Version
The police version, as reported by Times of India and PTI/ThePrint, is that Tiwari was armed, had brandished a pistol, allegedly fired at police or in the air, and posed a threat to public safety. Police said officers and STF personnel attempted to control the situation and opened fire in self-defence after he allegedly targeted the police team.

Times of India reported that police said a pistol, two live cartridges, two empty cartridges and a magazine were recovered. PTI/ThePrint reported that police said an investigation was underway.

What remains missing from the public police version: the full FIR, any press note in full text, independent video after the livestream ended, forensic/ballistic reports, post-mortem details, exact shot sequence, medical transfer records and inquiry status.

## Family Allegations / Public Claims
Family members have reportedly alleged that Tiwari had surrendered or thrown away his weapon before being shot. Navbharat Times reported the father's claim that his son had no earlier criminal case and was deliberately targeted. The same report said the father claimed he had asked police to arrest his mentally unwell son and send him for treatment.

These are allegations and family claims. They are not being presented by CWI as proven facts. Their seriousness makes independent inquiry necessary.

Public representatives also raised questions. Live Hindustan reported that Ara MP Sudama Prasad demanded an impartial investigation, compensation and a government job for the family. Navbharat Times reported his criticism that Bihar was seeing an "Encounter Raj" and that Tiwari had raised issues connected to Jawaniya displaced families.

## What We Know So Far
* Bharat Bhushan Tiwari died after a reported police/STF encounter in Bhojpur, Bihar, on 17 June 2026.
* Police reports say he was armed, had fired or threatened police, and that firing by police/STF was in self-defence.
* Multiple reports say he had livestreamed parts of the standoff or confrontation.
* His family has reportedly disputed the police version and alleged he had surrendered or thrown away his weapon before being shot.
* ThePrint/PTI reported four police personnel including Shahpur SHO Rajesh Kumar Malakar were suspended over the June 16 response.
* Navbharat Times reported FIRs against Tiwari's father, brother and the Bilauti panchayat head after protests/public-order allegations.
* Political/public figures including Ara MP Sudama Prasad have demanded inquiry and compensation, according to reports.
* Independent inquiry findings, post-mortem details, FIR text and forensic reports are still needed.

## What Remains Unclear
* Was there independent video, CCTV, bodycam or unedited Facebook Live evidence covering the exact moment before shots were fired?
* Was there a verified surrender attempt, and what happened after the livestream stopped?
* What does the post-mortem report say about number of bullets, distance, trajectory and cause of death?
* Was an official magisterial or judicial inquiry ordered, and what is its current status?
* What is the exact police FIR version?
* Has the family complaint been registered as an FIR?
* Were weapons recovered, and has forensic/ballistic verification been publicly reported?
* Was due process followed under encounter-death guidelines and any mental-health intervention protocol?
* What is the status of suspended officers, FIRs against protesters/family members and any independent probe?
* What evidence has been independently verified beyond police statements, family claims and viral videos?

## Timeline
* Before the encounter: Reported local/public work around Jawaniya erosion victims and rehabilitation demands; needs primary-document verification.
* 16 June 2026: Viral video reportedly showed Tiwari armed and confronting police; police later suspended personnel for failure to act effectively.
* Night of 16 June 2026: Indian Express reported that Bhojpur Police described him as mentally unwell and said treatment/safe custody steps were underway.
* 17 June 2026: Police/STF operation in Bilauti. Police version says he fired and officers responded in self-defence. Tiwari was injured and later died at PMCH Patna.
* After death: Family and villagers reportedly alleged he had surrendered or thrown away the weapon before being shot.
* Protest phase: Protests and public anger were reported in Bhojpur. Police suspensions and FIRs followed.
* Political/legal phase: Ara MP Sudama Prasad and others demanded impartial inquiry, compensation and accountability.
* Latest update: As of 20 June 2026, publicly available reporting still leaves the post-mortem, full FIRs, forensic reports, family complaint status and inquiry findings unclear.

## Why This Case Matters
Not every encounter can be judged by viral claims. But every encounter must be open to evidence, scrutiny and due process.

This case matters because a citizen died in state action, the police version and family version sharply conflict, and the public does not yet have a complete evidence-backed account. Accountability protects both citizens and honest institutions. Police have the right to present their official version. Families have the right to answers. The public has the right to transparent investigation.

Public anger must remain peaceful and lawful. Evidence matters more than viral claims.

## CWI Context
This case is not only about one death. It is about whether the public can access a clear, evidence-backed explanation when a citizen dies in state action. CWI is tracking the police version, family allegations, public reaction, legal developments, and unanswered questions separately so the case does not disappear into noise, outrage, or misinformation.

## Source Table
${sourceTable.map((source) => `* ${source.sourceName}, "${source.title}", ${source.date}: ${source.url} - Supports: ${source.supports} Reliability note: ${source.reliabilityNote}`).join("\n")}

## Verification Note
This CWI Live Newsroom item is based on publicly available reporting, official statements where available, and source material reviewed at the time of publication. Several claims in the Bharat Tiwari case remain contested. CWI does not independently declare the encounter fake or genuine. The article will be updated if official inquiry findings, court records, post-mortem details, police documents, or new verified evidence become available.

## Public Safety / Responsible Sharing Note
Do not share graphic visuals, unverified allegations, private family details, or claims without source attribution. Public anger must remain peaceful, lawful, and evidence-based.

## Submit Correction CTA
Have a correction, source, document, video evidence, legal record, or verified update related to this case? Submit it to CWI: https://cockroachwatchindia.online/submit`;

export const bharatTiwariPendingRecord: PendingNewsroomRecord = {
  id: "pending-bharat-tiwari-encounter-case-2026-06-20",
  headline: "Bharat Tiwari Encounter Case: What We Know, What Is Alleged, and What Still Needs Answers",
  slug: "bharat-tiwari-encounter-case-explained",
  category: "Live Newsroom / Public Accountability / Justice Watch",
  source: "CWI research dossier + Indian Express + Times of India + PTI/ThePrint + Navbharat Times + Live Hindustan",
  author: "Cockroach Watch India Editorial Desk",
  publishedDate,
  updatedDate,
  url: canonical,
  summaryBullets: [
    "Bharat Bhushan Tiwari died after a reported police/STF encounter in Bhojpur, Bihar, on 17 June 2026.",
    "Police reports say he was armed, firing or threatening police, and that officers fired in self-defence.",
    "Family members and villagers have reportedly alleged that he had surrendered or thrown away his weapon before being shot.",
    "ThePrint/PTI reported suspensions of police personnel over the June 16 response; Navbharat Times reported FIRs involving family/protest-related allegations.",
    "The case remains developing and high-sensitivity because post-mortem, full FIRs, forensic reports, family complaint status and inquiry findings are not yet publicly clear."
  ],
  whatHappened:
    "Bharat Bhushan Tiwari's death after a reported police/STF encounter has become a contested public-accountability case. Police reports frame the firing as self-defence during an armed threat; family/supporter accounts reportedly allege surrender before shooting.",
  whatWeKnow:
    "Source-backed reporting confirms the Bhojpur location, June 16-17 standoff context, Facebook Live references, PMCH death, police self-defence version, family dispute of the version, police suspensions and public/political reaction.",
  whatRemainsUnclear: whatRemainsUnclear.join(" "),
  verificationStatus: "Pending approval",
  sourceCount: sourceTable.length,
  riskLevel: "High",
  cwiRelevance:
    "The case sits directly inside CWI's public-memory work on state action, due process, police accountability, contested viral claims and citizen right to transparent investigation.",
  suggestedLiveNewsroomCategory: "Public Accountability / Justice Watch",
  seoTitle: "Bharat Tiwari Encounter Case Explained - CWI Live Newsroom | Cockroach Watch India",
  metaDescription:
    "Cockroach Watch India explains the Bharat Tiwari encounter case, family allegations, police version, timeline, public reaction, and the unanswered questions around the alleged fake encounter controversy.",
  socialCaption:
    "Developing: Bharat Tiwari encounter case. CWI separates police version, family allegations, source-backed facts, and what remains unanswered.",
  sourceType: "Established media",
  approvalStatus: "pending",
  draftPreview:
    "A full CWI Live Newsroom draft on the Bharat Tiwari case, from reported Jawaniya public-work context to the June 17 police/STF encounter, family surrender allegation, protests, FIR developments, timeline, source table and verification note.",
  seoPreview: {
    canonical,
    schemaTypes: ["NewsArticle", "BlogPosting", "BreadcrumbList"],
    openGraphTitle: "Bharat Tiwari Encounter Case Explained - CWI Live Newsroom",
    twitterCard: "summary_large_image"
  },
  socialPreview: {
    x: "Developing: Bharat Tiwari encounter case. Police version, family allegations, source-backed facts and unanswered questions separated by CWI. Read after approval: " + canonical
  },
  sourceGaps: [
    "Full police FIR and press note.",
    "Post-mortem report and medical transfer records.",
    "Forensic/ballistic report on recovered weapon and fired rounds.",
    "Official status of any magisterial/judicial inquiry.",
    "Verified unedited video/bodycam/CCTV covering the moment after the livestream ended.",
    "Status of mother's/family complaint and any FIR based on it."
  ],
  timeline,
  fullArticleDraft,
  approvalCard: {
    summary:
      "High-sensitivity developing draft on Bharat Bhushan Tiwari's contested Bhojpur encounter death, separating police self-defence claims from family surrender allegations and verified reporting.",
    verificationStatus: "Developing",
    riskLevel: "High sensitivity",
    sourceCount: sourceTable.length,
    timelinePreview: timeline.map((item) => `${item.date}: ${item.event}`),
    policeVersionSummary:
      "Police version says Tiwari was armed, fired or threatened police/public safety, and that police/STF fired in self-defence after repeated surrender requests.",
    familyAllegationSummary:
      "Family/supporter reports allege Tiwari had surrendered or thrown away his weapon before being shot; CWI labels this as contested and not independently verified.",
    whatRemainsUnclear,
    seoPreview:
      "Title: Bharat Tiwari Encounter Case Explained - CWI Live Newsroom | Cockroach Watch India. Canonical: " + canonical
  },
  sourceTable,
  image: {
    heroImage: "/images/cwi/newsroom/hero/cwi-police-standoff-public-safety-01.jpg",
    thumbnailImage: "/images/cwi/newsroom/thumbnails/cwi-police-standoff-public-safety.jpg",
    ogImage: "/images/cwi/newsroom/og/cwi-police-standoff-public-safety.jpg",
    altText:
      "CWI Live Newsroom graphic explaining the Bharat Tiwari encounter case, family allegations, police version, and unanswered questions.",
    imageCredit: "CWI Original Graphic"
  }
};
