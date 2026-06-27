/* ============================================================
   Taihō Coffee & Tea — Main Script (Loading & Init)
   ============================================================ */

(function() {
  'use strict';

  // ── Loading screen ──
  function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    const loadingBar = document.querySelector('.loading-bar__fill');
    
    if (!loadingScreen || !loadingBar) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20 + 5;
      if (progress > 100) progress = 100;
      loadingBar.style.width = progress + '%';
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          loadingScreen.classList.add('hidden');
          document.body.style.overflow = '';
        }, 400);
      }
    }, 150);
  }

  // ── Form handling ──
  function initFormHandling() {
    const form = document.querySelector('.booking__form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const btn = form.querySelector('.booking__submit');
      const originalText = btn.textContent;
      
      btn.textContent = 'Đang gửi...';
      btn.disabled = true;
      
      setTimeout(() => {
        btn.textContent = 'Đã gửi thành công! ✓';
        btn.style.background = '#4a7c59';
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.background = '';
          form.reset();
        }, 3000);
      }, 1500);
    });
  }

  // ── Back to top ──
  function initBackToTop() {
    const backTopBtn = document.querySelector('.footer__back-top');
    if (!backTopBtn) return;

    backTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ── Image lazy loading with fade ──
  function initLazyImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.6s ease';
      
      if (img.complete) {
        img.style.opacity = '1';
      } else {
        img.addEventListener('load', () => {
          img.style.opacity = '1';
        });
      }
    });
  }

  // ── Initialize ──
  document.addEventListener('DOMContentLoaded', function() {
    // Prevent scroll during loading
    document.body.style.overflow = 'hidden';
    
    initLoadingScreen();
    initFormHandling();
    initBackToTop();
    initLazyImages();
  });
})();
