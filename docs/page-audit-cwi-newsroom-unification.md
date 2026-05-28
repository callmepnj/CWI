# CWI Newsroom Unification Page Audit

Date: 2026-05-28

This audit was created before route cleanup for the site-wide Live Newsroom UI unification.

| Page URL | Current purpose | Decision | Reason | New destination | SEO risk | Final action |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | Broad CWI landing page | KEEP | Front door should route users to Live Newsroom first. | `/` | Medium | Redesign as newsroom front door. |
| `/live-newsroom` | Daily newsroom product | KEEP | Primary product. | `/live-newsroom` | Low | Keep canonical and preserve current section order. |
| `/live-newsroom/[slug]` | Live newsroom detail | KEEP | Current updates and verification notes. | Same | Low | Use article layout and NewsArticle schema. |
| `/india-unanswered-files` | Public dossier index | KEEP | Secondary product and serious archive vertical. | Same | Low | Apply dossier newsroom UI. |
| `/india-unanswered-files/[slug]` | File detail pages | KEEP | Long-lived public issue files. | Same | Low | Use article/file layout. |
| `/unanswered-files` | Legacy alias | REDIRECT | Duplicate of canonical Unanswered Files. | `/india-unanswered-files` | Low | 308 redirect. |
| `/unanswered-files/[slug]` | Legacy file alias | REDIRECT | Duplicate detail route. | `/india-unanswered-files/[slug]` | Low | 308 redirect. |
| `/indias-unanswered-files` | Legacy alias | REDIRECT | Duplicate of canonical Unanswered Files. | `/india-unanswered-files` | Low | 308 redirect. |
| `/indias-unanswered-files/[slug]` | Legacy file alias | REDIRECT | Duplicate detail route. | `/india-unanswered-files/[slug]` | Low | 308 redirect. |
| `/archive` | Currently redirects to Watch Desk | KEEP | Archive must become canonical for older explainers. | `/archive` | Medium | Replace redirect with Archive page. |
| `/archive/[slug]` | Currently redirects to Watch Desk slug | KEEP | Canonical old explainer detail route. | `/archive/[slug]` | Medium | Replace redirect with archive article page; keep 410 for removed draft slug. |
| `/watch-desk` | Old article index | REDIRECT | Competes with Archive and old naming. | `/archive` | Medium | 308 redirect. |
| `/watch-desk/[slug]` | Old article detail route | REDIRECT | Preserve SEO while moving canonical. | `/archive/[slug]` | Medium | 308 redirect. |
| `/watch-desk/category/[category]` | Old taxonomy route | REDIRECT | Taxonomy is secondary and cluttered. | `/archive` | Low | 308 redirect. |
| `/watch-desk/tag/[tag]` | Old tag route | REDIRECT | Tag pages are low-value duplicates. | `/archive` | Low | 308 redirect. |
| `/submit` | Public intake | KEEP | Core source/correction workflow. | Same | Low | Apply CWI form UI and tracking ID. |
| `/support` | Reader support | KEEP | Core support product. | Same | Low | Apply newsroom support UI and use QR file if present. |
| `/about` | About platform | KEEP | Trust page. | Same | Low | Simplify and align with newsroom UI. |
| `/what-is-cwi` | Duplicate guide | REDIRECT | Belongs inside About. | `/about` | Low | 308 redirect. |
| `/editorial-policy` | Editorial trust page | KEEP | Required for credibility. | Same | Low | Apply ledger/card style. |
| `/corrections` | Correction log | KEEP | Trust and correction path. | Same | Low | Keep visible and do not fake corrections. |
| `/contact` | Contact route | KEEP | Trust and support route. | Same | Low | Simplify cards and contact form. |
| `/credit-policy` | Creator/source credit | KEEP | Secondary trust/legal page. | Same | Low | Keep footer-only. |
| `/privacy-policy` | Legal page | KEEP | Required legal page. | Same | Low | Keep footer-only with CWI UI. |
| `/terms` | Legal page | KEEP | Required legal page. | Same | Low | Keep footer-only with CWI UI. |
| `/charter` | Old campaign/manifesto page | REDIRECT | Content belongs in editorial trust/charter principles. | `/editorial-policy#charter` | Low | 308 redirect. |
| `/issues` | Old public issue index | REDIRECT | Public issue intake belongs in source/correction form. | `/submit#what-to-submit` | Low | 308 redirect. |
| `/join` | Old participation page | REDIRECT | Contribution now happens through reviewed submit flow. | `/submit#how-to-contribute` | Low | 308 redirect. |
| `/five-point-agenda` | Old agenda explainer | REDIRECT | Archive context, not a main product. | `/archive/cjp-five-point-agenda-explained-with-context` | Low | 308 redirect. |
| `/youth-voice` | Old youth page | REDIRECT | Youth/public tips belong in reviewed submit flow. | `/submit#youth-voice` | Low | 308 redirect. |
| `/media-bank` | Old asset/archive page | REDIRECT | Credit and asset rules belong in trust policy. | `/credit-policy` | Low | 308 redirect. |
| `/watch` | Old watch hub | REDIRECT | Old hub competes with simplified Archive route. | `/archive` | Low | 308 redirect. |
| `/watch/manipur-crisis` | Standalone Manipur investigation | REDIRECT | Duplicate with Manipur Unanswered File. | `/india-unanswered-files/manipur-violence` | Medium | 308 redirect to canonical file. |
| `/latest-cwi-updates` and `/latest` | Legacy latest aliases | REDIRECT | Duplicate of Live Newsroom if linked externally. | `/live-newsroom` | Low | 308 redirect. |
| `/cockroach-watch-india-guide` | Not currently implemented | REDIRECT | Guide belongs in About. | `/about` | Low | 308 redirect if requested. |
| `/cockroach-watch-india` | Legacy about alias | REDIRECT | Duplicate. | `/about` | Low | 308 redirect. |
| `/about-cockroach-watch-india` | Legacy about alias | REDIRECT | Duplicate. | `/about` | Low | 308 redirect. |
| `/admin` and `/admin/*` | Private admin | NOINDEX | Protected private UI. | Same | None | Keep protected and exclude from sitemap. |
| `/api/*` | API routes | NOINDEX | Backend endpoints. | Same | None | Keep excluded from sitemap. |
