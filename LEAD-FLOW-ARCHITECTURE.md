# Zoab Painting Website - Lead Flow Architecture
## Last Updated: May 12, 2026

## Lead Flow (How Estimate Requests Work)

```
Visitor on zoabpainting.com (or GitHub Pages staging)
    │
    ├─ Clicks "Free Estimate" / "Free Consultation" / "Schedule Your Estimate"
    │
    ▼
Popup Form Opens (zoab-enhancements.js)
    │ Fields: First Name, Last Name, Email, Phone, Address, Project Details
    │
    ├─ On Submit:
    │   ├─ 1. POST to FormSubmit.co ──> Email to zoabpainting@gmail.com (always works)
    │   └─ 2. POST to CRM API (localhost:5005/api/leads) ──> Only works if DNS is pointed
    │
    ▼
Hermes Cron "zoab-website-lead-sync" (every 15 min)
    │ Script: ~/.hermes/scripts/sync_website_leads.py
    │ Checks zoabpainting@gmail.com for FormSubmit notification emails
    │ Parses lead data, POSTs to CRM API
    │
    ▼
Zoab CRM Dashboard (localhost:5005)
    │ Lead appears in /leads with stage='new', source='website'
    │ Activity logged: 'website_lead'
    │
    ├─ Follow-up engine triggers automated sequences
    ├─ Telegram approval workflow (Patrick reviews before sending)
    └─ Patrick can manage lead through pipeline stages
```

## Architecture Components

### 1. Website (GitHub Pages)
- Repo: ~/zoab-website/ (github.com/Zantamoray/zoabpainting-site)
- Static HTML + CSS + JS
- Enhancement JS: assets/js/zoab-enhancements.js
  - Creates popup estimate form
  - Wires all CTA buttons
  - Dual-submits: FormSubmit.co (reliable) + CRM API (local)
  - Handles video testimonials, animations, lazy loading

### 2. FormSubmit.co (Email Gateway)
- Endpoint: https://formsubmit.co/ajax/zoabpainting@gmail.com
- No registration/API keys needed
- Sends formatted email with lead data to zoabpainting@gmail.com
- Works from any domain (GitHub Pages, custom domain, etc.)

### 3. Zoab CRM (Local Dashboard)
- Location: ~/zoab-followup/
- Framework: Flask + SQLite
- Port: 5005 (localhost only)
- API Endpoints:
  - POST /api/leads - Accept JSON lead submissions
  - GET /api/health - Health check
- Web UI: http://127.0.0.1:5005/
  - /leads - Lead list
  - /pipeline - Kanban pipeline
  - /add - Manual lead entry

### 4. Lead Sync Cron
- Job: zoab-website-lead-sync (ID: 9412bedf4260)
- Schedule: Every 15 minutes
- Script: ~/.hermes/scripts/sync_website_leads.py
- Uses himalaya CLI to check zoabpainting@gmail.com
- Parses FormSubmit emails, creates CRM leads
- Silent when no new leads (no Telegram spam)
- Notifies Patrick via Telegram when new leads arrive

## Files Modified/Created

### Website (~/zoab-website/)
- assets/css/ghl-entry.css - GHL framework CSS (32KB)
- assets/css/ghl-page-styles.css - Page layout CSS variables
- assets/css/ghl-overrides.css - Override CSS for static site
- assets/css/ghl-section-styles.css - Section-specific styles
- assets/js/zoab-enhancements.js - Enhancement JS (form, videos, animations)
- All 45 .html files - CSS links added

### CRM (~/zoab-followup/)
- web.py - Added /api/leads and /api/health endpoints, CORS headers
- sync_website_leads.py - Email-to-CRM sync script

### Hermes
- ~/.hermes/scripts/sync_website_leads.py - Cron script copy

## What's Still on GHL
- The LIVE zoabpainting.com domain still points to GHL (marketing guy manages)
- GHL handles forms, calendar, CRM on the live domain
- Our GitHub Pages site is the staging/backup clone
- When ready for DNS cutover, switch to our system

## Calendar Booking
- NOT implemented (the original GHL site also doesn't have calendar booking)
- The "Schedule Your Estimate" button is a lead capture form, not a calendar
- Patrick schedules estimates manually after reviewing leads in the CRM
- If calendar booking is wanted later, can add via Calendly embed or custom

## Environment Dependencies
- Flask (installed in ~/.hermes/hermes-agent/venv/)
- himalaya CLI (email client, installed at ~/.local/bin/)
- zoabpainting@gmail.com app password (configured in himalaya)
- No API keys needed for FormSubmit.co
- CRM runs on localhost:5005 only (not exposed to internet)
