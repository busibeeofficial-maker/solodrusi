(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- шапка ---------- */
  var hdr = document.getElementById('hdr');
  function onScroll() { if (hdr) hdr.classList.toggle('is-stuck', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- мобильное меню ---------- */
  var burger = document.getElementById('burger');
  var mobnav = document.getElementById('mobnav');
  function closeMenu() {
    document.body.classList.remove('menu-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }
  if (burger && mobnav) {
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    mobnav.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- подготовка линейной графики к прорисовке ---------- */
  // каждой линии задаём её собственную длину и небольшую задержку,
  // чтобы рисунок собирался по частям, а не появлялся целиком
  Array.prototype.forEach.call(document.querySelectorAll('.art'), function (art) {
    var paths = art.querySelectorAll('.d');
    Array.prototype.forEach.call(paths, function (p, i) {
      var len;
      try { len = p.getTotalLength(); } catch (e) { len = 0; }
      if (!len || !isFinite(len)) len = 600;
      p.style.setProperty('--len', Math.ceil(len + 2));
      var isBlueprint = !!p.closest('.blueprint');
      p.style.setProperty('--dl', isBlueprint ? i * 45 : 380 + i * 70);
    });
  });

  /* ---------- появление ---------- */
  var targets = document.querySelectorAll('[data-anim], .art');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('is-in'); });
  }

  /* ---------- счётчики ---------- */
  function runCount(el) {
    var to = parseFloat(el.getAttribute('data-count'));
    var from = parseFloat(el.getAttribute('data-from') || '0');
    if (reduced) { el.textContent = String(to); return; }
    var dur = 1100, t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      el.textContent = String(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
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
    Array.prototype.forEach.call(nums, function (el) { io2.observe(el); });
  }

  /* ---------- лёгкий параллакс рисунка первого экрана ---------- */
  var art = document.querySelector('.hero__art');
  if (art && !reduced) {
    var wide = window.matchMedia('(min-width:1081px)');
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        art.style.transform = wide.matches
          ? 'translate3d(0,' + (window.scrollY * -0.045).toFixed(1) + 'px,0)'
          : '';
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- маска телефона ---------- */
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

  /* ---------- валидация и отправка ---------- */
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
    product: function (v) { return !!v || 'Выберите продукт'; },
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
      if (first) first.focus();
      return;
    }

    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    data.page = location.href;

    btn.disabled = true;
    var old = btn.querySelector('span').textContent;
    btn.querySelector('span').textContent = 'Отправляем…';
    say('', '');

    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
      .then(function () {
        form.reset();
        say('Заявка отправлена. Свяжемся с вами и пришлём расчёт партии.', 'ok');
      })
      .catch(function (err) {
        var body = encodeURIComponent(
          'Заявка с сайта\n\nИмя: ' + data.name + '\nEmail: ' + data.email + '\nТелефон: ' + data.phone +
          '\nПредприятие: ' + data.company + '\nРегион: ' + data.region +
          '\nПродукт: ' + data.product + '\nОбъём, т: ' + data.volume
        );
        say('Не удалось отправить заявку (' + err.message + '). Данные не потеряны — ' +
          '<a href="mailto:info@solodrusi.ru?subject=' + encodeURIComponent('Расчёт партии солода') + '&body=' + body + '">отправьте письмом</a>, ' +
          'напишите в <a href="https://t.me/solodrusi" target="_blank" rel="noopener">Telegram</a> ' +
          'или позвоните <a href="tel:+78002012444">8-800-201-24-44</a>.', 'err');
      })
      .then(function () {
        btn.disabled = false;
        btn.querySelector('span').textContent = old;
      });
  });
})();
