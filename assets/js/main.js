/* ==========================================================================
   Lindenhof Hausverwaltung GmbH — Interaktion
   ========================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------------------------------------------- Kopf & Fortschritt */
  var head     = $('.head');
  var progress = $('.progress');
  var toTop    = $('.totop');
  var statsBg  = $('.stats__bg');
  var ticking  = false;

  function onScroll() {
    var y   = window.scrollY || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;

    if (head)  head.classList.toggle('is-stuck', y > 12);
    if (toTop) toTop.classList.toggle('is-on', y > 700);
    if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

    if (statsBg && !reduce) {
      var r = statsBg.parentElement.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        var p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
        statsBg.style.transform = 'translate3d(0,' + ((p - 0.5) * 56).toFixed(2) + 'px,0)';
      }
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  /* ------------------------------------------------------------ Mobilmenü */
  var burger = $('.burger');
  var mobile = $('.mobile');

  function closeMenu() {
    if (!burger || !mobile) return;
    burger.setAttribute('aria-expanded', 'false');
    mobile.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (burger && mobile) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      mobile.classList.toggle('is-open', !open);
      document.body.style.overflow = !open ? 'hidden' : '';
    });
    $$('.mobile__nav a, .mobile .btn', mobile).forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* -------------------------------------------------------- Scroll-Reveal */
  var revs = $$('[data-rev]');
  if (revs.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      revs.forEach(function (el) { el.classList.add('is-rev'); });
    } else {
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-rev');
          ro.unobserve(e.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

      revs.forEach(function (el, i) {
        var group = el.closest('[data-rev-group]');
        if (group && !el.style.getPropertyValue('--d')) {
          var sibs = $$('[data-rev]', group);
          el.style.setProperty('--d', (sibs.indexOf(el) * 80) + 'ms');
        }
        ro.observe(el);
      });
    }
  }

  /* ------------------------------------------------------------- Zählwerk */
  function countUp(el) {
    var target  = parseFloat(el.dataset.count);
    var dec     = parseInt(el.dataset.dec || '0', 10);
    var dur     = 1500;
    var start   = null;

    function fmt(v) {
      return v.toLocaleString('de-DE', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    }
    if (reduce) { el.textContent = fmt(target); return; }

    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * e);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(target);
    }
    requestAnimationFrame(tick);
  }

  var counters = $$('[data-count]');
  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(countUp);
    } else {
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          countUp(e.target);
          co.unobserve(e.target);
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { co.observe(el); });
    }
  }

  /* ------------------------------------------------------- Objektfilter */
  var filters = $$('.filter');
  var objs    = $$('.obj');

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.dataset.filter;
      filters.forEach(function (b) {
        b.classList.toggle('is-on', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
      objs.forEach(function (o) {
        var show = f === 'alle' || (o.dataset.cat || '').split(' ').indexOf(f) > -1;
        o.classList.remove('is-in');
        o.classList.toggle('is-hidden', !show);
        if (show && !reduce) { void o.offsetWidth; o.classList.add('is-in'); }
      });
    });
  });

  /* ------------------------------------------------------------- Lightbox */
  var lb = $('.lb');
  if (lb) {
    var lbImg   = $('.lb__box img', lb);
    var lbTitle = $('[data-lb="title"]', lb);
    var lbLoc   = $('[data-lb="loc"]', lb);
    var lbDesc  = $('[data-lb="desc"]', lb);
    var lbFacts = $('.lb__facts', lb);
    var lastFocus = null;

    function openLb(o) {
      lastFocus = o;
      lbImg.src = o.dataset.img;
      lbImg.alt = o.dataset.title;
      lbTitle.textContent = o.dataset.title;
      lbLoc.textContent   = o.dataset.loc;
      lbDesc.textContent  = o.dataset.desc;
      lbFacts.innerHTML = [
        ['Nutzungsart',  o.dataset.typ],
        ['Einheiten',    o.dataset.units],
        ['Baujahr',      o.dataset.year],
        ['Leistung',     o.dataset.service],
        ['Im Bestand seit', o.dataset.since]
      ].map(function (r) {
        return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>';
      }).join('');
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      $('.lb__close', lb).focus();
    }

    function closeLb() {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    objs.forEach(function (o) { o.addEventListener('click', function () { openLb(o); }); });
    $('.lb__close', lb).addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { if (lb.classList.contains('is-open')) closeLb(); closeMenu(); }
    });
  }

  /* ------------------------------------------------------------- Stimmen */
  var track = $('.voices__track');
  if (track) {
    var slides = $$('.voice', track);
    var dots   = $$('.vdot');
    var idx    = 0;
    var timer  = null;

    function go(n) {
      idx = (n + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (idx * 100) + '%)';
      dots.forEach(function (d, i) {
        d.classList.toggle('is-on', i === idx);
        d.setAttribute('aria-current', String(i === idx));
      });
      slides.forEach(function (s, i) { s.setAttribute('aria-hidden', String(i !== idx)); });
    }
    function play() {
      if (reduce) return;
      stop();
      timer = setInterval(function () { go(idx + 1); }, 7000);
    }
    function stop() { if (timer) clearInterval(timer); }

    $('.vbtn--prev').addEventListener('click', function () { go(idx - 1); play(); });
    $('.vbtn--next').addEventListener('click', function () { go(idx + 1); play(); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); play(); }); });
    $('.voices').addEventListener('mouseenter', stop);
    $('.voices').addEventListener('mouseleave', play);
    go(0); play();
  }

  /* ------------------------------------------------------------------ FAQ */
  $$('.faq__item').forEach(function (item) {
    var q = $('.faq__q', item);
    var a = $('.faq__a', item);
    q.addEventListener('click', function () {
      var open = item.classList.contains('is-open');
      $$('.faq__item').forEach(function (other) {
        if (other === item) return;
        other.classList.remove('is-open');
        $('.faq__q', other).setAttribute('aria-expanded', 'false');
        $('.faq__a', other).style.height = '0px';
      });
      item.classList.toggle('is-open', !open);
      q.setAttribute('aria-expanded', String(!open));
      a.style.height = open ? '0px' : a.firstElementChild.offsetHeight + 'px';
    });
  });

  window.addEventListener('resize', function () {
    var open = $('.faq__item.is-open');
    if (open) $('.faq__a', open).style.height = $('.faq__a > div', open).offsetHeight + 'px';
  });

  /* ----------------------------------------------------------- Scrollspy */
  var navLinks = $$('.nav__link[href^="#"]');
  var targets  = navLinks.map(function (l) { return $(l.getAttribute('href')); }).filter(Boolean);
  if (targets.length && 'IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (l) {
          l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach(function (t) { so.observe(t); });
  }

  /* -------------------------------------------------------------- Formular */
  var form = $('#anfrage');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var ok  = $('.form__ok');
      var err = $('.form__err');
      var btn = form.querySelector('button[type="submit"]');

      err.classList.remove('is-on');
      btn.disabled = true;
      form.classList.add('is-sending');

      // Netlify Forms nimmt den POST auf der eigenen Domain entgegen.
      fetch(form.getAttribute('action') || window.location.pathname, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          form.reset();
          form.classList.remove('is-sending');
          ok.classList.add('is-on');
          ok.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
        })
        .catch(function () {
          form.classList.remove('is-sending');
          btn.disabled = false;
          err.classList.add('is-on');
          err.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
        });
    });
  }

  /* ------------------------------------------------------------- Jahreszahl */
  $$('[data-year-now]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* -------------------------------- Laufband verdoppeln (nahtlose Schleife) */
  var track2 = $('.register__track');
  if (track2 && !reduce) track2.innerHTML += track2.innerHTML;
})();
