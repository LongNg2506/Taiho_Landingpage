/* ============================================================
   Taihō Coffee & Tea — Floating Dust Particles
   ============================================================ */

(function() {
  'use strict';

  function initParticles() {
    const canvas = document.getElementById('hero-particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let width, height;

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }

    function createParticle() {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      return {
        x: Math.random() * width,
        y: height + Math.random() * 50,
        size: Math.random() * 2 + 0.5,
        speedY: -(Math.random() * 0.3 + 0.1),
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.4 + 0.1,
        life: 0,
        maxLife: Math.random() * 500 + 300,
        color: isDark 
          ? `rgba(243, 239, 232, ${Math.random() * 0.3 + 0.05})`
          : `rgba(29, 38, 69, ${Math.random() * 0.15 + 0.03})`
      };
    }

    function update() {
      ctx.clearRect(0, 0, width, height);

      // Add new particles occasionally
      if (particles.length < 40 && Math.random() < 0.05) {
        particles.push(createParticle());
      }

      particles = particles.filter(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.life++;

        // Fade in and out
        let alpha = p.opacity;
        if (p.life < 50) {
          alpha = (p.life / 50) * p.opacity;
        } else if (p.life > p.maxLife - 80) {
          alpha = ((p.maxLife - p.life) / 80) * p.opacity;
        }

        if (p.life >= p.maxLife || p.y < -10) return false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        return true;
      });

      animationId = requestAnimationFrame(update);
    }

    // Initialize
    resize();
    window.addEventListener('resize', resize);
    update();

    // Cleanup on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        update();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initParticles);
})();
