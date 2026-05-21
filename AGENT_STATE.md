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
- Updated canonical site URL to `https://cwi-ten.vercel.app`.
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
- User uploaded Google Search Console HTML verification file `public/google9c2f6600a0be4f79.html`; file content is only the Google verification token and is safe to commit.
- Live check after push showed `https://cwi-ten.vercel.app/google9c2f6600a0be4f79.html` still returning 404 while GitHub raw served the file, indicating Vercel had not deployed the latest commit yet.
- Current sitemap fix: `app/sitemap.ts` now hardcodes production base URL `https://cwi-ten.vercel.app` and returns explicit static routes plus Watch Desk post routes; `app/robots.ts` hardcodes the production sitemap URL for Google Search Console.
- Verified after sitemap deploy: `https://cwi-ten.vercel.app/sitemap.xml` returns HTTP 200 with `application/xml` and parses as valid XML with 21 URLs; `https://cwi-ten.vercel.app/robots.txt` returns HTTP 200 with `Sitemap: https://cwi-ten.vercel.app/sitemap.xml`.
- Follow-up GSC screenshot review: `/robots.txt` was submitted under Sitemaps, which causes "Unsupported file format" because robots.txt is not XML. Live Googlebot-style checks confirm `/sitemap.xml` is HTTP 200 `application/xml`, parses with 21 URLs, and every sitemap URL returns 200.
- To address persistent GSC "could not be read" caching/format issues, replaced `app/sitemap.ts` with explicit route handler `app/sitemap.xml/route.ts` returning stable XML, fixed `lastmod` values, trailing slash homepage URL, and explicit `Content-Type: application/xml; charset=utf-8`.
- Verified after explicit sitemap route deployment: live `https://cwi-ten.vercel.app/sitemap.xml` returns HTTP 200, `application/xml; charset=utf-8`, homepage loc `https://cwi-ten.vercel.app/`, and stable `<lastmod>2026-05-20</lastmod>` values.
- User reported GSC still shows "couldn't fetch"; switched sitemap and robots to static files in `public/sitemap.xml` and `public/robots.txt`, deleting `app/sitemap.xml/route.ts` and `app/robots.ts` to remove Next metadata route behavior from these endpoints.
- Verified static deployment: live `/sitemap.xml` is HTTP 200, `application/xml; charset=utf-8`, stable XML with 21 URLs; live `/robots.txt` is HTTP 200, `text/plain; charset=utf-8`; every sitemap URL returns HTTP 200 to Googlebot.
- Current newsroom expansion: `data/posts.ts` now generates 58 Watch Desk articles with sections, social packs, tags, author, reading time, metadata, and related slugs. Added Watch Desk search/trending filters, article progress/share/schema layout, RSS route, category/tag archive pages, and static SEO file generator producing `public/sitemap.xml`.
- Current editorial polish pass: improved Watch Desk article seed headlines, summaries, meta descriptions, social copy, disclaimer language, repeated article template phrasing, homepage Watch Desk copy, and newsroom page descriptions without changing routes or UI structure. Verified `npm run lint`, `npm run typecheck`, `npm run build`, sitemap parse, RSS parse, and secret scan excluding `.env.local`.
