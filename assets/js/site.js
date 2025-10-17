/**
 * RR INDUSTRIES - MAIN JAVASCRIPT
 * Vanilla JavaScript for all interactive features
 * No frameworks, no dependencies
 */

(function() {
  'use strict';

  // ============================================
  // Utility Functions
  // ============================================
  
  const utils = {
    // Check if user prefers reduced motion
    prefersReducedMotion: () => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },
    
    // Debounce function
    debounce: (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    
    // Throttle function
    throttle: (func, limit) => {
      let inThrottle;
      return function(...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    }
  };

  // ============================================
  // Navigation & Header
  // ============================================
  
  const navigation = {
    init: () => {
      const header = document.querySelector('.site-header');
      const mobileToggle = document.querySelector('.mobile-menu-toggle');
      const mainNav = document.querySelector('.main-nav');
      const navLinks = document.querySelectorAll('.nav-links a');
      
      // Sticky header on scroll
      const handleScroll = utils.throttle(() => {
        if (window.scrollY > 100) {
          header?.classList.add('scrolled');
        } else {
          header?.classList.remove('scrolled');
        }
      }, 100);
      
      window.addEventListener('scroll', handleScroll);
      
      // Mobile menu toggle
      mobileToggle?.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        mainNav?.classList.toggle('active');
      });
      
      // Close mobile menu when clicking on a link
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileToggle?.classList.remove('active');
          mainNav?.classList.remove('active');
        });
      });
      
      // Active link highlighting
      const currentPath = window.location.pathname;
      navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        if (currentPath === linkPath || (currentPath === '/' && linkPath.includes('index.html'))) {
          link.classList.add('active');
        }
      });
    }
  };

  // ============================================
  // Scroll Reveal Animation
  // ============================================
  
  const scrollReveal = {
    init: () => {
      if (utils.prefersReducedMotion()) {
        // If user prefers reduced motion, show all elements immediately
        document.querySelectorAll('.reveal').forEach(el => {
          el.classList.add('active');
        });
        return;
      }
      
      const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);
      
      document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
      });
    }
  };

  // ============================================
  // Number Counter Animation
  // ============================================
  
  const counterAnimation = {
    init: () => {
      const counters = document.querySelectorAll('[data-counter]');
      
      if (counters.length === 0 || utils.prefersReducedMotion()) return;
      
      const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-counter'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
          current += step;
          if (current < target) {
            counter.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        };
        
        updateCounter();
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      counters.forEach(counter => observer.observe(counter));
    }
  };

  // ============================================
  // Carousel
  // ============================================
  
  const carousel = {
    instances: [],
    
    init: () => {
      const carousels = document.querySelectorAll('.carousel');
      
      carousels.forEach((carouselEl, index) => {
        const container = carouselEl.querySelector('.carousel-container');
        const slides = carouselEl.querySelectorAll('.carousel-slide');
        const prevBtn = carouselEl.querySelector('.carousel-btn-prev');
        const nextBtn = carouselEl.querySelector('.carousel-btn-next');
        const dotsContainer = carouselEl.querySelector('.carousel-dots');
        
        if (!container || slides.length === 0) return;
        
        let currentSlide = 0;
        let autoplayInterval;
        
        // Create dots
        if (dotsContainer) {
          slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
          });
        }
        
        const dots = carouselEl.querySelectorAll('.carousel-dot');
        
        const goToSlide = (index) => {
          currentSlide = index;
          const offset = -index * 100;
          container.style.transform = `translateX(${offset}%)`;
          
          // Update dots
          dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
          });
        };
        
        const nextSlide = () => {
          currentSlide = (currentSlide + 1) % slides.length;
          goToSlide(currentSlide);
        };
        
        const prevSlide = () => {
          currentSlide = (currentSlide - 1 + slides.length) % slides.length;
          goToSlide(currentSlide);
        };
        
        // Button controls
        nextBtn?.addEventListener('click', () => {
          nextSlide();
          stopAutoplay();
        });
        
        prevBtn?.addEventListener('click', () => {
          prevSlide();
          stopAutoplay();
        });
        
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        container.addEventListener('touchstart', (e) => {
          touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        container.addEventListener('touchend', (e) => {
          touchEndX = e.changedTouches[0].clientX;
          const diff = touchStartX - touchEndX;
          
          if (Math.abs(diff) > 50) {
            if (diff > 0) {
              nextSlide();
            } else {
              prevSlide();
            }
            stopAutoplay();
          }
        }, { passive: true });
        
        // Autoplay
        const startAutoplay = () => {
          if (utils.prefersReducedMotion()) return;
          autoplayInterval = setInterval(nextSlide, 5000);
        };
        
        const stopAutoplay = () => {
          clearInterval(autoplayInterval);
        };
        
        // Pause autoplay on hover
        carouselEl.addEventListener('mouseenter', stopAutoplay);
        carouselEl.addEventListener('mouseleave', startAutoplay);
        
        // Start autoplay
        startAutoplay();
        
        // Store instance
        carousel.instances.push({
          element: carouselEl,
          goToSlide,
          nextSlide,
          prevSlide,
          stopAutoplay,
          startAutoplay
        });
      });
    }
  };

  // ============================================
  // Product Filter
  // ============================================
  
  const productFilter = {
    init: () => {
      const filterChips = document.querySelectorAll('.filter-chip');
      const productCards = document.querySelectorAll('.product-card');
      
      if (filterChips.length === 0) return;
      
      filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
          const category = chip.getAttribute('data-category');
          
          // Update active chip
          filterChips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          
          // Filter products
          productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === 'all' || cardCategory === category) {
              card.style.display = 'block';
              setTimeout(() => card.classList.add('active'), 10);
            } else {
              card.classList.remove('active');
              setTimeout(() => card.style.display = 'none', 300);
            }
          });
        });
      });
    }
  };

  // ============================================
  // Modal
  // ============================================
  
  const modal = {
    activeModal: null,
    
    init: () => {
      const modalTriggers = document.querySelectorAll('[data-modal-target]');
      const modals = document.querySelectorAll('.modal');
      
      modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          const modalId = trigger.getAttribute('data-modal-target');
          modal.open(modalId);
        });
      });
      
      modals.forEach(modalEl => {
        const closeBtn = modalEl.querySelector('.modal-close');
        
        closeBtn?.addEventListener('click', () => {
          modal.close(modalEl.id);
        });
        
        // Close on backdrop click
        modalEl.addEventListener('click', (e) => {
          if (e.target === modalEl) {
            modal.close(modalEl.id);
          }
        });
      });
      
      // Close modal on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.activeModal) {
          modal.close(modal.activeModal.id);
        }
      });
    },
    
    open: (modalId) => {
      const modalEl = document.getElementById(modalId);
      if (!modalEl) return;
      
      modalEl.classList.add('active');
      modal.activeModal = modalEl;
      document.body.style.overflow = 'hidden';
      
      // Trap focus within modal
      const focusableElements = modalEl.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    },
    
    close: (modalId) => {
      const modalEl = document.getElementById(modalId);
      if (!modalEl) return;
      
      modalEl.classList.remove('active');
      modal.activeModal = null;
      document.body.style.overflow = '';
    }
  };

  // ============================================
  // Form Validation & Submission
  // ============================================
  
  const formHandler = {
    init: () => {
      const forms = document.querySelectorAll('form[data-validate]');
      
      forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          // Clear previous errors
          form.querySelectorAll('.form-error').forEach(error => {
            error.textContent = '';
          });
          
          form.querySelectorAll('.error').forEach(input => {
            input.classList.remove('error');
          });
          
          // Validate form
          const isValid = formHandler.validate(form);
          
          if (isValid) {
            await formHandler.submit(form);
          }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
          input.addEventListener('blur', () => {
            formHandler.validateField(input);
          });
        });
      });
    },
    
    validate: (form) => {
      let isValid = true;
      const inputs = form.querySelectorAll('[required]');
      
      inputs.forEach(input => {
        if (!formHandler.validateField(input)) {
          isValid = false;
        }
      });
      
      return isValid;
    },
    
    validateField: (input) => {
      const errorEl = input.parentElement.querySelector('.form-error');
      let isValid = true;
      let errorMessage = '';
      
      // Required check
      if (input.hasAttribute('required') && !input.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
      }
      
      // Email validation
      if (input.type === 'email' && input.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address';
        }
      }
      
      // Phone validation
      if (input.type === 'tel' && input.value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(input.value) || input.value.replace(/\D/g, '').length < 10) {
          isValid = false;
          errorMessage = 'Please enter a valid phone number';
        }
      }
      
      // Update UI
      if (!isValid) {
        input.classList.add('error');
        if (errorEl) errorEl.textContent = errorMessage;
      } else {
        input.classList.remove('error');
        if (errorEl) errorEl.textContent = '';
      }
      
      return isValid;
    },
    
    submit: async (form) => {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn?.textContent;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }
      
      try {
        // Simulate API call (replace with actual endpoint)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success
        toast.show('Message sent successfully! We will contact you soon.', 'success');
        form.reset();
        
        // Alternative: mailto fallback
        const email = 'rrindustries955@gmail.com';
        const subject = encodeURIComponent('Enquiry from Website');
        const body = encodeURIComponent(
          `Name: ${data.name || 'N/A'}\n` +
          `Company: ${data.company || 'N/A'}\n` +
          `Email: ${data.email || 'N/A'}\n` +
          `Phone: ${data.phone || 'N/A'}\n` +
          `City: ${data.city || 'N/A'}\n` +
          `Message: ${data.message || 'N/A'}`
        );
        
        console.log(`Fallback mailto link: mailto:${email}?subject=${subject}&body=${body}`);
        
      } catch (error) {
        toast.show('Failed to send message. Please try again or contact us directly.', 'error');
        console.error('Form submission error:', error);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    }
  };

  // ============================================
  // Toast Notifications
  // ============================================
  
  const toast = {
    show: (message, type = 'success', duration = 5000) => {
      const existingToast = document.querySelector('.toast');
      if (existingToast) {
        existingToast.remove();
      }
      
      const toastEl = document.createElement('div');
      toastEl.className = `toast toast-${type}`;
      toastEl.textContent = message;
      
      document.body.appendChild(toastEl);
      
      setTimeout(() => {
        toastEl.style.animation = 'toastSlideIn 0.3s ease-out reverse';
        setTimeout(() => toastEl.remove(), 300);
      }, duration);
    }
  };

  // ============================================
  // Back to Top Button
  // ============================================
  
  const backToTop = {
    init: () => {
      const btn = document.querySelector('.back-to-top');
      if (!btn) return;
      
      const handleScroll = utils.throttle(() => {
        if (window.scrollY > 300) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
      }, 100);
      
      window.addEventListener('scroll', handleScroll);
      
      btn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  };

  // ============================================
  // External Links
  // ============================================
  
  const externalLinks = {
    init: () => {
      document.querySelectorAll('a[href^="http"]').forEach(link => {
        const url = new URL(link.href);
        if (url.hostname !== window.location.hostname) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      });
    }
  };

  // ============================================
  // Initialize Everything
  // ============================================
  
  const init = () => {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    
    // Initialize all modules
    navigation.init();
    scrollReveal.init();
    counterAnimation.init();
    carousel.init();
    productFilter.init();
    modal.init();
    formHandler.init();
    backToTop.init();
    externalLinks.init();
    
    // Add reveal class to elements that should animate on scroll
    document.querySelectorAll('.card, .icon-item, .timeline-item, section > .container > *').forEach(el => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
      }
    });
    
    // Re-initialize scroll reveal for dynamically added elements
    scrollReveal.init();
  };
  
  // Start initialization
  init();
  
  // Export for debugging/external use
  window.RRIndustries = {
    utils,
    navigation,
    carousel,
    modal,
    toast,
    formHandler
  };

})();
