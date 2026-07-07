/**
 * MAP - Migration Assurance Platform
 * Main JavaScript File
 * Version: 1.0
 */

(function() {
  'use strict';

  // ============================================================
  // 1. DOM Ready Handler
  // ============================================================
  document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initModals();
    initFAQAccordion();
    initScrollFade();
    initSmoothScroll();
    initNavigation();
    initBackToTop();
    initLazyLoading();
    initCookieConsent();
    initCapabilityMatrix();
    initTimelineAnimation();
    initCountUp();
  });

  // ============================================================
  // 2. Mobile Menu Toggle
  // ============================================================
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu-link');

    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ============================================================
  // 3. Modal Functions
  // ============================================================
  function initModals() {
    document.querySelectorAll('[data-modal]').forEach(function(trigger) {
      trigger.addEventListener('click', function(e) {
        e.preventDefault();
        var modalId = this.getAttribute('data-modal');
        openModal(modalId);
      });
    });

    document.querySelectorAll('.modal-close').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var modal = this.closest('.modal');
        if (modal) {
          closeModal(modal.id);
        }
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
      overlay.addEventListener('click', function() {
        var modal = this.closest('.modal');
        if (modal) {
          closeModal(modal.id);
        }
      });
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        var activeModal = document.querySelector('.modal.active');
        if (activeModal) {
          closeModal(activeModal.id);
        }
      }
    });
  }

  function openModal(modalId) {
    var modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    var firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
      firstFocusable.focus();
    }

    modal.dispatchEvent(new CustomEvent('modal:open', { detail: { id: modalId } }));
  }

  function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';

    modal.dispatchEvent(new CustomEvent('modal:close', { detail: { id: modalId } }));
  }

  // Expose to global scope for inline handlers
  window.openModal = openModal;
  window.closeModal = closeModal;

  // ============================================================
  // 4. FAQ Accordion Toggle
  // ============================================================
  function initFAQAccordion() {
    document.querySelectorAll('.faq-question').forEach(function(question) {
      question.addEventListener('click', function() {
        toggleFAQ(this);
      });

      question.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleFAQ(this);
        }
      });
    });
  }

  function toggleFAQ(questionElement) {
    var faqItem = questionElement.closest('.faq-item');
    if (!faqItem) return;

    var answer = faqItem.querySelector('.faq-answer');
    var isActive = faqItem.classList.contains('active');

    document.querySelectorAll('.faq-item.active').forEach(function(item) {
      if (item !== faqItem) {
        item.classList.remove('active');
        var itemAnswer = item.querySelector('.faq-answer');
        if (itemAnswer) {
          itemAnswer.style.maxHeight = '0';
        }
      }
    });

    if (isActive) {
      faqItem.classList.remove('active');
      answer.style.maxHeight = '0';
    } else {
      faqItem.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  }

  window.toggleFAQ = toggleFAQ;

  // ============================================================
  // 5. Form Submit Handlers
  // ============================================================
  function initFormHandlers() {
    var contactForm = document.getElementById('contactForm');
    var demoForm = document.getElementById('demoForm');
    var trialForm = document.getElementById('trialForm');

    if (contactForm) {
      contactForm.addEventListener('submit', handleContactSubmit);
    }

    if (demoForm) {
      demoForm.addEventListener('submit', handleDemoSubmit);
    }

    if (trialForm) {
      trialForm.addEventListener('submit', handleTrialSubmit);
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    var form = e.target;
    var formData = new FormData(form);
    var data = {};

    formData.forEach(function(value, key) {
      data[key] = value;
    });

    if (!validateForm(form)) {
      return false;
    }

    showToast('success', 'Form Submitted', 'Thank you! We will get back to you soon.');

    form.reset();

    return false;
  }

  function handleContactSubmit(e) {
    e.preventDefault();
    var form = e.target;

    if (!validateForm(form)) {
      return false;
    }

    showToast('success', 'Message Sent', 'Your message has been sent successfully. We will respond within 24 hours.');

    form.reset();
    closeModal('contactModal');

    return false;
  }

  function handleDemoSubmit(e) {
    e.preventDefault();
    var form = e.target;

    if (!validateForm(form)) {
      return false;
    }

    showToast('success', 'Demo Requested', 'We will contact you shortly to schedule your personalized demo.');

    form.reset();
    closeModal('demoModal');

    return false;
  }

  function handleTrialSubmit(e) {
    e.preventDefault();
    var form = e.target;

    if (!validateForm(form)) {
      return false;
    }

    showToast('success', 'Trial Activated', 'Your free trial has been activated. Check your email for login details.');

    form.reset();
    closeModal('trialModal');

    return false;
  }

  window.handleFormSubmit = handleFormSubmit;
  window.handleContactSubmit = handleContactSubmit;

  function validateForm(form) {
    var isValid = true;
    var requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(function(field) {
      removeFieldError(field);

      if (!field.value.trim()) {
        showFieldError(field, 'This field is required');
        isValid = false;
      } else if (field.type === 'email' && !isValidEmail(field.value)) {
        showFieldError(field, 'Please enter a valid email address');
        isValid = false;
      }
    });

    return isValid;
  }

  function showFieldError(field, message) {
    field.classList.add('error');
    var errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
  }

  function removeFieldError(field) {
    field.classList.remove('error');
    var existingError = field.parentNode.querySelector('.form-error');
    if (existingError) {
      existingError.remove();
    }
  }

  function isValidEmail(email) {
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // ============================================================
  // 6. Scroll Fade Animation Observer
  // ============================================================
  function initScrollFade() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.scroll-fade').forEach(function(el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.scroll-fade').forEach(function(el) {
      observer.observe(el);
    });
  }

  // ============================================================
  // 7. CountUp Animation for Statistics
  // ============================================================
  function initCountUp() {
    var statNumbers = document.querySelectorAll('.stat-number[data-count]');

    if (!statNumbers.length) return;

    if (!('IntersectionObserver' in window)) {
      statNumbers.forEach(function(el) {
        el.textContent = el.getAttribute('data-count');
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          countUp(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    statNumbers.forEach(function(el) {
      observer.observe(el);
    });
  }

  function countUp(element) {
    var target = parseInt(element.getAttribute('data-count'), 10);
    var duration = 2000;
    var start = 0;
    var increment = target / (duration / 16);
    var suffix = element.getAttribute('data-suffix') || '';
    var prefix = element.getAttribute('data-prefix') || '';

    function update() {
      start += increment;
      if (start >= target) {
        element.textContent = prefix + target.toLocaleString() + suffix;
        return;
      }
      element.textContent = prefix + Math.floor(start).toLocaleString() + suffix;
      requestAnimationFrame(update);
    }

    element.classList.add('counting');
    requestAnimationFrame(update);
  }

  window.countUp = countUp;

  // ============================================================
  // 8. Smooth Scroll for Anchor Links
  // ============================================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        var navHeight = document.querySelector('.nav') ? document.querySelector('.nav').offsetHeight : 0;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        history.pushState(null, null, targetId);
      });
    });
  }

  // ============================================================
  // 9. Navigation Active State Management
  // ============================================================
  function initNavigation() {
    var nav = document.querySelector('.nav');
    var navLinks = document.querySelectorAll('.nav-link');
    var sections = document.querySelectorAll('section[id]');

    if (!nav) return;

    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });

    if (!sections.length || !navLinks.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '-72px 0px -50% 0px'
    });

    sections.forEach(function(section) {
      observer.observe(section);
    });
  }

  // ============================================================
  // 10. ROI Calculator
  // ============================================================
  var roiState = {
    students: 1000,
    staff: 50,
    hoursPerStudent: 2,
    hourlyRate: 75
  };

  function calculateROI() {
    var totalStudentHours = roiState.students * roiState.hoursPerStudent;
    var totalStaffHours = roiState.staff * 40;
    var currentCost = (totalStudentHours + totalStaffHours) * roiState.hourlyRate;

    var automationRate = 0.85;
    var aiAssistRate = 0.6;

    var automatedHours = totalStudentHours * automationRate;
    var aiAssistedHours = totalStaffHours * aiAssistRate;

    var optimizedCost = ((totalStudentHours - automatedHours) + (totalStaffHours - aiAssistedHours)) * roiState.hourlyRate;

    var savings = currentCost - optimizedCost;
    var roi = currentCost > 0 ? Math.round((savings / optimizedCost) * 100) : 0;
    var timeSaved = Math.round((automatedHours + aiAssistedHours) / 8);

    updateROIResults(savings, roi, timeSaved, currentCost, optimizedCost);

    return {
      currentCost: currentCost,
      optimizedCost: optimizedCost,
      savings: savings,
      roi: roi,
      timeSaved: timeSaved
    };
  }

  function updateROIResults(savings, roi, timeSaved, currentCost, optimizedCost) {
    var savingsEl = document.getElementById('roi-savings');
    var roiEl = document.getElementById('roi-percentage');
    var timeEl = document.getElementById('roi-time');
    var currentEl = document.getElementById('roi-current-cost');
    var optimizedEl = document.getElementById('roi-optimized-cost');

    if (savingsEl) animateValue(savingsEl, savings, '$');
    if (roiEl) animateValue(roiEl, roi, '', '%');
    if (timeEl) animateValue(timeEl, timeSaved, '', ' hrs');
    if (currentEl) currentEl.textContent = '$' + currentCost.toLocaleString();
    if (optimizedEl) optimizedEl.textContent = '$' + optimizedCost.toLocaleString();
  }

  function animateValue(element, target, prefix, suffix) {
    prefix = prefix || '';
    suffix = suffix || '';
    var start = parseInt(element.textContent.replace(/[^0-9]/g, ''), 10) || 0;
    var duration = 1000;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easeProgress = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(start + (target - start) * easeProgress);
      element.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  function updateStudents(value) {
    roiState.students = parseInt(value, 10) || 0;
    var display = document.getElementById('students-value');
    if (display) display.textContent = roiState.students.toLocaleString();
    calculateROI();
  }

  function updateStaff(value) {
    roiState.staff = parseInt(value, 10) || 0;
    var display = document.getElementById('staff-value');
    if (display) display.textContent = roiState.staff.toLocaleString();
    calculateROI();
  }

  function updateHours(value) {
    roiState.hoursPerStudent = parseInt(value, 10) || 0;
    var display = document.getElementById('hours-value');
    if (display) display.textContent = roiState.hoursPerStudent;
    calculateROI();
  }

  window.calculateROI = calculateROI;
  window.updateStudents = updateStudents;
  window.updateStaff = updateStaff;
  window.updateHours = updateHours;

  // ============================================================
  // 11. Timeline Animation on Scroll
  // ============================================================
  function initTimelineAnimation() {
    var timelineItems = document.querySelectorAll('.timeline-item');

    if (!timelineItems.length) return;

    if (!('IntersectionObserver' in window)) {
      timelineItems.forEach(function(item) {
        item.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    });

    timelineItems.forEach(function(item) {
      item.style.opacity = '0';
      item.style.transform = 'translateY(30px)';
      item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(item);
    });

    var style = document.createElement('style');
    style.textContent = '.timeline-item.visible { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);
  }

  // ============================================================
  // 12. Capability Matrix Row Highlight
  // ============================================================
  function initCapabilityMatrix() {
    var rows = document.querySelectorAll('.capability-matrix-row');

    rows.forEach(function(row) {
      row.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.01)';
      });

      row.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
      });
    });
  }

  // ============================================================
  // 13. Demo Request Modal Form Handling
  // ============================================================
  function initDemoForm() {
    var demoForm = document.getElementById('demo-request-form');
    if (!demoForm) return;

    demoForm.addEventListener('submit', function(e) {
      e.preventDefault();

      var formData = new FormData(this);
      var data = {};

      formData.forEach(function(value, key) {
        data[key] = value;
      });

      if (!validateForm(this)) {
        return false;
      }

      showToast('success', 'Demo Requested', 'Our team will contact you within 24 hours to schedule your demo.');

      this.reset();
      closeModal('demoModal');

      return false;
    });
  }

  // ============================================================
  // 14. Free Trial Modal Form Handling
  // ============================================================
  function initTrialForm() {
    var trialForm = document.getElementById('free-trial-form');
    if (!trialForm) return;

    trialForm.addEventListener('submit', function(e) {
      e.preventDefault();

      var formData = new FormData(this);
      var data = {};

      formData.forEach(function(value, key) {
        data[key] = value;
      });

      if (!validateForm(this)) {
        return false;
      }

      showToast('success', 'Trial Started', 'Welcome! Your 14-day free trial is now active. Check your email for next steps.');

      this.reset();
      closeModal('trialModal');

      return false;
    });
  }

  // ============================================================
  // 15. Lazy Loading for Images
  // ============================================================
  function initLazyLoading() {
    var lazyImages = document.querySelectorAll('img[data-src]');

    if (!lazyImages.length) return;

    if ('IntersectionObserver' in window) {
      var imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '100px 0px'
      });

      lazyImages.forEach(function(img) {
        imageObserver.observe(img);
      });
    } else {
      lazyImages.forEach(function(img) {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
      });
    }
  }

  // ============================================================
  // 16. Back to Top Button
  // ============================================================
  function initBackToTop() {
    var backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', function() {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ============================================================
  // 17. Cookie Consent Banner
  // ============================================================
  function initCookieConsent() {
    var cookieBanner = document.querySelector('.cookie-banner');
    if (!cookieBanner) return;

    var hasConsent = getCookie('map_cookie_consent');

    if (!hasConsent) {
      setTimeout(function() {
        cookieBanner.classList.add('visible');
      }, 2000);
    }

    var acceptBtn = cookieBanner.querySelector('.cookie-accept');
    var declineBtn = cookieBanner.querySelector('.cookie-decline');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function() {
        setCookie('map_cookie_consent', 'accepted', 365);
        cookieBanner.classList.remove('visible');
      });
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', function() {
        setCookie('map_cookie_consent', 'declined', 365);
        cookieBanner.classList.remove('visible');
      });
    }
  }

  function setCookie(name, value, days) {
    var expires = '';
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/; SameSite=Lax';
  }

  function getCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }

  // ============================================================
  // 18. Toast/Notification System
  // ============================================================
  function showToast(type, title, message) {
    var container = document.querySelector('.toast-container');

    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    var icons = {
      success: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      error: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      warning: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      info: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };

    toast.innerHTML = '<div class="toast-icon">' + (icons[type] || icons.info) + '</div>' +
      '<div class="toast-content">' +
        '<p class="toast-title">' + escapeHtml(title) + '</p>' +
        '<p class="toast-message">' + escapeHtml(message) + '</p>' +
      '</div>' +
      '<button class="toast-close" aria-label="Close notification">&times;</button>';

    container.appendChild(toast);

    var closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', function() {
      removeToast(toast);
    });

    setTimeout(function() {
      removeToast(toast);
    }, 5000);
  }

  function removeToast(toast) {
    if (!toast || !toast.parentNode) return;

    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(function() {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  window.showToast = showToast;

  // ============================================================
  // 19. Tab Functionality
  // ============================================================
  function initTabs() {
    document.querySelectorAll('.tabs-nav-item').forEach(function(tab) {
      tab.addEventListener('click', function() {
        var tabGroup = this.closest('.tabs');
        var targetId = this.getAttribute('data-tab');

        tabGroup.querySelectorAll('.tabs-nav-item').forEach(function(t) {
          t.classList.remove('active');
        });
        this.classList.add('active');

        tabGroup.querySelectorAll('.tab-panel').forEach(function(panel) {
          panel.classList.remove('active');
        });

        var targetPanel = tabGroup.querySelector('#' + targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  // ============================================================
  // 20. Accordion Functionality
  // ============================================================
  function initAccordion() {
    document.querySelectorAll('.accordion-header').forEach(function(header) {
      header.addEventListener('click', function() {
        var item = this.closest('.accordion-item');
        var content = item.querySelector('.accordion-content');
        var isActive = item.classList.contains('active');

        item.closest('.accordion').querySelectorAll('.accordion-item.active').forEach(function(activeItem) {
          if (activeItem !== item) {
            activeItem.classList.remove('active');
            var activeContent = activeItem.querySelector('.accordion-content');
            if (activeContent) {
              activeContent.style.maxHeight = '0';
            }
          }
        });

        if (isActive) {
          item.classList.remove('active');
          content.style.maxHeight = '0';
        } else {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }

  // ============================================================
  // 21. Tooltip Initialization
  // ============================================================
  function initTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(function(element) {
      element.classList.add('tooltip');
    });
  }

  // ============================================================
  // 22. Form Input Enhancement
  // ============================================================
  function initFormEnhancements() {
    document.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(function(input) {
      input.addEventListener('focus', function() {
        this.closest('.form-group').classList.add('focused');
      });

      input.addEventListener('blur', function() {
        this.closest('.form-group').classList.remove('focused');
        if (this.value.trim()) {
          this.closest('.form-group').classList.add('has-value');
        } else {
          this.closest('.form-group').classList.remove('has-value');
        }
      });
    });
  }

  // ============================================================
  // 23. Parallax Effect
  // ============================================================
  function initParallax() {
    var parallaxElements = document.querySelectorAll('[data-parallax]');

    if (!parallaxElements.length) return;

    window.addEventListener('scroll', function() {
      var scrollY = window.scrollY;

      parallaxElements.forEach(function(el) {
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
        var yOffset = -(scrollY * speed);
        el.style.transform = 'translate3d(0, ' + yOffset + 'px, 0)';
      });
    });
  }

  // ============================================================
  // 24. Typing Effect
  // ============================================================
  function initTypingEffect() {
    var typingElements = document.querySelectorAll('[data-typing]');

    typingElements.forEach(function(element) {
      var text = element.getAttribute('data-typing');
      var speed = parseInt(element.getAttribute('data-typing-speed'), 10) || 100;
      var index = 0;

      element.textContent = '';

      function type() {
        if (index < text.length) {
          element.textContent += text.charAt(index);
          index++;
          setTimeout(type, speed);
        }
      }

      var observer = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) {
          type();
          observer.unobserve(element);
        }
      });

      observer.observe(element);
    });
  }

  // ============================================================
  // 25. Number Counter with Scroll
  // ============================================================
  function initScrollCounter() {
    var counters = document.querySelectorAll('[data-scroll-count]');

    if (!counters.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var target = parseInt(entry.target.getAttribute('data-scroll-count'), 10);
          var current = 0;
          var increment = target / 50;
          var duration = 2000;
          var stepTime = duration / 50;

          function updateCounter() {
            current += increment;
            if (current < target) {
              entry.target.textContent = Math.floor(current).toLocaleString();
              setTimeout(updateCounter, stepTime);
            } else {
              entry.target.textContent = target.toLocaleString();
            }
          }

          updateCounter();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function(counter) {
      observer.observe(counter);
    });
  }

  // ============================================================
  // 26. Progress Bar Animation
  // ============================================================
  function initProgressBar() {
    var progressBars = document.querySelectorAll('.progress-bar[data-progress]');

    if (!progressBars.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var progress = entry.target.getAttribute('data-progress');
          entry.target.style.width = progress + '%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    progressBars.forEach(function(bar) {
      bar.style.width = '0%';
      observer.observe(bar);
    });
  }

  // ============================================================
  // 27. Search Functionality
  // ============================================================
  function initSearch() {
    var searchInput = document.querySelector('.search-input');
    var searchResults = document.querySelector('.search-results');

    if (!searchInput) return;

    var debounceTimer;

    searchInput.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      var query = this.value.trim();

      debounceTimer = setTimeout(function() {
        if (query.length >= 2) {
          performSearch(query);
        } else {
          if (searchResults) {
            searchResults.innerHTML = '';
            searchResults.style.display = 'none';
          }
        }
      }, 300);
    });
  }

  function performSearch(query) {
    var searchResults = document.querySelector('.search-results');
    if (!searchResults) return;

    var searchableElements = document.querySelectorAll('[data-searchable]');
    var results = [];

    searchableElements.forEach(function(el) {
      var text = el.textContent.toLowerCase();
      if (text.includes(query.toLowerCase())) {
        results.push({
          element: el,
          text: el.textContent.substring(0, 100)
        });
      }
    });

    displaySearchResults(results, searchResults);
  }

  function displaySearchResults(results, container) {
    if (results.length === 0) {
      container.innerHTML = '<div class="search-no-results">No results found</div>';
      container.style.display = 'block';
      return;
    }

    var html = '<ul class="search-results-list">';
    results.forEach(function(result) {
      html += '<li class="search-result-item">' + escapeHtml(result.text) + '...</li>';
    });
    html += '</ul>';

    container.innerHTML = html;
    container.style.display = 'block';
  }

  // ============================================================
  // 28. Keyboard Navigation
  // ============================================================
  function initKeyboardNav() {
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        var activeModal = document.querySelector('.modal.active');
        if (activeModal) {
          closeModal(activeModal.id);
        }

        var activeDropdown = document.querySelector('.dropdown.active');
        if (activeDropdown) {
          activeDropdown.classList.remove('active');
        }
      }

      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });

    document.addEventListener('mousedown', function() {
      document.body.classList.remove('keyboard-nav');
    });
  }

  // ============================================================
  // 29. Print Report Functionality
  // ============================================================
  function initPrintReport() {
    var printButtons = document.querySelectorAll('[data-print]');

    printButtons.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        window.print();
      });
    });
  }

  // ============================================================
  // 30. Export Data Functionality
  // ============================================================
  function exportToCSV(data, filename) {
    if (!data || !data.length) return;

    var headers = Object.keys(data[0]);
    var csvContent = headers.join(',') + '\n';

    data.forEach(function(row) {
      var values = headers.map(function(header) {
        var value = row[header];
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return '"' + value.replace(/"/g, '""') + '"';
        }
        return value;
      });
      csvContent += values.join(',') + '\n';
    });

    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename || 'export.csv';
    link.click();
  }

  window.exportToCSV = exportToCSV;

  // ============================================================
  // 31. Debounce Utility
  // ============================================================
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this;
      var args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  window.debounce = debounce;

  // ============================================================
  // 32. Throttle Utility
  // ============================================================
  function throttle(func, limit) {
    var inThrottle;
    return function() {
      var context = this;
      var args = arguments;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(function() {
          inThrottle = false;
        }, limit);
      }
    };
  }

  window.throttle = throttle;

  // ============================================================
  // 33. Local Storage Helpers
  // ============================================================
  function saveToLocalStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Unable to save to localStorage:', e);
    }
  }

  function getFromLocalStorage(key) {
    try {
      var item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.warn('Unable to read from localStorage:', e);
      return null;
    }
  }

  window.saveToLocalStorage = saveToLocalStorage;
  window.getFromLocalStorage = getFromLocalStorage;

  // ============================================================
  // 34. URL Parameter Helpers
  // ============================================================
  function getUrlParam(param) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  function setUrlParam(param, value) {
    var url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.replaceState({}, '', url);
  }

  window.getUrlParam = getUrlParam;
  window.setUrlParam = setUrlParam;

  // ============================================================
  // 35. Event Bus (Simple Pub/Sub)
  // ============================================================
  var EventBus = {
    events: {},

    on: function(event, callback) {
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(callback);
    },

    off: function(event, callback) {
      if (!this.events[event]) return;
      this.events[event] = this.events[event].filter(function(cb) {
        return cb !== callback;
      });
    },

    emit: function(event, data) {
      if (!this.events[event]) return;
      this.events[event].forEach(function(callback) {
        callback(data);
      });
    }
  };

  window.EventBus = EventBus;

})();
