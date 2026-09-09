# Ghana Day in Tampa Bay — Launch Checklist

Use this after the site is built (Part 1) and before pointing **www.ghanadaytb.com** at production.

## 1. Fill launch values

Edit `src/constants.ts` and schedule markdown files:

| Field | File | Status |
|---|---|---|
| Event time | `src/constants.ts` → `EVENT_TIME` | Set to **9:00 AM** |
| Contact email | `CONTACT_EMAIL` | Needed |
| Vendor form (Tally) | `VENDOR_FORM_URL` | Needed |
| Sponsor PDF | `SPONSOR_PDF_URL` | Needed |
| MailerLite form URL | `MAILERLITE_ENDPOINT` | Needed |
| Vendor deadline | `DEADLINE_PLACEHOLDER` | Needed |
| Booth/sponsor prices | `Vendors.astro`, `Sponsors.astro` | Replace `$PRICE` |
| Schedule times | `src/content/schedule/*.md` | Replace `TIME_PLACEHOLDER` |

Verify nothing is left:

```bash
npm run check:placeholders
```

## 2. Local QA

```bash
npm run prelaunch   # checks placeholders + builds
npm run preview     # test production build at localhost:4321
```

Manual checks:

- [ ] Hero shows correct date, time, and location
- [ ] Google Maps loads at Rowlett Park
- [ ] Mobile menu opens/closes (375px width)
- [ ] Newsletter signup (once MailerLite is wired)
- [ ] Vendor and sponsor CTAs open real links
- [ ] No horizontal scroll on phone

## 3. Deploy to Namecheap

Choose **one** method:

### Option A — GitHub Actions + FTP (recommended)

1. In GitHub → **Settings → Secrets and variables → Actions**, add:
   - `FTP_SERVER` — your cPanel FTP host (e.g. `ftp.ghanadaytb.com`)
   - `FTP_USERNAME` — cPanel username
   - `FTP_PASSWORD` — cPanel/FTP password
2. Go to **Actions → Deploy to Namecheap (FTP) → Run workflow**
3. Confirm the site at https://www.ghanadaytb.com

### Option B — cPanel Git + local build

See [DEPLOY.md](./DEPLOY.md). Build locally, ensure `dist/` is on the server, then pull in cPanel Git Version Control.

### Option C — Manual FTP

1. `npm run build`
2. Upload everything inside `dist/` to `public_html/` via File Manager or FileZilla

## 4. DNS & SSL

1. Point **ghanadaytb.com** nameservers (Namecheap or Cloudflare — see DEPLOY.md)
2. In cPanel → **SSL/TLS Status** → run **AutoSSL**
3. Confirm HTTPS redirect works (`.htaccess` is included in the build)

## 5. Post-launch

- [ ] Share link on Facebook/Instagram — confirm OG preview image looks correct
- [ ] Submit sitemap: `https://www.ghanadaytb.com/sitemap-index.xml`
- [ ] Add confirmed sponsor logos to `src/content/sponsors/` (JSON files)
- [ ] Add past event photos to `src/content/gallery/` as they become available
