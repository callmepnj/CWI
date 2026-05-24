# Agent State

Last updated: 2026-05-20

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
- Updated canonical site URL to `https://cockroachwatchindia.online`.
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
- Live check after push showed `https://cockroachwatchindia.online/google9c2f6600a0be4f79.html` still returning 404 while GitHub raw served the file, indicating Vercel had not deployed the latest commit yet.
- Current sitemap fix: `app/sitemap.ts` now hardcodes production base URL `https://cockroachwatchindia.online` and returns explicit static routes plus Watch Desk post routes; `app/robots.ts` hardcodes the production sitemap URL for Google Search Console.
- Verified after sitemap deploy: `https://cockroachwatchindia.online/sitemap.xml` returns HTTP 200 with `application/xml` and parses as valid XML with 21 URLs; `https://cockroachwatchindia.online/robots.txt` returns HTTP 200 with `Sitemap: https://cockroachwatchindia.online/sitemap.xml`.
- Follow-up GSC screenshot review: `/robots.txt` was submitted under Sitemaps, which causes "Unsupported file format" because robots.txt is not XML. Live Googlebot-style checks confirm `/sitemap.xml` is HTTP 200 `application/xml`, parses with 21 URLs, and every sitemap URL returns 200.
- To address persistent GSC "could not be read" caching/format issues, replaced `app/sitemap.ts` with explicit route handler `app/sitemap.xml/route.ts` returning stable XML, fixed `lastmod` values, trailing slash homepage URL, and explicit `Content-Type: application/xml; charset=utf-8`.
- Verified after explicit sitemap route deployment: live `https://cockroachwatchindia.online/sitemap.xml` returns HTTP 200, `application/xml; charset=utf-8`, homepage loc `https://cockroachwatchindia.online/`, and stable `<lastmod>2026-05-20</lastmod>` values.
- User reported GSC still shows "couldn't fetch"; switched sitemap and robots to static files in `public/sitemap.xml` and `public/robots.txt`, deleting `app/sitemap.xml/route.ts` and `app/robots.ts` to remove Next metadata route behavior from these endpoints.
- Verified static deployment: live `/sitemap.xml` is HTTP 200, `application/xml; charset=utf-8`, stable XML with 21 URLs; live `/robots.txt` is HTTP 200, `text/plain; charset=utf-8`; every sitemap URL returns HTTP 200 to Googlebot.
- Current newsroom expansion: `data/posts.ts` now generates 58 Watch Desk articles with sections, social packs, tags, author, reading time, metadata, and related slugs. Added Watch Desk search/trending filters, article progress/share/schema layout, RSS route, category/tag archive pages, and static SEO file generator producing `public/sitemap.xml`.
- Current editorial polish pass: improved Watch Desk article seed headlines, summaries, meta descriptions, social copy, disclaimer language, repeated article template phrasing, homepage Watch Desk copy, and newsroom page descriptions without changing routes or UI structure. Verified `npm run lint`, `npm run typecheck`, `npm run build`, sitemap parse, RSS parse, and secret scan excluding `.env.local`.
- Current source-backed newsroom pass: updated canonical site URL to `https://cockroachwatchindia.online`, added source metadata to Watch Desk articles, added 20 additional source-focused articles, rendered visible "Sources & Further Reading" sections, added citation URLs to NewsArticle/BlogPosting schema, expanded verification filters, added moderated article comments via `POST/GET /api/comments`, added comment UI/policy text, and regenerated static sitemap/robots for the new domain.
- 2026-05-22 Submit Report polish: scoped copy/UI pass on `/submit` and `components/SubmitForm.tsx` removed developer-facing upload/backend wording, added professional civic intake sections, aligned validation/error/success language, updated submission type options, and kept backend details hidden from users.
- 2026-05-22 official domain pass: confirmed production SEO helpers use `https://cockroachwatchindia.online`, cleaned remaining old-domain documentation references, made OpenGraph image URLs absolute to the official domain, and added `middleware.ts` to permanently redirect the legacy Vercel host to the official domain.
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
