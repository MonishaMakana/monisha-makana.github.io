/* ============================================================
   MONISHA MAKANA — PORTFOLIO JAVASCRIPT
   Features:
   - Dark / Light mode toggle (persisted in localStorage)
   - Typing animation in hero
   - Scroll-based reveal animations (IntersectionObserver)
   - Sticky navbar with scrolled state + active link highlighting
   - Mobile hamburger menu
   - Project filter by category
   - Contact form with validation feedback
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. THEME TOGGLE — Dark ↔ Light
  // ============================================================
  const html        = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const THEME_KEY   = 'mm-theme';

  // Load saved preference (default: dark)
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
  });


  // ============================================================
  // 2. TYPING ANIMATION — Hero role text
  // ============================================================
  const typedEl  = document.getElementById('typedText');
  const phrases  = [
    'college web projects',
    'interactive websites',
    'student-friendly apps',
    'responsive frontends',
    'lightweight solutions',
  ];

  let phraseIdx  = 0;
  let charIdx    = 0;
  let isDeleting = false;
  let typingTimer;

  function typeLoop() {
    const phrase = phrases[phraseIdx];

    if (!isDeleting) {
      // Typing forward
      typedEl.textContent = phrase.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === phrase.length) {
        // Pause at end then delete
        isDeleting = true;
        typingTimer = setTimeout(typeLoop, 1800);
        return;
      }
    } else {
      // Deleting
      typedEl.textContent = phrase.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx  = (phraseIdx + 1) % phrases.length;
        typingTimer = setTimeout(typeLoop, 400);
        return;
      }
    }

    const speed = isDeleting ? 45 : 75;
    typingTimer = setTimeout(typeLoop, speed);
  }

  // Start after a brief delay
  setTimeout(typeLoop, 1200);


  // ============================================================
  // 3. SCROLL REVEAL — IntersectionObserver
  // ============================================================
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children inside same parent group
        const el    = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => el.classList.add('visible'), delay);
        revealObserver.unobserve(el);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  // Add incremental stagger delays to sibling reveal elements
  const revealGroups = document.querySelectorAll(
    '.about-values, .skills-grid, .projects-grid, .timeline, .contact-grid, .footer-inner'
  );

  revealGroups.forEach(group => {
    const children = group.querySelectorAll('.reveal');
    children.forEach((child, idx) => {
      child.dataset.delay = idx * 80;
    });
  });

  revealEls.forEach(el => revealObserver.observe(el));


  // ============================================================
  // 4. NAVBAR — Scrolled state + Active link highlighting
  // ============================================================
  const navbar   = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateNavbar() {
    // Scrolled class for background blur
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    // Active section highlighting
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar(); // run once on load


  // ============================================================
  // 5. MOBILE HAMBURGER MENU
  // ============================================================
  const hamburger  = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on nav link click
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  // ============================================================
  // 6. PROJECT FILTER
  // ============================================================
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const category = card.dataset.category;
        const match    = filter === 'all' || category === filter;

        if (match) {
          card.classList.remove('hidden');
          // Re-trigger reveal animation
          card.classList.remove('visible');
          setTimeout(() => card.classList.add('visible'), 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  // ============================================================
  // 7. CONTACT FORM — Basic validation + UX feedback
  // ============================================================
  const contactForm = document.getElementById('contactForm');
  const formNote    = document.getElementById('formNote');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = contactForm.name.value.trim();
      const email   = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      // Simple validation
      if (!name || !email || !message) {
        formNote.textContent  = '⚠ Please fill in all required fields.';
        formNote.style.color  = '#f87171';
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        formNote.textContent  = '⚠ Please enter a valid email address.';
        formNote.style.color  = '#f87171';
        return;
      }

      // Simulate a successful send (replace with actual fetch/EmailJS call)
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.textContent  = 'Sending...';
      submitBtn.disabled     = true;

      setTimeout(() => {
        formNote.textContent  = '✓ Message sent! I'll get back to you soon.';
        formNote.style.color  = '#6ee7b7';
        contactForm.reset();
        submitBtn.textContent = 'Send Message →';
        submitBtn.disabled    = false;

        // Clear note after 5 seconds
        setTimeout(() => { formNote.textContent = ''; }, 5000);
      }, 1200);
    });
  }


  // ============================================================
  // 8. SMOOTH SCROLL for anchor links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // navbar height
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  // ============================================================
  // 9. HERO — immediate visibility for above-fold elements
  // ============================================================
  const heroReveals = document.querySelectorAll('.hero .reveal');
  heroReveals.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 120);
  });

});
