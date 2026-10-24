/* ══════════════════════════════════════════════
   SCRIPT.JS — Mir Sarfaraz Ahmed Portfolio v2
   Fully responsive across mobile, tablet, and desktop
══════════════════════════════════════════════ */

window.addEventListener('DOMContentLoaded', () => {

  /* ── Custom Cursor (Only on non-touch pointer devices) ── */
  const cdot  = document.getElementById('cdot');
  const cring = document.getElementById('cring');
  const isTouchDevice = ('ontouchstart' in window) ||
                        (navigator.maxTouchPoints > 0) ||
                        window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  if (cdot && cring && !isTouchDevice && window.innerWidth > 860) {
    let mx = -100, my = -100, rx = -100, ry = -100;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cdot.style.left = (mx - 3) + 'px';
      cdot.style.top  = (my - 3) + 'px';
    });

    (function animRing() {
      rx += (mx - rx - 14) * 0.12;
      ry += (my - ry - 14) * 0.12;
      cring.style.left = rx + 'px';
      cring.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    })();

    document.querySelectorAll('a, button, .proj-row, .channel, .cert-card, .magnetic-pill, .magnetic-card, .tech-node').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cdot.style.transform = 'scale(3)';
        cring.style.opacity  = '0';
      });
      el.addEventListener('mouseleave', () => {
        cdot.style.transform = 'scale(1)';
        cring.style.opacity  = '1';
      });
    });
  }

  /* ── Mobile & Tablet Nav Drawer ───────────── */
  const navToggle = document.getElementById('navToggle');
  const navDrawer = document.getElementById('navDrawer');

  if (navToggle && navDrawer) {
    const setDrawer = (isOpen) => {
      navDrawer.classList.toggle('open', isOpen);
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
      navDrawer.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !navDrawer.classList.contains('open');
      setDrawer(willOpen);
    });

    // Close when tapping links in drawer
    navDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        setDrawer(false);
      });
    });

    // Close on click outside drawer
    document.addEventListener('click', (e) => {
      if (navDrawer.classList.contains('open') &&
          !navDrawer.contains(e.target) &&
          !navToggle.contains(e.target)) {
        setDrawer(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navDrawer.classList.contains('open')) {
        setDrawer(false);
      }
    });

    // Auto close drawer if resized back to desktop (> 860px)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860 && navDrawer.classList.contains('open')) {
        setDrawer(false);
      }
    });
  }

  /* ── Scroll Reveal ───────────────────────── */
  const reveals = document.querySelectorAll('.reveal, .reveal-left');
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(r => revealObs.observe(r));
  } else {
    // Fallback if IntersectionObserver not supported
    reveals.forEach(r => r.classList.add('visible'));
  }


  /* ── Nav Active on Scroll (Desktop & Drawer) ────── */
  const sectionIds  = ['home', 'about', 'projects', 'certifications', 'contact'];
  const deskLinks   = document.querySelectorAll('.nav-links a');
  const drawerLinks = document.querySelectorAll('.drawer-links a');

  const updateActiveNav = () => {
    const y = window.scrollY + 100;
    sectionIds.forEach((id, i) => {
      const sec = document.getElementById(id);
      if (sec && y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight) {
        deskLinks.forEach(a => a.classList.remove('active'));
        if (deskLinks[i]) deskLinks[i].classList.add('active');

        drawerLinks.forEach(a => a.classList.remove('active'));
        if (drawerLinks[i]) drawerLinks[i].classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ── Scroll To Top Button ────────────────── */
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Responsive Accordion Height Fix on Resize ── */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.querySelectorAll('.proj-detail').forEach(det => {
        if (det.style.maxHeight && det.style.maxHeight !== '0px') {
          det.style.maxHeight = det.scrollHeight + 'px';
        }
      });
    }, 150);
  });

  /* ── Contact Form ────────────────────────── */
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (form && status) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const data = new FormData(form);
      const submitBtn = form.querySelector('.btn-submit');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Transmitting...';
      }
      try {
        const res = await fetch(form.action, {
          method: 'POST', body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          status.style.color   = '#4A7FA7';
          status.textContent   = '✓ MESSAGE TRANSMITTED SUCCESSFULLY';
          form.reset();
        } else {
          status.style.color   = '#e74c3c';
          status.textContent   = '✗ TRANSMISSION FAILED · PLEASE RETRY';
        }
      } catch {
        status.style.color = '#e74c3c';
        status.textContent = '✗ NETWORK ERROR · CHECK CONNECTION';
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = '► Transmit Message';
        }
      }
    });
  }

  /* ── 3D Magnetic Physics: Pills & Interactive Cards ── */
  if (!isTouchDevice) {
    // 1. Magnetic Pills (Buttons, Links, Tags)
    const magneticPills = document.querySelectorAll('.magnetic-pill');
    magneticPills.forEach(pill => {
      pill.addEventListener('mousemove', (e) => {
        const rect = pill.getBoundingClientRect();
        const halfW = rect.width / 2;
        const halfH = rect.height / 2;
        const offsetX = e.clientX - rect.left - halfW;
        const offsetY = e.clientY - rect.top - halfH;

        pill.style.transform = `translate3d(${offsetX * 0.28}px, ${offsetY * 0.28}px, 0) rotateX(${-offsetY * 0.12}deg) rotateY(${offsetX * 0.12}deg) scale(1.04)`;
      });

      pill.addEventListener('mouseleave', () => {
        pill.style.transform = 'translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) scale(1)';
      });
    });

    // 2. Magnetic Cards (Tech Nodes, Cert Cards, Hero Profile Panel)
    const magneticCards = document.querySelectorAll('.magnetic-card');
    magneticCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const halfW = rect.width / 2;
        const halfH = rect.height / 2;
        const offsetX = e.clientX - rect.left - halfW;
        const offsetY = e.clientY - rect.top - halfH;

        card.style.transform = `translate3d(${offsetX * 0.08}px, ${offsetY * 0.08}px, 0) rotateX(${-offsetY * 0.04}deg) rotateY(${offsetX * 0.04}deg) scale(1.015)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) scale(1)';
      });
    });
  }

  /* ── Cinematic Motion Footer: Giant Parallax Text ── */
  const giantText = document.getElementById('footerGiantText');
  const footerWrap = document.getElementById('footerRevealWrap');
  if (giantText && footerWrap) {
    const handleFooterParallax = () => {
      const rect = footerWrap.getBoundingClientRect();
      const winH = window.innerHeight;
      if (rect.top <= winH && rect.bottom >= 0) {
        const progress = (winH - rect.top) / (winH + rect.height);
        const maxShift = window.innerWidth <= 860 ? 12 : 35;
        const shiftY = (1 - progress) * maxShift;
        giantText.style.transform = `translateX(-50%) translateY(${shiftY}px)`;
      }
    };
    window.addEventListener('scroll', handleFooterParallax, { passive: true });
    handleFooterParallax();
  }

  /* ── Cinematic Motion Footer: Back To Top ── */
  const footerScrollTopBtn = document.getElementById('footerScrollTopBtn');
  if (footerScrollTopBtn) {
    footerScrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});

/* ── Project Expand (global so onclick works) ── */
function toggleProject(i) {
  const det  = document.getElementById('pdet' + i);
  const arr  = document.getElementById('parr' + i);
  if (!det) return;

  const isOpen = det.style.maxHeight && det.style.maxHeight !== '0px';

  // Close all other details
  document.querySelectorAll('.proj-detail').forEach(d => d.style.maxHeight = '0px');
  document.querySelectorAll('.p-arrow').forEach(a => a.textContent = '▼');

  if (!isOpen) {
    det.style.maxHeight = det.scrollHeight + 'px';
    if (arr) arr.textContent = '▲';

    // Recalculate once inner images or fonts settle
    setTimeout(() => {
      if (det.style.maxHeight !== '0px') {
        det.style.maxHeight = det.scrollHeight + 'px';
      }
    }, 250);
  }
}

/* -- Contact Form Reveal (Footer Email Me Button) -- */
(function initContactFormReveal() {
  var emailBtn   = document.getElementById('footerEmailBtn');
  var formWrap   = document.getElementById('contactFormWrap');
  var closeBtn   = document.getElementById('formCloseBtn');
  var contactSec = document.getElementById('contact');

  if (!emailBtn || !formWrap || !closeBtn) return;

  function openForm() {
    contactSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(function() {
      formWrap.classList.add('form-open');
      var firstInput = formWrap.querySelector('input, textarea');
      if (firstInput) setTimeout(function() { firstInput.focus(); }, 200);
    }, 420);
  }

  function closeForm() {
    formWrap.classList.remove('form-open');
  }

  emailBtn.addEventListener('click', openForm);
  closeBtn.addEventListener('click', closeForm);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && formWrap.classList.contains('form-open')) {
      closeForm();
    }
  });
})();
