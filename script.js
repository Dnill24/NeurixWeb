// Prevent automatic scroll restoration
window.history.scrollRestoration = "manual";

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});

document.addEventListener("DOMContentLoaded", () => {
// ================= THEME TOGGLE =================
// Sync desktop and mobile theme switches
const themeToggles = document.querySelectorAll(".theme-switch__checkbox");
const logoImg = document.getElementById("logo-img"); // Make sure this exists in your HTML

function updateLogo() {
  if (!logoImg) return; // Safety check
  if (document.body.classList.contains("dark")) {
    logoImg.src = "./img/mainlogo-dark.png"; // Dark mode logo
  } else {
    logoImg.src = "./img/mainlogo-light.png"; // Light mode logo
  }
}

// Apply the logo update whenever the theme changes
themeToggles.forEach(toggle => {
  toggle.addEventListener("change", () => {
    document.body.classList.toggle("dark", toggle.checked);

    // Sync all other toggles
    themeToggles.forEach(other => {
      if (other !== toggle) other.checked = toggle.checked;
    });

    // Update the logo
    updateLogo();
  });
});

// Update logo on page load in case dark mode is pre-set
updateLogo();

  // ================= MOBILE NAV TOGGLE =================
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  // ================= DESKTOP NAV HIDE/SHOW ON SCROLL =================
  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".hero");
  if (header && hero) {
    let hideTimeout;

    const checkHeader = () => {
      const scrollY = window.scrollY;
      const heroBottom = hero.offsetTop + hero.offsetHeight;

      if (window.innerWidth <= 900) {
        // Mobile: always show header
        header.classList.remove("nav-hidden");
      } else {
        // Desktop: hide after hero
        if (scrollY < heroBottom) {
          header.classList.remove("nav-hidden");
        } else {
          header.classList.add("nav-hidden");
        }
      }
    };

    const mouseMoveHandler = (e) => {
      if (e.clientY < 50 && window.innerWidth > 900) {
        header.classList.remove("nav-hidden");
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
          if (window.scrollY >= hero.offsetTop + hero.offsetHeight) {
            header.classList.add("nav-hidden");
          }
        }, 1500);
      }
    };

    window.addEventListener("scroll", checkHeader);
    window.addEventListener("mousemove", mouseMoveHandler);
    checkHeader();
  }

  // ================= SCROLL REVEAL =================
  const revealItems = document.querySelectorAll(".reveal");
  const observerReveal = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        entry.target.classList.toggle("show", entry.isIntersecting);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  revealItems.forEach((el, index) => {
    el.style.transitionDelay = `${index * 80}ms`;
    observerReveal.observe(el);
  });

  // ================= CANVAS BACKGROUND =================
  const canvas = document.getElementById("wave-bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, dpr;
  let orbs = [];

  function resize() {
    dpr = window.devicePixelRatio || 1;
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  class Orb {
    constructor() {
      this.x = Math.random() * w;
      this.baseY = Math.random() * h;
      this.radius = Math.random() * 3 + 2;
      this.speed = Math.random() * 0.0018 + 0.0003;
      this.offset = Math.random() * Math.PI * 2;
      this.alpha = Math.random() * 0.4 + 0.3;
    }
    update(time) {
      this.y = this.baseY + Math.sin(time * this.speed + this.offset) * 20;
    }
    draw() {
      const orbOpacity =
        getComputedStyle(document.body).getPropertyValue("--orb-opacity") || 0.3;
      ctx.save();
      ctx.shadowBlur = 18;
      ctx.shadowColor = "rgba(0,174,169,0.6)";
      ctx.fillStyle = `rgba(0,174,169, ${orbOpacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function initOrbs(count = 20) {
    orbs = Array.from({ length: count }, () => new Orb());
  }
  initOrbs();

  const glowSpots = Array.from({ length: 3 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 300 + 170,
  }));

  function animate(time) {
    const isDark = document.body.classList.contains("dark");
    ctx.clearRect(0, 0, w, h);
    if (isDark) {
      ctx.fillStyle = "#053247ff";
      ctx.fillRect(0, 0, w, h);
    }

    glowSpots.forEach(g => {
      const grad = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
      grad.addColorStop(0, "rgba(0,174,169,0.12)");
      grad.addColorStop(1, "rgba(0,174,169,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
      ctx.fill();
    });

    orbs.forEach(o => {
      o.update(time);
      o.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
});
