# Zoab Painting - Production Cutover Plan

## Prerequisites (Must Complete Before DNS Switch)
- [ ] All staging checklist items pass
- [ ] FormSubmit.co email verified and receiving test leads
- [ ] Patrick has manually reviewed the staging site on desktop and mobile
- [ ] Phone number 515-414-8441 is working (either on GHL or ported to Twilio)
- [ ] Backup: Screenshot current GHL site for reference

## DNS Cutover Steps

### Step 1: Add CNAME file to repo
Create file `CNAME` in repo root with content:
```
zoabpainting.com
```

### Step 2: Configure GitHub Pages Custom Domain
- Go to https://github.com/Zantamoray/zoabpainting-site/settings/pages
- Under "Custom domain", enter: zoabpainting.com
- Check "Enforce HTTPS"

### Step 3: Update GoDaddy DNS
Login: wepainthouses1968@gmail.com (password in credential vault)
URL: https://dcc.godaddy.com/control/portfolio/zoabpainting.com/settings

Remove existing A record (162.159.140.156 - Cloudflare/GHL)

Add these GitHub Pages A records:
```
Type: A    Name: @    Value: 185.199.108.153
Type: A    Name: @    Value: 185.199.109.153
Type: A    Name: @    Value: 185.199.110.153
Type: A    Name: @    Value: 185.199.111.153
```

Add CNAME for www:
```
Type: CNAME    Name: www    Value: zantamoray.github.io
```

### Step 4: Wait for DNS Propagation (5-30 min with TTL 600)
- Check: `dig zoabpainting.com +short` should show GitHub IPs
- Check: https://zoabpainting.com should load the new site
- Check: HTTPS certificate should auto-provision (may take up to 1 hour)

### Step 5: Post-Cutover Verification
- [ ] https://zoabpainting.com loads correctly
- [ ] https://www.zoabpainting.com redirects correctly
- [ ] HTTPS works (green lock)
- [ ] All forms submit correctly on production domain
- [ ] Phone number is clickable
- [ ] Google Search Console: verify ownership of new site
- [ ] Test from mobile device on cellular (not WiFi, to avoid DNS cache)

## Rollback Plan
If something goes wrong, revert GoDaddy DNS to:
```
Type: A    Name: @    Value: 162.159.140.156    TTL: 600
```
Site will be back on GHL within 10 minutes.

## Post-Cutover Tasks (Do Within 1 Week)
- [ ] Update Google Business Profile website URL if needed
- [ ] Verify Google Analytics/GTM is working (may need to re-add GTM script)
- [ ] Set up proper form backend (connect to Zoab CRM on port 5005)
- [ ] Port 515-414-8441 to Twilio (requires marketing guy's account # + PIN)
- [ ] Update sitemap submission in Google Search Console
- [ ] Monitor form submissions for 48 hours to ensure leads are captured

## Important Notes
- DNS switch does NOT affect email (zoabpainting@gmail.com)
- The GHL site will stop working once DNS is switched (that's expected)
- GoDaddy domain expires July 2027 - no rush
- Keep the GHL marketing guy informed (he may notice his site stops resolving)
