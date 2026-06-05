/* ============================================================
   PORTFOLIO HUD — MAIN JAVASCRIPT
   Netflix × Iron Man × Motion Array
   ============================================================ */

'use strict';

// ============================================================
// CONFIGURATION
// ============================================================
const CONFIG = {
  // Contact links — update these with your real info
  website:  'https://yourwebsite.com',
  email:    'mailto:you@example.com',
  schedule: 'https://calendly.com/yourlink',

  // Carousel settings
  autoplay:      false,
  autoplayDelay: 5000,

  // Colors
  primaryColor:  '#ec7323',
  cyanColor:     '#00e5ff',
  redColor:      '#ef4124',
};

// ============================================================
// UTILITY
// ============================================================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ============================================================
// CONTACT LINKS
// ============================================================
function openLink(type) {
  const map = {
    website:  CONFIG.website,
    email:    CONFIG.email,
    schedule: CONFIG.schedule,
  };
  const url = map[type];
  if (url) window.open(url, '_blank', 'noopener');
}

// ============================================================
// WEB AUDIO — SWOOSH SOUND
// ============================================================
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playSwoosh(direction = 'next') {
  try {
    const ctx = initAudio();
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const duration = 0.45;

    // Create oscillator for the "whoosh" tone
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Distortion/wobble via panner
    const panner = ctx.createStereoPanner();

    // Connect nodes
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(panner);
    panner.connect(ctx.destination);

    // Oscillator type
    osc.type = 'sawtooth';

    // Frequency sweep (swoosh up for next, down for prev)
    if (direction === 'next') {
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(200, now + duration);
    } else {
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(600, now + duration);
    }

    // Gain envelope (attack + decay)
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.18, now + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Low-pass filter sweeping open
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(4000, now + 0.15);
    filter.frequency.exponentialRampToValueAtTime(800, now + duration);
    filter.Q.value = 1.5;

    // Stereo pan (swoosh left-to-right or right-to-left)
    if (direction === 'next') {
      panner.pan.setValueAtTime(-0.6, now);
      panner.pan.linearRampToValueAtTime(0.6, now + duration);
    } else {
      panner.pan.setValueAtTime(0.6, now);
      panner.pan.linearRampToValueAtTime(-0.6, now + duration);
    }

    // Add a secondary noise layer for texture
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(800, now);
    noiseFilter.frequency.linearRampToValueAtTime(3000, now + 0.1);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.06, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    // Start and stop
    osc.start(now);
    osc.stop(now + duration);
    noise.start(now);
    noise.stop(now + duration);

  } catch (e) {
    // Silently fail if audio isn't supported
    console.warn('Audio not available:', e);
  }
}

// ============================================================
// CAROUSEL
// ============================================================
class Carousel {
  constructor() {
    this.track     = $('#carouselTrack');
    this.viewport  = $('#carouselViewport');
    this.prevBtn   = $('#prevBtn');
    this.nextBtn   = $('#nextBtn');
    this.dotsWrap  = $('#carouselDots');
    this.indexEl   = $('#currentIndex');
    this.totalEl   = $('#totalCards');

    this.cards     = $$('.project-card');
    this.total     = this.cards.length;
    this.current   = 0;
    this.isAnimating = false;
    this.autoTimer = null;

    this.init();
  }

  init() {
    if (!this.track || this.total === 0) return;

    // Set total
    if (this.totalEl) this.totalEl.textContent = String(this.total).padStart(2, '0');

    // Build dots
    this.buildDots();

    // Initial layout
    this.layoutCards();
    this.updateActive(true);

    // Events
    this.prevBtn.addEventListener('click', () => this.navigate('prev'));
    this.nextBtn.addEventListener('click', () => this.navigate('next'));

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  this.navigate('prev');
      if (e.key === 'ArrowRight') this.navigate('next');
    });

    // Touch / swipe support
    this.initSwipe();

    // Autoplay
    if (CONFIG.autoplay) this.startAutoplay();

    // Set year
    const yearEl = $('#currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  buildDots() {
    if (!this.dotsWrap) return;
    this.dotsWrap.innerHTML = '';
    this.cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to project ${i + 1}`);
      dot.addEventListener('click', () => this.goTo(i));
      this.dotsWrap.appendChild(dot);
    });
  }

  layoutCards() {
    // Position all cards in the track
    const vw = this.viewport.clientWidth;
    const cardW = Math.min(Math.max(vw * 0.72, 320), 660);
    const gap = 24;

    this.cards.forEach((card) => {
      card.style.width = cardW + 'px';
    });

    // Center the active card; place prev/next on sides
    this.updateTrackPosition(false);
  }

  updateTrackPosition(animate = true) {
    const vw = this.viewport.clientWidth;
    const cardW = Math.min(Math.max(vw * 0.72, 320), 660);
    const gap = 24;

    // Each card offset
    const offset = this.current * (cardW + gap);
    // Center adjustment
    const center = (vw - cardW) / 2;
    const tx = center - offset;

    this.track.style.transition = animate
      ? 'transform 0.6s cubic-bezier(0.68, -0.15, 0.265, 1.35)'
      : 'none';
    this.track.style.transform = `translateX(${tx}px)`;
  }

  updateActive(instant = false) {
    this.cards.forEach((card, i) => {
      card.classList.remove('active', 'prev', 'next');
      if (i === this.current) {
        card.classList.add('active');
      } else if (i === this.current - 1) {
        card.classList.add('prev');
      } else if (i === this.current + 1) {
        card.classList.add('next');
      }
    });

    // Update dots
    $$('.carousel-dot', this.dotsWrap).forEach((dot, i) => {
      dot.classList.toggle('active', i === this.current);
    });

    // Update index display
    if (this.indexEl) {
      this.indexEl.textContent = String(this.current + 1).padStart(2, '0');
    }

    // Update mockup screens
    this.updateMockups();

    // Update dial values
    this.updateDials();
  }

  navigate(direction) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const prevIdx = this.current;

    if (direction === 'next') {
      this.current = (this.current + 1) % this.total;
    } else {
      this.current = (this.current - 1 + this.total) % this.total;
    }

    // Play swoosh
    playSwoosh(direction);

    // Animate arrow flash
    const btn = direction === 'next' ? this.nextBtn : this.prevBtn;
    this.flashArrow(btn);

    // Update position
    this.updateTrackPosition(true);
    this.updateActive(false);

    // Add screen flash effect
    this.screenFlash(direction);

    setTimeout(() => {
      this.isAnimating = false;
    }, 700);
  }

  goTo(index) {
    if (this.isAnimating || index === this.current) return;
    const direction = index > this.current ? 'next' : 'prev';
    this.isAnimating = true;
    this.current = index;
    playSwoosh(direction);
    this.updateTrackPosition(true);
    this.updateActive(false);
    setTimeout(() => { this.isAnimating = false; }, 700);
  }

  flashArrow(btn) {
    btn.style.transform = 'scale(1.3)';
    setTimeout(() => { btn.style.transform = ''; }, 200);
  }

  screenFlash(direction) {
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 999;
      background: linear-gradient(${direction === 'next' ? 'to right' : 'to left'},
        transparent,
        rgba(236,115,35,0.06),
        transparent
      );
      animation: flashFade 0.4s ease-out forwards;
    `;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 450);
  }

  updateMockups() {
    // You can update mockup screens here with card-specific images
    // For now, we update the placeholders with the current project number
    const screens = ['#mockupScreen1', '#mockupScreen2', '#mockupScreen3'];
    screens.forEach((sel) => {
      const el = $(sel);
      if (!el) return;
      // If the current card has an image, show it; otherwise keep placeholder
      const activeCard = this.cards[this.current];
      const img = activeCard ? $('img', activeCard) : null;
      // placeholder stays unless user adds real images
    });
  }

  updateDials() {
    // Randomize dial values per card for dynamic effect
    const vals = [
      { tl: 87, tr: 94 },
      { tl: 73, tr: 88 },
      { tl: 95, tr: 79 },
      { tl: 81, tr: 92 },
    ];
    const v = vals[this.current % vals.length];
    const tlEl = $('#dialValueTL');
    const trEl = $('#dialValueTR');
    if (tlEl) this.animateNumber(tlEl, parseInt(tlEl.textContent), v.tl, '%');
    if (trEl) this.animateNumber(trEl, parseInt(trEl.textContent), v.tr, '%');
  }

  animateNumber(el, from, to, suffix = '') {
    const steps = 20;
    const step = (to - from) / steps;
    let count = 0;
    const id = setInterval(() => {
      count++;
      el.textContent = Math.round(from + step * count) + suffix;
      if (count >= steps) clearInterval(id);
    }, 25);
  }

  initSwipe() {
    let touchStartX = 0;
    let touchEndX = 0;

    this.viewport.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    this.viewport.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        this.navigate(diff > 0 ? 'next' : 'prev');
      }
    }, { passive: true });
  }

  startAutoplay() {
    this.autoTimer = setInterval(() => {
      this.navigate('next');
    }, CONFIG.autoplayDelay);

    // Pause on hover
    this.viewport.addEventListener('mouseenter', () => {
      clearInterval(this.autoTimer);
    });
    this.viewport.addEventListener('mouseleave', () => {
      this.startAutoplay();
    });
  }
}

// ============================================================
// WAVEFORM VISUALIZER
// ============================================================
class Waveform {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.phase = 0;
    this.resize();
    this.animate();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const wrap = this.canvas.parentElement;
    this.canvas.width  = wrap ? Math.min(wrap.clientWidth - 90, 250) : 200;
    this.canvas.height = 30;
  }

  draw() {
    const { canvas, ctx } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;
    const mid = h / 2;

    ctx.beginPath();
    ctx.strokeStyle = '#ec7323';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#ec7323';
    ctx.shadowBlur = 6;

    for (let x = 0; x < w; x++) {
      const t = (x / w) * Math.PI * 8 + this.phase;
      // Multi-frequency interference pattern
      const y = mid
        + Math.sin(t) * 8
        + Math.sin(t * 2.3 + 1) * 4
        + Math.sin(t * 0.5) * 5;

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Second wave (cyan)
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0,229,255,0.4)';
    ctx.lineWidth = 1;
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 4;

    for (let x = 0; x < w; x++) {
      const t = (x / w) * Math.PI * 6 + this.phase * 0.7;
      const y = mid + Math.sin(t + 1) * 6 + Math.cos(t * 1.5) * 3;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  animate() {
    this.phase += 0.05;
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

// ============================================================
// PARTICLE SYSTEM
// ============================================================
class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx    = this.canvas.getContext('2d');
    this.particles = [];
    this.resize();
    this.initParticles();
    this.animate();
    window.addEventListener('resize', () => {
      this.resize();
      this.initParticles();
    });
  }

  resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initParticles() {
    this.particles = [];
    const count = Math.floor((window.innerWidth * window.innerHeight) / 18000);
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(true));
    }
  }

  createParticle(randomY = false) {
    return {
      x: Math.random() * this.canvas.width,
      y: randomY ? Math.random() * this.canvas.height : this.canvas.height + 10,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.8 + 0.2),
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.7 ? '#00e5ff' : '#ec7323',
      pulse: Math.random() * Math.PI * 2,
    };
  }

  update() {
    this.particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.04;
      p.opacity = (Math.sin(p.pulse) * 0.3 + 0.3);

      if (p.y < -10) {
        this.particles[i] = this.createParticle(false);
      }
    });
  }

  draw() {
    const { canvas, ctx } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  animate() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

// ============================================================
// HUD DIAL — TICK MARKS BUILDER
// ============================================================
function buildDialTicks(id) {
  const g = document.getElementById(id);
  if (!g) return;
  const cx = 80, cy = 80;
  const radii = [72, 58, 43];
  const counts = [24, 16, 12];

  radii.forEach((r, ri) => {
    const n = counts[ri];
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      const x1 = cx + Math.cos(angle) * (r - 3);
      const y1 = cy + Math.sin(angle) * (r - 3);
      const x2 = cx + Math.cos(angle) * (r + 3);
      const y2 = cy + Math.sin(angle) * (r + 3);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('stroke', i % 4 === 0 ? '#ec7323' : 'rgba(236,115,35,0.3)');
      line.setAttribute('stroke-width', i % 4 === 0 ? '1.5' : '0.8');
      g.appendChild(line);
    }
  });
}

// ============================================================
// MOUSE COORDINATE TRACKER
// ============================================================
function initMouseTracker() {
  const xEl = $('#mouseX');
  const yEl = $('#mouseY');
  if (!xEl || !yEl) return;

  document.addEventListener('mousemove', (e) => {
    xEl.textContent = String(e.clientX).padStart(4, '0');
    yEl.textContent = String(e.clientY).padStart(4, '0');
  });
}

// ============================================================
// PARALLAX — MOCKUP FLOATING
// ============================================================
function initParallax() {
  const mockups = $$('.mockup');
  if (!mockups.length) return;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx; // -1 to 1
    const dy = (e.clientY - cy) / cy;

    mockups.forEach((m) => {
      const depth = parseFloat(m.dataset.depth || 0.3);
      const tx = dx * depth * 20;
      const ty = dy * depth * 15;
      const rx = -dy * depth * 8;
      const ry = dx * depth * 8;

      m.style.transform = `
        translate(${tx}px, ${ty}px)
        rotateX(${rx}deg)
        rotateY(${ry}deg)
      `;
    });
  });
}

// ============================================================
// RESIZE HANDLER
// ============================================================
function initResize(carousel) {
  let debounce;
  window.addEventListener('resize', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      carousel.layoutCards();
      carousel.updateActive(true);
    }, 150);
  });
}

// ============================================================
// FLASH CSS ANIMATION KEYFRAME (dynamic inject)
// ============================================================
function injectDynamicStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes flashFade {
      from { opacity: 1; }
      to   { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// ============================================================
// SCAN LINE STAGGER
// ============================================================
function initScanLines() {
  const lines = $$('.card-scan-line');
  lines.forEach((line, i) => {
    line.style.animationDelay = `${i * 0.8}s`;
    line.style.animationDuration = `${3 + i * 0.5}s`;
  });
}

// ============================================================
// HUD PANEL LIVE BARS ANIMATION
// ============================================================
function animatePanelBars() {
  const bars = $$('.panel-bar');
  bars.forEach(bar => {
    setInterval(() => {
      const h = Math.floor(Math.random() * 70 + 20) + '%';
      bar.style.setProperty('--h', h);
    }, 800 + Math.random() * 600);
  });
}

// ============================================================
// BOOT SEQUENCE INTRO ANIMATION
// ============================================================
function bootSequence() {
  const wrapper = document.querySelector('.app-wrapper');
  const menu    = document.querySelector('.contact-menu');
  const header  = document.querySelector('.hud-header');
  const footer  = document.querySelector('.hud-footer');
  const carousel = document.querySelector('.carousel-section');

  // Initial state — invisible
  [menu, header, footer, carousel].forEach(el => {
    if (el) el.style.opacity = '0';
  });

  // Staggered fade-in
  setTimeout(() => { if (header)   { header.style.transition = 'opacity 0.5s ease'; header.style.opacity = '1'; } }, 200);
  setTimeout(() => { if (menu)     { menu.style.transition = 'opacity 0.6s ease'; menu.style.opacity = '1'; } }, 400);
  setTimeout(() => { if (carousel) { carousel.style.transition = 'opacity 0.7s ease'; carousel.style.opacity = '1'; } }, 600);
  setTimeout(() => { if (footer)   { footer.style.transition = 'opacity 0.5s ease'; footer.style.opacity = '1'; } }, 800);

  // After boot, remove inline opacity so CSS takes over
  setTimeout(() => {
    [menu, header, footer, carousel].forEach(el => {
      if (el) el.style.opacity = el.style.transition = '';
    });
  }, 1500);
}

// ============================================================
// CTA BUTTON HANDLERS ON CARDS
// ============================================================
function initCardCTAs() {
  $$('.card-cta').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Pulse animation
      btn.style.transform = 'scale(1.05)';
      setTimeout(() => { btn.style.transform = ''; }, 150);
    });
  });
}

// ============================================================
// IMAGE UPLOAD SUPPORT
// Each card-image-banner can be clicked to upload a real image
// ============================================================
function initImageUpload() {
  $$('.card-image-banner').forEach((banner, idx) => {
    banner.style.cursor = 'pointer';
    banner.title = 'Click to upload project image';

    banner.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          banner.innerHTML = `<img src="${ev.target.result}" alt="Project screenshot" style="width:100%;height:100%;object-fit:cover;border-radius:4px;" />`;
        };
        reader.readAsDataURL(file);
      };
      input.click();
    });
  });
}

// ============================================================
// INIT — DOMContentLoaded
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  injectDynamicStyles();

  // Boot sequence
  bootSequence();

  // Build HUD dial tick marks
  buildDialTicks('dialTicks');
  buildDialTicks('dialTicksTR');

  // Carousel
  const carousel = new Carousel();

  // Waveform
  new Waveform('waveform');

  // Particles
  new ParticleSystem('particles-canvas');

  // Mouse tracker
  initMouseTracker();

  // Parallax on mockups
  initParallax();

  // Resize handler
  initResize(carousel);

  // Scan line stagger
  initScanLines();

  // Panel bars
  animatePanelBars();

  // Card CTAs
  initCardCTAs();

  // Image upload
  initImageUpload();

  // Make openLink global
  window.openLink = openLink;

  console.log('%c 🔴 PORTFOLIO HUD ONLINE ', 'background:#000022;color:#ec7323;font-size:14px;font-weight:bold;font-family:monospace;padding:6px 12px;border:1px solid #ec7323;');
});
