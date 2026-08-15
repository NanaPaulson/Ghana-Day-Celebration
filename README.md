# Ghana Day in Tampa Bay — Website

Static marketing site for **Ghana Day in Tampa Bay 2026**, built with [Astro](https://astro.build), TypeScript, and Tailwind CSS.

**Production URL:** https://www.ghanadaytb.com

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:4321

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npm run check:placeholders` | List values still needed before launch |
| `npm run prelaunch` | Placeholder check + build |

## Project structure

```text
src/
  components/     UI sections (Hero, Schedule, Vendors, etc.)
  content/        Editable markdown/JSON (schedule, FAQ, gallery)
  constants.ts    Event details and launch configuration
  layouts/        BaseLayout with SEO and JSON-LD
  pages/          index.astro, 404.astro
public/           Static assets, .htaccess, robots.txt
scripts/          Launch helper scripts
.github/workflows/  CI and FTP deploy
```

## Editing content

- **Schedule** — copy a file in `src/content/schedule/` and edit frontmatter
- **FAQ** — same pattern in `src/content/faq/`
- **Gallery** — add images to `public/images/gallery/` and JSON in `src/content/gallery/`
- **Sponsors** — add JSON files in `src/content/sponsors/`

## Launch & deploy

- **[LAUNCH.md](./LAUNCH.md)** — pre-launch checklist
- **[DEPLOY.md](./DEPLOY.md)** — Namecheap cPanel, SSL, Cloudflare

## Tech

- Astro 7 (static output)
- Tailwind CSS 4
- Sharp image optimization
- `@astrojs/sitemap`
