/* ============================================================
   Taihō Coffee & Tea — Scroll & Intersection Observer Animations
   ============================================================ */

(function() {
  'use strict';

  // ── Scroll reveal via IntersectionObserver ──
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale'
    );

    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // ── Navbar scroll state ──
  function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;
    let ticking = false;

    function updateNavbar() {
      const scrollY = window.scrollY;
      
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      lastScroll = scrollY;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    }, { passive: true });
  }

  // ── Active nav link highlighting ──
  function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar__link[href^="#"]');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', 
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-80px 0px -40% 0px'
    });

    sections.forEach(section => observer.observe(section));
  }

  // ── Smooth scroll for anchor links ──
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (!target) return;
        
        e.preventDefault();
        
        // Close mobile menu if open
        const mobileMenu = document.querySelector('.navbar__mobile-menu');
        const hamburger = document.querySelector('.navbar__hamburger');
        if (mobileMenu && mobileMenu.classList.contains('open')) {
          mobileMenu.classList.remove('open');
          hamburger.classList.remove('open');
          document.body.style.overflow = '';
        }

        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        
        window.scrollTo({
          top: top,
          behavior: 'smooth'
        });
      });
    });
  }

  // ── Parallax effect for hero elements ──
  function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const heroImage = hero.querySelector('.hero__image-wrapper');
    const heroBokehs = hero.querySelectorAll('.hero__bokeh');
    
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroHeight = hero.offsetHeight;
          
          if (scrollY < heroHeight) {
            const progress = scrollY / heroHeight;
            
            if (heroImage) {
              heroImage.style.transform = `translateY(${scrollY * 0.15}px)`;
            }
            
            heroBokehs.forEach((bokeh, i) => {
              const speed = 0.05 + (i * 0.03);
              bokeh.style.transform = `translateY(${scrollY * speed}px)`;
            });
          }
          
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ── Counter animation for stats ──
  function initCounterAnimation() {
    const counters = document.querySelectorAll('.about__stat-number');
    if (!counters.length) return;

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

  function animateCounter(element) {
    const text = element.textContent;
    const match = text.match(/(\d+)/);
    if (!match) return;

    const target = parseInt(match[1]);
    const suffix = text.replace(match[1], '');
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(target * ease);
      
      element.textContent = current + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = text;
      }
    }

    requestAnimationFrame(update);
  }

  // ── Menu tab filtering ──
  function initMenuTabs() {
    const tabs = document.querySelectorAll('.menu__tab');
    const items = document.querySelectorAll('.menu-item');

    if (!tabs.length || !items.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const category = this.dataset.category;
        
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        items.forEach(item => {
          if (category === 'all' || item.dataset.category === category) {
            item.style.display = '';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateX(0)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-10px)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // ── Mobile hamburger ──
  function initMobileMenu() {
    const hamburger = document.querySelector('.navbar__hamburger');
    const mobileMenu = document.querySelector('.navbar__mobile-menu');

    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  // ── Cursor glow follow ──
  function initCursorGlow() {
    const glow = document.querySelector('.cursor-glow');
    if (!glow || window.innerWidth < 900) return;

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      glow.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
      glow.classList.remove('active');
    });

    function animate() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
      requestAnimationFrame(animate);
    }

    animate();
  }

  // ── Initialize all ──
  document.addEventListener('DOMContentLoaded', function() {
    initScrollReveal();
    initNavbarScroll();
    initActiveNavLink();
    initSmoothScroll();
    initParallax();
    initCounterAnimation();
    initMenuTabs();
    initMobileMenu();
    initCursorGlow();
  });
})();
