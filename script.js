/*
  script.js
  ---------
  All interactivity for the portfolio:
  - Preloader fade-out
  - Theme toggle (persisted in localStorage)
  - Mobile menu + smooth scroll + active nav highlighting
  - Typing effect in hero
  - Scroll-reveal + animated counters + skill bars
  - Project filtering + modal
  - Experience expand/collapse
  - Testimonials carousel
  - Contact form validation + submit (Formspree placeholder + mailto fallback)
  - Back-to-top button
  - Particle canvas background
*/
'use strict';

/* ---------- Utilities ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Preloader ---------- */
window.addEventListener('load', () => {
  const pre = $('#preloader');
  if (pre) {
    setTimeout(() => pre.classList.add('fade'), 400);
    setTimeout(() => pre.remove(), 1100);
  }
});

/* ---------- Theme toggle ---------- */
const themeToggle = $('#themeToggle');
const rootEl = document.documentElement;
function applyTheme(theme) {
  rootEl.setAttribute('data-theme', theme);
  if (themeToggle) {
    themeToggle.innerHTML = theme === 'dark'
      ? '<i class="fa-solid fa-moon" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-sun" aria-hidden="true"></i>';
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
}
const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = rootEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });
}

/* ---------- Mobile menu ---------- */
const hamburger = $('#hamburger');
const navLinks = $('#navLinks');
function closeMenu() {
  if (navLinks) navLinks.classList.remove('open');
  if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
}
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
  });
}
$$('.nav-link').forEach(link => link.addEventListener('click', closeMenu));

/* ---------- Smooth scroll for in-page links ---------- */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      closeMenu();
    }
  });
});

/* ---------- Active nav link via IntersectionObserver ---------- */
const sections = $$('section[id]');
const navLinkMap = new Map($$('.nav-link').map(l => [l.getAttribute('href').slice(1), l]));
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      $$('.nav-link').forEach(l => l.classList.remove('active'));
      const link = navLinkMap.get(id);
      if (link) link.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
sections.forEach(s => sectionObserver.observe(s));

/* ---------- Typing effect ---------- */
const typedEl = $('#typedText');
const roles = ['LLM applications', 'AI agents', 'RAG systems', 'computer vision', 'MLOps platforms'];
let roleIndex = 0;
let charIndex = 0;
let deleting = false;
function typeLoop() {
  if (!typedEl) return;
  const current = roles[roleIndex];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 45 : 80);
}
if (!prefersReducedMotion) typeLoop();
else if (typedEl) typedEl.textContent = roles[0];

/* ---------- Scroll reveal ---------- */
const revealEls = $$('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

/* ---------- Animated counters ---------- */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10) || 0;
  const numEl = el.querySelector('.counter-num');
  if (!numEl) return;
  const duration = 1600;
  const startTime = performance.now();
  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    numEl.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else numEl.textContent = target;
  }
  requestAnimationFrame(step);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
$$('.counter').forEach(c => counterObserver.observe(c));

/* ---------- Skill bars animate on scroll ---------- */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      $$('.skill-bar', entry.target).forEach(bar => {
        const fill = bar.querySelector('.bar-fill');
        const level = bar.getAttribute('data-level');
        if (fill) fill.style.width = level + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.25 });
$$('.skill-card').forEach(c => skillObserver.observe(c));

/* ---------- Project filtering ---------- */
const filterBtns = $$('.filter-btn');
const projectCards = $$('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const filter = btn.getAttribute('data-filter');
    projectCards.forEach(card => {
      const cat = card.getAttribute('data-category');
      const show = filter === 'all' || cat === filter;
      if (show) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ---------- Project modal ---------- */
const projectData = [
  { title: 'Enterprise RAG Knowledge Assistant', desc: 'A retrieval-augmented assistant that lets employees query internal documentation with cited answers and guardrails.', details: 'Built a full RAG pipeline with chunking, embeddings, hybrid search, and reranking. Includes evaluation harness, guardrails, and a FastAPI backend. Reduced average lookup time from minutes to seconds.', tags: ['LangChain', 'FastAPI', 'Pinecone', 'OpenAI', 'Docker'], demo: 'https://demo.mcdanielologun.dev/rag-assistant', github: 'https://github.com/mcdanielologun/rag-assistant' },
  { title: 'Autonomous Research Agent', desc: 'Multi-step agent that plans, searches, synthesizes, and writes cited research reports autonomously.', details: 'Uses LangGraph for planning and tool use, with Redis-backed state and a citation engine. Handles multi-hop queries and produces structured reports with sources.', tags: ['LangGraph', 'Python', 'Redis', 'OpenAI'], demo: 'https://demo.mcdanielologun.dev/research-agent', github: 'https://github.com/mcdanielologun/research-agent' },
  { title: 'Real-time Object Detection Pipeline', desc: 'Low-latency YOLOv8 pipeline processing 60fps video streams with edge deployment.', details: 'End-to-end pipeline: capture, preprocess, inference, postprocess, and streaming. Deployed on edge devices with TensorRT optimization and monitoring.', tags: ['YOLOv8', 'PyTorch', 'OpenCV', 'Docker', 'TensorRT'], demo: 'https://demo.mcdanielologun.dev/object-detection', github: 'https://github.com/mcdanielologun/object-detection' },
  { title: 'Medical Image Segmentation', desc: 'U-Net based segmentation for radiology scans with clinical-grade accuracy metrics.', details: 'Trained and validated U-Net variants on annotated datasets. Achieved Dice > 0.92. Includes data augmentation, cross-validation, and a review UI.', tags: ['U-Net', 'TensorFlow', 'Keras', 'AWS'], demo: 'https://demo.mcdanielologun.dev/med-seg', github: 'https://github.com/mcdanielologun/med-seg' },
  { title: 'Workflow Automation Engine', desc: 'Event-driven automation platform orchestrating data pipelines and notifications.', details: 'Visual workflow builder with triggers, conditions, and actions. Integrates with APIs and queues. Reduced manual ops by 60%.', tags: ['n8n', 'Python', 'Docker', 'PostgreSQL'], demo: 'https://demo.mcdanielologun.dev/workflow-engine', github: 'https://github.com/mcdanielologun/workflow-engine' },
  { title: 'AI Code Review Bot', desc: 'GitHub Action that reviews PRs with LLMs, suggests fixes, and enforces standards.', details: 'Analyzes diffs, generates review comments, and proposes patches. Configurable rules and severity. Integrates into CI with status checks.', tags: ['GitHub Actions', 'OpenAI', 'Python', 'FastAPI'], demo: 'https://demo.mcdanielologun.dev/code-review-bot', github: 'https://github.com/mcdanielologun/code-review-bot' }
];

const modal = $('#projectModal');
const modalBody = $('#modalBody');
function openModal(index) {
  const p = projectData[index];
  if (!p || !modal || !modalBody) return;
  modalBody.innerHTML = `<h3 id="modalTitle">${p.title}</h3><p>${p.desc}</p><p>${p.details}</p><div class="modal-tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div><div class="modal-actions"><a href="${p.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a><a href="${p.github}" target="_blank" rel="noopener noreferrer" class="btn btn-outline"><i class="fa-brands fa-github"></i> GitHub</a></div>`;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
if (modal) modal.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal(); });
projectCards.forEach(card => {
  card.addEventListener('click', () => openModal(parseInt(card.getAttribute('data-project'), 10)));
  card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(parseInt(card.getAttribute('data-project'), 10)); } });
});

/* ---------- Experience expand/collapse ---------- */
$$('.toggle-details').forEach(btn => {
  btn.addEventListener('click', () => {
    const details = btn.nextElementSibling;
    const open = details.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.firstChild.nodeValue = open ? 'Hide details ' : 'Show details ';
  });
});

/* ---------- Testimonials carousel ---------- */
const track = $('#carouselTrack');
const slides = track ? $$('.testimonial-card', track) : [];
const dotsContainer = $('#carouselDots');
let currentSlide = 0;
let autoplayTimer = null;
function goToSlide(i) {
  if (!track || slides.length === 0) return;
  currentSlide = (i + slides.length) % slides.length;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  if (dotsContainer) {
    $$('.dot-btn', dotsContainer).forEach((d, idx) => d.classList.toggle('active', idx === currentSlide));
  }
}
if (dotsContainer && slides.length) {
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot-btn' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
}
const prevBtn = $('#carouselPrev');
const nextBtn = $('#carouselNext');
if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

function startAutoplay() {
  if (prefersReducedMotion || slides.length < 2) return;
  stopAutoplay();
  autoplayTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
}
function stopAutoplay() { if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; } }
const carousel = $('#carousel');
if (carousel) {
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('focusin', stopAutoplay);
  carousel.addEventListener('focusout', startAutoplay);
}
startAutoplay();

/* ---------- Toast helper ---------- */
function showToast(message, type = 'info') {
  let toast = $('#toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = 'toast show ' + type;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 3500);
}
const toastStyle = document.createElement('style');
toastStyle.textContent = '.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--bg-soft);color:var(--text);border:1px solid var(--border-strong);padding:12px 20px;border-radius:10px;opacity:0;transition:opacity .3s,transform .3s;z-index:4000;box-shadow:var(--shadow)}.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}.toast.success{border-color:#22c55e}.toast.error{border-color:#ef4444}';
document.head.appendChild(toastStyle);

/* ---------- CV download fallback ---------- */
$$('a[download]').forEach(link => {
  link.addEventListener('click', async (e) => {
    if (location.protocol === 'file:') return; // allow native download when opened locally
    const href = link.getAttribute('href');
    try {
      const res = await fetch(href, { method: 'HEAD' });
      if (!res.ok) throw new Error('missing');
    } catch (err) {
      e.preventDefault();
      showToast('CV file not found. Please add cv.pdf to the project folder.', 'error');
    }
  });
});

/* ---------- Back to top ---------- */
const backToTop = $('#backToTop');
function handleScroll() {
  if (backToTop) backToTop.classList.toggle('show', window.scrollY > 400);
}
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();
if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' }));

/* ---------- Contact form validation + submit ---------- */
const form = $('#contactForm');
const submitBtn = $('#submitBtn');
const formStatus = $('#formStatus');

function validateField(input) {
  const val = input.value.trim();
  let msg = '';
  if (input.hasAttribute('required') && !val) msg = 'This field is required.';
  else if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) msg = 'Enter a valid email.';
  else if (input.getAttribute('minlength') && val.length < parseInt(input.getAttribute('minlength'), 10)) msg = `Minimum ${input.getAttribute('minlength')} characters.`;
  const errorEl = document.getElementById(input.id + 'Error');
  if (errorEl) errorEl.textContent = msg;
  input.classList.toggle('invalid', !!msg);
  return !msg;
}

if (form) {
  $$('input, textarea', form).forEach(inp => {
    inp.addEventListener('input', () => validateField(inp));
    inp.addEventListener('blur', () => validateField(inp));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const inputs = $$('input, textarea', form);
    let valid = true;
    inputs.forEach(inp => { if (!validateField(inp)) valid = false; });
    if (!valid) {
      formStatus.textContent = 'Please fix the errors above.';
      formStatus.className = 'form-status error';
      return;
    }

    const ENDPOINT = 'https://formspree.io/f/your-form-id';

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
      const data = new FormData(form);
      const res = await fetch(ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (res.ok) {
        form.reset();
        formStatus.textContent = 'Message sent successfully! I will get back to you soon.';
        formStatus.className = 'form-status success';
        showToast('Message sent!', 'success');
      } else {
        throw new Error('Request failed');
      }
    } catch (err) {
      const name = encodeURIComponent($('#name').value);
      const email = encodeURIComponent($('#email').value);
      const subject = encodeURIComponent($('#subject').value);
      const message = encodeURIComponent($('#message').value);
      const mailto = `mailto:hello@mcdanielologun.dev?subject=${subject}&body=From:%20${name}%20(${email})%0A%0A${message}`;
      formStatus.innerHTML = `Could not send via form. <a href="${mailto}">Click here to email me directly</a>.`;
      formStatus.className = 'form-status error';
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}

/* ---------- Particle / neural-network canvas background ---------- */
const canvas = $('#bgCanvas');
if (canvas && !prefersReducedMotion) {
  const ctx = canvas.getContext('2d');
  let particles;
  const PARTICLE_COUNT = 70;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.6 + 0.6
    }));
  }
  function draw() {
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    ctx.clearRect(0, 0, cw, ch);
    ctx.strokeStyle = 'rgba(99,102,241,0.18)';
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          ctx.globalAlpha = 1 - dist / 120;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(34,211,238,0.7)';
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > cw) p.vx *= -1;
      if (p.y < 0 || p.y > ch) p.vy *= -1;
    });
    requestAnimationFrame(draw);
  }
  resize();
  initParticles();
  window.addEventListener('resize', () => { resize(); initParticles(); });
  draw();
}
