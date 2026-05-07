# Zoab Painting - Staging Checklist

## Current Staging URL
https://zantamoray.github.io/zoabpainting-site/

## Pre-Testing Verification
- [ ] All pages load without 404 errors
- [ ] No JavaScript console errors
- [ ] Images load on all pages (especially gallery, services)
- [ ] YouTube testimonials show thumbnails with play buttons
- [ ] Clicking play buttons loads YouTube videos inline

## Form Testing
- [ ] "Free Estimate" button opens estimate popup form
- [ ] "Free Consultation On-Site Estimate" button opens estimate popup form
- [ ] "Join Your Neighbors" button opens estimate popup form
- [ ] Form requires: First Name, Last Name, Email, Phone, Consent checkbox
- [ ] Form validates email format
- [ ] Form validates phone format (min 7 digits)
- [ ] Honeypot field is hidden and not fillable by humans
- [ ] Submit form with test data - verify email arrives at zoabpainting@gmail.com
- [ ] After first submission, confirm FormSubmit.co verification email
- [ ] Contact Us page form submits correctly
- [ ] Des Moines location page form submits correctly

## Navigation
- [ ] All nav links work (Services dropdown, About dropdown, Gallery, Reviews, Contact)
- [ ] Service subpages load: Interior, Exterior, Cabinet, Commercial
- [ ] Calculator pages load (note: calculators are non-functional pending CRM integration)
- [ ] Article/blog pages load
- [ ] Location pages load (Des Moines, Altoona, Beaverdale)
- [ ] BBB links go to correct BBB page
- [ ] Phone number (515-414-8441) is clickable/callable

## Mobile Testing
- [ ] Test on iPhone/Android - layout doesn't break
- [ ] Hamburger menu opens and closes
- [ ] Forms are usable on mobile (fields don't overflow)
- [ ] Phone number tap-to-call works

## Known Limitations (Not Bugs)
- Calculator forms (exterior/cabinet) are non-functional (need CRM integration)
- GTM tracking is not active (trapped in GHL JSON data)
- Review widget removed (was GHL-dependent)
- Video testimonials use YouTube embed (original GHL videos were not portable)

## First-Time FormSubmit.co Setup
1. Submit a test form on the staging site
2. Check zoabpainting@gmail.com for a verification email from FormSubmit.co
3. Click the verification link
4. All subsequent submissions will go through automatically
