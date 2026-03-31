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
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Se for link âncora (#), faz smooth scroll e fecha menu
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          closeMenu(); // Fecha menu mobile
          target.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Se for link normal, apenas fecha o menu
        closeMenu();
      }
    });
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

  /* ----------------------------------------------------------  
     6. CONTACT FORM HANDLING
     ---------------------------------------------------------- */
  class ContactForm {
    constructor(formElement) {
      this.form = formElement;
      this.submitBtn = this.form.querySelector('.btn-submit');
      this.btnText = this.submitBtn.querySelector('.btn-text');
      this.btnLoading = this.submitBtn.querySelector('.btn-loading');
      this.messageDiv = document.getElementById('form-message');
      this.charCount = document.getElementById('char-count');
      this.charCounter = document.querySelector('.char-counter');
      
      this.init();
    }

    init() {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      
      // Phone mask
      const phoneInput = this.form.querySelector('#phone');
      phoneInput.addEventListener('input', (e) => this.applyPhoneMask(e.target));
      phoneInput.addEventListener('focus', (e) => {
        if (!e.target.value) e.target.value = '(';
      });
      
      // Character counter for textarea
      const messageTextarea = this.form.querySelector('#message');
      messageTextarea.addEventListener('input', (e) => this.updateCharCount(e.target));
      
      // Real-time validation
      const inputs = this.form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => {
          this.clearFieldError(input);
          this.updateSubmitButton();
        });
      });
      
      // Checkbox validation (se existir)
      const privacyCheckbox = this.form.querySelector('#privacy');
      if (privacyCheckbox) {
        privacyCheckbox.addEventListener('change', () => {
          this.validateField(privacyCheckbox);
          this.updateSubmitButton();
        });
      }
      
      // Initialize submit button state
      this.updateSubmitButton();
    }

    applyPhoneMask(input) {
      let value = input.value.replace(/\D/g, '');
      
      if (value.length <= 11) {
        if (value.length <= 2) {
          value = value.replace(/(\d{0,2})/, '($1');
        } else if (value.length <= 6) {
          value = value.replace(/(\d{2})(\d{0,4})/, '($1) $2');
        } else if (value.length <= 10) {
          value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else {
          value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }
      }
      
      input.value = value;
    }

    updateCharCount(textarea) {
      const count = textarea.value.length;
      this.charCount.textContent = count;
      
      if (count > 450) {
        this.charCounter.classList.add('warning');
      } else {
        this.charCounter.classList.remove('warning');
      }
    }

    validateField(field) {
      const value = field.value.trim();
      const errorElement = document.getElementById(`${field.id}-error`);
      
      if (!errorElement) return;
      
      let isValid = true;
      let errorMessage = '';
      
      switch (field.id) {
        case 'name':
          if (!value) {
            isValid = false;
            errorMessage = 'Nome é obrigatório';
          } else if (value.length < 2) {
            isValid = false;
            errorMessage = 'Nome deve ter pelo menos 2 caracteres';
          } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
            isValid = false;
            errorMessage = 'Nome deve conter apenas letras e espaços';
          }
          break;
          
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!value) {
            isValid = false;
            errorMessage = 'E-mail é obrigatório';
          } else if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'E-mail inválido';
          }
          break;
          
        case 'phone':
          const cleanPhone = value.replace(/\D/g, '');
          if (!value) {
            isValid = false;
            errorMessage = 'Telefone é obrigatório';
          } else if (cleanPhone.length < 10 || cleanPhone.length > 11) {
            isValid = false;
            errorMessage = 'Telefone deve ter 10 ou 11 dígitos';
          }
          break;
          
        case 'privacy':
          if (!field.checked) {
            isValid = false;
            errorMessage = 'Você deve aceitar a Política de Privacidade';
          }
          break;
      }
      
      if (!isValid) {
        errorElement.textContent = errorMessage;
        field.setAttribute('aria-invalid', 'true');
        field.classList.add('error');
      } else {
        errorElement.textContent = '';
        field.setAttribute('aria-invalid', 'false');
        field.classList.remove('error');
      }
      
      return isValid;
    }

    clearFieldError(field) {
      const errorElement = document.getElementById(`${field.id}-error`);
      if (errorElement) {
        errorElement.textContent = '';
        field.setAttribute('aria-invalid', 'false');
        field.classList.remove('error');
      }
    }

    updateSubmitButton() {
      const requiredFields = this.form.querySelectorAll('input[required], textarea[required], select[required]');
      const privacyCheckbox = this.form.querySelector('#privacy');
      
      let allValid = true;
      
      requiredFields.forEach(field => {
        if (!this.validateField(field)) {
          allValid = false;
        }
      });
      
      // Verificar checkbox privacy apenas se existir
      if (privacyCheckbox && !privacyCheckbox.checked) {
        allValid = false;
      }
      
      this.submitBtn.disabled = !allValid;
    }

    async handleSubmit(e) {
      e.preventDefault();
      
      // Final validation
      const inputs = this.form.querySelectorAll('input[required], textarea[required], select[required]');
      const privacyCheckbox = this.form.querySelector('#privacy');
      let isFormValid = true;
      
      inputs.forEach(input => {
        if (!this.validateField(input)) {
          isFormValid = false;
        }
      });
      
      if (privacyCheckbox && !privacyCheckbox.checked) {
        this.validateField(privacyCheckbox);
        isFormValid = false;
      }
      
      if (!isFormValid) {
        this.showMessage('Por favor, corrija os erros no formulário.', 'error');
        return;
      }
      
      // Show loading state
      this.setLoading(true);
      
      try {
        // Simulate form submission (replace with actual API call)
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate success (replace with actual response handling)
        this.showMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        this.form.reset();
        this.charCount.textContent = '0';
        this.charCounter.classList.remove('warning');
        this.updateSubmitButton();
        
      } catch (error) {
        this.showMessage('Erro ao enviar mensagem. Tente novamente.', 'error');
      } finally {
        this.setLoading(false);
      }
    }

    setLoading(isLoading) {
      this.submitBtn.disabled = isLoading;
      
      if (isLoading) {
        this.btnText.style.display = 'none';
        this.btnLoading.style.display = 'block';
      } else {
        this.btnText.style.display = 'block';
        this.btnLoading.style.display = 'none';
      }
    }

    showMessage(message, type) {
      this.messageDiv.textContent = message;
      this.messageDiv.className = `form-message ${type}`;
      this.messageDiv.style.display = 'block';
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        this.messageDiv.style.display = 'none';
      }, 5000);
    }
  }

  // Initialize contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    new ContactForm(contactForm);
  }

})();
