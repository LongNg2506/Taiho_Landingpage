/* ============================================================
   Taihō Coffee & Tea — Hero Video Controller
   Handles autoplay, visibility-based pause, and mobile fallback
   ============================================================ */

(function () {
  'use strict';

  const video = document.querySelector('.hero__video');
  if (!video) return;

  // Attempt autoplay (some browsers block it)
  function tryPlay() {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(function () {
        // Autoplay was prevented — video will show poster image as fallback
        video.setAttribute('controls', '');
      });
    }
  }

  // Play when ready
  if (video.readyState >= 3) {
    tryPlay();
  } else {
    video.addEventListener('canplay', tryPlay, { once: true });
  }

  // Pause video when hero is off-screen for performance
  const heroSection = document.getElementById('hero');
  if ('IntersectionObserver' in window && heroSection) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            video.play().catch(function () {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(heroSection);
  }

  // Reduce motion preference: pause video and show poster
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.pause();
    video.style.display = 'none';
  }

})();
