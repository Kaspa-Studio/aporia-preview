/* ============================================
   APORIA LANDING PAGE — Scripts
   Scroll animations, mobile menu, navbar
   ============================================ */

(function () {
  'use strict';

  // ---- Mobile Menu Toggle ----
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    // Close menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
  }

  // ---- Navbar background on scroll ----
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      navbar.style.background = 'rgba(19, 19, 26, 0.95)';
    } else {
      navbar.style.background = 'rgba(19, 19, 26, 0.85)';
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ---- Scroll-triggered Animations (IntersectionObserver) ----
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    animatedElements.forEach((el, index) => {
      // Stagger siblings within the same parent
      el.style.transitionDelay = `${index % 4 * 0.1}s`;
      observer.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    animatedElements.forEach(el => el.classList.add('visible'));
  }

  // ---- Smooth stagger for prop cards within same grid ----
  document.querySelectorAll('.props-grid, .steps-grid, .stats-grid, .team-grid').forEach(grid => {
    const children = grid.querySelectorAll('.animate-on-scroll');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.12}s`;
    });
  });

  // ---- "In progress" toast for placeholder links ----
  const toast = document.createElement('div');
  toast.className = 'toast';
  document.body.appendChild(toast);

  let toastTimer = null;

  function showToast(anchor, message) {
    clearTimeout(toastTimer);
    toast.classList.remove('toast--visible');
    toast.textContent = message || 'In progress';

    const rect = anchor.getBoundingClientRect();
    const gap = 10;
    const estimatedHeight = 44;

    let top = rect.top - estimatedHeight - gap;
    if (top < 8) top = rect.bottom + gap; // flip below if near the top edge

    toast.style.top  = `${top}px`;
    toast.style.left = `${rect.left + rect.width / 2}px`;

    void toast.offsetWidth; // force reflow so transition replays
    toast.classList.add('toast--visible');
    toastTimer = setTimeout(() => toast.classList.remove('toast--visible'), 2000);
  }

  // Logo scrolls back to top
  const navLogo = document.querySelector('.nav-logo');
  if (navLogo) {
    navLogo.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (!e.currentTarget.dataset.toast) return;
      showToast(e.currentTarget, e.currentTarget.dataset.toast);
    });
  });

})();
