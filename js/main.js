(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- sticky header ---------- */
  var hdr = document.getElementById('hdr');
  /* ---------- mobile menu ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  function closeMenu() {
    document.body.classList.remove('menu-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealables = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- counters ---------- */
  function runCount(el) {
    var to = parseFloat(el.getAttribute('data-count'));
    var from = parseFloat(el.getAttribute('data-from') || '0');
    if (reduced) { el.textContent = String(to); return; }
    var dur = 1100, t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(from + (to - from) * e));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var nums = document.querySelectorAll('.num[data-count]');
  if ('IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCount(en.target); io2.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    nums.forEach(function (el) { io2.observe(el); });
  }

  /* ---------- 34-tick dial ---------- */
  var dial = document.getElementById('dial');
  if (dial) {
    var ns = 'http://www.w3.org/2000/svg', N = 34, out = '';
    for (var i = 0; i < N; i++) {
      var a = (i / N) * Math.PI * 2 - Math.PI / 2;
      var r1 = 88, r2 = i % 5 === 0 ? 116 : 106;
      out += '<line x1="' + (120 + Math.cos(a) * r1).toFixed(2) + '" y1="' + (120 + Math.sin(a) * r1).toFixed(2) +
             '" x2="' + (120 + Math.cos(a) * r2).toFixed(2) + '" y2="' + (120 + Math.sin(a) * r2).toFixed(2) + '"/>';
    }
    dial.setAttribute('viewBox', '0 0 240 240');
    dial.innerHTML = out;
    void ns;
  }

  /* ---------- scroll-linked motion ---------- */
  var parallax = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var drifts = Array.prototype.slice.call(document.querySelectorAll('[data-drift]'));
  var ticking = false;
  function onScroll() {
    if (hdr) hdr.classList.toggle('is-stuck', window.scrollY > 24);
    if (reduced) return;
    var vh = window.innerHeight;
    parallax.forEach(function (el) {
      var k = parseFloat(el.getAttribute('data-parallax'));
      el.style.transform = 'translate3d(0,' + (window.scrollY * k).toFixed(1) + 'px,0)';
    });
    drifts.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var p = (vh - r.top) / (vh + r.height);
      p = Math.max(0, Math.min(1, p));
      el.style.transform = 'translate3d(' + ((p - 0.5) * parseFloat(el.getAttribute('data-drift'))).toFixed(1) + 'px,0,0)';
    });
  }
  function tick() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScroll(); ticking = false; });
  }
  window.addEventListener('scroll', tick, { passive: true });
  window.addEventListener('resize', tick);
  onScroll();

  /* ---------- product prefill ---------- */
  var select = document.getElementById('f-product');
  document.querySelectorAll('[data-prefill]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (select) select.value = a.getAttribute('data-prefill');
    });
  });

  /* ---------- phone mask +7 (999) 999-99-99 ---------- */
  var phone = document.getElementById('f-phone');
  function formatPhone(raw) {
    var d = raw.replace(/\D/g, '');
    if (d[0] === '8') d = '7' + d.slice(1);
    if (d[0] !== '7') d = '7' + d;
    d = d.slice(0, 11);
    var out = '+7';
    if (d.length > 1) out += ' (' + d.slice(1, 4);
    if (d.length >= 5) out += ') ' + d.slice(4, 7);
    if (d.length >= 8) out += '-' + d.slice(7, 9);
    if (d.length >= 10) out += '-' + d.slice(9, 11);
    return out;
  }
  if (phone) {
    phone.addEventListener('focus', function () { if (!phone.value) phone.value = '+7 ('; });
    phone.addEventListener('input', function () { phone.value = formatPhone(phone.value); });
    phone.addEventListener('blur', function () { if (phone.value.replace(/\D/g, '').length <= 1) phone.value = ''; });
  }

  /* ---------- validation + submit ---------- */
  var form = document.getElementById('orderForm');
  if (!form) return;
  var status = document.getElementById('formStatus');
  var btn = document.getElementById('submitBtn');
  var EMAIL = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

  var rules = {
    name: function (v) { return v.trim().length >= 2 || 'Укажите имя'; },
    email: function (v) { return EMAIL.test(v.trim()) || 'Похоже, в адресе опечатка'; },
    phone: function (v) { return v.replace(/\D/g, '').length === 11 || 'Телефон в формате +7 (999) 999-99-99'; },
    company: function (v) { return v.trim().length >= 2 || 'Укажите название предприятия'; },
    region: function (v) { return v.trim().length >= 2 || 'Укажите регион поставки'; },
    product: function (v) { return !!v || 'Выберите солод'; },
    volume: function (v) {
      var n = parseFloat(String(v).replace(',', '.'));
      if (!v || isNaN(n)) return 'Укажите объём в тоннах';
      return n >= 5 || 'Минимальная партия — от 5 тонн';
    }
  };

  function setError(el, msg) {
    var field = el.closest('.field');
    var slot = field.querySelector('.err');
    field.classList.toggle('is-bad', !!msg);
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (slot) slot.textContent = msg || '';
  }

  function checkField(el) {
    var rule = rules[el.name];
    if (!rule) return true;
    var res = rule(el.value);
    setError(el, res === true ? '' : res);
    return res === true;
  }

  Object.keys(rules).forEach(function (n) {
    var el = form.elements[n];
    if (!el) return;
    el.addEventListener('blur', function () { checkField(el); });
    el.addEventListener('input', function () { if (el.closest('.field').classList.contains('is-bad')) checkField(el); });
    el.addEventListener('change', function () { if (el.tagName === 'SELECT') checkField(el); });
  });

  function say(text, kind) {
    status.className = 'formstatus ' + (kind ? 'is-' + kind : '');
    status.innerHTML = text;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true, first = null;
    Object.keys(rules).forEach(function (n) {
      var el = form.elements[n];
      if (!el) return;
      if (!checkField(el)) { ok = false; if (!first) first = el; }
    });
    if (!ok) {
      say('Проверьте отмеченные поля — и отправим.', 'err');
      if (first) { first.focus({ preventScroll: false }); }
      return;
    }

    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    data.page = location.href;

    btn.disabled = true;
    var old = btn.textContent;
    btn.textContent = 'Отправляем…';
    say('', '');

    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .then(function () {
        form.reset();
        say('Заявка отправлена. Свяжемся с вами по указанным контактам и пришлём расчёт партии.', 'ok');
      })
      .catch(function (err) {
        var body = encodeURIComponent(
          'Заявка с сайта\n\nИмя: ' + data.name + '\nEmail: ' + data.email + '\nТелефон: ' + data.phone +
          '\nПредприятие: ' + data.company + '\nРегион: ' + data.region +
          '\nПродукт: ' + data.product + '\nОбъём, т: ' + data.volume
        );
        say('Не удалось отправить заявку (' + err.message + '). Данные не потеряны — ' +
          '<a href="mailto:info@solodrusi.ru?subject=' + encodeURIComponent('Заявка на солод') + '&body=' + body + '">отправьте письмом</a>, ' +
          'напишите в <a href="https://t.me/solodrusi" target="_blank" rel="noopener">Telegram</a> ' +
          'или позвоните <a href="tel:+78002012444">8-800-201-24-44</a>.', 'err');
      })
      .then(function () {
        btn.disabled = false;
        btn.textContent = old;
      });
  });
})();
