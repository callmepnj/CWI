# Cockroach Watch India - CWI

Official website codebase for Cockroach Watch India, a founder-led civic watch, satire, and commentary platform documenting youth voice, public issues, creator-led commentary, civic satire, and the Cockroach wave across India.

Production domain:

```text
https://www.cockroachwatchindia.online
```

## Development

```bash
npm install
npm run dev
```

Required server environment variables:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
DATABASE_SSL="true"
CWI_ADMIN_PASSWORD="change-this-long-admin-password"
AI_PROVIDER="mock"
AI_MODEL=""
OPENAI_API_KEY=""
GEMINI_API_KEY=""
```

Do not commit `.env.local`.

## CWI AI OS Admin

- Set `CWI_ADMIN_PASSWORD` in Vercel before opening `/admin`; use at least 12 characters.
- The admin system uses the existing PostgreSQL/Supabase `DATABASE_URL`.
- Agents prepare research packs, drafts, SEO packs, social packs, image notes, UI/UX audits, and approval cards.
- Nothing publishes automatically. Approval queue actions are required before any public update.
- Set `AI_PROVIDER` to `openai` or `gemini` in production and add the matching server-side API key. `mock` is only for labelled local testing and must not be treated as real editorial output.
- If an AI provider key is missing, the dashboard returns a visible configuration error instead of silently generating fake output.
- The low-cost operating target is INR 8,000/month with a daily target around INR 250. The system uses manual links, RSS/source lists, templates, caching, and approval-first workflows instead of paid social APIs or expensive crawlers.

## SEO Launch Checklist

- Add the production site to Google Search Console.
- Submit `https://www.cockroachwatchindia.online/sitemap.xml`.
- Confirm `https://www.cockroachwatchindia.online/robots.txt` allows crawling.
- After deploy, submit `https://www.cockroachwatchindia.online/sitemap.xml` in Google Search Console.
- Use URL Inspection for `https://www.cockroachwatchindia.online/`.
- Use URL Inspection for `https://www.cockroachwatchindia.online/watch-desk`.
- Use URL Inspection for `https://www.cockroachwatchindia.online/india-unanswered-files`.
- Use URL Inspection for `https://www.cockroachwatchindia.online/watch`.
- Use URL Inspection for `https://www.cockroachwatchindia.online/submit`.
- Add the website link to X, Instagram, YouTube, Reddit, Facebook, and other official CWI profiles.
- Use the consistent public name "Cockroach Watch India" and abbreviation "CWI" across all social bios and posts.
- Test social previews with the OpenGraph image before major campaigns.
- Keep page titles, descriptions, and Watch Desk content updated with real civic-watch language.
- Publish fresh Watch Desk posts regularly with original context, source labels, and internal links to Submit, Issues, Charter, and About.
- Build real backlinks by linking the site from every official social profile, YouTube descriptions, creator credits, press notes, and community posts.
- Use the exact brand phrase `Cockroach Watch India` in public bios, captions, and video descriptions so Google connects off-site mentions to the website.
- In Google Search Console, inspect the homepage and key pages after each deployment, then request indexing when major content changes are published.

## License

This project is proprietary. See [LICENSE](./LICENSE).
