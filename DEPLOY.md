# Deployment Guide — Ghana Day in Tampa Bay

This site is a static Astro build deployed to Namecheap shared cPanel hosting via Git Version Control.

## Local Build

```bash
npm install
npm run build
```

The output is in the `dist/` folder. Preview locally with:

```bash
npm run preview
```

## cPanel Git Version Control

1. Log in to your Namecheap cPanel account.
2. Open **Git Version Control** under the Files section.
3. Click **Create** and enter your repository URL (GitHub, GitLab, etc.).
4. Set the repository path (e.g. `/home/username/repositories/gatb-web`).
5. After cloning, cPanel reads `.cpanel.yml` and runs the deployment tasks on each pull.
6. The `.cpanel.yml` file copies `dist/*` into `~/public_html/`.

**Important:** Run `npm run build` as part of your deployment pipeline before cPanel pulls, or add a post-receive hook that runs the build on the server if Node is available in cPanel Terminal. On shared hosting without Node, build locally or in CI and deploy the `dist/` contents via FTP.

## AutoSSL (Free HTTPS)

1. In cPanel, go to **SSL/TLS Status**.
2. Click **Run AutoSSL** to provision a free Let's Encrypt certificate.
3. AutoSSL renews automatically.
4. The `.htaccess` file forces HTTPS and redirects to `www.ghanadaytb.com`.

## Cloudflare CDN (Optional)

1. Create a free Cloudflare account at [cloudflare.com](https://cloudflare.com).
2. Add the domain `ghanadaytb.com`.
3. Update nameservers in Namecheap to Cloudflare's provided nameservers.
4. Add **A records** for `@` and `www` pointing to your cPanel server IP.
5. Enable **Proxied** (orange cloud) for CDN and caching.
6. Set SSL/TLS mode to **Full** once AutoSSL is active on cPanel.

## GitHub Actions deploy (FTP)

For automated deploys from GitHub:

1. Add repository secrets: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`
2. Run the **Deploy to Namecheap (FTP)** workflow from the Actions tab
3. See [LAUNCH.md](./LAUNCH.md) for the full checklist

CI runs on every push via `.github/workflows/ci.yml`.

## Vercel (Preview / Production)

This project is a **static Astro site**. Vercel must serve the built `dist/` folder, not the source files.

### Required project settings

| Setting | Value |
|---|---|
| Framework Preset | **Astro** |
| Build Command | `npm run build` |
| Output Directory | **`dist`** |
| Install Command | `npm install` |
| Node.js Version | **22.x** |

These are also declared in `vercel.json` at the repo root.

### Deploy the correct branch

Production content lives on **`cursor/ghana-day-festival-site`** (or whichever branch you merge to production). In Vercel:

1. **Project → Settings → Git → Production Branch** — set to your active branch
2. After pushing, open **Deployments** and confirm the latest commit hash matches GitHub
3. Use **Redeploy → Clear build cache** if styles still look stale

### Preview URL vs custom domain

- **`.vercel.app` preview** should match `npm run build && npm run preview` locally
- **`ghanadaytb.com`** must be added under **Settings → Domains** and DNS must point to Vercel (or your final host). A misconfigured domain can show an old host, SSL error, or blank page

### If the site looks unstyled on Vercel

Usually the **Output Directory** is wrong (e.g. `.` or `public` instead of `dist`). Without `dist/`, Tailwind CSS is not applied and the hero/layout will look broken compared to localhost.

### Local parity check

```bash
npm run build
npm run preview
```

Open http://localhost:4321 — this is what Vercel should match after a successful deploy.

## Placeholders

Before launch, search the codebase for these placeholders and replace them:

| Placeholder | Description |
|---|---|
| `TIME_PLACEHOLDER` | Event start/end time |
| `CONTACT_EMAIL` | Committee email |
| `CONTACT_PHONE` | Contact phone |
| `VENDOR_FORM_URL` | Tally vendor form URL |
| `SPONSOR_PDF_URL` | Sponsorship packet PDF |
| `MAILERLITE_ENDPOINT` | MailerLite form action URL |
| `DEADLINE_PLACEHOLDER` | Vendor application deadline |
| `$PRICE` | Booth and sponsorship pricing |
