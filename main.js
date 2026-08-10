/* ═══════════════════════════════════════════════════════════
   Dr. Justiniano Blanco y Palomo × LiveGood — main.js
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var WA_BASE = "https://wa.link/drblanco1";
  var LG_BASE = "https://www.descubrelivegood.com/drblanco";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Móvil / táctil: sin parallax ni partículas. Son la causa principal
     de que la página "brinque" al hacer scroll en celular. */
  function isLiteMode() {
    return (
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(max-width: 1023px)").matches ||
      navigator.maxTouchPoints > 0
    );
  }
  var liteMode = isLiteMode();

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
  var loaderDone = false;

  document.body.classList.add("is-loading");

  var progress = 0;
  var progressTimer = setInterval(function () {
    progress += Math.random() * 14 + 4;
    if (progress > 92) progress = 92;
    if (bar) bar.style.width = progress + "%";
  }, 180);

  function hideLoader() {
    if (loaderDone) return;
    loaderDone = true;

    clearInterval(progressTimer);
    if (bar) bar.style.width = "100%";

    setTimeout(function () {
      if (loader) loader.classList.add("is-hidden");
      if (wipe) wipe.classList.add("wipe-active");
      document.body.classList.remove("is-loading");
      document.body.classList.add("is-ready");
      // Reevalúa qué elementos ya están visibles una vez liberado el scroll
      window.dispatchEvent(new Event("scroll"));
      setTimeout(function () {
        if (wipe && wipe.parentNode) wipe.parentNode.removeChild(wipe);
      }, 1300);
    }, 240);
  }

  var minDelay = reduceMotion ? 300 : (liteMode ? 900 : 1400);
  window.addEventListener("load", function () {
    setTimeout(hideLoader, minDelay);
  });
  /* Red lenta o una imagen que nunca carga no deben dejar la pantalla
     de carga pegada: pase lo que pase, el sitio se muestra. */
  setTimeout(hideLoader, 6000);

  /* ═══ HEADER: scroll state + mobile nav ═══ */
  var header = document.getElementById("site-header");
  var navToggle = document.getElementById("nav-toggle");
  var headerTicking = false;

  function applyHeaderState() {
    if (!header) return;
    if (window.scrollY > 30) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
    headerTicking = false;
  }
  window.addEventListener("scroll", function () {
    if (!headerTicking) {
      headerTicking = true;
      requestAnimationFrame(applyHeaderState);
    }
  }, { passive: true });
  applyHeaderState();

  function closeNav() {
    if (!header || !navToggle) return;
    header.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú");
  }

  if (navToggle && header) {
    navToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = header.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });

    document.querySelectorAll("#main-nav a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });

    // Cerrar al tocar fuera del menú o al presionar Escape
    document.addEventListener("click", function (e) {
      if (header.classList.contains("nav-open") && !header.contains(e.target)) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
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
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ═══ COUNTERS ═══ */
  var counters = document.querySelectorAll("[data-count]");
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (isNaN(target)) return;
    if (reduceMotion) { el.textContent = target.toLocaleString("en-US"); return; }

    var duration = 1800;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target).toLocaleString("en-US");
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
      { threshold: 0.4 }
    );
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = parseFloat(el.getAttribute("data-count")).toLocaleString("en-US");
    });
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
          setTimeout(typeLoop, 1600);
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

  /* ═══ PARALLAX (solo escritorio) ═══
     En móvil el parallax se desactiva por completo: al mostrarse y ocultarse
     la barra del navegador cambia la altura de la ventana y las imágenes
     daban saltos. */
  var parallaxEls = document.querySelectorAll("[data-parallax]");
  if (parallaxEls.length && !reduceMotion && !liteMode) {
    var ticking = false;
    var updateParallax = function () {
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
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
    }, { passive: true });
    onWidthChange(updateParallax);
    updateParallax();
  } else {
    parallaxEls.forEach(function (el) { el.style.transform = "none"; });
  }

  /* ═══ RESIZE: solo reaccionamos a cambios de ANCHO ═══
     En celular, al hacer scroll la barra de direcciones se oculta y dispara
     un "resize" de altura. Recalcular ahí es justo lo que hacía brincar
     el contenido. */
  function onWidthChange(fn) {
    var lastW = window.innerWidth;
    var t;
    window.addEventListener("resize", function () {
      if (window.innerWidth === lastW) return;   // solo cambió la altura → ignorar
      lastW = window.innerWidth;
      clearTimeout(t);
      t = setTimeout(fn, 150);
    });
    window.addEventListener("orientationchange", function () {
      clearTimeout(t);
      t = setTimeout(function () { lastW = window.innerWidth; fn(); }, 250);
    });
  }

  /* ═══ PARTÍCULAS (canvas — solo escritorio) ═══ */
  function initParticles(canvasId, opts) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    if (reduceMotion || liteMode) { canvas.style.display = "none"; return; }

    var ctx = canvas.getContext("2d");
    var particles = [];
    var count = opts.count || 46;
    var colors = opts.colors || ["#C9A24B", "#2E9E5B", "#E4CD8F"];
    var w = 0, h = 0, running = true, rafId = null;

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
        alpha: Math.random() * 0.5 + 0.15
      };
    }

    function init() {
      resize();
      particles = [];
      for (var i = 0; i < count; i++) particles.push(makeParticle());
    }

    function tick() {
      if (!running) { rafId = null; return; }
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
      rafId = requestAnimationFrame(tick);
    }

    init();
    tick();
    onWidthChange(init);

    // Pausar fuera de pantalla y con la pestaña oculta (menos consumo, cero jank)
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        running = entries[0].isIntersecting && !document.hidden;
        if (running && rafId === null) tick();
      }, { threshold: 0 }).observe(canvas);
    }
    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
      if (running && rafId === null) tick();
    });
  }

  initParticles("hero-canvas", { count: 54 });
  initParticles("stats-canvas", { count: 40, colors: ["#C9A24B", "#2E9E5B"] });

  /* ═══ FAQ ACCORDION ═══ */
  var faqItems = document.querySelectorAll(".faq-item");

  function closeFaq(item) {
    item.classList.remove("is-open");
    item.querySelector(".faq-q").setAttribute("aria-expanded", "false");
    item.querySelector(".faq-a").style.maxHeight = null;
  }
  function openFaq(item) {
    var a = item.querySelector(".faq-a");
    item.classList.add("is-open");
    item.querySelector(".faq-q").setAttribute("aria-expanded", "true");
    a.style.maxHeight = a.scrollHeight + "px";
  }

  faqItems.forEach(function (item) {
    var q = item.querySelector(".faq-q");
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      faqItems.forEach(function (other) {
        if (other !== item && other.classList.contains("is-open")) closeFaq(other);
      });
      if (isOpen) closeFaq(item); else openFaq(item);
    });
  });

  /* Al girar el teléfono el texto refluye: recalculamos la altura abierta
     para que no quede cortado ni sobre espacio en blanco. */
  onWidthChange(function () {
    document.querySelectorAll(".faq-item.is-open .faq-a").forEach(function (a) {
      a.style.maxHeight = a.scrollHeight + "px";
    });
  });

  /* ═══ FORMULARIO DE CONTACTO → WHATSAPP ═══ */
  var leadForm = document.getElementById("lead-form");
  if (leadForm) {
    var showError = function (field, msg) {
      field.classList.add("has-error");
      var next = field.parentNode.querySelector(".form-error");
      if (!next) {
        next = document.createElement("p");
        next.className = "form-error";
        field.parentNode.appendChild(next);
      }
      next.textContent = msg;
    };
    var clearError = function (field) {
      field.classList.remove("has-error");
      var next = field.parentNode.querySelector(".form-error");
      if (next) next.remove();
    };

    ["nombre", "whatsapp", "interes"].forEach(function (name) {
      var field = leadForm.elements[name];
      if (field) field.addEventListener("input", function () { clearError(field); });
      if (field) field.addEventListener("change", function () { clearError(field); });
    });

    leadForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var nombreEl = leadForm.elements.nombre;
      var waEl = leadForm.elements.whatsapp;
      var interesEl = leadForm.elements.interes;

      var nombre = nombreEl.value.trim();
      var whatsapp = waEl.value.trim();
      var interes = interesEl.value;
      var mensaje = leadForm.elements.mensaje.value.trim();
      var firstInvalid = null;

      clearError(nombreEl); clearError(waEl); clearError(interesEl);

      if (nombre.length < 2) {
        showError(nombreEl, "Escribe tu nombre completo.");
        firstInvalid = firstInvalid || nombreEl;
      }
      if (whatsapp.replace(/\D/g, "").length < 10) {
        showError(waEl, "Escribe tu número de WhatsApp a 10 dígitos.");
        firstInvalid = firstInvalid || waEl;
      }
      if (!interes) {
        showError(interesEl, "Selecciona qué te interesa.");
        firstInvalid = firstInvalid || interesEl;
      }
      if (firstInvalid) { firstInvalid.focus(); return; }

      var texto = "Hola, soy " + nombre + " (WhatsApp: " + whatsapp + "). " + interes + ".";
      if (mensaje) texto += " Mensaje: " + mensaje;

      var url = buildWaLink(texto);
      if (liteMode) window.location.href = url;         // en celular abre la app de WhatsApp
      else window.open(url, "_blank", "noopener,noreferrer");
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

      closeNav();
      var headerH = header ? header.getBoundingClientRect().height : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 12;
      window.scrollTo({ top: Math.max(top, 0), behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

})();
