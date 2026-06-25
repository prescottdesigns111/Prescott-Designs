/* ── NAV SCROLL ──────────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── SCROLL REVEAL ───────────────────────────────────────────── */
const revealEls = document.querySelectorAll(
  '.service-card, .project-item, .stat, .section-label, .section-title, .contact-sub, .contact-form, .project-info'
);

revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  const delay = (i % 4) * 0.08;
  el.style.transitionDelay = delay + 's';
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ── COUNT UP STATS ──────────────────────────────────────────── */
const statNums = document.querySelectorAll('.stat-num');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };

    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.5 });

statNums.forEach(el => countObserver.observe(el));

/* ── 3D MOUSE TILT ───────────────────────────────────────────── */
const scenes = document.querySelectorAll('.project-scene');

scenes.forEach(scene => {
  const device = scene.querySelector('.project-device');

  scene.addEventListener('mousemove', (e) => {
    const rect = scene.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);

    device.style.transform = `
      rotateX(${-dy * 8}deg)
      rotateY(${dx * 10}deg)
      translateZ(10px)
      translateY(-8px)
    `;
    device.style.animationPlayState = 'paused';
    device.style.boxShadow = `
      ${-dx * 20}px ${dy * 20 + 40}px 80px rgba(0,0,0,0.7),
      0 0 80px rgba(83, 17, 143, 0.3)
    `;
  });

  scene.addEventListener('mouseleave', () => {
    device.style.transform = '';
    device.style.boxShadow = '';
    device.style.animationPlayState = 'running';
  });
});

/* ── SMOOTH ANCHOR SCROLL ────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── IFRAME DESKTOP SCALE ────────────────────────────────────── */
function setIframeScales() {
  document.querySelectorAll('.device-screen').forEach(screen => {
    const w = screen.offsetWidth;
    const scale = w / 1440;
    screen.style.setProperty('--iframe-scale', scale);
    // adjust container height to match scaled iframe height
    screen.style.paddingTop = (900 * scale) + 'px';
    screen.style.height = 'auto';
  });
}
setIframeScales();
window.addEventListener('resize', setIframeScales);

/* ── CURSOR GLOW (desktop only) ──────────────────────────────── */
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(83,17,143,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    opacity: 0;
  `;
  document.body.appendChild(glow);

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    glow.style.opacity = '1';
    glow.style.left = mx + 'px';
    glow.style.top = my + 'px';
  });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
}
