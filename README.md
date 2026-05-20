# Cockroach Watch India — CWI

Official website codebase for Cockroach Watch India, a founder-led civic watch, satire, and commentary platform documenting youth voice, public issues, creator-led commentary, civic satire, and the Cockroach wave across India.

## Development

```bash
npm install
npm run dev
```

Required server environment variables:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
DATABASE_SSL="true"
```

Do not commit `.env.local`.

## SEO Launch Checklist

- Add the production site to Google Search Console.
- Request indexing for `https://cwi-ten.vercel.app/`.
- Submit `https://cwi-ten.vercel.app/sitemap.xml`.
- Confirm `https://cwi-ten.vercel.app/robots.txt` allows crawling.
- Add the website link to X, Instagram, YouTube, Reddit, Facebook, and other official CWI profiles.
- Use the consistent public name “Cockroach Watch India” and abbreviation “CWI” across all social bios and posts.
- Test social previews with the OpenGraph image before major campaigns.
- Keep page titles, descriptions, and Watch Desk content updated with real civic-watch language.

## License

This project is proprietary. See [LICENSE](./LICENSE).
