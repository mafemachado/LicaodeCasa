document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     HEADER SCROLL EFFECT & ACTIVE STATE
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  
  function handleScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
    
    // Active link highlighting on scroll
    let current = '';
    const sections = document.querySelectorAll('section[id], header[id], main[id]');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 140)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run once initially

  /* ==========================================================================
     MOBILE NAVIGATION MENU
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('is-active')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-active');
      }
    });
  }

  /* ==========================================================================
     SCROLL REVEAL (INTERSECTION OBSERVER) & STAGGER SETUP
     ========================================================================== */
  // Apply index variables to reveal groups for CSS animations delay
  document.querySelectorAll('.reveal-group').forEach(group => {
    Array.from(group.children).forEach((child, index) => {
      child.style.setProperty('--i', index);
    });
  });

  const revealOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        
        // If this section contains stat counters, run them
        const counters = entry.target.querySelectorAll('.stat-num');
        if (counters.length > 0) {
          counters.forEach(counter => {
            if (!counter.classList.contains('animated')) {
              counter.classList.add('animated');
              const target = parseInt(counter.getAttribute('data-target'), 10);
              animateCountUp(counter, target);
            }
          });
        }
        
        revealObserver.unobserve(entry.target); // Animate once
      }
    });
  }, revealOptions);

  document.querySelectorAll('.reveal').forEach(element => {
    revealObserver.observe(element);
  });

  /* ==========================================================================
     STATISTICS COUNT-UP ANIMATION
     ========================================================================== */
  function animateCountUp(el, target, duration = 1600) {
    const start = performance.now();
    
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(eased * target);
      
      if (target === 92) {
        el.textContent = val + '%';
      } else if (target === 100) {
        el.textContent = val + '%';
      } else if (target === 12 || target === 15) {
        el.textContent = val + '+';
      } else {
        el.textContent = val;
      }
      
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        if (target === 92 || target === 100) el.textContent = target + '%';
        else if (target === 12 || target === 15) el.textContent = target + '+';
        else el.textContent = target;
      }
    }
    
    requestAnimationFrame(tick);
  }

  /* ==========================================================================
     NEWSLETTER FORM SUBMISSION
     ========================================================================== */
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterSuccess = document.getElementById('newsletter-success');

  if (newsletterForm && newsletterSuccess) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        let newsletters = JSON.parse(localStorage.getItem('newsletters_licao_de_casa')) || [];
        newsletters.push({ email: emailInput.value, data: new Date().toISOString() });
        localStorage.setItem('newsletters_licao_de_casa', JSON.stringify(newsletters));

        newsletterForm.reset();
        newsletterSuccess.style.display = 'block';
        setTimeout(() => {
          newsletterSuccess.style.display = 'none';
        }, 5000);
      }
    });
  }

  /* ==========================================================================
     APPROVED MARQUEE ACTIVE CENTER EFFECT
     ========================================================================== */
  const marquee = document.querySelector('.logo-marquee');
  const marqueeItems = document.querySelectorAll('.logo-marquee__item--img');
  
  if (marquee && marqueeItems.length > 0) {
    let animationFrameId;
    let isVisible = false;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          checkCenter();
        } else {
          cancelAnimationFrame(animationFrameId);
        }
      });
    }, { threshold: 0.1 });
    
    function checkCenter() {
      if (!isVisible) return;
      
      const marqueeRect = marquee.getBoundingClientRect();
      const marqueeCenter = marqueeRect.left + marqueeRect.width / 2;
      
      marqueeItems.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2;
        const distance = Math.abs(itemCenter - marqueeCenter);
        
        if (distance < 110) {
          item.classList.add('in-center');
        } else {
          item.classList.remove('in-center');
        }
      });
      
      animationFrameId = requestAnimationFrame(checkCenter);
    }
    
    observer.observe(marquee);
  }

  /* ==========================================================================
     ANALYTICS & CLICK TRACKING
     ========================================================================== */
  const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
  whatsappButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      console.log(`[Analytics] Clique no link do WhatsApp institucional.`);
    });
  });

});
