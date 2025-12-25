document.addEventListener("DOMContentLoaded", () => {
  // ===== THEME TOGGLE =====
  const toggle = document.getElementById("themeToggle");
  toggle.addEventListener("change", () => {
    document.body.classList.toggle("dark", toggle.checked);
  });

  // ===== NAVBAR TOGGLE =====
  const togglenav = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  togglenav.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  // ===== HERO OBSERVER =====
  const header = document.querySelector("header");
  const hero = document.getElementById("hero");
  const navObserver = new IntersectionObserver(
    ([entry]) => {
      header.classList.toggle("nav-hidden", !entry.isIntersecting);
    },
    { threshold: 0.1 }
  );
  navObserver.observe(hero);

  // ===== SCROLL REVEAL =====
  const revealItems = document.querySelectorAll(".reveal");
  const observerReveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("show", entry.isIntersecting);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  revealItems.forEach((el, index) => {
    el.style.transitionDelay = `${index * 80}ms`;
    observerReveal.observe(el);
  });

  // ===== WAVE BACKGROUND =====
  const canvas = document.getElementById("wave-bg");
  const ctx = canvas.getContext("2d");
  let w, h, time = 0, isDark = document.body.classList.contains("dark");
  let scrollTarget = 0, scrollSmooth = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const themeObserver = new MutationObserver(() => {
    isDark = document.body.classList.contains("dark");
  });
  themeObserver.observe(document.body, { attributes: true });

  window.addEventListener("scroll", () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    scrollTarget = Math.min(window.scrollY / maxScroll, 1);
  });

  function drawWaveLayer({ amplitude, wavelength, speed, baseY, hue, alpha, depth }) {
    const blur = scrollSmooth * (5 + depth * 6);
    ctx.filter = `blur(${blur}px)`;
    ctx.beginPath();
    ctx.moveTo(0, h);
    const rise = scrollSmooth * 180;
    for (let x = 0; x <= w; x += 8) {
      const y = baseY - rise + Math.sin(x / wavelength + time * speed) * amplitude
        + Math.sin(time * speed * 0.6) * amplitude * 0.25;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();

    const hueShift = hue + scrollSmooth * 45 + depth * 10;
    const intensity = 0.7 + scrollSmooth * 0.6;
    const grad = ctx.createLinearGradient(0, baseY, w, h);
    grad.addColorStop(
      0,
      `hsla(${hueShift}, 90%, ${isDark ? 30 + scrollSmooth * 10 : 55 + scrollSmooth * 8}%, ${alpha * intensity})`
    );
    grad.addColorStop(
      1,
      `hsla(${hueShift + 20}, 85%, ${isDark ? 22 + scrollSmooth * 8 : 48 + scrollSmooth * 6}%, ${alpha * intensity})`
    );
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.filter = "none";
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    scrollSmooth += (scrollTarget - scrollSmooth) * 0.045;
    const baseHue = isDark ? 145 : 155;

    drawWaveLayer({ amplitude: 140, wavelength: 750, speed: 0.55, baseY: h * 0.48, hue: baseHue, alpha: 0.35, depth: 0 });
    drawWaveLayer({ amplitude: 100, wavelength: 560, speed: 0.42, baseY: h * 0.54, hue: baseHue + 12, alpha: 0.32, depth: 1 });
    drawWaveLayer({ amplitude: 70, wavelength: 380, speed: 0.3, baseY: h * 0.6, hue: baseHue + 26, alpha: 0.28, depth: 2 });
    drawWaveLayer({ amplitude: 55, wavelength: 300, speed: 0.22, baseY: h * 0.66, hue: baseHue + 36, alpha: 0.25, depth: 3 });

    time += 0.012;
    requestAnimationFrame(animate);
  }
  animate();
});
