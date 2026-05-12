/**
 * Zoab Painting - Site Enhancement Layer
 * 
 * Fixes and enhancements for the static site clone:
 * 1. Video testimonials - replaces broken GHL video components with YouTube embeds
 * 2. Form handling - wires up buttons and forms to FormSubmit.co
 * 3. Popup estimate form - creates a modal form for "Free Estimate" CTAs
 * 4. Spam protection - honeypot fields + time-based validation
 * 5. Lazy loading - initializes data-bg-src background images
 * 
 * No external dependencies. Pure vanilla JS.
 * Config at bottom - easy to swap form endpoint later.
 */

(function() {
  'use strict';

  // ============================================================
  // CONFIGURATION - Change these when swapping backends
  // ============================================================
  var CONFIG = {
    // Primary: Zoab CRM API endpoint (local dashboard)
    // Falls back to FormSubmit.co if CRM is unreachable
    crmEndpoint: 'http://127.0.0.1:5005/api/leads',
    
    // Backup: FormSubmit.co endpoint (email notification)
    formEndpoint: 'https://formsubmit.co/ajax/zoabpainting@gmail.com',
    
    // YouTube video IDs for the 3 testimonials
    videos: {
      'video-1f9FdcMyGh': { id: 'PkRjmjQpvQw', name: 'Fred' },
      'video-Pdzh46ahZm': { id: 'Qqzeet7O02w', name: 'Riley' },
      'video-fg11BpIa4n': { id: 'u6Y9jQ5KCf8', name: 'Tom' }
    },

    // Success message after form submit
    successMessage: "Thanks! We'll reach out as soon as possible to schedule your free estimate. Have a great day!",
    
    // Minimum seconds before form can be submitted (bot protection)
    minSubmitTime: 3
  };

  // ============================================================
  // 1. FIX VIDEO TESTIMONIALS
  // ============================================================
  function fixVideoTestimonials() {
    Object.keys(CONFIG.videos).forEach(function(elementId) {
      var video = CONFIG.videos[elementId];
      var container = document.getElementById(elementId);
      if (!container) return;

      // Find the figure element inside
      var figure = container.querySelector('figure') || container.querySelector('.video-container');
      if (!figure) return;

      // Create a responsive YouTube embed
      var wrapper = document.createElement('div');
      wrapper.style.cssText = 'position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;border-radius:8px;';
      
      // Start with thumbnail + play button (privacy-friendly, loads faster)
      var thumbUrl = 'https://img.youtube.com/vi/' + video.id + '/maxresdefault.jpg';
      wrapper.innerHTML = 
        '<div class="zoab-video-thumb" style="position:absolute;top:0;left:0;width:100%;height:100%;cursor:pointer;background:url(\'' + thumbUrl + '\') center/cover no-repeat;">' +
          '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:68px;height:48px;background:rgba(255,0,0,0.85);border-radius:12px;display:flex;align-items:center;justify-content:center;">' +
            '<div style="width:0;height:0;border-style:solid;border-width:10px 0 10px 20px;border-color:transparent transparent transparent #fff;margin-left:4px;"></div>' +
          '</div>' +
        '</div>';

      // Click handler - replace thumbnail with iframe
      wrapper.querySelector('.zoab-video-thumb').addEventListener('click', function() {
        wrapper.innerHTML = '<iframe src="https://www.youtube.com/embed/' + video.id + '?autoplay=1&rel=0" ' +
          'style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" ' +
          'allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" ' +
          'allowfullscreen loading="lazy" title="' + video.name + ' - Zoab Painting Testimonial"></iframe>';
      });

      // Replace the broken figure
      figure.parentNode.replaceChild(wrapper, figure);
    });
  }

  // ============================================================
  // 2. POPUP ESTIMATE FORM (Modal)
  // ============================================================
  function createEstimateModal() {
    // Check if modal already exists
    if (document.getElementById('zoab-estimate-modal')) return;

    var loadTime = Date.now();

    var modalHTML = 
      '<div id="zoab-estimate-modal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:99999;align-items:center;justify-content:center;">' +
        '<div style="background:#fff;border-radius:12px;max-width:480px;width:90%;max-height:90vh;overflow-y:auto;position:relative;padding:0;box-shadow:0 20px 60px rgba(0,0,0,0.3);">' +
          '<button id="zoab-modal-close" style="position:absolute;top:12px;right:12px;background:none;border:none;font-size:24px;cursor:pointer;color:#666;z-index:2;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background 0.2s;" aria-label="Close">&times;</button>' +
          '<div style="background:linear-gradient(135deg,#3E4A58,#315A9E);color:#fff;padding:28px 32px 20px;border-radius:12px 12px 0 0;">' +
            '<h2 style="margin:0 0 4px;font-family:Montserrat,sans-serif;font-size:22px;font-weight:700;">Book Your Free Estimate</h2>' +
            '<p style="margin:0;font-size:14px;opacity:0.9;">On Site &mdash; On Time &mdash; Always Kind</p>' +
          '</div>' +
          '<form id="zoab-estimate-form" style="padding:24px 32px 28px;">' +
            '<div style="display:none;"><input type="text" name="_honey" tabindex="-1" autocomplete="off"></div>' +
            '<input type="hidden" name="_subject" value="New Estimate Request - Zoab Painting Website">' +
            '<input type="hidden" name="_template" value="table">' +
            '<input type="hidden" name="_captcha" value="false">' +
            '<input type="hidden" name="_source" value="website-estimate-form">' +
            '<input type="hidden" name="_timestamp" value="">' +
            '<div style="margin-bottom:14px;display:flex;gap:12px;">' +
              '<div style="flex:1;"><label style="display:block;font-size:13px;font-weight:600;color:#3E4A58;margin-bottom:4px;">First Name *</label>' +
              '<input type="text" name="first_name" required placeholder="First Name" style="width:100%;padding:10px 12px;border:1px solid #ccc;border-radius:6px;font-size:14px;box-sizing:border-box;transition:border 0.2s;" onfocus="this.style.borderColor=\'#315A9E\'" onblur="this.style.borderColor=\'#ccc\'"></div>' +
              '<div style="flex:1;"><label style="display:block;font-size:13px;font-weight:600;color:#3E4A58;margin-bottom:4px;">Last Name *</label>' +
              '<input type="text" name="last_name" required placeholder="Last Name" style="width:100%;padding:10px 12px;border:1px solid #ccc;border-radius:6px;font-size:14px;box-sizing:border-box;transition:border 0.2s;" onfocus="this.style.borderColor=\'#315A9E\'" onblur="this.style.borderColor=\'#ccc\'"></div>' +
            '</div>' +
            '<div style="margin-bottom:14px;"><label style="display:block;font-size:13px;font-weight:600;color:#3E4A58;margin-bottom:4px;">Email *</label>' +
            '<input type="email" name="email" required placeholder="your@email.com" style="width:100%;padding:10px 12px;border:1px solid #ccc;border-radius:6px;font-size:14px;box-sizing:border-box;transition:border 0.2s;" onfocus="this.style.borderColor=\'#315A9E\'" onblur="this.style.borderColor=\'#ccc\'"></div>' +
            '<div style="margin-bottom:14px;"><label style="display:block;font-size:13px;font-weight:600;color:#3E4A58;margin-bottom:4px;">Phone *</label>' +
            '<input type="tel" name="phone" required placeholder="(515) 555-0123" pattern="[\\d\\s\\-\\(\\)\\+]{7,}" title="Please enter a valid phone number" style="width:100%;padding:10px 12px;border:1px solid #ccc;border-radius:6px;font-size:14px;box-sizing:border-box;transition:border 0.2s;" onfocus="this.style.borderColor=\'#315A9E\'" onblur="this.style.borderColor=\'#ccc\'"></div>' +
            '<div style="margin-bottom:14px;"><label style="display:block;font-size:13px;font-weight:600;color:#3E4A58;margin-bottom:4px;">Address</label>' +
            '<input type="text" name="address" placeholder="Street address, City, State" style="width:100%;padding:10px 12px;border:1px solid #ccc;border-radius:6px;font-size:14px;box-sizing:border-box;transition:border 0.2s;" onfocus="this.style.borderColor=\'#315A9E\'" onblur="this.style.borderColor=\'#ccc\'"></div>' +
            '<div style="margin-bottom:18px;"><label style="display:block;font-size:13px;font-weight:600;color:#3E4A58;margin-bottom:4px;">Project Details</label>' +
            '<textarea name="project_details" rows="3" placeholder="Brief overview of your painting project..." style="width:100%;padding:10px 12px;border:1px solid #ccc;border-radius:6px;font-size:14px;box-sizing:border-box;resize:vertical;transition:border 0.2s;" onfocus="this.style.borderColor=\'#315A9E\'" onblur="this.style.borderColor=\'#ccc\'"></textarea></div>' +
            '<div style="margin-bottom:18px;font-size:12px;color:#666;"><label style="display:flex;align-items:flex-start;gap:8px;cursor:pointer;"><input type="checkbox" name="consent" required style="margin-top:2px;"> I agree to <a href="terms-conditions.html" target="_blank" style="color:#315A9E;">terms & conditions</a>. By providing my phone number or email, I agree to receive messages from the business.</label></div>' +
            '<button type="submit" id="zoab-submit-btn" style="width:100%;padding:14px;background:#dfb614;color:#660000;font-size:16px;font-weight:700;border:none;border-radius:8px;cursor:pointer;font-family:Montserrat,sans-serif;transition:all 0.2s;letter-spacing:0.5px;" onmouseover="this.style.background=\'#c9a412\';this.style.transform=\'translateY(-1px)\'" onmouseout="this.style.background=\'#dfb614\';this.style.transform=\'none\'">Schedule Your Estimate</button>' +
            '<div id="zoab-form-status" style="margin-top:12px;text-align:center;display:none;"></div>' +
          '</form>' +
        '</div>' +
      '</div>';

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    var modal = document.getElementById('zoab-estimate-modal');
    var form = document.getElementById('zoab-estimate-form');

    // Close button
    document.getElementById('zoab-modal-close').addEventListener('click', function() {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    });

    // Click outside to close
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });

    // Escape key to close
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Bot check: honeypot
      var honey = form.querySelector('input[name="_honey"]');
      if (honey && honey.value) return;

      // Bot check: time-based
      var elapsed = (Date.now() - loadTime) / 1000;
      if (elapsed < CONFIG.minSubmitTime) {
        showFormStatus('Please wait a moment before submitting.', 'error');
        return;
      }

      // Set timestamp
      form.querySelector('input[name="_timestamp"]').value = new Date().toISOString();

      var btn = document.getElementById('zoab-submit-btn');
      var originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      btn.style.opacity = '0.7';

      var formData = new FormData(form);

      // Build JSON payload for CRM
      var crmPayload = {
        first_name: formData.get('first_name') || '',
        last_name: formData.get('last_name') || '',
        email: formData.get('email') || '',
        phone: formData.get('phone') || '',
        address: formData.get('address') || '',
        project_details: formData.get('project_details') || '',
        source: 'website'
      };

      // Submit to CRM API (primary) - fire and forget
      // CRM may be unreachable from GitHub Pages (localhost), so don't block on it
      if (CONFIG.crmEndpoint) {
        try {
          fetch(CONFIG.crmEndpoint, {
            method: 'POST',
            body: JSON.stringify(crmPayload),
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            mode: 'cors'
          }).catch(function() { /* CRM unreachable - that's OK, FormSubmit is backup */ });
        } catch(e) { /* ignore */ }
      }

      // Submit to FormSubmit.co (backup/email notification - always works)
      fetch(CONFIG.formEndpoint, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(function(response) {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Submission failed');
      })
      .then(function() {
        form.innerHTML = '<div style="text-align:center;padding:30px 0;">' +
          '<div style="font-size:48px;margin-bottom:12px;">✅</div>' +
          '<h3 style="color:#3E4A58;margin:0 0 8px;font-family:Montserrat,sans-serif;">Thank You!</h3>' +
          '<p style="color:#666;margin:0;">' + CONFIG.successMessage + '</p>' +
          '</div>';
      })
      .catch(function() {
        showFormStatus('Something went wrong. Please call us at 515-414-8441 instead.', 'error');
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.opacity = '1';
      });
    });
  }

  function showFormStatus(message, type) {
    var status = document.getElementById('zoab-form-status');
    if (!status) return;
    status.style.display = 'block';
    status.style.color = type === 'error' ? '#c0392b' : '#27ae60';
    status.style.fontSize = '14px';
    status.textContent = message;
  }

  function openEstimateModal() {
    var modal = document.getElementById('zoab-estimate-modal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      // Focus first input
      var firstInput = modal.querySelector('input[name="first_name"]');
      if (firstInput) setTimeout(function() { firstInput.focus(); }, 100);
    }
  }

  // ============================================================
  // 3. WIRE UP CTA BUTTONS
  // ============================================================
  function wireUpButtons() {
    // Find all "Free Estimate" / "Free Consultation" / estimate buttons
    var allButtons = document.querySelectorAll('button, a.cbutton-DdLIlTJSZp, [class*="cbutton"]');
    allButtons.forEach(function(btn) {
      var text = (btn.textContent || '').toLowerCase().trim();
      // Match estimate/consultation buttons but NOT phone number or calculator links
      if ((text.indexOf('estimate') > -1 || text.indexOf('consultation') > -1 || text.indexOf('free') > -1) &&
          text.indexOf('calculator') === -1 && text.indexOf('515') === -1) {
        // Don't rewire if it's already a link to a real page
        if (btn.tagName === 'A' && btn.href && btn.href.indexOf('calculator') > -1) return;
        
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          openEstimateModal();
        });
        btn.style.cursor = 'pointer';
      }
    });

    // Also wire up the "Join Your Neighbors" CTA
    var allElements = document.querySelectorAll('button, [role="button"]');
    allElements.forEach(function(el) {
      var text = (el.textContent || '').toLowerCase();
      if (text.indexOf('join your neighbors') > -1 || text.indexOf('click for a free') > -1) {
        el.addEventListener('click', function(e) {
          e.preventDefault();
          openEstimateModal();
        });
        el.style.cursor = 'pointer';
      }
    });
  }

  // ============================================================
  // 4. FIX MAILTO FORMS (contact-us, des-moines, etc.)
  // ============================================================
  function fixMailtoForms() {
    var forms = document.querySelectorAll('form[action^="mailto:"]');
    forms.forEach(function(form) {
      form.removeAttribute('action');
      form.setAttribute('method', 'POST');
      
      // Add honeypot
      var honey = document.createElement('div');
      honey.style.display = 'none';
      honey.innerHTML = '<input type="text" name="_honey" tabindex="-1" autocomplete="off">';
      form.insertBefore(honey, form.firstChild);

      // Add hidden fields
      var hiddens = [
        { name: '_subject', value: 'New Contact - Zoab Painting Website' },
        { name: '_template', value: 'table' },
        { name: '_captcha', value: 'false' },
        { name: '_source', value: 'website-contact-form' }
      ];
      hiddens.forEach(function(h) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = h.name;
        input.value = h.value;
        form.appendChild(input);
      });

      var loadTime = Date.now();

      form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Bot checks
        var honeyField = form.querySelector('input[name="_honey"]');
        if (honeyField && honeyField.value) return;
        if ((Date.now() - loadTime) / 1000 < CONFIG.minSubmitTime) return;

        var btn = form.querySelector('button[type="submit"], input[type="submit"]');
        if (btn) {
          var origText = btn.textContent || btn.value;
          if (btn.tagName === 'BUTTON') btn.textContent = 'Sending...';
          else btn.value = 'Sending...';
          btn.disabled = true;
        }

        var formData = new FormData(form);

        fetch(CONFIG.formEndpoint, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        })
        .then(function(response) {
          if (response.ok) {
            form.innerHTML = '<div style="text-align:center;padding:20px;background:#e8f5e9;border-radius:8px;">' +
              '<p style="color:#2e7d32;font-weight:600;margin:0;">✅ ' + CONFIG.successMessage + '</p></div>';
          } else {
            throw new Error('Failed');
          }
        })
        .catch(function() {
          if (btn) {
            if (btn.tagName === 'BUTTON') btn.textContent = origText;
            else btn.value = origText;
            btn.disabled = false;
          }
          alert('Something went wrong. Please call us at 515-414-8441.');
        });
      });
    });
  }

  // ============================================================
  // 5. LAZY LOAD BACKGROUND IMAGES
  // ============================================================
  function initLazyBackgrounds() {
    var elements = document.querySelectorAll('[data-bg-src]');
    elements.forEach(function(el) {
      var src = el.getAttribute('data-bg-src');
      if (src && !el.style.backgroundImage) {
        el.style.backgroundImage = 'url(' + src + ')';
      }
    });
  }

  // ============================================================
  // 6. REMOVE DEAD EXTERNAL SCRIPTS
  // ============================================================
  function cleanupDeadScripts() {
    // Remove GHL reviews widget that no longer works
    var scripts = document.querySelectorAll('script[src*="apisystem.tech"]');
    scripts.forEach(function(s) { s.remove(); });
  }

  // ============================================================
  // FIX BROKEN INTERNAL LINKS
  // ============================================================
  function fixBrokenLinks() {
    // These pages were 404 error pages from GHL clone.
    // Redirect files exist but also fix links so users don't see the redirect flash.
    var linkMap = {
      'painting-services.html': 'painting-services-central-iowa.html',
      'terms--conditions.html': 'terms-conditions.html'
    };
    var links = document.querySelectorAll('a[href]');
    links.forEach(function(a) {
      var href = a.getAttribute('href');
      Object.keys(linkMap).forEach(function(bad) {
        if (href === bad || href.endsWith('/' + bad)) {
          a.setAttribute('href', linkMap[bad]);
        }
      });
    });
  }

  // ============================================================
  // FIX GHL ANIMATIONS (trigger elements with data-animation-class)
  // ============================================================
  function fixAnimations() {
    // GHL uses data-animation-class to store animation classes
    // and sets opacity:0 inline. Nuxt hydration JS would trigger these
    // on scroll via IntersectionObserver. We trigger them on load/scroll.
    var animated = document.querySelectorAll('[data-animation-class]');
    if (!animated.length) return;

    function triggerAnimation(el) {
      var animClass = el.getAttribute('data-animation-class');
      if (animClass && (el.style.opacity === '0' || el.style.opacity === '')) {
        animClass.split(' ').forEach(function(cls) {
          if (cls) el.classList.add(cls);
        });
        el.style.opacity = '1';
      }
    }

    // Use IntersectionObserver for scroll-triggered animations
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            triggerAnimation(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '50px' });

      animated.forEach(function(el) { observer.observe(el); });
    }

    // Also trigger immediately for any elements already visible
    // (handles elements above the fold and desktop-only elements)
    setTimeout(function() {
      animated.forEach(function(el) {
        if (el.style.opacity === '0') {
          triggerAnimation(el);
        }
      });
    }, 500);
  }

  // ============================================================
  // FIX MAILTO FORM ACTIONS (remove from HTML to prevent browser warning)
  // ============================================================
  function fixMailtoFormActions() {
    var forms = document.querySelectorAll('form[action^="mailto:"]');
    forms.forEach(function(form) {
      form.removeAttribute('action');
    });
  }

  // ============================================================
  // INITIALIZE
  // ============================================================
  function init() {
    fixVideoTestimonials();
    createEstimateModal();
    wireUpButtons();
    fixMailtoForms();
    fixBrokenLinks();
    fixMailtoFormActions();
    initLazyBackgrounds();
    cleanupDeadScripts();
    fixAnimations();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
