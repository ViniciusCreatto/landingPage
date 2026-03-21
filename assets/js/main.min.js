/* ============================================================
   MAIN.JS — Navegação, carrossel, formulário, back-to-top
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. ACTIVE LINK — destaca o item do menu pela página atual
     ---------------------------------------------------------- */
  function setActiveLink() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link').forEach(link => {
      const href = link.getAttribute('href');
      // Remove active de todos
      link.classList.remove('active-link');

      // Marca pelo href exato ou pela página atual
      if (
        href === page ||
        (page === '' && href === 'index.html') ||
        (page === 'index.html' && href === 'index.html')
      ) {
        link.classList.add('active-link');
      }
    });
  }
  setActiveLink();


  /* ----------------------------------------------------------
     2. HEADER — efeito scroll
     ---------------------------------------------------------- */
  const header = document.getElementById('header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 50);

    // Back to top
    const btn = document.getElementById('back-to-top');
    if (btn) btn.classList.toggle('visible', window.scrollY > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ----------------------------------------------------------
     3. MENU MOBILE
     ---------------------------------------------------------- */
  const navMenu   = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose  = document.getElementById('nav-close');

  // Cria overlay dinamicamente
  let overlay = document.querySelector('.nav__overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav__overlay';
    document.body.appendChild(overlay);
  }

  function openMenu() {
    navMenu?.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    navToggle?.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    navMenu?.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    navToggle?.setAttribute('aria-expanded', 'false');
  }

  navToggle?.addEventListener('click', openMenu);
  navClose?.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  // Fecha ao clicar em um link do menu
  navMenu?.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Fecha com ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });


  /* ----------------------------------------------------------
     4. BACK TO TOP + SMOOTH SCROLL
     ---------------------------------------------------------- */
  document.getElementById('back-to-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--header-h')) || 72;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ----------------------------------------------------------
     5. BEFORE/AFTER CAROUSEL
     ---------------------------------------------------------- */
  class BACarousel {
    constructor(container) {
      this.container = container;
      this.track = container.querySelector('.ba-carousel__track');
      this.slides = container.querySelectorAll('.ba-slide');
      this.prevBtn = container.querySelector('.ba-carousel__nav--prev');
      this.nextBtn = container.querySelector('.ba-carousel__nav--next');
      this.dots = container.querySelectorAll('.ba-dot');
      this.currentIndex = 0;
      this.autoplayInterval = null;

      this.init();
    }

    init() {
      this.showSlide(0);
      this.bindEvents();
      this.startAutoplay();
    }

    bindEvents() {
      this.prevBtn?.addEventListener('click', () => this.prev());
      this.nextBtn?.addEventListener('click', () => this.next());

      this.dots.forEach((dot, index) => {
        dot.addEventListener('click', () => this.goToSlide(index));
      });

      // Pause autoplay on hover
      this.container.addEventListener('mouseenter', () => this.stopAutoplay());
      this.container.addEventListener('mouseleave', () => this.startAutoplay());

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
      });
    }

    showSlide(index) {
      this.slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });

      this.dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });

      this.currentIndex = index;
    }

    next() {
      const nextIndex = (this.currentIndex + 1) % this.slides.length;
      this.showSlide(nextIndex);
    }

    prev() {
      const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
      this.showSlide(prevIndex);
    }

    goToSlide(index) {
      this.showSlide(index);
    }

    startAutoplay() {
      this.stopAutoplay();
      this.autoplayInterval = setInterval(() => this.next(), 4000);
    }

    stopAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
      }
    }
  }

  // Initialize carousels
  document.querySelectorAll('.ba-carousel').forEach(carousel => {
    new BACarousel(carousel);
  });

})();
