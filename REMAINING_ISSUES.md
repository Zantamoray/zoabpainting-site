# REMAINING ISSUES — Zoab Painting Staging Site

**Date:** 2026-05-07

Issues are classified as: **CRITICAL BLOCKER**, **RECOMMENDED**, or **OPTIONAL POLISH**.

---

## CRITICAL BLOCKERS

**None.** The site is deployable.

---

## RECOMMENDED IMPROVEMENTS

### R1. FormSubmit.co Email Verification (Pre-Deploy)
- **What:** FormSubmit.co requires a one-time email verification before it delivers submissions. The first form submission triggers a verification email to zoabpainting@gmail.com.
- **Impact:** Forms will silently fail until verification is completed.
- **Fix:** Submit one test form on staging, then click the verification link in the email.
- **Effort:** 5 minutes
- **Priority:** HIGH — do this before DNS switch

### R2. Enable CAPTCHA on Forms
- **What:** `_captcha` is set to `false`. No CAPTCHA protection on any form.
- **Impact:** Bots can submit forms freely (honeypot + 3-sec gate provide minimal protection).
- **Fix:** Change `_captcha` value to `true` in `zoab-enhancements.js` (FormSubmit.co will show its built-in CAPTCHA), OR integrate reCAPTCHA/hCaptcha for better UX.
- **Effort:** 5 minutes (FormSubmit CAPTCHA) or 2 hours (reCAPTCHA)
- **Priority:** HIGH

### R3. Image Optimization — Convert to WebP
- **What:** 103 MB of images, mostly JPEG/PNG at original resolution. Only 2 WebP files exist.
- **Impact:** Slow page loads, especially on mobile. First-visit load for index.html could be 10+ MB.
- **Fix:** Batch-convert all JPEG/PNG photos to WebP at quality 80. Update `<source>` tags.
  ```bash
  for f in assets/images/*.jpeg; do cwebp -q 80 "$f" -o "${f%.jpeg}.webp"; done
  ```
- **Effort:** 1-2 hours (scripted conversion + HTML updates)
- **Priority:** MEDIUM — GitHub Pages serves with gzip/brotli which helps, but images dominate

### R4. Google Fonts Optimization
- **What:** Loading 7-9 font families with ALL 18 weights. Only 2-3 fonts actually used.
- **Impact:** Unnecessary font downloads (~500KB-1MB overhead per page).
- **Fix:** Edit the font CSS link in each HTML to request only: Lato:400,700 | Montserrat:400,600,700 | Open Sans:400,600. Remove Akronim, Adamina, Alegreya SC, Abril Fatface, Alatsi, and duplicate Roboto.
- **Effort:** 1-2 hours (batch find-replace across HTML files)
- **Priority:** MEDIUM

### R5. Hero Image Loading Strategy
- **What:** All images use `loading="lazy"`, including the hero/above-the-fold image.
- **Impact:** Delays Largest Contentful Paint (LCP). Hero image waits for scroll observer.
- **Fix:** Add `loading="eager" fetchpriority="high"` to the first visible image per page.
- **Effort:** 30 minutes
- **Priority:** MEDIUM

### R6. Add Client-Side Rate Limiting to Forms
- **What:** No rate limiting. A bot can submit the same form hundreds of times.
- **Impact:** Inbox flooding, potential FormSubmit.co rate limit hits.
- **Fix:** Add sessionStorage-based counter that limits to 3 submissions per session, plus a 30-second cooldown between submissions.
- **Effort:** 30 minutes (JS change in enhancement script)
- **Priority:** MEDIUM

---

## OPTIONAL POLISH

### P1. Mobile Navigation (Hamburger Menu)
- **What:** Desktop horizontal nav is displayed on mobile. "Articles" link clips past viewport edge (right=397px on 375px screen). Nav link tap targets are only 22px tall (minimum 44px recommended).
- **Impact:** Last nav link is partially hidden on narrow screens. Small tap targets cause mis-taps.
- **Fix:** Add CSS media query to collapse nav into hamburger menu on screens <768px, or increase nav link padding.
- **Effort:** 2-4 hours
- **Priority:** LOW — the GHL Nuxt CSS handles this for the original site, but the mobile hamburger button behavior relies on GHL JS that isn't running. The current nav IS functional, just not ideal on very narrow screens.

### P2. Responsive Image Srcsets
- **What:** All `<source>` elements in `<picture>` tags point to the same file for all breakpoints.
- **Impact:** Mobile users download full-resolution images unnecessarily.
- **Fix:** Generate 640px/960px variants and add proper `srcset` with media queries.
- **Effort:** 3-5 hours
- **Priority:** LOW (depends on R3 being done first)

### P3. HTML Minification
- **What:** HTML files average 596KB each (index.html is 2.99MB). Massive inline styles, NUXT JSON data.
- **Impact:** Larger download size (mitigated by gzip compression on GitHub Pages).
- **Fix:** Run HTML minifier to strip comments, collapse whitespace.
- **Effort:** 1 hour
- **Priority:** LOW

### P4. Missing Calculator Survey Images
- **What:** 2 PNG images referenced in calculator-exterior.html and calculator-cabinets.html don't exist. They were GHL-internal survey form images that also 404 on the live site.
- **Impact:** Broken image icons in calculator survey forms (which are already documented as non-functional).
- **Fix:** Download from GHL admin, or remove the image references.
- **Effort:** 15 minutes
- **Priority:** LOW (calculators are non-functional anyway)

### P5. Footer Year Update
- **What:** Footer shows "© 2024 Zoab Painting"
- **Impact:** Looks outdated in 2026.
- **Fix:** Update to 2026 or add dynamic year via JS.
- **Effort:** 5 minutes
- **Priority:** LOW

### P6. "Read More" and Footer Link Tap Targets
- **What:** "Read More" links are 30px tall, footer nav links are 22px tall. Both below 44px minimum.
- **Impact:** Slight mobile usability issue.
- **Fix:** Add padding to increase tap target sizes.
- **Effort:** 30 minutes
- **Priority:** LOW

---

## NOT ISSUES (Clarifications)

| Item | Why It's Not a Problem |
|------|----------------------|
| Stripe `pk_live_` key in HTML | Publishable keys are designed to be client-facing. Cannot charge cards or access data. |
| GHL location IDs in NUXT JSON | Orphaned data from clone. Non-functional, not exploitable. |
| `mailto:` in raw HTML source | Enhancement script strips at runtime. Browser warning eliminated. |
| Leading-slash links in NUXT JSON | Nuxt runtime converts to .html at render time. Never visible to users. |
| Self-anchor links (.html#) | Standard GHL behavior. Browser stays on current page. |
