(function () {
  'use strict';

  /* ─── Year ────────────────────────────────────────────── */
  var yrEl = document.getElementById('yr');
  if (yrEl) yrEl.textContent = new Date().getFullYear();

  /* ─── Fixed Navbar Scrolled Class ────────────────────── */
  var navbar = document.getElementById('navbar');
  var topbar = document.querySelector('.topbar');

  function handleNavScroll() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ─── Mobile Drawer ───────────────────────────────────── */
  var hamburger   = document.getElementById('hamburger');
  var drawer      = document.getElementById('mobileDrawer');
  var drawerScrim = document.getElementById('drawerScrim');
  var drawerClose = document.getElementById('drawerClose');

  function openDrawer() {
    if (!drawer || !hamburger) return;
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!drawer || !hamburger) return;
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      drawer && drawer.classList.contains('open') ? closeDrawer() : openDrawer();
    });
  }
  if (drawerScrim) drawerScrim.addEventListener('click', closeDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);

  /* Close drawer on any hash-link click inside it */
  if (drawer) {
    drawer.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });
  }

  /* ─── Smooth Scroll ───────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var topbarH = topbar ? topbar.offsetHeight : 0;
      var navbarH = navbar ? navbar.offsetHeight : 0;
      var offset  = topbarH + navbarH + 12;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ─── Scroll Reveal ───────────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var d  = parseInt(el.getAttribute('data-d') || '0', 10);
        /* stagger delay: 0ms, 100ms, 200ms, 300ms */
        setTimeout(function () { el.classList.add('visible'); }, d * 100);
        revealObserver.unobserve(el);
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -32px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    /* fallback: show everything immediately */
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ─── Estimate Form ───────────────────────────────────── */
  var estimateForm = document.getElementById('estimateForm');
  var toast        = document.getElementById('toast');

  function showToast() {
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 4200);
  }

  if (estimateForm) {
    estimateForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn  = estimateForm.querySelector('button[type="submit"]');
      if (!btn) return;
      var orig = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(function () {
        estimateForm.reset();
        btn.textContent = orig;
        btn.disabled = false;
        showToast();
      }, 1200);
    });
  }

  /* ─── Active Nav Link ─────────────────────────────────── */
  var sections  = document.querySelectorAll('section[id]');
  var navLinks  = document.querySelectorAll('.nav-links .nav-link');

  function updateActiveLink() {
    if (!sections.length || !navLinks.length) return;
    var topbarH = topbar ? topbar.offsetHeight : 0;
    var navbarH = navbar ? navbar.offsetHeight : 0;
    var scrollY = window.scrollY + topbarH + navbarH + 40;
    var current  = '';
    sections.forEach(function (section) {
      if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === current);
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });

  /* ─── Phone Input Format ──────────────────────────────── */
  var phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      var v = this.value.replace(/\D/g, '').slice(0, 10);
      if (v.length >= 6) {
        v = '(' + v.slice(0, 3) + ') ' + v.slice(3, 6) + '-' + v.slice(6);
      } else if (v.length >= 3) {
        v = '(' + v.slice(0, 3) + ') ' + v.slice(3);
      }
      this.value = v;
    });
  }

  /* ─── Testimonial Rotator ─────────────────────────────── */
  var track   = document.getElementById('testimonialsTrack');
  var dots    = document.querySelectorAll('.t-dot');
  var prevBtn = document.getElementById('tPrev');
  var nextBtn = document.getElementById('tNext');

  if (track && dots.length) {
    var current    = 0;
    var total      = dots.length;
    var autoTimer  = null;

    function goTo(n) {
      current = (n % total + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === current);
        d.setAttribute('aria-selected', i === current ? 'true' : 'false');
      });
    }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(function () { goTo(current + 1); }, 5500);
    }
    function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }

    if (prevBtn) prevBtn.addEventListener('click', function () { stopAuto(); goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { stopAuto(); goTo(current + 1); startAuto(); });

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        stopAuto();
        goTo(parseInt(this.getAttribute('data-index'), 10));
        startAuto();
      });
    });

    /* touch swipe */
    var touchStartX = 0;
    track.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
      stopAuto();
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { diff > 0 ? goTo(current + 1) : goTo(current - 1); }
      startAuto();
    }, { passive: true });

    goTo(0);
    startAuto();
  }

  /* ─── Before / After Slider ───────────────────────────── */
  var ba = document.getElementById('ba');

  if (ba) {
    var dragging = false;

    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

    function applySplit(clientX) {
      var rect = ba.getBoundingClientRect();
      var pct  = clamp(((clientX - rect.left) / rect.width) * 100, 3, 97);
      ba.style.setProperty('--split', pct.toFixed(2) + '%');
    }

    ba.addEventListener('pointerdown', function (e) {
      dragging = true;
      ba.setPointerCapture(e.pointerId);
      applySplit(e.clientX);
    });

    ba.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      applySplit(e.clientX);
    });

    ba.addEventListener('pointerup',     function () { dragging = false; });
    ba.addEventListener('pointercancel', function () { dragging = false; });

    /* prevent context menu on long-press mobile */
    ba.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  }

})();
