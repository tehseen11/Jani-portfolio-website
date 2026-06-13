/* ═══════════════════════════════════════════════
   JANITHA PORTFOLIO — script.js
   ═══════════════════════════════════════════════ */

'use strict';

/* ── LOADER ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hidden'), 600);
});

/* ── NAV: scroll style + active link + mobile toggle ── */
const navbar   = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const navToggle= document.getElementById('navToggle');
const allAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  setActiveNavLink();
}, { passive: true });

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

function setActiveNavLink() {
  const scrollY = window.scrollY + 100;
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => { if (scrollY >= s.offsetTop) current = s.id; });
  allAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

/* ── INTERSECTION OBSERVER: reveal + skill bars + timeline ── */
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;

    // Generic reveal
    if (el.classList.contains('reveal') || el.classList.contains('timeline-item')) {
      el.classList.add('visible');
    }

    // Skill bars
    if (el.classList.contains('skill-card')) {
      const bar = el.querySelector('.skill-bar');
      if (bar) {
        const pct = bar.dataset.pct || '0';
        bar.style.width = pct + '%';
      }
    }

    io.unobserve(el);
  });
}, { threshold: 0.15 });

// Observe all reveal targets
document.querySelectorAll(
  '.reveal, .timeline-item, .skill-card, .project-card, .highlight-card, .cert-card, .contact-link, .about-text'
).forEach(el => {
  el.classList.add('reveal');
  io.observe(el);
});

// Timeline items have their own class — re-add
document.querySelectorAll('.timeline-item').forEach(el => io.observe(el));

/* ── STAGGER CHILDREN ── */
function staggerReveal(containerSelector, childSelector, delay = 80) {
  document.querySelectorAll(containerSelector).forEach(container => {
    container.querySelectorAll(childSelector).forEach((child, i) => {
      child.style.transitionDelay = (i * delay) + 'ms';
    });
  });
}
staggerReveal('.projects-grid', '.project-card', 80);
staggerReveal('.cert-grid', '.cert-card', 70);
staggerReveal('.skill-cards', '.skill-card', 60);
staggerReveal('.about-highlights', '.highlight-card', 60);

/* ── CONTACT FORM ── */
function handleFormSubmit() {
  const name  = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const msg   = document.getElementById('contact-msg').value.trim();
  const note  = document.getElementById('formNote');
  const btn   = document.getElementById('sendBtn');

  if (!name || !email || !msg) {
    note.textContent = '⚠ Please fill in all fields.';
    note.style.color = '#f87171';
    return;
  }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    note.textContent = '⚠ Please enter a valid email address.';
    note.style.color = '#f87171';
    return;
  }

  btn.textContent = 'Sending...';
  btn.disabled = true;

  // Simulated async send (replace with actual API call)
  setTimeout(() => {
    note.textContent = '✅ Message sent! I\'ll get back to you soon.';
    note.style.color = '#22d3ee';
    btn.textContent = 'Send Message';
    btn.disabled = false;
    document.getElementById('contact-name').value = '';
    document.getElementById('contact-email').value = '';
    document.getElementById('contact-msg').value = '';
  }, 1200);
}

/* ── SMOOTH SCROLL for # links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── TYPING EFFECT on hero subtitle ── */
function typeEffect(element, texts, speed = 80, pause = 2000) {
  let ti = 0, ci = 0, deleting = false;
  function tick() {
    const text = texts[ti];
    element.textContent = deleting ? text.slice(0, ci--) : text.slice(0, ci++);
    if (!deleting && ci > text.length) { deleting = true; setTimeout(tick, pause); return; }
    if (deleting && ci < 0) { deleting = false; ti = (ti + 1) % texts.length; ci = 0; }
    setTimeout(tick, deleting ? speed / 2 : speed);
  }
  tick();
}

const accentEl = document.querySelector('.accent-text');
if (accentEl) {
  typeEffect(accentEl, [
    'Cloud & Automation Enthusiast',
    'Infrastructure as Code Learner',
    'CI/CD Pipeline Builder',
    'Open Source Contributor',
  ], 55, 2200);
}

/* ── CURSOR TRAIL (desktop only) ── */
if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
  const dots = [];
  const N = 8;
  for (let i = 0; i < N; i++) {
    const d = document.createElement('div');
    Object.assign(d.style, {
      position: 'fixed', pointerEvents: 'none', zIndex: '9998',
      borderRadius: '50%', transform: 'translate(-50%,-50%)',
      transition: `opacity ${0.3 + i * 0.06}s`,
      width: Math.max(3, 10 - i) + 'px',
      height: Math.max(3, 10 - i) + 'px',
      background: `rgba(99,102,241,${0.5 - i * 0.05})`,
    });
    document.body.appendChild(d);
    dots.push({ el: d, x: 0, y: 0 });
  }

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  (function animate() {
    let px = mx, py = my;
    dots.forEach((dot, i) => {
      dot.x += (px - dot.x) * (0.35 - i * 0.03);
      dot.y += (py - dot.y) * (0.35 - i * 0.03);
      dot.el.style.left = dot.x + 'px';
      dot.el.style.top  = dot.y + 'px';
      px = dot.x; py = dot.y;
    });
    requestAnimationFrame(animate);
  })();
}

/* ── KEYBOARD FOCUS accessibility: skip link ── */
(function addSkipLink() {
  const skip = document.createElement('a');
  skip.href = '#about';
  skip.textContent = 'Skip to main content';
  skip.setAttribute('class', 'sr-only');
  Object.assign(skip.style, {
    position: 'absolute', top: '-40px', left: '12px', zIndex: '9999',
    background: 'var(--indigo)', color: '#fff',
    padding: '8px 16px', borderRadius: '0 0 8px 8px', fontWeight: '600',
    transition: 'top .2s',
  });
  skip.addEventListener('focus', () => { skip.style.top = '0'; });
  skip.addEventListener('blur',  () => { skip.style.top = '-40px'; });
  document.body.prepend(skip);
})();

/* ── PARTICLES background subtle dots ── */
(function particleBg() {
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, {
    position: 'fixed', inset: '0', zIndex: '0',
    pointerEvents: 'none', opacity: '.35',
  });
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, pts;

  function init() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
      r: Math.random() * 1.5 + .5,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(99,102,241,.6)';
      ctx.fill();
    });
    // Draw connecting lines
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(99,102,241,${0.12 * (1 - d/120)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', init, { passive: true });
})();

console.log('%c  Janitha Portfolio  ', 'background:#6366f1;color:#fff;font-size:14px;padding:6px 14px;border-radius:6px;font-family:monospace;');
console.log('%c Built with HTML, CSS & Vanilla JS', 'color:#06b6d4;font-family:monospace');
