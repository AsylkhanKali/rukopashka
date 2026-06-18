/* =========================================================================
   Всеказахстанская ассоциация рукопашного боя — интерактив сайта
   ========================================================================= */
(function () {
  "use strict";

  /* ---------------------------------------- 1. Региональные федерации */
  // region: краткое название (RU/KZ); fed: полное юр. наименование
  var REGIONS = [
    { ru: "Карагандинская область", kz: "Қарағанды облысы", fed: "«Федерация рукопашного боя Карагандинской области»" },
    { ru: "Алматинская область", kz: "Алматы облысы", fed: "«Федерация рукопашного боя и восточных единоборств Алматинской области»" },
    { ru: "Костанайская область", kz: "Қостанай облысы", fed: "«Федерация рукопашного боя Костанайской области»" },
    { ru: "Атырауская область", kz: "Атырау облысы", fed: "«Атырауская областная федерация Iskustvo Rukopashny boi»" },
    { ru: "Акмолинская область", kz: "Ақмола облысы", fed: "«Федерация рукопашного боя Акмолинской области»" },
    { ru: "Актюбинская область", kz: "Ақтөбе облысы", fed: "«Актюбинская областная федерация рукопашного боя и смешанных единоборств»" },
    { ru: "Мангистауская область", kz: "Маңғыстау облысы", fed: "«Федерация полноконтактного рукопашного боя Мангистауской области»" },
    { ru: "г. Алматы", kz: "Алматы қ.", fed: "«Федерация рукопашного боя г. Алматы»" },
    { ru: "Восточно-Казахстанская область", kz: "Шығыс Қазақстан облысы", fed: "«Восточно-Казахстанская областная федерация рукопашного боя»" },
    { ru: "Западно-Казахстанская область", kz: "Батыс Қазақстан облысы", fed: "«Федерация рукопашного боя Западно-Казахстанской области»" },
    { ru: "Кызылординская область", kz: "Қызылорда облысы", fed: "«Федерация рукопашного боя Кызылординской области»" },
    { ru: "Павлодарская область", kz: "Павлодар облысы", fed: "«Федерация рукопашного боя Павлодарской области «Тигр»»" },
    { ru: "Республиканская", kz: "Республикалық", fed: "«Казахстанская федерация полноконтактного рукопашного боя»" },
    { ru: "Северо-Казахстанская область", kz: "Солтүстік Қазақстан облысы", fed: "«Северо-Казахстанская областная федерация рукопашного боя»" },
    { ru: "г. Шымкент", kz: "Шымкент қ.", fed: "«Федерация рукопашного боя г. Шымкент»" }
  ];

  function buildRegions() {
    var grid = document.getElementById("regionsGrid");
    if (!grid) return;
    var html = "";
    for (var i = 0; i < REGIONS.length; i++) {
      var r = REGIONS[i];
      var delay = (i % 3) + 1;
      html +=
        '<article class="region-card reveal" data-d="' + delay + '">' +
          '<div class="reg" data-i18n data-ru="' + r.ru + '" data-kz="' + r.kz + '">' + r.ru + "</div>" +
          '<div class="fed">' + r.fed + "</div>" +
        "</article>";
    }
    grid.innerHTML = html;
  }

  /* ---------------------------------------- 2. Переключение языков */
  var TITLES = {
    ru: "Всеказахстанская ассоциация рукопашного боя",
    kz: "Бүкілқазақстандық жекпе-жек сайыс қауымдастығы"
  };
  var LANG_KEY = "akhfa-lang";

  function applyLang(lang) {
    if (lang !== "kz") lang = "ru";
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var val = nodes[i].getAttribute("data-" + lang);
      if (val !== null) nodes[i].textContent = val;
    }
    document.documentElement.lang = lang === "kz" ? "kk" : "ru";
    document.title = TITLES[lang];
    var btns = document.querySelectorAll(".lang-toggle button");
    for (var j = 0; j < btns.length; j++) {
      btns[j].setAttribute("aria-pressed", btns[j].getAttribute("data-lang") === lang ? "true" : "false");
    }
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  }

  function initLang() {
    var saved = "kz";
    try { saved = localStorage.getItem(LANG_KEY) || "kz"; } catch (e) {}
    applyLang(saved);
    var toggle = document.querySelector(".lang-toggle");
    if (toggle) {
      toggle.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-lang]");
        if (b) applyLang(b.getAttribute("data-lang"));
      });
    }
  }

  /* ---------------------------------------- 3. Sticky-топбар */
  function initTopbar() {
    var bar = document.getElementById("topbar");
    if (!bar) return;
    var onScroll = function () {
      bar.classList.toggle("scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------- 4. Мобильное меню */
  function initBurger() {
    var burger = document.getElementById("burger");
    var nav = document.getElementById("navLinks");
    if (!burger || !nav) return;
    var close = function () { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); };
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) { if (e.target.tagName === "A") close(); });
  }

  /* ---------------------------------------- 5. Scroll-reveal */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      for (var i = 0; i < els.length; i++) els[i].classList.add("in");
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    for (var k = 0; k < els.length; k++) io.observe(els[k]);
  }

  /* ---------------------------------------- 6. Счётчик статистики */
  function initCounters() {
    var els = document.querySelectorAll("[data-count]");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var target = parseInt(el.getAttribute("data-count"), 10) || 0;
        if (reduce) { el.textContent = String(target); io.unobserve(el); return; }
        var start = performance.now(), dur = 1100;
        var step = function (now) {
          var p = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = String(Math.round(target * eased));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    for (var i = 0; i < els.length; i++) io.observe(els[i]);
  }

  /* ---------------------------------------- 7. Активная ссылка в навигации */
  function initActiveNav() {
    var links = document.querySelectorAll(".nav-links a[href^='#']");
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("active"); });
          if (map[en.target.id]) map[en.target.id].classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["about", "leaders", "regions", "events", "partners", "contact"].forEach(function (id) {
      var s = document.getElementById(id);
      if (s) io.observe(s);
    });
  }

  /* ---------------------------------------- init */
  document.addEventListener("DOMContentLoaded", function () {
    buildRegions();   // строим карточки до применения языка
    initLang();
    initTopbar();
    initBurger();
    initReveal();
    initCounters();
    initActiveNav();
  });
})();
