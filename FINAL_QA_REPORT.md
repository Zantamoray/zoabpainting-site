# FINAL QA REPORT — Zoab Painting Staging Site

**Date:** 2026-05-07  
**URL:** https://zantamoray.github.io/zoabpainting-site/  
**Repo:** https://github.com/Zantamoray/zoabpainting-site  
**Tester:** Hermes Agent (automated)

---

## 1. CRAWL RESULTS (43 pages)

| Check | Result |
|-------|--------|
| HTTP 200 on all pages | ✅ 43/43 |
| Enhancement script present | ✅ 43/43 (correct relative paths) |
| Page titles present | ✅ 43/43 |
| H1 tags present (rendered DOM) | ✅ All checked pages |
| Console JS errors | ✅ 0 across all tested pages |
| Console warnings | ⚠️ 1 (Mixed Content on mailto pages — fixed by enhancement script) |

### Broken Links
- **Rendered DOM:** 0 broken links. GHL Nuxt runtime correctly converts all internal links.
- **Raw HTML / NUXT JSON:** 6 leading-slash links exist in JSON data (`/privacy-policy`, `/terms--conditions`, etc.) but Nuxt converts these to `.html` at render time. **Not user-facing.**
- **Self-anchor links** (`.html#`): 20 across article pages — standard GHL artifacts, browser treats as same-page. **No impact.**

### Missing Images
- **2 PNGs** in calculator survey forms — also 404 on the live GHL site. GHL-internal assets that never existed as static files.
- **3 MP4s** — original video testimonials replaced by YouTube embeds. **Expected and intentional.**
- **0 broken images in rendered pages** — verified via browser on 15+ pages.

### Pages Fixed This Session
- `painting-services.html` — was a GHL 404 error page. **Now redirects** to `painting-services-central-iowa.html`. 8 pages linked to it.
- `terms--conditions.html` — was a GHL 404 error page. **Now redirects** to `terms-conditions.html`. 40 pages linked to it via footer.
- Enhancement script now **rewrites stale links at runtime** and **strips mailto form actions** to eliminate browser warnings.

---

## 2. CTA BUTTONS & FORMS

### CTA Buttons Tested
| Button | Location | Action | Result |
|--------|----------|--------|--------|
| "Free Estimate" (header) | All pages | Opens modal | ✅ |
| "Free Consultation On-Site Estimate" | index.html hero | Opens modal | ✅ |
| "Join Your Neighbors" | index.html | Opens modal | ✅ |
| "Schedule Your Free Estimate" | Multiple pages | Opens modal | ✅ |
| "GET MY FREE ESTIMATE" | contact-us, location pages | Submits inline form | ✅ |
| "Instant Estimate Calculator" link | index.html | Navigates to calculators.html | ✅ |

### Estimate Modal Form
- **Opens:** ✅ On all CTA button clicks
- **Closes:** ✅ Via Escape key and X button
- **Fields:** First Name (req), Last Name (req), Email (req), Phone (req), Address, Project Details, Consent checkbox (req)
- **Validation:** ✅ Empty submit correctly blocked — 5 required fields caught by browser validation
- **Honeypot:** ✅ Hidden `_honey` field present (display:none)
- **Time gate:** ✅ 3-second minimum before submission allowed
- **FormSubmit.co integration:** ✅ AJAX endpoint configured (`formsubmit.co/ajax/zoabpainting@gmail.com`)
- **Hidden fields:** `_subject`, `_template` (table), `_captcha` (false), `_source` (website-estimate-form), `_timestamp`

### Contact Page Form (contact-us.html, location pages)
- **Fields:** Full Name (req), Phone (req), Email (opt), Project Description (opt)
- **Enhancement:** ✅ Mailto action stripped, honeypot added, FormSubmit.co endpoint wired
- **Validation:** ✅ Required fields enforced

### Submission Flow
- **NOTE:** Actual FormSubmit.co submission NOT tested (would require email verification and would send real emails). Form infrastructure is correctly wired and ready.

---

## 3. MOBILE LAYOUT (375x812 iPhone X viewport)

| Check | Result |
|-------|--------|
| Horizontal scroll | ✅ None on any page (scrollWidth === clientWidth) |
| Text readability | ✅ Body 16px, H1 28px — no zoom needed |
| CTA button tap targets | ✅ All ≥44px height |
| Image scaling | ✅ All fit within viewport |
| Form fields fit viewport | ✅ |

### Issues Found
| Issue | Severity | Detail |
|-------|----------|--------|
| No hamburger menu on mobile | MEDIUM | Desktop nav shown inline — "Articles" link clips past viewport edge (right=397px vs 375px viewport) |
| Nav link tap targets too small | MEDIUM | 22px height vs 44px minimum recommended |
| "Read More" links too small | LOW | 30px height vs 44px minimum |
| Footer nav links too small | LOW | 22px height |

---

## 4. PERFORMANCE

| Metric | Value |
|--------|-------|
| Total site weight | 129 MB (excl .git) |
| Images | 103 MB (80% of total) |
| HTML | 25.6 MB (43 files avg 596KB) |
| Largest file | 5.0 MB (65e0b097...jpeg) |
| index.html | 2.99 MB |
| WebP images | 2 files, 0.25 MB (barely used) |
| Render-blocking scripts | ✅ None — enhancement JS is deferred |
| Google Fonts | ⚠️ 7-9 families with ALL weights loaded |

### Top Issues
1. **18 JPEGs over 2MB each** — no WebP conversion done
2. **No responsive srcsets** — mobile downloads same 5MB images as desktop
3. **Google Fonts bloat** — loading 7+ families with 18 weights each (only 2-3 used)
4. **Hero image uses `loading="lazy"`** — should be `loading="eager"` for LCP

---

## 5. SECURITY

| Check | Result |
|-------|--------|
| Secrets in git history | ✅ Clean — PAT was in remote URL config only, never committed |
| .git web exposure | ✅ Clean — GitHub Pages blocks .git directory |
| API keys in files | ✅ No secret keys — only Stripe publishable key (public by design) |
| .gitignore configured | ✅ Excludes .env, credentials, OS files |

### Form Security
| Protection | Status |
|------------|--------|
| Honeypot field | ✅ Active |
| Time gate (3 sec) | ✅ Active |
| CAPTCHA | ❌ Disabled (`_captcha=false`) |
| Rate limiting | ❌ None (relies on FormSubmit.co defaults) |
| Client-side submission cooldown | ❌ Not implemented |

### Residual Data (Informational)
- Stripe publishable key `pk_live_...` in NUXT JSON data (public-facing, non-exploitable)
- GHL location IDs in NUXT JSON (orphaned, non-functional)
- GTM ID `GTM-WVVZ49VD` in code (public by design)

---

## 6. CONSOLE HEALTH

| Page Type | JS Errors | Warnings |
|-----------|-----------|----------|
| Main pages (index, services, gallery, reviews, etc.) | 0 | 0 |
| Contact/location pages (with forms) | 0 | 0* |
| Article pages | 0 | 0 |
| Calculator pages | 0 | 0 |

*Mixed Content warnings now eliminated by the `fixMailtoFormActions()` function added this session.

---

## 7. NAVIGATION

- ✅ Main nav: Services, About, Gallery, Reviews, Contact Us
- ✅ Service dropdowns: Interior, Exterior, Cabinet, Commercial
- ✅ About dropdowns: Our Story, Articles, FAQs
- ✅ Footer links: Privacy Policy, Terms & Conditions, Sitemap
- ✅ Phone number: Clickable tel: links on all pages
- ✅ External links: BBB, Google Maps verified
- ✅ `terms--conditions.html` → now redirects to `terms-conditions.html`
- ✅ `painting-services.html` → now redirects to `painting-services-central-iowa.html`

---

## 8. VIDEO TESTIMONIALS

| Video | YouTube ID | Thumbnail | Click-to-play |
|-------|-----------|-----------|--------------|
| Fred | PkRjmjQpvQw | ✅ | ✅ |
| Riley | Qqzeet7O02w | ✅ | ✅ |
| Tom | u6Y9jQ5KCf8 | ✅ | ✅ |

---

## CHANGES MADE THIS SESSION

All changes are reversible via `git revert`.

1. **`painting-services.html`** — Replaced 39KB GHL 404 page with 352-byte HTML redirect
2. **`terms--conditions.html`** — Replaced 39KB GHL 404 page with 311-byte HTML redirect
3. **`assets/js/zoab-enhancements.js`** — Added `fixBrokenLinks()` and `fixMailtoFormActions()` functions

Commit: `297633a` on `main` branch, pushed to GitHub.
