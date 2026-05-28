# Agent State

Last updated: 2026-05-25

Current task: Build the complete Cockroach Watch India production-ready Next.js website in `c:\Users\praka\Downloads\CWI`.

Workspace notes:
- The folder initially contained only `1st.png`, `agenda.png`, `banner.png`, and two MP4 files.
- Assets have been copied into `public/brand/`.
- This is being built as a standalone Next.js App Router project.
- Required positioning: CWI is independent from Cockroach Janta Party unless explicitly declared. Do not claim CWI is the official CJP website.
- Required disclaimer text: “Cockroach Watch India is an independent civic watch, satire, and commentary platform. Not affiliated with any political party or organization unless officially declared.”

Implementation progress:
- Project config, Tailwind config, shared site constants, and utilities added.
- Assets copied into `public/brand/`.
- Data files added: roles, issues, agenda, posts, charter, socials.
- Reusable components added: hero, founder statement, ticker, charter/role/issue/agenda/watch desk cards, social links, submit form, disclaimer, footer, nav, mobile nav, verification badge, credit policy box, movement quote, archive card, poll card.
- Pages added: home, what-is-cwi, charter, join, submit, watch-desk, watch-desk/[slug], five-point-agenda, issues, media-bank, credit-policy, youth-voice, about, contact.
- API placeholder added: `POST /api/submit-report`.
- CJP site was reviewed only for manifesto/poster rhythm. CWI copy was rephrased and keeps independent/non-party positioning.

Next steps:
- Verified commands passed: `npm run lint`, `npm run typecheck`, `npm audit --omit=dev`, `npm run build`.
- `npm audit --omit=dev` reports 0 vulnerabilities after adding a PostCSS override.
- The build generated 25 static/server routes including all requested pages and dynamic Watch Desk post pages.
- `.gitignore` added for `.next/`, `node_modules/`, and TypeScript build info.
- If continuing, run `npm run dev` and review the UI in browser at desktop and mobile widths.

2026-05-20 UI redesign progress:
- User requested CWI visual identity move away from CJP-style saffron/green/cream poster look.
- Shared Tailwind tokens remapped to CWI palette: royal/electric blue, amber, white, deep navy, teal, warning orange.
- Global background, buttons, cards, inputs, section headers, ticker, disclaimer, hero, navbar, footer, form, cards, and many route layouts refactored to cleaner modern civic-newsroom style.
- Navbar simplified to Home, Watch Desk, Issues, Join, Submit, Contact plus More dropdown: Charter, Five-Point Agenda, Youth Voice, Media Bank, Credit Policy, About.
- Mobile bottom nav disabled; hamburger menu now handles primary and More links.
- Watch Desk now has client-side category filters.
- Telegram link added: `https://t.me/cockroachwatchindia`.
- `logo.png` copied to `public/brand/logo.png` and used in navbar, footer, and metadata icons.
- Verified after redesign/logo/social updates: `npm run lint`, `npm run typecheck`, `npm run build`.
- Dev server restarted and ready at `http://localhost:3000`.
- Fixed CTA clipping across the website by removing fixed-height/nowrap button behavior, allowing safe wrapping, making role CTAs full-width, and changing role grids from forced 5 columns at `lg` to `md:2`, `lg:3`, `xl:5`.
- Verified after clipping fix: `npm run lint`, clean `npm run build`, then standalone `npm run typecheck`.

2026-05-20 Supabase integration:
- Added `pg` and `@types/pg`.
- Added server-only DB helper at `lib/db.ts`.
- Added `.env.example` and `.env.local`; `.env.local` contains the Supabase `DATABASE_URL` and remains ignored by `.gitignore`.
- Updated `POST /api/submit-report` to create/use `cwi_report_submissions` and insert validated reports into Supabase.
- Added `npm run db:check` using `scripts/check-db.mjs`.
- Verified: `npm run lint`, `npm run build`, `npm run typecheck`, `npm run db:check`, `npm audit --omit=dev`.
- Live API insert test succeeded, then the test row was deleted from Supabase.
- Dev server restarted and ready at `http://localhost:3000`.
- Fixed submit form client bug: saved `event.currentTarget` before awaiting `fetch`, then called `form.reset()` from the saved reference.
- Verified after reset fix: `npm run lint`, `npm run build`, standalone `npm run typecheck`, live API test succeeded, and test row was deleted.
- Stopped duplicate Node dev servers and restarted one clean dev server at `http://localhost:3000`.

2026-05-20 GitHub publish prep:
- User requested pushing the full project to `https://github.com/callmepnj/CWI.git`.
- Important: parent folder `C:\Users\praka` is already a Git repo with unrelated `aisupport` remote. Treat `CWI` as its own nested standalone repository.
- Added strict proprietary `LICENSE`.
- `.env.local` must remain untracked; `.gitignore` already excludes `.env*` except `.env.example`.
- Initialized standalone Git repo inside `CWI`.
- Remote set to `https://github.com/callmepnj/CWI.git`.
- Initial project commit pushed to `origin/main`: `45af0bc Initial CWI website`.
- Confirmed `.env.local`, `.next`, `node_modules`, and `tsconfig.tsbuildinfo` were ignored before commit.

2026-05-20 SEO upgrade:
- Updated canonical site URL to `https://www.cockroachwatchindia.online`.
- Added centralized SEO helper at `lib/seo.ts`.
- Added page-level canonical, robots index/follow, OpenGraph, Twitter/X metadata, and keywords across primary pages and Watch Desk posts.
- Added `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, dynamic `app/opengraph-image.tsx`, `app/icon.tsx`, `app/apple-icon.tsx`, `public/favicon.svg`, and `public/favicon.ico`.
- Added Organization and WebSite JSON-LD in `app/layout.tsx`.
- Added Reddit social profile and expanded footer/social links.
- Improved homepage crawlable SEO copy and heading labels while preserving UI structure.
- Added `README.md` with Search Console and sitemap submission checklist.
- Verified locally: `npm run lint`, `npm run build`, standalone `npm run typecheck`, `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, `/opengraph-image`, `/favicon.ico`, and homepage 200.
- Added Facebook social URL `https://www.facebook.com/profile.php?id=61590247497201` to shared site config, social cards, footer, and Organization JSON-LD.
- Added Google Search Console verification meta tag with token `Wqz_bAcrTX-o4uXV83OWMUA3qSLYj3lHYanoWci9BPY`.
- Current SEO optimization pass added homepage WebPage JSON-LD, homepage FAQ JSON-LD, crawlable FAQ content, stronger internal homepage links to About/Credit Policy/Submit, Telegram in Organization `sameAs`, and extra README ranking checklist items.
- Verified after current SEO pass: `npm run lint`, `npm run typecheck`, `npm run build`, secret scan excluding `.env.local`, and generated homepage HTML contains FAQPage/WebPage schema plus Google verification metadata.

2026-05-24 Manipur investigative page task:
- User requested a new source-backed investigative Watch page about the Manipur crisis from 2023 to 2026.
- Working route assumption: `/watch/manipur-crisis`, linked from the existing `/watch` hub.
- Copied selected user-provided Manipur-relevant images from `manipur article photos/` into `public/manipur/`.
- Editorial guardrail for this task: use cautious, attributed wording for political/accountability claims; no hate against Meitei, Kuki-Zo, Naga, Hindu, Christian, tribal, or any community.
- Source trail being used includes AP, BBC, Al Jazeera, Human Rights Watch, Indian Express, PIB, ThePrint/PTI, Supreme Court Observer, and Parliament/PIB references.
- Implemented typed Manipur investigation data in `data/manipur.ts`, source-bound research UI, searchable source archive, animated timeline, and route `app/watch/manipur-crisis/page.tsx`.
- Added Watch hub and footer links to the Manipur investigation, copied selected images into `public/manipur/`, and ignored the raw `manipur article photos/` source folder to avoid committing unrelated/unoptimized files.
- Verified after implementation: `npm run typecheck`, `npm run lint`, and `npm run build` passed. Build generated `public/sitemap.xml` with `/watch/manipur-crisis`.
- Follow-up UI polish: user said Manipur page was too dark. Converted the route and Manipur-specific timeline/source archive/research components to the bright CWI UI system: paper background, white cards, royal blue highlights, amber notices, ink text, and limited navy accents.
- Verified after UI polish: `npm run typecheck`, `npm run lint`, and `npm run build` passed.
- User uploaded Google Search Console HTML verification file `public/google9c2f6600a0be4f79.html`; file content is only the Google verification token and is safe to commit.
- Live check after push showed `https://www.cockroachwatchindia.online/google9c2f6600a0be4f79.html` still returning 404 while GitHub raw served the file, indicating Vercel had not deployed the latest commit yet.
- Current sitemap fix: `app/sitemap.ts` now hardcodes production base URL `https://www.cockroachwatchindia.online` and returns explicit static routes plus Watch Desk post routes; `app/robots.ts` hardcodes the production sitemap URL for Google Search Console.
- Verified after sitemap deploy: `https://www.cockroachwatchindia.online/sitemap.xml` returns HTTP 200 with `application/xml` and parses as valid XML with 21 URLs; `https://www.cockroachwatchindia.online/robots.txt` returns HTTP 200 with `Sitemap: https://www.cockroachwatchindia.online/sitemap.xml`.
- Follow-up GSC screenshot review: `/robots.txt` was submitted under Sitemaps, which causes "Unsupported file format" because robots.txt is not XML. Live Googlebot-style checks confirm `/sitemap.xml` is HTTP 200 `application/xml`, parses with 21 URLs, and every sitemap URL returns 200.
- To address persistent GSC "could not be read" caching/format issues, replaced `app/sitemap.ts` with explicit route handler `app/sitemap.xml/route.ts` returning stable XML, fixed `lastmod` values, trailing slash homepage URL, and explicit `Content-Type: application/xml; charset=utf-8`.
- Verified after explicit sitemap route deployment: live `https://www.cockroachwatchindia.online/sitemap.xml` returns HTTP 200, `application/xml; charset=utf-8`, homepage loc `https://www.cockroachwatchindia.online/`, and stable `<lastmod>2026-05-20</lastmod>` values.
- User reported GSC still shows "couldn't fetch"; switched sitemap and robots to static files in `public/sitemap.xml` and `public/robots.txt`, deleting `app/sitemap.xml/route.ts` and `app/robots.ts` to remove Next metadata route behavior from these endpoints.
- Verified static deployment: live `/sitemap.xml` is HTTP 200, `application/xml; charset=utf-8`, stable XML with 21 URLs; live `/robots.txt` is HTTP 200, `text/plain; charset=utf-8`; every sitemap URL returns HTTP 200 to Googlebot.
- Current newsroom expansion: `data/posts.ts` now generates 58 Watch Desk articles with sections, social packs, tags, author, reading time, metadata, and related slugs. Added Watch Desk search/trending filters, article progress/share/schema layout, RSS route, category/tag archive pages, and static SEO file generator producing `public/sitemap.xml`.
- Current editorial polish pass: improved Watch Desk article seed headlines, summaries, meta descriptions, social copy, disclaimer language, repeated article template phrasing, homepage Watch Desk copy, and newsroom page descriptions without changing routes or UI structure. Verified `npm run lint`, `npm run typecheck`, `npm run build`, sitemap parse, RSS parse, and secret scan excluding `.env.local`.
- Current source-backed newsroom pass: updated canonical site URL to `https://www.cockroachwatchindia.online`, added source metadata to Watch Desk articles, added 20 additional source-focused articles, rendered visible "Sources & Further Reading" sections, added citation URLs to NewsArticle/BlogPosting schema, expanded verification filters, added moderated article comments via `POST/GET /api/comments`, added comment UI/policy text, and regenerated static sitemap/robots for the new domain.
- 2026-05-22 Submit Report polish: scoped copy/UI pass on `/submit` and `components/SubmitForm.tsx` removed developer-facing upload/backend wording, added professional civic intake sections, aligned validation/error/success language, updated submission type options, and kept backend details hidden from users.
- 2026-05-22 official domain pass: confirmed production SEO helpers use `https://www.cockroachwatchindia.online`, cleaned remaining old-domain documentation references, made OpenGraph image URLs absolute to the official domain, and added `middleware.ts` to permanently redirect the legacy Vercel host to the official domain.
- 2026-05-22 evidence upload fix: `/submit` now has a working multi-file evidence input for JPG, PNG, PDF, MP4, WebM, MOV, DOC, and DOCX files; `POST /api/submit-report` now accepts multipart form data, validates up to 3 files under 4 MB total, and stores evidence in `cwi_report_evidence_files` linked to `cwi_report_submissions`.
- 2026-05-22 social link update: added Bluesky profile `https://bsky.app/profile/cwatchindia.bsky.social` to shared site config, social cards, footer, hero social buttons, and Organization JSON-LD `sameAs`.
- 2026-05-23 Watch experience: added `/watch` public live hub, animated homepage `WatchHighlightSection`, radar/carousel/watch card components, Watch advisories/categories data, `/watch` SEO metadata/schema, navbar/footer links, and sitemap route inclusion.
- 2026-05-23 Watch Desk article SEO/content pass: improved generated article structure across all Watch Desk posts with Short answer, What happened, What we know, What remains unclear, Why it matters, CWI context, and CWI Note sections; strengthened metadata around Cockroach Watch India/CWI Watch Desk; added topic-specific source-backed context for X withholding, founder/family/threat reports, follower/bot allegations, and satire explainers; updated article page visible byline, source count, correction links, internal links, exact disclaimer, and schema `url`.
- 2026-05-23 Watch Desk date/sort pass: article generator now assigns date-aware published/updated dates, cards show formatted published/updated dates, `/watch-desk` has a sort control and groups articles by date, and homepage/watch/footer/category/tag article lists now sort newest-first.
- 2026-05-24 current task: building `India's Unanswered Files` as a data-driven CWI investigative section at `/unanswered-files` with 18 source-backed case files, generated editorial visuals, individual case pages, filters, source archives, source-bound AI research boxes, and sitemap integration. Editorial guardrail: cautious attribution, no communal targeting, no fake incident photos, and government response separated from ground reality.
- 2026-05-24 image-pack follow-up: user added `CWI_India_Unanswered_Files_Image_Pack/` with manifest/prompt/downloader but no bundled image files. Wikimedia Commons downloader returned almost no usable case images and a few unrelated results due 429 rate limiting, so generated downloads were removed. Production approach: Manipur uses real local `public/manipur/` archive photos; all other Unanswered Files now have an image research board generated from the pack's case-specific visual briefs and clearly labelled as CWI editorial visuals, not incident photographs. Raw pack and failed downloader output are ignored.
- 2026-05-24 real image fix in progress: added `scripts/collect-unanswered-file-images.py` and generated actual local JPGs under `public/images/cwi-unanswered-files/`. Filesystem verification confirmed all 18 folders contain `hero.jpg` plus `image-01.jpg` through `image-10.jpg` and `metadata.json`. UI is being switched to `data/unanswered-file-images.ts` so Unanswered Files pages reference exact local paths with captions, source URLs, and license notes; old generated SVG visual routes are removed.

2026-05-24 Unanswered Files audit/fix:
- User now requires using only photos from `CWI_India_Unanswered_Files_Image_Pack/`.
- Pack scan found 288 image files across 16 case folders. Missing from the provided pack so far: `Manipur violence` and `Vizhinjam port fisherfolk protest`.
- Do not claim images are from the provided pack unless actual files are copied from that pack into `public/images/cwi-unanswered-files/` and referenced by the section.
- In progress: import local pack images into clean slug folders, remove the old gallery-only UI, add `/indias-unanswered-files` aliases, add article interaction APIs/components, update sitemap, and add a validation/audit script.
- Current validation status: build/lint/type-check pass. Audit passes all implementation rows for all 18 articles except image provenance for `manipur-violence` and `vizhinjam-port-fisherfolk-protest`, because the required folders are absent from `CWI_India_Unanswered_Files_Image_Pack/`. Existing local fallback images keep those pages unbroken, but they are truthfully marked as not from the provided pack.

2026-05-24 new photos organization:
- User added `new photos/` with 32 PNG poster/social assets for India Unanswered Files only.
- Added `scripts/organize-india-unanswered-images.py` to scan the folder, classify clear topic matches, place unclear generic CWI posters in `unanswered-files-review`, generate optimized WebP hero/thumbnail/OG/social/poster/gallery variants, write `public/images/india-unanswered-files/image-index.json`, write inventory JSON, and create `CWI_India_Unanswered_Files_Final_Website_Image_Pack.zip`.
- New organized image root: `public/images/india-unanswered-files/`. Existing `public/images/cwi-unanswered-files/` paths are preserved.
- Raw `new photos/` and old raw image pack zip are ignored in `.gitignore`; final optimized image pack zip is generated at repo root.
- Updated Unanswered Files article data to expose `heroImage`, `thumbnailImage`, `ogImage`, `socialImages`, `galleryImages`, and topic-specific `altText`; article cards now use thumbnails and article metadata/schema uses topic OG images.
- Current validation: `npm run type-check`, `npm run lint`, `npm run build`, and `node scripts/validate-unanswered-files.js` pass. Validation confirms all 18 article pages have hero/thumbnail/OG images, 6 gallery images, date-wise timelines, SEO image fields, FAQ schema, sitemap entries, comments/interactions, and no old Vercel URL.
- New photo coverage from `new photos/`: 14 topics matched clearly. `manipur-violence`, `vizhinjam-port-fisherfolk-protest`, `sambhal-mosque-survey-violence`, and `lakhimpur-kheri-farmers-case` had no clear new-topic image in the folder, so they use existing local archive fallback images to avoid random assignment.
- 2026-05-24 Watch page gesture update: replaced the static India Unanswered Files image stack inside `/watch` with `components/UnansweredFilesGestureRail.tsx`, a Framer Motion draggable/moving case rail with live-style ticker chips and article thumbnail images. Verified after change: `npm run type-check`, `npm run lint`, and `npm run build` pass.
- 2026-05-24 gesture rail polish: user reported the rail was too dark and barely moving. Updated `UnansweredFilesGestureRail` to a bright CWI card system with white/sky backgrounds, readable article panels, continuous horizontal image-card movement, and a faster moving headline ticker. Verified: `npm run type-check`, `npm run lint`, and `npm run build` pass.
- 2026-05-24 gesture ticker polish: user reported the lower moving news strip was still too dark and fast. Changed the ticker from dark ink to a light white/sky treatment, slowed card rail duration from 26s to 34s and ticker duration from 18s to 28s. Verified: `npm run type-check`, `npm run lint`, and `npm run build` pass.
- 2026-05-24 SEO system upgrade in progress: canonical India Unanswered Files path standardized to `/india-unanswered-files` with middleware redirects from `/unanswered-files`, `/indias-unanswered-files`, legacy Vercel host, and `www.cockroachwatchindia.online`. Added `/editorial-policy`, `/privacy-policy`, `/terms`, expanded About FAQ/schema, strengthened homepage CWI metadata/copy, added homepage CWI India Unanswered Files section, updated Watch Desk article H1/schema/OG metadata, updated sitemap generator to 254 URLs, and verified `npm run type-check`, `npm run lint`, `npm run build`, old URL scan, sitemap/robots, and Unanswered Files validation pass.
- 2026-05-25 engagement integrity task: user asked for fake-looking comments/star ratings; refused deceptive social proof and implemented transparent alternatives instead. Added shared `ArticleDiscussionPrompts` and `ArticleRating` components, DB-backed `/api/article-ratings` route with one rating per visitor/IP per article, and `cwi_article_ratings` table setup in `lib/db.ts`. Watch Desk and India Unanswered Files article templates now show labelled CWI discussion prompts, reader questions to consider, real visitor ratings only, and clearer moderation copy saying only approved real comments appear publicly.
- Verification after engagement integrity task: `npm run type-check`, `npm run lint`, `npm run build`, and `node scripts/validate-unanswered-files.js` pass. Changes remain local and uncommitted unless the user asks to push.
- 2026-05-25 redirect loop fix: live curl showed Vercel redirected `https://cockroachwatchindia.online/` to `https://www.cockroachwatchindia.online/` while app middleware redirected `www` back to apex, causing `ERR_TOO_MANY_REDIRECTS`. Permanent code fix aligns canonical app host to `https://www.cockroachwatchindia.online`, redirects apex/legacy Vercel host to `www`, updates sitemap/robots/schema source URLs to `www`, and stops treating `www` as a legacy host. Verified locally: `npm run type-check`, `npm run lint`, `npm run build`, old URL scan, and `node scripts/validate-unanswered-files.js` pass.
- 2026-05-25 related files title color fix: made `UnansweredFileVisual` title color configurable and changed Related Unanswered Files image-overlay titles to CWI royal blue with a light backing for readability. Hero/inline visual overlays keep their default white title text.
- 2026-05-25 CWI AI OS build in progress: added PostgreSQL admin OS schema via `ensureAdminOsTables()` for agents, tasks, approval queue, sources, keywords, manual links, research/verification/article/SEO/social/image/UI packs, reports, comments, briefings, health logs, cost logs, and settings. Added env-protected admin auth (`CWI_ADMIN_PASSWORD`), `/admin/login`, `/admin`, `/admin/[section]`, and admin APIs for dashboard data, agent actions, manual link processing, approval status changes, comment moderation, login, and logout. The system is low-cost/template-first, no paid social APIs, no auto-publish, and every generated output goes to approval queue.
- 2026-05-25 local admin/dev fix: added `CWI_ADMIN_PASSWORD=change-this-long-admin-password` to ignored `.env.local` for local testing and fixed duplicate React footer keys by using `label + href` instead of `href` alone.
- Local admin test note: admin login succeeds with the local password, but Supabase/Postgres returned `28P01 password authentication failed for user "postgres"` from the current `.env.local` `DATABASE_URL`. Added setup-mode fallback for `/api/admin/dashboard` so `/admin` loads and shows the DB connection issue instead of failing completely.
- 2026-05-25 real AI admin backend wiring in progress: added explicit AI provider abstraction (`openai`, `gemini`, `mock`), shared CWI Big Brain rules, real agent service files, orchestrator workflows, protected `/api/ai/*` routes, and `/api/approval/update`. Dashboard actions are being moved from UI-only/admin stubs to these backend workflows. Important behavior: missing AI keys return visible configuration errors; `AI_PROVIDER=mock` is labelled local-test mode only; Publish AI refuses unless approval status is `approved`.
- 2026-05-25 real AI admin backend complete for Phase 1: dashboard buttons now call protected backend routes for command, research, verify, article, SEO, social, image, UI/UX, health, manual-link, approval update, and publish. Manual Link -> Research -> Verify -> Article -> SEO -> Social -> Image -> Approval Queue is implemented through `lib/ai/orchestrator.ts`. Publish AI saves only approved items and blocks everything else with "Publishing blocked. Human approval required." Verification: `npm run type-check`, `npm run lint`, and `npm run build` pass. Local `/admin/login` returns 200 and admin login/dashboard API works in setup mode; current `.env.local` `DATABASE_URL` still fails Postgres auth, so real DB saves require replacing it with a valid Supabase connection string.
- 2026-05-25 push prep: user requested pushing all current changes. Secret scan excludes `.env.local`; only placeholder/example env values are present in tracked docs. Remote is `origin` -> `https://github.com/callmepnj/CWI.git`, branch `main`.
- 2026-05-25 Vercel env helper: added local `vercel.env` upload/import template with required production variables for admin, database, and AI provider. It intentionally uses `CHANGE_ME` placeholders initially, does not copy secrets from `.env.local`, and is ignored by Git so user-filled credentials are not pushed.
- 2026-05-25 Supabase prepared-statement fix: user reported "cannot insert multiple commands into a prepared statement" when running admin agent buttons on Vercel. Root cause was parameterized multi-statement SQL in `completeAgentTask()` and legacy `logTask()`. Split those operations into separate `pg` queries so Supabase/Postgres accepts them.
- 2026-05-25 Supabase pooler hardening: user still saw the same prepared-statement error on Vercel. Updated all DB/table initialization helpers in `lib/db/index.ts` to execute schema statements one by one via `runSqlBatch()` instead of sending large multi-command schema strings. Also removed a semicolon from a SQL string literal in `saveResearchPack()` to avoid pooler/proxy false positives.
- 2026-05-25 stronger DB guard: added a global safe-query guard inside `getPool()` that strips trailing semicolons from prepared queries and blocks any future multi-statement prepared query with a clear CWI error before Supabase rejects it. `runSqlBatch()` now uses a quote/comment-aware SQL splitter for schema setup.
- 2026-05-25 admin dashboard speed fix complete: user reported `/admin` sections stayed on "Loading CWI AI OS dashboard..." too long after clicking sidebar items. Root cause was route navigation remounting `AdminDashboard` and refetching `/api/admin/dashboard`, while the backend repeatedly checked/seeded admin DB tables. Implemented client-side section switching with history pushState, forced refresh only when needed, dashboard request timeout messaging, in-memory dashboard cache, one-time admin seed promise, and schema readiness probing before running expensive admin SQL setup. Verified `npm run type-check`, `npm run lint`, and `npm run build`; pushed commit `aca9957`.
- 2026-05-25 approval UI clarity fix complete: user saw "Publishing blocked. Human approval required." after using "Approve Social Only". Publish AI is correctly strict: only `approved`/Approve Publish can publish, and items without `article_draft_id` cannot publish. Approval buttons now send canonical statuses, Run Publish AI is disabled unless status is exactly `approved` and an article draft is attached, and approval cards explain why publishing is unavailable.
- 2026-05-25 approval-to-article flow complete: user then saw "Publish AI is unavailable for this item because no article draft is attached." Added a per-card "Generate Article Draft" action for approval items that have a `research_pack_id` but no article draft. `/api/ai/article` now accepts `approvalQueueId`, generates the draft from that card's research/verification pack, and attaches the draft back to the same approval item so the next flow is Review -> Approve Publish -> Run Publish AI. Verified `npm run type-check`, `npm run lint`, and `npm run build`.

2026-05-25 product understanding pass:
- Current user request: understand the full product end to end. No feature code changes were requested.
- Product identity: Cockroach Watch India (CWI) is an independent civic watch, satire, and commentary platform. Required editorial positioning remains: CWI is independent from Cockroach Janta Party unless officially declared; do not describe it as the official CJP site.
- Production domain/canonical: `https://www.cockroachwatchindia.online`. Middleware redirects apex `cockroachwatchindia.online`, legacy Vercel host, and old Unanswered Files paths to the canonical host/path.
- Stack: Next.js 15 App Router, React 19, Tailwind CSS, PostgreSQL via `pg`, Framer Motion, lucide icons. Main scripts: `npm run dev`, `npm run build` (prebuild regenerates static sitemap/robots), `npm run lint`, `npm run typecheck`, `npm run validate:unanswered-files`, `npm run db:check`.
- Public information architecture: homepage, `/watch`, `/watch-desk`, `/watch-desk/[slug]`, `/watch-desk/category/[category]`, `/watch-desk/tag/[tag]`, `/india-unanswered-files`, `/india-unanswered-files/[slug]`, `/watch/manipur-crisis`, `/submit`, `/issues`, `/charter`, `/join`, `/about`, `/contact`, `/what-is-cwi`, `/five-point-agenda`, `/youth-voice`, `/media-bank`, `/credit-policy`, `/editorial-policy`, `/privacy-policy`, `/terms`, and `/rss.xml`.
- Watch Desk content: `data/posts.ts` generates 78 source-backed Watch Desk articles from `articleSeeds`, with sections, metadata, source lists, social copy packs, dates, tags, related slugs, and JSON-LD rendered in `app/watch-desk/[slug]/page.tsx`.
- India Unanswered Files: `data/unanswered-files.ts` defines 18 source-backed case files. Canonical route is `/india-unanswered-files`; legacy `/unanswered-files` and `/indias-unanswered-files` exist only as aliases/redirects. Each case page includes timeline, source archive, source-bound research box, local visuals, interactions, comments, rating, FAQ JSON-LD, and visible editorial caution.
- Manipur investigation: `/watch/manipur-crisis` is a standalone source-backed longform page using `data/manipur.ts`, `public/manipur/` visuals, timeline, source archive, quick facts, human-cost/accountability/community/media-bias sections, and source-bound research UI.
- Public intake: `/submit` uses `components/SubmitForm.tsx` and `POST /api/submit-report`. The API accepts multipart reports, validates required fields/consent, allows up to 3 evidence files under 4 MB total, and stores submissions/evidence in `cwi_report_submissions` and `cwi_report_evidence_files`.
- Public engagement: Watch Desk comments use `/api/comments`; India Unanswered Files comments/likes/metrics use `/api/unanswered-files/*`; ratings use `/api/article-ratings`. Comments are pending by default and moderation is handled in admin.
- Admin product: `/admin/login`, `/admin`, and `/admin/[section]` are protected by `CWI_ADMIN_PASSWORD`/`ADMIN_PASSWORD` using the `cwi_admin_session` cookie. `components/AdminDashboard.tsx` is a private CWI AI Operating System with overview, agents, approval queue, manual link processing, research/article/SEO/social packs, reports, comments, sources, keywords, daily briefing, system health, and settings.
- AI/admin backend: `lib/ai/model-provider.ts` supports `AI_PROVIDER=openai`, `gemini`, or explicit `mock`. Missing provider keys return visible config errors. `lib/ai/orchestrator.ts` wires Manual Link -> Research -> Verify -> Article -> SEO -> Social -> Image -> Approval Queue. Publish AI only writes approved items to admin DB and does not update static public content automatically.
- Database layer: `lib/db/index.ts` lazily creates public/report/comment/rating/unanswered/admin tables, uses a global pg pool, and includes a safe-query guard to block multi-statement prepared queries for Supabase pooler compatibility. Admin schema includes agents, tasks, approval queue, manual links, research packs, verification reports, article drafts, SEO/social/image packs, UI/UX audits, published_articles, health/cost/settings.
- SEO system: `lib/seo.ts` centralizes metadata. `scripts/generate-static-seo.mjs` writes static `public/sitemap.xml` and `public/robots.txt`; current generator should produce 254 URLs from static routes, Watch Desk categories/tags/articles, and India Unanswered Files articles. `app/rss.xml/route.ts` emits RSS for latest Watch Desk articles.
- Asset model: brand assets live in `public/brand/`; Manipur visuals in `public/manipur/`; India Unanswered Files optimized visuals and indexes in `public/images/india-unanswered-files/`; older/local fallback CWI image sets in `public/images/cwi-unanswered-files/`. Raw image source folders and zips are ignored except the final generated website image pack zip.
- Important local file risk: `vercel.env` is intentionally ignored by Git but currently contains credential-shaped values/placeholders and malformed-looking lines. Treat it as local-only. If any values are real, rotate them before use; do not commit or quote them.

2026-05-25 test and publish-flow fix:
- User reported CWI AI responses are inaccurate and approved articles are not getting posted; also requested faster approvals or visible bot progress percentage.
- Root cause found for "approved articles not posted": Publish AI saved approved drafts into `published_articles`, but public Watch Desk pages only read static `data/posts.ts`. Therefore approvals could succeed in admin while no new public article appeared.
- Fix implemented: `lib/db/articles.ts` now exposes published DB articles as Watch Desk-compatible posts, upserts `published_articles` by `article_draft_id`, and marks article drafts as published. `/watch-desk` now reads approved DB-published articles dynamically in addition to static posts. `/watch-desk/[slug]` now falls back to a DB-published article when the slug is not in static `data/posts.ts`. `/api/article-ratings` now accepts DB-published Watch Desk slugs too. Publish AI messaging now says the article is available on the public Watch Desk route.
- Admin UX fix implemented: `components/AdminDashboard.tsx` now shows a Bot progress card with percentage while agent actions, approval updates, article generation, publish, and comment moderation are running. Approval status updates now update local dashboard state immediately instead of always refetching the whole dashboard, making approval feel faster.
- Verification after fixes: `npm run lint`, `npm run typecheck`, `npm run validate:unanswered-files`, and `npm run build` all pass. Build generated `public/sitemap.xml` with 254 URLs and 322 app pages/routes; `/watch-desk` is now dynamic (`ƒ`) so DB-published articles can appear without a static rebuild.
- Local HTTP smoke test on `http://localhost:3001`: `/`, `/watch`, `/watch-desk`, `/watch-desk/what-is-cockroach-janta-party`, `/india-unanswered-files`, `/india-unanswered-files/manipur-violence`, `/watch/manipur-crisis`, `/submit`, `/rss.xml`, `/sitemap.xml`, and `/robots.txt` all returned 200.
- Local admin auth smoke test: `/api/admin/login` returned 200 with the local admin password; authenticated `/api/admin/dashboard` returned 200 in degraded setup mode.
- Current blocker: `npm run db:check` fails with Postgres `28P01`, meaning the configured local `DATABASE_URL` has invalid database credentials. Until fixed in `.env.local` and Vercel, DB-backed AI workflows, publishing, report inserts, comments, ratings, and dashboard data cannot work reliably.
- Current AI config issue: `.env.local` has `AI_PROVIDER` not set and no OpenAI/Gemini key present. With this configuration real AI cannot run; production must set `AI_PROVIDER=openai` or `gemini` plus the matching server-side key. `mock` is local-test only and should not be treated as accurate editorial output.

2026-05-25 "fix all" follow-up:
- User asked "fix all, all means all." Completed all fixable code/config-template issues without inventing secrets.
- Cleaned ignored `vercel.env` back into a valid Vercel production template with only `CHANGE_ME` placeholders, `DATABASE_SSL="true"`, `AI_PROVIDER="openai"`, and no credential-shaped junk. If any previous values in that local file were real, they should be rotated.
- Added `scripts/validate-env.mjs` plus npm scripts: `env:check`, `env:check:vercel`, and `env:check:production`. The checker validates env syntax and required DB/admin/AI settings without printing secret values. `env:check:vercel` allows placeholders for template checking; `env:check:production` is strict.
- Updated README with env-check usage and warnings not to paste real keys into tracked files.
- Added public AI provider status to admin dashboard data and setup-mode dashboard output. Admin Settings now shows AI provider, model, configured state, production-ready state, and a clear message if AI is missing or in mock mode.
- Reduced public Watch Desk DB fallback noise: if DB is unavailable, `/watch-desk` still serves static posts without logging the full Postgres failure on every public page load.
- Verification after follow-up: `npm run lint`, `npm run typecheck`, `npm run build`, `npm run validate:unanswered-files`, and `npm run env:check:vercel` pass. A local smoke test confirmed `/watch-desk`, `/watch-desk/what-is-cockroach-janta-party`, `/admin/login`, `/sitemap.xml`, and `/robots.txt` return 200; local admin login returns 200 and dashboard returns degraded setup mode with `aiProvider=not_configured`.
- Remaining non-code blockers: `npm run db:check` still fails `28P01` because the configured `.env.local` Postgres credentials are invalid; `npm run env:check` still fails because `.env.local` has no valid `AI_PROVIDER`. These require real Supabase and AI provider credentials from the user/Vercel and cannot be fixed in code.

2026-05-25 empty UUID article-click fix:
- User reported clicking an article shows `invalid input syntax for type uuid: ""`.
- Root cause class: optional admin/article/comment IDs could flow into PostgreSQL `uuid` columns as empty strings. Postgres rejects `""` before application code can recover.
- Added `lib/db/ids.ts` with shared UUID normalization/validation. Optional UUID inputs now become `null` unless they are valid UUIDs; required UUID inputs now fail with a clear app error before reaching Postgres.
- Hardened admin/article DB boundaries: approval queue save/update/get/attach, research pack lookup, verification report save/get, article draft save/get, published article save, SEO/social pack save, agent task complete/fail, legacy admin OS approval/comment helpers, and Unanswered Files comment parent/comment-like IDs.
- Verification after fix: `npm run typecheck`, `npm run lint`, `npm run validate:unanswered-files`, `npm run env:check:vercel`, and `npm run build` pass.
- Remaining environment blocker: `npm run db:check` still fails `28P01`, meaning local Postgres credentials are invalid. The code now avoids empty UUID crashes, but production DB-backed actions still need valid Supabase credentials.

2026-05-25 AI publish architecture fix:
- User reported nothing is getting published through AI and requested a proper architecture fix.
- Publish architecture is now DB-first and explicit: the admin approval button is `Approve & Publish`, which first saves approval status, then calls Publish AI in the same user action.
- Publish AI now accepts legacy approved statuses through shared status normalization, refuses non-approved items, and can generate a missing article draft from the approved card's research/verification pack before publishing.
- Public visibility fix: `/watch-desk/[slug]` is now fully dynamic and checks DB-published articles before static seed posts. `/watch-desk` and `/rss.xml` also merge DB-published posts with static posts, with DB-published content taking precedence.
- Published article data fix: article drafts now store AI article payloads in a public-renderable shape, published rows update the draft slug used publicly, and static slug collisions get a draft-id suffix.
- DB hardening: admin schema now adds missing approval columns on existing databases and indexes `published_articles` by slug/published date.
- Verification after fix: `npm run typecheck`, `npm run lint`, `npm run build`, `npm run validate:unanswered-files`, and `npm run env:check:vercel` pass. Build now shows `/watch-desk/[slug]` and `/rss.xml` as dynamic routes.
- Local `npm run db:check` still fails `28P01`; this confirms local `.env.local` DB credentials are invalid, not a code-path failure. Production still requires valid Vercel `DATABASE_URL`/AI env values for DB-backed publish actions.

2026-05-25 powerful CWI AI architecture implementation in progress:
- User requested implementing the recommended five AI upgrades: Source Memory + Knowledge Graph, Verification Engine before writing, real workflow state machine with progress, Trend Radar, and AI Quality Scoring + Self-Correction.
- Added admin DB schema for `cwi_memory_nodes`, `cwi_memory_edges`, `cwi_memory_claims`, `cwi_agent_workflows`, `cwi_agent_workflow_steps`, `cwi_verification_gates`, `cwi_quality_scores`, and `cwi_trend_radar_items`.
- Added backend modules: `lib/ai/source-memory.ts`, `lib/ai/verification-engine.ts`, `lib/ai/workflow-state.ts`, `lib/ai/quality-engine.ts`, and `lib/ai/trend-radar.ts`.
- Wired manual-link/article/publish AI flows through workflow state, verification gates, quality scoring/self-correction, source memory updates, and approval metadata.
- Admin dashboard now exposes Workflows, Source Memory, Trend Radar, and Quality Scores sections, plus Sync Memory and Run Trend Radar actions.
- Verification after implementation: `npm run typecheck`, `npm run lint`, `npm run validate:unanswered-files`, `npm run env:check:vercel`, `npm run build`, and `git diff --check` pass.
- Remaining environment blocker: `npm run db:check` still fails `28P01`, meaning the local `.env.local` Postgres credentials are still rejected. The new AI architecture needs valid Supabase/Vercel `DATABASE_URL` to create/read the new memory, workflow, verification, quality, and radar tables in production.

2026-05-28 audit remediation pass:
- User supplied a full website audit and requested fixing all issues toward a 100/100 score.
- Implemented critical SEO/public-trust fixes in the Next.js App Router codebase:
  - Added `/archive` redirect to `/watch-desk` and `/archive/[slug]` route that returns HTTP 410 plus `X-Robots-Tag: noindex, nofollow` for `cwi-priority-public-interest-update`; DB-published articles with that slug are filtered out in `lib/db/articles.ts`.
  - Removed the public-facing "Mock mode active" phrase from AI mock output defaults so it cannot appear in approved drafts by default.
  - Added article-grade metadata for `/live-newsroom/[slug]`: canonical, OG/Twitter image, article type, published/modified times, keywords, and NewsArticle/Breadcrumb JSON-LD.
  - Added dynamic OG image route at `/live-newsroom/[slug]/opengraph-image`.
  - Added the audited NEET live newsroom slug as a source-backed student advisory in `data/live-newsroom.ts`.
  - Regenerated `public/sitemap.xml` and `public/robots.txt`; sitemap now includes `/support`, `/corrections`, `/live-newsroom`, and live article URLs; robots disallows the removed mock archive slug.
- Added missing public routes/pages:
  - `/support` with UPI copy/deeplink logic using `NEXT_PUBLIC_CWI_UPI_ID`, `NEXT_PUBLIC_CWI_UPI_NAME`, and optional `NEXT_PUBLIC_CWI_UPI_QR_PATH`.
  - `/corrections` with public correction workflow and sample correction format.
  - `/api/contact` and `ContactForm` for structured contact submissions.
- Important blocker: no real UPI ID was provided by the user. Support page is wired and production-safe, but production env must set `NEXT_PUBLIC_CWI_UPI_ID` and ideally `NEXT_PUBLIC_CWI_UPI_QR_PATH` before promotion.
- Expanded trust/content surfaces:
  - About page now lists founder/editor as `PNJ / callmepnj` from repo owner context and explains platform responsibility, independence, and India Unanswered Files.
  - Editorial Policy expanded with verification process, labels, corrections timeline, creator credit/takedown review, satire vs news, privacy, independence, and human approval standards.
  - Today's Brief now includes editor byline.
- Reduced AI/template signals:
  - Removed generated `CWI Watch Desk:` style summary prefix from generated posts.
  - Replaced the repeated boilerplate "Some details remain time-sensitive..." section with topic-specific `unclearParagraphs()` text.
  - Public-facing "Watch Desk" wording was changed to "CWI Archive" in the main public archive pages/components while keeping `/watch-desk` route paths intact.
- UX/navigation/performance changes:
  - Footer now uses grouped navigation instead of 30+ flat links.
  - Navbar includes Support CWI, Corrections is under More, and old `/cockroach-watch-india` plus `/about-cockroach-watch-india` redirect to `/about` in middleware.
  - Archive grid now paginates client-side at 18 articles per page.
  - India Unanswered Files image paths are URL-encoded segment-by-segment to avoid raw spaces in image URLs.
  - Submit and contact forms include a honeypot and server-side rate limiting.
  - `.env.example` was scrubbed to placeholders and now documents support UPI env variables.
- Verification passed after this pass: `npm run seo:generate`, `npm run typecheck`, `npm run lint`, and `npm run build`.
- Build output confirms the NEET live article route is statically generated and its built HTML contains canonical, OG article metadata, Twitter card metadata, article published/modified times, and NewsArticle JSON-LD.

2026-05-28 Live Newsroom redesign in progress:
- Current user request: redesign `/live-newsroom` as the main daily CWI newsroom homepage with exact section order and stronger daily command-center UX.
- User supplied a PDF research file at `C:\Users\praka\Downloads\Do a deep reasearch for my CWI news room news from.pdf`; extractable text covers NEET-UG 2026, CBSE OSM, CJI/CJP context, and source links for 26-28 May 2026.
- Verified official/source trail before edits: NTA NEET public notices, CBSE latest/circular pages, CBSE/Pariksha Sangam post-result links, Tele-MANAS, Indian Express NEET probe report, NDTV CBSE OSM clarification report, and CJI clarification media coverage.
- Implementation approach: replace old repeated Watch Brief/Live Rail/Source-Backed Reports/Claim Tracker/Research Timeline homepage flow, remove placeholder fake sources from public newsroom data, keep CWI warm cream/dark ink/deep green/saffron/brown identity, and keep daily labels data-driven only.

2026-05-28 Live Newsroom redesign progress update:
- Replaced `data/live-newsroom.ts` with approved daily records for NEET/NTA notices, CBSE OSM claims, student official-link advisory, and CJI/CJP quote-card source request. Old placeholder example.com/platform sample sources are no longer exposed through `getPublicLiveNewsroomItems()`.
- Rebuilt `app/live-newsroom/page.tsx` in the requested order with masthead, ticker, Top 3, What Changed Today, Lead Story, tabbed Latest Updates, Verification Desk, Public Advisory Board, India Unanswered Files, Source Ledger, Corrections, Submit CTA, and Archive Preview.
- Added `components/LiveNewsroomFeed.tsx` for the tabbed feed, refreshed Lead Story/Verification/Advisory/Source Ledger/Corrections/Submit components, and updated `/admin/live-newsroom` with daily controls plus approval-only publish guard.

2026-05-28 Live Newsroom redesign complete:
- `/live-newsroom` now follows the requested product order: Daily Newsroom Masthead, Live Ticker, Today's Top 3, What Changed Today, Lead Story, Latest Updates Feed, Verification Desk, Public Advisory Board, India Unanswered Files, Source Ledger, Corrections & Clarifications, Submit CTA, and From the Archive.
- Added `components/LiveNewsroomFeed.tsx` for client-side feed tabs and updated Lead Story, Verification Desk, Public Advisory Board, Source Ledger, Corrections, Submit CTA, and admin newsroom components to the warm CWI newsroom visual system.
- `/admin/live-newsroom` now exposes daily controls for Top 3, Lead Story, What Changed Today, live updates, verification claims, public advisories, India Unanswered File priority, Source Ledger entries, corrections, labels, hide, approval queue, and approval-only publishing guard.
- SEO/build status: `npm run typecheck`, `npm run lint`, and `npm run build` pass. Build regenerated `public/sitemap.xml` with 261 URLs including the new live newsroom slugs. Local smoke checks pass for `/live-newsroom`, the NEET lead detail route, and `/admin/live-newsroom` redirecting to login when unauthenticated.
- Dev server is running at `http://localhost:3000`; review URL is `http://localhost:3000/live-newsroom`.
