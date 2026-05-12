# Zoab Painting — Migration Master Plan
## Created: May 12, 2026

---

## 1. INFRASTRUCTURE OWNERSHIP CHECKLIST

| Asset | Status | Owner | Access | Notes |
|-------|--------|-------|--------|-------|
| **Domain: zoabpainting.com** | OWNED | Patrick | GoDaddy login | Expires Jul 2027. VERIFY: Can you log into GoDaddy and see DNS settings? |
| **DNS** | GHL-CONTROLLED | Marketing guy | GoDaddy panel | Currently points to GHL. Patrick can change this anytime via GoDaddy. |
| **GitHub repo** | OWNED | Patrick (Zantamoray) | Git push works | github.com/Zantamoray/zoabpainting-site |
| **Website source code** | OWNED | Patrick | ~/zoab-website/ | Full clone with all pages, images, CSS, JS |
| **Zoab CRM** | OWNED | Patrick | localhost:5005 | ~/zoab-followup/, systemd service, SQLite DB |
| **CRM Database** | OWNED | Patrick | Local file | ~/zoab-followup/zoab_followup.db, nightly encrypted backups |
| **Twilio account** | OWNED | Patrick | SID: ACfe448... | Phone: +15154146250. A2P campaign in progress. |
| **zoabpainting@gmail.com** | OWNED | Patrick | App password in vault | Email, himalaya configured |
| **Google Business Profile** | VERIFY | Patrick? | zoabpainting@gmail.com? | ACTION NEEDED: Verify you can log in and edit |
| **Google Search Console** | NOT SET UP | — | — | ACTION NEEDED: Set up BEFORE cutover |
| **Google Analytics** | VERIFY | Marketing guy? | — | ACTION NEEDED: Check if GA is on current site, get property ID |
| **Hermes automation** | OWNED | Patrick | ~/.hermes/ | Crons, scripts, gateway |
| **Encrypted backups** | OWNED | Patrick | ~/backups/ | Nightly restic backup, Patrick controls encryption key |
| **Credential vault** | OWNED | Patrick | ~/credential-vault/ | Encrypted Twilio creds, API keys |
| **SSL/HTTPS** | GHL-CONTROLLED | Marketing guy | GHL manages | Will auto-provision on Cloudflare after DNS switch |

### ACTION ITEMS BEFORE CUTOVER:
1. **Verify GoDaddy login** — Can you access DNS settings right now?
2. **Verify Google Business Profile** — Log into business.google.com with zoabpainting@gmail.com
3. **Set up Google Search Console** — Add zoabpainting.com property, verify via DNS TXT record
4. **Check Google Analytics** — Is GA installed on the current GHL site? What property ID?
5. **Get GA access** — If marketing guy set up GA, you need the property transferred to your account

---

## 2. SAFE MIGRATION PLAN

### Phase 1: STAGING (Current — In Progress)
- [x] Clone GHL site to static HTML
- [x] Restore CSS framework and layout
- [x] Fix hero feature boxes
- [x] Wire up forms (FormSubmit.co)
- [x] CRM API endpoint
- [x] Lead sync automation
- [x] CRM systemd service
- [ ] Full page-by-page audit (see SEO checklist)
- [ ] Fix URL structure mismatches (see below)
- [ ] Create redirect files for /post/* → /articles/b/*
- [ ] Create /schedule redirect → contact-us.html
- [ ] Fix canonical URLs (currently relative, should be absolute)
- [ ] Test all internal links
- [ ] Verify all meta tags preserved
- [ ] Set up Google Search Console
- [ ] Baseline current search rankings

### Phase 2: STABILIZE (Before DNS Touch)
- [ ] A2P campaign approved and Twilio SMS live
- [ ] CRM follow-up sequences tested end-to-end
- [ ] All 45+ pages return HTTP 200 on staging
- [ ] All forms tested with real submissions
- [ ] Speed test: staging vs current GHL site
- [ ] Mobile test: all breakpoints
- [ ] Schema markup validated (schema.org validator)
- [ ] sitemap.xml updated with all actual pages
- [ ] robots.txt updated
- [ ] Google Analytics installed (or Cloudflare Analytics as alternative)
- [ ] 404 page created
- [ ] Favicon working
- [ ] All images have alt tags
- [ ] No console errors

### Phase 3: PRE-CUTOVER (1 week before)
- [ ] Deploy to Cloudflare Pages (or Vercel) from GitHub repo
- [ ] Verify site on Cloudflare preview URL
- [ ] Test custom domain on Cloudflare (without switching DNS yet)
- [ ] Prepare DNS changes (write down exact records to change)
- [ ] Notify marketing guy (courtesy, not permission)
- [ ] Take final screenshot/archive of current GHL site
- [ ] Full database backup
- [ ] Document rollback procedure

### Phase 4: DNS CUTOVER (The Switch)
- [ ] Switch DNS at GoDaddy (change A/CNAME records)
- [ ] Verify HTTPS auto-provisions
- [ ] Test zoabpainting.com loads from new host
- [ ] Test all forms submit correctly
- [ ] Test phone links work
- [ ] Submit updated sitemap to Google Search Console
- [ ] Monitor Search Console for crawl errors
- [ ] Monitor site uptime

### Phase 5: POST-CUTOVER (30 days)
- [ ] Keep GHL site alive if possible (marketing guy's call)
- [ ] Monitor search rankings weekly
- [ ] Fix any 404s from Search Console
- [ ] Verify Google Business Profile still links correctly
- [ ] Verify backlinks still resolve
- [ ] Check page speed scores
- [ ] Remove any references to GHL from site code

---

## 3. ROLLBACK / RECOVERY PLAN

### If Something Breaks After DNS Cutover:

**Immediate rollback (< 5 minutes):**
1. Log into GoDaddy
2. Change DNS back to GHL's original records
3. DNS propagates in 5-15 minutes
4. GHL site is back live
5. Our staging site continues working on GitHub Pages

**GHL's original DNS records (SAVE THESE BEFORE CUTOVER):**
- ACTION: Record the current A records, CNAME records, and any TXT records
- These are your rollback coordinates

**If GHL site is also down (marketing guy killed it):**
1. Keep DNS pointed to Cloudflare Pages
2. Our clone serves traffic
3. Forms still work (FormSubmit.co)
4. Fix whatever broke

**If CRM is down:**
- Forms still submit to FormSubmit.co → emails arrive
- Hermes sync will catch up when CRM comes back
- CRM systemd auto-restarts on crash
- Manual fallback: check zoabpainting@gmail.com

**If FormSubmit.co is down:**
- Extremely unlikely (SaaS, multi-region)
- Fallback: forms would fail silently
- Monitoring: we'd know from zero new leads
- Fix: swap to another service (Formspree, Getform) — one URL change in JS

### Data Recovery:
- CRM database: nightly encrypted backups in ~/backups/
- Website: GitHub repo (full history)
- Credentials: ~/credential-vault/ (encrypted)
- Config: backed up in weekly Hermes update cycle

---

## 4. SEO PRESERVATION CHECKLIST

### URL Structure Audit:

**MATCHED (14 core pages) — These are fine:**
- / → index.html ✅
- /painting-services → painting-services.html ✅
- /residential-interior → residential-interior.html ✅
- /residential-exterior → residential-exterior.html ✅
- /cabinet-painting → cabinet-painting.html ✅
- /commercial-painting → commercial-painting.html ✅
- /our-story → our-story.html ✅
- /gallery → gallery.html ✅
- /reviews → reviews.html ✅
- /contact-us → contact-us.html ✅
- /faqs → faqs.html ✅
- /articles → articles.html ✅
- /privacy-policy → privacy-policy.html ✅
- /terms-conditions → terms-conditions.html ✅

**MISSING — Need redirect files:**
- /schedule → NEED: redirect to contact-us.html
- /404-error → NEED: proper 404.html page
- /post/* (blog URLs) → NEED: redirect to /articles/b/*
- /our-articles/* → NEED: redirect to /articles/*

**EXTRA PAGES (not in sitemap, but good to have):**
- 40-off-cabinets.html — promo page
- altoona.html, beaverdale.html, des-moines.html — local SEO pages
- calculators.html, calculator-cabinets.html, calculator-exterior.html
- painting-services-central-iowa.html — alternate services page
- policies.html, sms-policy.html — compliance

### SEO Elements to Verify Per Page:
- [ ] `<title>` tag present and correct
- [ ] `<meta name="description">` present
- [ ] `<meta property="og:title">` present
- [ ] `<meta property="og:description">` present
- [ ] `<meta property="og:image">` present
- [ ] `<link rel="canonical">` pointing to zoabpainting.com (NOT github.io)
- [ ] `<h1>` tag present (one per page)
- [ ] Schema markup (JSON-LD) on homepage at minimum
- [ ] Alt tags on images
- [ ] Internal links use relative paths (not absolute zoabpainting.com)

### Critical SEO Actions:
1. **Fix canonical URLs** — Must point to https://zoabpainting.com/*, not github.io
2. **Update sitemap.xml** — Add missing pages, remove dead URLs (/schedule, /404-error)
3. **Create redirect files** — For /post/* URLs that Google has indexed
4. **Add robots.txt sitemap reference** — Already there ✅
5. **Set up Search Console** — BEFORE cutover, baseline everything
6. **Page speed** — Static site will be faster than GHL (good for SEO)

---

## 5. RECOMMENDED FINAL ARCHITECTURE

```
┌─────────────────────────────────────────────────────┐
│                    PATRICK OWNS                       │
├─────────────────────────────────────────────────────┤
│                                                       │
│  DOMAIN: zoabpainting.com (GoDaddy, expires 2027)    │
│     │                                                 │
│     ▼                                                 │
│  DNS/CDN: Cloudflare (free plan)                     │
│     │  - HTTPS auto                                   │
│     │  - Edge caching worldwide                       │
│     │  - DDoS protection                              │
│     │  - Redirect rules (/post/* → /articles/b/*)    │
│     │  - Page rules                                   │
│     │                                                 │
│     ▼                                                 │
│  FRONTEND: Cloudflare Pages (free, deploys from Git) │
│     │  - Source: GitHub (Zantamoray/zoabpainting-site)│
│     │  - Static HTML/CSS/JS                           │
│     │  - Auto-deploy on git push                      │
│     │  - Preview URLs for staging                     │
│     │                                                 │
│     ▼                                                 │
│  FORMS: FormSubmit.co (free, no account)             │
│     │  - Sends to zoabpainting@gmail.com              │
│     │  - No server dependency                         │
│     │  - Swap to own backend API when ready           │
│     │                                                 │
│     ▼                                                 │
│  LEAD SYNC: Hermes cron (every 15 min)               │
│     │  - Checks email for new form submissions        │
│     │  - Parses and inserts into CRM                  │
│     │  - Telegram notification to Patrick             │
│     │                                                 │
│     ▼                                                 │
│  BACKEND: Zoab CRM (Flask + SQLite)                  │
│     │  - localhost:5005, systemd service              │
│     │  - Lead management, pipeline, jobs, revenue     │
│     │  - Follow-up sequences + Telegram approval      │
│     │  - API: POST /api/leads, GET /api/health        │
│     │                                                 │
│     ▼                                                 │
│  MESSAGING: Twilio (Patrick's account)               │
│     │  - SMS follow-ups (when A2P approved)           │
│     │  - Phone: 515-414-8441 (port to Twilio later)  │
│     │                                                 │
│     ▼                                                 │
│  AUTOMATION: Hermes Agent                            │
│     │  - Cron jobs (lead sync, backups, reminders)    │
│     │  - Telegram gateway                             │
│     │  - Task management                              │
│     │                                                 │
│     ▼                                                 │
│  DATA: All local, all backed up                      │
│     - SQLite DB: ~/zoab-followup/zoab_followup.db    │
│     - Encrypted nightly backups: ~/backups/           │
│     - Credential vault: ~/credential-vault/           │
│     - Git history: full website history               │
│                                                       │
└─────────────────────────────────────────────────────┘

FUTURE EVOLUTION (when scale demands):
  - SQLite → PostgreSQL
  - FormSubmit.co → Own API endpoint (Cloudflare Tunnel or VPS)
  - Static site → Add dynamic features via Cloudflare Workers
  - Calendar booking → Calendly embed or custom
  - Chat widget → Tidio/Crisp (free tier)
  - Analytics → Cloudflare Analytics (free, no JS needed)
```

### Vendor Lock-in Assessment:

| Component | Lock-in Risk | Switch Cost | Alternative |
|-----------|-------------|-------------|-------------|
| GoDaddy (registrar) | LOW | 10 min transfer | Any registrar |
| Cloudflare (CDN/hosting) | LOW | Change DNS, redeploy | Vercel, Netlify, GitHub Pages |
| GitHub (source) | LOW | git remote change | GitLab, self-hosted |
| FormSubmit.co (forms) | LOW | One URL change in JS | Formspree, Getform, own API |
| Twilio (SMS) | MEDIUM | Port number, update creds | Vonage, MessageBird |
| SQLite (database) | LOW | Export/import SQL | Postgres, MySQL |
| Flask (backend) | LOW | Standard Python | FastAPI, Django |
| Hermes (automation) | MEDIUM | Rewrite crons as scripts | Crontab, systemd timers |

**Nothing in this stack creates a single point of failure that you can't replace in a day.**

---

## 6. RISK ANALYSIS

### HIGH RISK (Mitigate Before Cutover):

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| DNS misconfiguration | Site goes down | Medium | Document exact records, test on staging first |
| Missing pages (404s) | SEO damage | High | Full crawl audit + redirect files BEFORE cutover |
| Blog URL mismatch (/post/* vs /articles/b/*) | Lost blog SEO | High | Cloudflare redirect rules handle this |
| Canonical URL errors | Duplicate content penalty | Medium | Audit and fix all canonical tags |
| Marketing guy kills GHL site early | No rollback | Low | We already have full clone |
| FormSubmit.co down | Lost leads | Very Low | Multi-region SaaS, 99.9% uptime |

### MEDIUM RISK (Monitor After Cutover):

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Google re-crawl drops rankings temporarily | Less traffic for 2-4 weeks | Medium | Normal for any migration, recovers |
| Missing Google Analytics data | Gap in metrics | Medium | Set up analytics BEFORE cutover |
| Broken internal links | Poor UX + SEO | Medium | Link audit + JS link-fixer already in place |
| Calculator pages non-functional | Lost tool traffic | High | Rebuild calculators (separate project) |

### LOW RISK (Accept):

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| GHL reviews widget doesn't work | Missing social proof | Certain | Embed Google Reviews directly |
| GHL chat widget gone | No live chat | Certain | Add Tidio/Crisp later if wanted |
| Some GHL-specific styling differences | Minor visual issues | Likely | Iterative CSS fixes |

### TIMELINE RECOMMENDATION:
- **Phase 1 completion**: 1-2 weeks (audit, redirects, canonical fixes)
- **Phase 2 completion**: 2-3 weeks (testing, Search Console, analytics)
- **Phase 3 pre-cutover**: 1 week (Cloudflare setup, final verification)
- **Phase 4 cutover**: Pick a low-traffic time (Sunday night)
- **Phase 5 monitoring**: 30 days post-cutover

**Total: 5-7 weeks from now, not rushed.**

---

## BOTTOM LINE

You own your domain. You own your data. You own your code.
The only thing the marketing guy controls is the DNS pointer and the GHL account.
When you're ready, you change one DNS record and you're free.

But "ready" means: every page loads, every form works, every URL matches,
every meta tag is preserved, Search Console is set up, and you have a
rollback plan if anything goes wrong.

We are NOT there yet. We're maybe 60% through Phase 1.

What's left before Phase 2:
1. URL redirect files for /post/* and /schedule
2. Canonical tag audit and fix
3. Full page crawl (all 45 pages return 200)
4. Internal link audit
5. sitemap.xml update
6. Google Search Console setup
7. Verify GoDaddy access
8. Verify Google Business Profile access
