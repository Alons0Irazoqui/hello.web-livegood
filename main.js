/* ═══════════════════════════════════════════════════════════
   Dr. Justiniano Blanco y Palomo × LiveGood — main.js
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var WA_BASE = "https://wa.link/drblanco1";
  var LG_BASE = "https://www.descubrelivegood.com/drblanco";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ═══ WHATSAPP / LIVEGOOD LINKS ═══ */
  function buildWaLink(msg) {
    return WA_BASE + (msg ? "?text=" + encodeURIComponent(msg) : "");
  }
  document.querySelectorAll(".js-wa-link").forEach(function (el) {
    el.setAttribute("href", buildWaLink(el.getAttribute("data-wa-msg") || ""));
  });
  document.querySelectorAll(".js-lg-link").forEach(function (el) {
    el.setAttribute("href", LG_BASE);
  });

  /* ═══ PRELOADER ═══ */
  var loader = document.getElementById("page-loader");
  var wipe = document.getElementById("loader-wipe");
  var bar = document.getElementById("loader-bar");
  document.body.classList.add("is-loading");

  var progress = 0;
  var progressTimer = setInterval(function () {
    progress += Math.random() * 14 + 4;
    if (progress > 92) progress = 92;
    if (bar) bar.style.width = progress + "%";
  }, 180);

  window.addEventListener("load", function () {
    var minDelay = reduceMotion ? 300 : 1900;
    setTimeout(function () {
      clearInterval(progressTimer);
      if (bar) bar.style.width = "100%";
      setTimeout(function () {
        if (loader) loader.classList.add("is-hidden");
        if (wipe) wipe.classList.add("wipe-active");
        document.body.classList.remove("is-loading");
        document.body.classList.add("is-ready");
        setTimeout(function () {
          if (wipe) wipe.remove();
        }, 1300);
      }, 260);
    }, minDelay);
  });

  /* ═══ HEADER: scroll state + mobile nav ═══ */
  var header = document.getElementById("site-header");
  var navToggle = document.getElementById("nav-toggle");

  function onScrollHeader() {
    if (window.scrollY > 30) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });
    document.querySelectorAll("#main-nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        header.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ═══ SCROLL REVEAL ═══ */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ═══ COUNTERS ═══ */
  var counters = document.querySelectorAll("[data-count]");
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var duration = 1800;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var value = Math.floor(eased * target);
      el.textContent = value.toLocaleString("en-US");
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString("en-US");
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ═══ TYPEWRITER (hero) ═══ */
  var typedTarget = document.getElementById("typed-target");
  if (typedTarget && !reduceMotion) {
    var phrases = ["tu retiro.", "tu familia.", "tu legado."];
    var pIndex = 0, cIndex = 0, deleting = false;

    function typeLoop() {
      var current = phrases[pIndex];
      if (!deleting) {
        cIndex++;
        typedTarget.textContent = current.slice(0, cIndex);
        if (cIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1500);
          return;
        }
        setTimeout(typeLoop, 65);
      } else {
        cIndex--;
        typedTarget.textContent = current.slice(0, cIndex);
        if (cIndex === 0) {
          deleting = false;
          pIndex = (pIndex + 1) % phrases.length;
          setTimeout(typeLoop, 300);
          return;
        }
        setTimeout(typeLoop, 35);
      }
    }
    setTimeout(typeLoop, 900);
  } else if (typedTarget) {
    typedTarget.textContent = "tu familia.";
  }

  /* ═══ PARALLAX (fondos con movimiento) ═══ */
  var parallaxEls = document.querySelectorAll("[data-parallax]");
  if (parallaxEls.length && !reduceMotion) {
    var ticking = false;
    function updateParallax() {
      var vh = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        var speed = parseFloat(el.getAttribute("data-parallax-speed")) || 0.2;
        var center = rect.top + rect.height / 2 - vh / 2;
        var offset = center * speed * -1;
        el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
      });
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
    }, { passive: true });
    window.addEventListener("resize", updateParallax);
    updateParallax();
  }

  /* ═══ PARTÍCULAS (canvas reutilizable) ═══ */
  function initParticles(canvasId, opts) {
    var canvas = document.getElementById(canvasId);
    if (!canvas || reduceMotion) return;
    var ctx = canvas.getContext("2d");
    var particles = [];
    var count = opts.count || 46;
    var colors = opts.colors || ["#C9A24B", "#2E9E5B", "#E4CD8F"];
    var w, h;

    function resize() {
      var parent = canvas.parentElement;
      w = canvas.width = parent.offsetWidth;
      h = canvas.height = parent.offsetHeight;
    }

    function makeParticle() {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.6,
        vy: Math.random() * 0.35 + 0.08,
        vx: (Math.random() - 0.5) * 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.15,
      };
    }

    function init() {
      resize();
      particles = [];
      for (var i = 0; i < count; i++) particles.push(makeParticle());
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(function (p) {
        p.y -= p.vy;
        p.x += p.vx;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    }

    init();
    tick();
    window.addEventListener("resize", init);
  }

  initParticles("hero-canvas", { count: 54 });
  initParticles("stats-canvas", { count: 40, colors: ["#C9A24B", "#2E9E5B"] });

  /* ═══ FAQ ACCORDION ═══ */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item.is-open").forEach(function (other) {
        if (other !== item) {
          other.classList.remove("is-open");
          other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
          other.querySelector(".faq-a").style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove("is-open");
        q.setAttribute("aria-expanded", "false");
        a.style.maxHeight = null;
      } else {
        item.classList.add("is-open");
        q.setAttribute("aria-expanded", "true");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ═══ FORMULARIO DE CONTACTO → WHATSAPP ═══ */
  var leadForm = document.getElementById("lead-form");
  if (leadForm) {
    leadForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre = leadForm.nombre.value.trim();
      var whatsapp = leadForm.whatsapp.value.trim();
      var interes = leadForm.interes.value;
      var mensaje = leadForm.mensaje.value.trim();

      var texto = "Hola, soy " + nombre + " (WhatsApp: " + whatsapp + "). " + interes + ".";
      if (mensaje) texto += " Mensaje: " + mensaje;

      window.open(buildWaLink(texto), "_blank", "noopener,noreferrer");
    });
  }

  /* ═══ AJUSTE DE SCROLL PARA ANCLAS (header fijo) ═══ */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var headerH = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 12;
      window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

})();
