/* =========================================================================
   Всеказахстанская ассоциация рукопашного боя — интерактив сайта
   ========================================================================= */
(function () {
  "use strict";

  /* ---------------------------------------- 1. Региональные федерации */
  // region: краткое название (RU/KZ); city: точка на карте; fed: полное юр. наименование
  var REGIONS = [
    { ru: "Карагандинская область", kz: "Қарағанды облысы", cityRu: "Караганда", cityKz: "Қарағанды", x: 57, y: 52, fed: "«Федерация рукопашного боя Карагандинской области»" },
    { ru: "Алматинская область", kz: "Алматы облысы", cityRu: "Конаев", cityKz: "Қонаев", x: 67, y: 72, fed: "«Федерация рукопашного боя и восточных единоборств Алматинской области»" },
    { ru: "Костанайская область", kz: "Қостанай облысы", cityRu: "Костанай", cityKz: "Қостанай", x: 41, y: 30, fed: "«Федерация рукопашного боя Костанайской области»" },
    { ru: "Атырауская область", kz: "Атырау облысы", cityRu: "Атырау", cityKz: "Атырау", x: 18, y: 58, fed: "«Атырауская областная федерация Iskustvo Rukopashny boi»" },
    { ru: "Акмолинская область", kz: "Ақмола облысы", cityRu: "Кокшетау", cityKz: "Көкшетау", x: 49, y: 27, fed: "«Федерация рукопашного боя Акмолинской области»" },
    { ru: "Актюбинская область", kz: "Ақтөбе облысы", cityRu: "Актобе", cityKz: "Ақтөбе", x: 30, y: 45, fed: "«Актюбинская областная федерация рукопашного боя и смешанных единоборств»" },
    { ru: "Мангистауская область", kz: "Маңғыстау облысы", cityRu: "Актау", cityKz: "Ақтау", x: 13, y: 74, fed: "«Федерация полноконтактного рукопашного боя Мангистауской области»" },
    { ru: "г. Алматы", kz: "Алматы қ.", cityRu: "Алматы", cityKz: "Алматы", x: 68, y: 79, fed: "«Федерация рукопашного боя г. Алматы»" },
    { ru: "Восточно-Казахстанская область", kz: "Шығыс Қазақстан облысы", cityRu: "Оскемен", cityKz: "Өскемен", x: 82, y: 46, fed: "«Восточно-Казахстанская областная федерация рукопашного боя»" },
    { ru: "Западно-Казахстанская область", kz: "Батыс Қазақстан облысы", cityRu: "Уральск", cityKz: "Орал", x: 14, y: 40, fed: "«Федерация рукопашного боя Западно-Казахстанской области»" },
    { ru: "Кызылординская область", kz: "Қызылорда облысы", cityRu: "Кызылорда", cityKz: "Қызылорда", x: 44, y: 70, fed: "«Федерация рукопашного боя Кызылординской области»" },
    { ru: "Павлодарская область", kz: "Павлодар облысы", cityRu: "Павлодар", cityKz: "Павлодар", x: 67, y: 32, fed: "«Федерация рукопашного боя Павлодарской области «Тигр»»" },
    { ru: "Республиканская", kz: "Республикалық", cityRu: "Астана", cityKz: "Астана", x: 54, y: 39, fed: "«Казахстанская федерация полноконтактного рукопашного боя»" },
    { ru: "Северо-Казахстанская область", kz: "Солтүстік Қазақстан облысы", cityRu: "Петропавловск", cityKz: "Петропавл", x: 49, y: 18, fed: "«Северо-Казахстанская областная федерация рукопашного боя»" },
    { ru: "г. Шымкент", kz: "Шымкент қ.", cityRu: "Шымкент", cityKz: "Шымкент", x: 52, y: 83, fed: "«Федерация рукопашного боя г. Шымкент»" }
  ];

  function buildRegions() {
    var track = document.getElementById("regionsTrack");
    var markers = document.getElementById("regionsMapMarkers");
    if (!track && !markers) return;
    var cards = "";
    var dots = "";
    for (var i = 0; i < REGIONS.length; i++) {
      var r = REGIONS[i];
      var delay = (i % 3) + 1;
      cards +=
        '<article class="region-card" data-d="' + delay + '">' +
          '<div class="city" data-i18n data-ru="' + r.cityRu + '" data-kz="' + r.cityKz + '">' + r.cityRu + "</div>" +
          '<div class="reg" data-i18n data-ru="' + r.ru + '" data-kz="' + r.kz + '">' + r.ru + "</div>" +
          '<div class="fed">' + r.fed + "</div>" +
        "</article>";
      dots +=
        '<button class="map-point" type="button" style="--x:' + r.x + '%; --y:' + r.y + '%;" aria-label="' + r.cityRu + '">' +
          '<span data-i18n data-ru="' + r.cityRu + '" data-kz="' + r.cityKz + '">' + r.cityRu + "</span>" +
        "</button>";
    }
    if (track) {
      track.innerHTML =
        '<div class="regions-track__group">' + cards + "</div>" +
        '<div class="regions-track__group" aria-hidden="true">' + cards + "</div>";
    }
    if (markers) markers.innerHTML = dots;
  }

  /* ---------------------------------------- 2. Слайдеры фотографий */
  function initPhotoSliders() {
    var sliders = document.querySelectorAll("[data-slider]");
    for (var i = 0; i < sliders.length; i++) {
      (function (slider) {
        var track = slider.querySelector(".photo-slider__track");
        var imgs = slider.querySelectorAll("img");
        var prev = slider.querySelector(".photo-slider__btn--prev");
        var next = slider.querySelector(".photo-slider__btn--next");
        var dotsWrap = slider.querySelector(".photo-slider__dots");
        if (!track || imgs.length < 2) return;
        var index = 0;
        var dots = [];

        function setActive(nextIndex) {
          index = (nextIndex + imgs.length) % imgs.length;
          track.style.transform = "translateX(-" + (index * 100) + "%)";
          for (var d = 0; d < dots.length; d++) {
            dots[d].classList.toggle("is-active", d === index);
          }
        }

        if (dotsWrap) {
          for (var k = 0; k < imgs.length; k++) {
            var dot = document.createElement("button");
            dot.type = "button";
            dot.setAttribute("aria-label", "Показать фото " + (k + 1));
            dot.addEventListener("click", (function (n) {
              return function () { setActive(n); };
            })(k));
            dotsWrap.appendChild(dot);
            dots.push(dot);
          }
        }
        if (prev) prev.addEventListener("click", function () { setActive(index - 1); });
        if (next) next.addEventListener("click", function () { setActive(index + 1); });
        setActive(0);
      })(sliders[i]);
    }
  }

  /* ---------------------------------------- 3. Переключение языков */
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

  /* ---------------------------------------- 4. Sticky-топбар */
  function initTopbar() {
    var bar = document.getElementById("topbar");
    if (!bar) return;
    var onScroll = function () {
      bar.classList.toggle("scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------- 5. Мобильное меню */
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

  /* ---------------------------------------- 6. Scroll-reveal */
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

  /* ---------------------------------------- 7. Счётчик статистики */
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

  /* ---------------------------------------- 8. Активная ссылка в навигации */
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
    initPhotoSliders();
    initLang();
    initTopbar();
    initBurger();
    initReveal();
    initCounters();
    initActiveNav();
  });
})();
