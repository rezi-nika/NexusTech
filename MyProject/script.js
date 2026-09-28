/**
 * NexusTech Landing Page - Core JavaScript
 * Features:
 * - Theme Switcher (Light / Dark) with LocalStorage persistence
 * - Particle Ambient Canvas Animation
 * - 3D Card Tilt Effect on Hero
 * - Feature Cards Spotlight Follower & Category Filtering
 * - Animated Stats Counter
 * - Navbar Scroll Spy & Sticky Header
 * - Mobile Navigation Drawer
 * - Contact Form Validation & Simulated API Dispatch with Loading
 * - Copy-to-Clipboard with Toast Notifications
 * - Scroll Reveal System
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initParticleCanvas();
  initHeaderScroll();
  initMobileNav();
  initScrollSpy();
  initScrollReveal();
  initHeroTilt();
  initStatsCounter();
  initFeatureFilters();
  initSpotlightEffect();
  initContactForm();
  initCopyButtons();
  initBackToTop();
});

/* ===================================================================
   1. THEME SWITCHER
   =================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  // Check saved preference or system default
  const savedTheme = localStorage.getItem('nexustech-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (!systemPrefersDark) {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('nexustech-theme', newTheme);
    
    showToast(newTheme === 'dark' ? '🌙 ჩაირთო მუქი თემა' : '☀️ ჩაირთო ნათელი თემა');
  });
}

/* ===================================================================
   2. PARTICLES CANVAS ANIMATION
   =================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor((width * height) / 18000), 65);
  const particles = [];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.8 + 0.8;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(129, 140, 248, ${this.alpha})`
        : `rgba(99, 102, 241, ${this.alpha * 0.8})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const linkColor = isDark ? 'rgba(99, 102, 241,' : 'rgba(129, 140, 248,';

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const opacity = (1 - dist / 110) * 0.18;
          ctx.strokeStyle = `${linkColor}${opacity})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ===================================================================
   3. NAVBAR SCROLL EFFECT
   =================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ===================================================================
   4. MOBILE NAVIGATION DRAWER
   =================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const navLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer .btn');

  if (!toggleBtn || !drawer) return;

  const toggleDrawer = () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
    } else {
      drawer.classList.add('open');
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
    }
  };

  toggleBtn.addEventListener('click', toggleDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (drawer.classList.contains('open')) {
        toggleDrawer();
      }
    });
  });

  // Close when clicking outside drawer
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      toggleDrawer();
    }
  });
}

/* ===================================================================
   5. SCROLL SPY ACTIVE NAV LINK
   =================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const onScroll = () => {
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        desktopLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('data-nav') === id);
        });
        mobileLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('data-nav') === id);
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ===================================================================
   6. SCROLL REVEAL (IntersectionObserver)
   =================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('[data-reveal]');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ===================================================================
   7. 3D TILT EFFECT ON HERO MOCKUP
   =================================================================== */
function initHeroTilt() {
  const heroCard = document.getElementById('hero-card-3d');
  if (!heroCard) return;

  // Only apply tilt on non-touch desktop screens
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const handleMouseMove = (e) => {
    const rect = heroCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  heroCard.addEventListener('mousemove', handleMouseMove);
  heroCard.addEventListener('mouseleave', handleMouseLeave);
}

/* ===================================================================
   8. STATS COUNTER ANIMATION
   =================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-count'));
          const isDecimal = target % 1 !== 0;
          const duration = 2000;
          const startTime = performance.now();

          const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic formula
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = target * easeOut;

            counter.innerText = isDecimal ? current.toFixed(1) : Math.floor(current);

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              counter.innerText = isDecimal ? target.toFixed(1) : target;
            }
          };

          requestAnimationFrame(updateCount);
        });
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) observer.observe(heroStats);
}

/* ===================================================================
   9. FEATURE CATEGORY FILTERS
   =================================================================== */
function initFeatureFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.feature-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hide');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.classList.add('hide');
          }, 300);
        }
      });
    });
  });
}

/* ===================================================================
   10. MOUSE SPOTLIGHT EFFECT ON FEATURE CARDS
   =================================================================== */
function initSpotlightEffect() {
  const cards = document.querySelectorAll('.feature-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ===================================================================
   11. CONTACT FORM WITH VALIDATION & FEEDBACK
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  if (!form || !submitBtn) return;

  const nameInput = document.getElementById('user-name');
  const emailInput = document.getElementById('user-email');
  const messageInput = document.getElementById('user-message');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (input, isValid) => {
    const parent = input.closest('.form-group');
    if (!isValid) {
      parent.classList.add('has-error');
    } else {
      parent.classList.remove('has-error');
    }
    return isValid;
  };

  // Real-time input validation on blur / input
  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim().length > 0) validateField(nameInput, true);
  });

  emailInput.addEventListener('input', () => {
    if (emailRegex.test(emailInput.value.trim())) validateField(emailInput, true);
  });

  messageInput.addEventListener('input', () => {
    if (messageInput.value.trim().length > 0) validateField(messageInput, true);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameInput, nameInput.value.trim().length > 0);
    const isEmailValid = validateField(emailInput, emailRegex.test(emailInput.value.trim()));
    const isMessageValid = validateField(messageInput, messageInput.value.trim().length > 0);

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      showToast('⚠️ გთხოვთ შეავსოთ ყველა აუცილებელი ველი სწორად');
      return;
    }

    // Set loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Simulate network dispatch
    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;

      form.reset();
      showToast('🎉 მადლობა! თქვენი შეტყობინება წარმატებით გაიგზავნა.');
    }, 1200);
  });
}

/* ===================================================================
   12. COPY TO CLIPBOARD BUTTONS
   =================================================================== */
function initCopyButtons() {
  const emailCard = document.getElementById('copy-email-card');
  const phoneCard = document.getElementById('copy-phone-card');

  const copyText = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`📋 ${label} დაკოპირდა ბუფერში: ${text}`);
    }).catch(() => {
      showToast(`📋 ${label}: ${text}`);
    });
  };

  if (emailCard) {
    emailCard.addEventListener('click', () => {
      const email = document.getElementById('email-text').innerText.trim();
      copyText(email, 'ელ-ფოსტა');
    });
  }

  if (phoneCard) {
    phoneCard.addEventListener('click', () => {
      const phone = document.getElementById('phone-text').innerText.trim();
      copyText(phone, 'ტელეფონი');
    });
  }
}

/* ===================================================================
   13. BACK TO TOP BUTTON
   =================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ===================================================================
   14. TOAST NOTIFICATION UTILITY
   =================================================================== */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast toast-success';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger enter animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto remove after 3.8s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode === container) {
        container.removeChild(toast);
      }
    }, 400);
  }, 3800);
}
