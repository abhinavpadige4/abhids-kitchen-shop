// ============================================================
// Abhids Kitchen Shop — main.js
// Vanilla JS: smooth scroll, mobile nav, form handling,
//             intersection observer scroll animations
// ============================================================

(function () {
  'use strict';

  // ----------------------------------------------------------
  // 1. Smooth Scroll Navigation
  // ----------------------------------------------------------
  function initSmoothScroll() {
    var navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#' || href === '') return;

        var target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        // Calculate offset for fixed header
        var header = document.querySelector('.site-header');
        var headerHeight = header ? header.offsetHeight : 0;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile nav if open
        var mobileNav = document.querySelector('.mobile-nav');
        var navToggle = document.querySelector('.nav-toggle');
        if (mobileNav && mobileNav.classList.contains('is-open')) {
          mobileNav.classList.remove('is-open');
          navToggle.classList.remove('is-active');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });
  }

  // ----------------------------------------------------------
  // 2. Mobile Navigation Toggle
  // ----------------------------------------------------------
  function initMobileNav() {
    var navToggle = document.querySelector('.nav-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (!navToggle || !mobileNav) return;

    navToggle.addEventListener('click', function (e) {
      e.preventDefault();
      var isOpen = mobileNav.classList.toggle('is-open');
      this.classList.toggle('is-active', isOpen);
      this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      // Prevent body scroll when nav is open
      document.body.style.overflow = isOpen ? 'hidden' : '';

      // Update aria-label for accessibility
      this.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', function (e) {
      if (!mobileNav.contains(e.target) && !navToggle.contains(e.target)) {
        if (mobileNav.classList.contains('is-open')) {
          mobileNav.classList.remove('is-open');
          navToggle.classList.remove('is-active');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      }
    });

    // Close mobile nav on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        mobileNav.classList.remove('is-open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        navToggle.focus();
      }
    });
  }

  // ----------------------------------------------------------
  // 3. Contact Form Submission Handling
  // ----------------------------------------------------------
  function initContactForm() {
    var form = document.querySelector('.contact-form');
    if (!form) return;

    // Add novalidate to handle validation ourselves
    form.setAttribute('novalidate', '');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var isValid = true;
      var fields = form.querySelectorAll('[required]');

      // Reset previous error states
      fields.forEach(function (field) {
        field.classList.remove('is-invalid', 'is-valid');
        var errorEl = field.parentElement.querySelector('.field-error');
        if (errorEl) {
          errorEl.textContent = '';
          errorEl.classList.remove('is-visible');
        }
      });

      // Validate each required field
      fields.forEach(function (field) {
        var value = field.value.trim();
        var errorEl = field.parentElement.querySelector('.field-error');

        if (!value) {
          field.classList.add('is-invalid');
          if (errorEl) {
            errorEl.textContent = 'This field is required.';
            errorEl.classList.add('is-visible');
          }
          isValid = false;
        } else if (field.type === 'email' && !isValidEmail(value)) {
          field.classList.add('is-invalid');
          if (errorEl) {
            errorEl.textContent = 'Please enter a valid email address.';
            errorEl.classList.add('is-visible');
          }
          isValid = false;
        } else if (field.type === 'tel' && !isValidPhone(value)) {
          field.classList.add('is-invalid');
          if (errorEl) {
            errorEl.textContent = 'Please enter a valid phone number.';
            errorEl.classList.add('is-visible');
          }
          isValid = false;
        } else {
          field.classList.add('is-valid');
        }
      });

      if (!isValid) {
        // Focus first invalid field
        var firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }

      // Simulate form submission with loading state
      var submitBtn = form.querySelector('.form-submit');
      var originalText = submitBtn ? submitBtn.textContent : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        submitBtn.classList.add('is-loading');
      }

      // Simulate async submission (replace with real API call)
      setTimeout(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          submitBtn.classList.remove('is-loading');
        }

        // Reset form
        form.reset();
        fields.forEach(function (field) {
          field.classList.remove('is-valid', 'is-invalid');
        });

        // Show success toast
        showToast('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
      }, 1500);
    });

    // Real-time validation on blur
    var inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(function (input) {
      input.addEventListener('blur', function () {
        if (this.value.trim() === '') {
          this.classList.remove('is-valid', 'is-invalid');
          return;
        }

        var errorEl = this.parentElement.querySelector('.field-error');

        if (this.type === 'email' && !isValidEmail(this.value.trim())) {
          this.classList.add('is-invalid');
          this.classList.remove('is-valid');
          if (errorEl) {
            errorEl.textContent = 'Please enter a valid email address.';
            errorEl.classList.add('is-visible');
          }
        } else if (this.type === 'tel' && !isValidPhone(this.value.trim())) {
          this.classList.add('is-invalid');
          this.classList.remove('is-valid');
          if (errorEl) {
            errorEl.textContent = 'Please enter a valid phone number.';
            errorEl.classList.add('is-visible');
          }
        } else {
          this.classList.add('is-valid');
          this.classList.remove('is-invalid');
          if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('is-visible');
          }
        }
      });

      // Clear error on input
      input.addEventListener('input', function () {
        if (this.classList.contains('is-invalid')) {
          this.classList.remove('is-invalid');
          var errorEl = this.parentElement.querySelector('.field-error');
          if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('is-visible');
          }
        }
      });
    });
  }

  // Email validation helper
  function isValidEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Phone validation helper
  function isValidPhone(phone) {
    var re = /^[+]?[0-9\-\s()]{7,20}$/;
    return re.test(phone);
  }

  // ----------------------------------------------------------
  // 4. Toast Notification System
  // ----------------------------------------------------------
  function showToast(message, type) {
    // Remove existing toast if any
    var existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
      existingToast.remove();
    }

    // Create toast element
    var toast = document.createElement('div');
    toast.className = 'toast-notification toast-' + (type || 'info');
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    var icon = '';
    if (type === 'success') {
      icon = '\u2713'; // Checkmark
    } else if (type === 'error') {
      icon = '\u2717'; // Cross
    } else {
      icon = '\u2139\uFE0F'; // Info
    }

    toast.innerHTML =
      '<span class="toast-icon">' + icon + '</span>' +
      '<span class="toast-message">' + message + '</span>' +
      '<button class="toast-close" aria-label="Close notification">&times;</button>';

    // Append to body
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(function () {
      toast.classList.add('is-visible');
    });

    // Auto-dismiss after 5 seconds
    var timeout = setTimeout(function () {
      dismissToast(toast);
    }, 5000);

    // Close button handler
    var closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        clearTimeout(timeout);
        dismissToast(toast);
      });
    }
  }

  function dismissToast(toast) {
    if (!toast || !toast.parentNode) return;
    toast.classList.remove('is-visible');
    toast.classList.add('is-dismissing');

    setTimeout(function () {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  // ----------------------------------------------------------
  // 5. Intersection Observer — Scroll Animations
  // ----------------------------------------------------------
  function initScrollAnimations() {
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all elements immediately
      var elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.classList.add('is-visible');

          // Unobserve after animation to save resources
          observer.unobserve(el);
        }
      });
    }, observerOptions);

    var animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ----------------------------------------------------------
  // 6. Header Scroll Effect
  // ----------------------------------------------------------
  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    var lastScrollY = 0;
    var ticking = false;

    function updateHeader() {
      var currentScrollY = window.pageYOffset;

      if (currentScrollY > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }

      // Hide/show header on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        header.classList.add('is-hidden');
      } else {
        header.classList.remove('is-hidden');
      }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }

  // ----------------------------------------------------------
  // 7. Active Navigation Link Highlighting
  // ----------------------------------------------------------
  function initActiveNavHighlight() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    if (sections.length === 0 || navLinks.length === 0) return;

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.remove('is-active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('is-active');
            }
          });
        }
      });
    }, {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    });

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  // ----------------------------------------------------------
  // 8. Back to Top Button
  // ----------------------------------------------------------
  function initBackToTop() {
    var backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    var ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          if (window.pageYOffset > 500) {
            backToTop.classList.add('is-visible');
          } else {
            backToTop.classList.remove('is-visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ----------------------------------------------------------
  // 9. Menu Card Hover Tilt Effect (Desktop Only)
  // ----------------------------------------------------------
  function initMenuCardTilt() {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches === false) return;

    var cards = document.querySelectorAll('.menu-card');

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = (y - centerY) / centerY * -3;
        var rotateY = (x - centerX) / centerX * 3;

        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      });
    });
  }

  // ----------------------------------------------------------
  // 10. Initialize Everything on DOM Ready
  // ----------------------------------------------------------
  function init() {
    initSmoothScroll();
    initMobileNav();
    initContactForm();
    initScrollAnimations();
    initHeaderScroll();
    initActiveNavHighlight();
    initBackToTop();
    initMenuCardTilt();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
