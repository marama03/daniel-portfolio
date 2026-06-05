/* ============================================================
   PORTFOLIO HUD  ·  Main JavaScript
   Netflix × Iron Man × Motion Array
   ============================================================ */
'use strict';

/* ── CONFIG ─────────────────────────────────────────────── */
const CFG = {
  website:  'https://yourwebsite.com',
  email:    'mailto:you@example.com',
  schedule: 'https://calendly.com/yourlink',

  // Project / card data
  projects: [
    {
      title:   'BACKSTAGE',
      tagline: 'AI Agent Command Center — Windows Native',
    },
    {
      title:   'BACKSTAGE',
      tagline: 'Output Review · Decision Journal · Intelligence Layer',
    },
  ],
};

/* ── GLOBALS ─────────────────────────────────────────────── */
let audioCtx = null;

/* ── HELPERS ─────────────────────────────────────────────── */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/* ============================================================
   CONTACT LINKS
   ============================================================ */
function openLink(type) {
  const map = { website: CFG.website, email: CFG.email, schedule: CFG.schedule };
  if (map[type]) window.open(map[type], '_blank', 'noopener');
}
window.openLink = openLink;

/* ============================================================
   SWOOSH  (Web Audio API)
   ============================================================ */
function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function swoosh(dir = 'next') {
  try {
    const ctx = getAudio();
    const t   = ctx.currentTime;
    const dur = 0.48;

    // — oscillator (sawtooth sweep) —
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    const bpf  = ctx.createBiquadFilter();
    const pan  = ctx.createStereoPanner();

    osc.connect(bpf); bpf.connect(gain); gain.connect(pan); pan.connect(ctx.destination);

    osc.type = 'sawtooth';
    if (dir === 'next') {
      osc.frequency.setValueAtTime(70, t);
      osc.frequency.exponentialRampToValueAtTime(1400, t + 0.14);
      osc.frequency.exponentialRampToValueAtTime(180, t + dur);
      pan.pan.setValueAtTime(-0.7, t);
      pan.pan.linearRampToValueAtTime(0.7, t + dur);
    } else {
      osc.frequency.setValueAtTime(1400, t);
      osc.frequency.exponentialRampToValueAtTime(70, t + 0.14);
      osc.frequency.exponentialRampToValueAtTime(700, t + dur);
      pan.pan.setValueAtTime(0.7, t);
      pan.pan.linearRampToValueAtTime(-0.7, t + dur);
    }

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    bpf.type = 'bandpass';
    bpf.frequency.setValueAtTime(300, t);
    bpf.frequency.exponentialRampToValueAtTime(5000, t + 0.14);
    bpf.Q.value = 1.2;

    osc.start(t); osc.stop(t + dur);

    // — noise layer —
    const size = Math.floor(ctx.sampleRate * dur);
    const buf  = ctx.createBuffer(1, size, ctx.sampleRate);
    const d    = buf.getChannelData(0);
    for (let i = 0; i < size; i++) d[i] = (Math.random() * 2 - 1) * 0.25;
    const ns  = ctx.createBufferSource();
    ns.buffer = buf;
    const nf  = ctx.createBiquadFilter();
    nf.type   = 'bandpass';
    nf.frequency.setValueAtTime(600, t);
    nf.frequency.linearRampToValueAtTime(3200, t + 0.12);
    const ng  = ctx.createGain();
    ng.gain.setValueAtTime(0.07, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + dur);
    ns.connect(nf); nf.connect(ng); ng.connect(ctx.destination);
    ns.start(t); ns.stop(t + dur);
  } catch (_) {}
}

/* ============================================================
   CAROUSEL
   ============================================================ */
class Carousel {
  constructor() {
    this.track   = $('#cardTrack');
    this.vp      = $('#cardViewport');
    this.cards   = $$('.proj-card');
    this.total   = this.cards.length;
    this.cur     = 0;
    this.busy    = false;

    this.prevBtn = $('#prevBtn');
    this.nextBtn = $('#nextBtn');
    this.dotsEl  = $('#carouselDots');
    this.curEl   = $('#curIdx');
    this.totEl   = $('#totIdx');
    this.titleEl = $('#projectTitle');

    this._init();
  }

  _init() {
    if (!this.track) return;

    // Total label
    if (this.totEl) this.totEl.textContent = String(this.total).padStart(2, '0');

    // Build dots
    this._buildDots();

    // Initial layout
    this._layout(false);
    this._setActive();

    // Buttons
    this.prevBtn?.addEventListener('click', () => this._nav('prev'));
    this.nextBtn?.addEventListener('click', () => this._nav('next'));

    // Keyboard
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') this._nav('next');
      if (e.key === 'ArrowLeft')  this._nav('prev');
    });

    // Touch swipe
    let tx0 = 0;
    this.vp.addEventListener('touchstart', e => { tx0 = e.touches[0].clientX; }, { passive: true });
    this.vp.addEventListener('touchend',   e => {
      const dx = tx0 - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 45) this._nav(dx > 0 ? 'next' : 'prev');
    }, { passive: true });

    // Resize
    let rt;
    window.addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => { this._layout(false); this._setActive(); }, 120);
    });
  }

  _buildDots() {
    if (!this.dotsEl) return;
    this.dotsEl.innerHTML = '';
    this.cards.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'cdot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Project ${i + 1}`);
      d.addEventListener('click', () => this._goto(i));
      this.dotsEl.appendChild(d);
    });
  }

  _cardWidth() {
    const vw = this.vp.clientWidth;
    return clamp(vw * 0.9, 300, 720);
  }

  _layout(animate = true) {
    const cw  = this._cardWidth();
    const gap = 28;
    this.cards.forEach(c => { c.style.width = cw + 'px'; });
    const offset = this.cur * (cw + gap);
    const center = (this.vp.clientWidth - cw) / 2;
    const tx = center - offset;
    this.track.style.transition = animate
      ? 'transform 0.62s cubic-bezier(0.68,-0.15,0.265,1.35)'
      : 'none';
    this.track.style.transform = `translateX(${tx}px)`;
  }

  _setActive() {
    this.cards.forEach((c, i) => {
      c.classList.remove('is-active', 'is-side');
      if (i === this.cur) c.classList.add('is-active');
      else c.classList.add('is-side');
    });

    // Update dots
    $$('.cdot', this.dotsEl).forEach((d, i) => d.classList.toggle('active', i === this.cur));

    // Update counter
    if (this.curEl) this.curEl.textContent = String(this.cur + 1).padStart(2, '0');

    // Update title + tagline
    const p = CFG.projects[this.cur];
    const tagEl = document.getElementById('projectTagline');
    if (this.titleEl && p) {
      this.titleEl.style.opacity = '0';
      this.titleEl.style.transform = 'translateY(-8px)';
      if (tagEl) { tagEl.style.opacity = '0'; }
      setTimeout(() => {
        this.titleEl.textContent = p.title;
        this.titleEl.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        this.titleEl.style.opacity = '1';
        this.titleEl.style.transform = 'translateY(0)';
        if (tagEl) {
          tagEl.textContent = p.tagline;
          tagEl.style.transition = 'opacity 0.4s ease';
          tagEl.style.opacity = '1';
        }
      }, 200);
    }

    // Animate ring values
    _animRingVal('powerLevel', 70, 99);
    _animRingVal('scanIndex', 60, 98);
  }

  _nav(dir) {
    if (this.busy) return;
    this.busy = true;
    this.cur = dir === 'next'
      ? (this.cur + 1) % this.total
      : (this.cur - 1 + this.total) % this.total;
    swoosh(dir);
    _screenFlash(dir);
    _arrowFlash(dir === 'next' ? this.nextBtn : this.prevBtn);
    this._layout(true);
    this._setActive();
    setTimeout(() => { this.busy = false; }, 680);
  }

  _goto(i) {
    if (this.busy || i === this.cur) return;
    const dir = i > this.cur ? 'next' : 'prev';
    this.busy = true;
    this.cur  = i;
    swoosh(dir);
    this._layout(true);
    this._setActive();
    setTimeout(() => { this.busy = false; }, 680);
  }
}

function _screenFlash(dir) {
  const d = document.createElement('div');
  const side = dir === 'next' ? 'to right' : 'to left';
  d.style.cssText = `
    position:fixed;inset:0;pointer-events:none;z-index:999;
    background:linear-gradient(${side},transparent,rgba(236,115,35,.07),transparent);
    animation:flashOver 0.4s ease-out forwards;
  `;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 450);
}

function _arrowFlash(btn) {
  if (!btn) return;
  btn.style.transform = 'scale(1.3)';
  setTimeout(() => { btn.style.transform = ''; }, 180);
}

function _animRingVal(id, lo, hi) {
  const el = document.getElementById(id);
  if (!el) return;
  const target = Math.floor(Math.random() * (hi - lo) + lo);
  const start  = parseInt(el.textContent) || lo;
  const steps  = 18;
  const step   = (target - start) / steps;
  let n = 0;
  const suffix = el.textContent.includes('%') ? '%' : '';
  const t = setInterval(() => {
    n++;
    el.textContent = Math.round(start + step * n) + '%';
    if (n >= steps) clearInterval(t);
  }, 25);
}

/* ============================================================
   PARTICLE SYSTEM
   ============================================================ */
class Particles {
  constructor(id) {
    this.c = document.getElementById(id);
    if (!this.c) return;
    this.g = this.c.getContext('2d');
    this.p = [];
    this._resize();
    this._populate();
    this._tick();
    window.addEventListener('resize', () => { this._resize(); this._populate(); });
  }
  _resize() {
    this.c.width  = window.innerWidth;
    this.c.height = window.innerHeight;
  }
  _populate() {
    this.p = [];
    const n = Math.floor((this.c.width * this.c.height) / 16000);
    for (let i = 0; i < n; i++) this.p.push(this._mk(true));
  }
  _mk(rnd = false) {
    return {
      x:  Math.random() * this.c.width,
      y:  rnd ? Math.random() * this.c.height : this.c.height + 5,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -(Math.random() * 0.7 + 0.15),
      r:  Math.random() * 1.4 + 0.4,
      a:  Math.random() * 0.45 + 0.1,
      ph: Math.random() * Math.PI * 2,
      col: Math.random() > 0.65 ? '#00e5ff' : '#ec7323',
    };
  }
  _tick() {
    const { c, g } = this;
    g.clearRect(0, 0, c.width, c.height);
    this.p.forEach((p, i) => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.ph += 0.035;
      const a = (Math.sin(p.ph) * 0.28 + 0.32);
      g.beginPath();
      g.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      g.fillStyle = p.col;
      g.globalAlpha = a;
      g.fill();
      if (p.y < -8) this.p[i] = this._mk(false);
    });
    g.globalAlpha = 1;
    requestAnimationFrame(() => this._tick());
  }
}

/* ============================================================
   3D GRID CANVAS
   ============================================================ */
class GridBg {
  constructor(id) {
    this.c = document.getElementById(id);
    if (!this.c) return;
    this.g = this.c.getContext('2d');
    this._resize();
    this._tick();
    window.addEventListener('resize', () => this._resize());
  }
  _resize() {
    this.c.width  = window.innerWidth;
    this.c.height = window.innerHeight;
  }
  _tick() {
    const { c, g } = this;
    g.clearRect(0, 0, c.width, c.height);

    const now = Date.now() / 1000;
    const pulse = (Math.sin(now * 0.4) * 0.5 + 0.5) * 0.04 + 0.02;

    g.strokeStyle = `rgba(236,115,35,${pulse})`;
    g.lineWidth = 0.7;

    // Perspective grid — vanishing point at center-bottom
    const vx = c.width / 2;
    const vy = c.height * 0.6;
    const cols = 22;
    const rows = 14;

    // Vertical lines
    for (let i = 0; i <= cols; i++) {
      const x = (i / cols) * c.width;
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(vx + (x - vx) * 0.08, vy);
      g.stroke();
    }
    // Horizontal lines (perspective compression)
    for (let j = 0; j <= rows; j++) {
      const t  = j / rows;
      const ty = t * vy;
      const xl = vx - (vx) * (1 - t * 0.92);
      const xr = vx + (c.width - vx) * (1 - t * 0.92);
      g.beginPath();
      g.moveTo(xl, ty);
      g.lineTo(xr, ty);
      g.stroke();
    }

    requestAnimationFrame(() => this._tick());
  }
}

/* ============================================================
   WAVEFORM
   ============================================================ */
class Waveform {
  constructor(id) {
    this.c = document.getElementById(id);
    if (!this.c) return;
    this.g   = this.c.getContext('2d');
    this.ph  = 0;
    this._resize();
    this._tick();
    window.addEventListener('resize', () => this._resize());
  }
  _resize() {
    const wrap = this.c.closest('.waveform-wrap');
    this.c.width  = wrap ? Math.min(wrap.clientWidth - 10, 300) : 260;
    this.c.height = 32;
  }
  _draw() {
    const { c, g, ph } = this;
    g.clearRect(0, 0, c.width, c.height);
    const mid = c.height / 2;

    // Orange primary
    g.beginPath();
    g.strokeStyle = '#ec7323';
    g.lineWidth   = 1.6;
    g.shadowColor = '#ec7323';
    g.shadowBlur  = 7;
    for (let x = 0; x < c.width; x++) {
      const t = (x / c.width) * Math.PI * 9 + ph;
      const y = mid + Math.sin(t) * 9 + Math.sin(t * 2.4 + 1) * 4 + Math.sin(t * 0.5) * 5;
      x === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
    }
    g.stroke();

    // Cyan secondary
    g.beginPath();
    g.strokeStyle = 'rgba(0,229,255,0.4)';
    g.lineWidth   = 1;
    g.shadowColor = '#00e5ff';
    g.shadowBlur  = 4;
    for (let x = 0; x < c.width; x++) {
      const t = (x / c.width) * Math.PI * 6 + ph * 0.65;
      const y = mid + Math.sin(t + 1.2) * 7 + Math.cos(t * 1.8) * 3;
      x === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
    }
    g.stroke();
    g.shadowBlur = 0;
  }
  _tick() {
    this.ph += 0.05;
    this._draw();
    requestAnimationFrame(() => this._tick());
  }
}

/* ── mini waveforms for floating panels ── */
class MiniWave {
  constructor(id, color = '#ec7323') {
    this.c   = document.getElementById(id);
    if (!this.c) return;
    this.g   = this.c.getContext('2d');
    this.ph  = Math.random() * Math.PI * 2;
    this.col = color;
    this.c.width  = this.c.offsetWidth  || 120;
    this.c.height = 22;
    this._tick();
  }
  _tick() {
    const { c, g, ph, col } = this;
    g.clearRect(0, 0, c.width, c.height);
    const mid = c.height / 2;
    g.beginPath();
    g.strokeStyle = col;
    g.lineWidth   = 1.2;
    g.shadowColor = col;
    g.shadowBlur  = 4;
    for (let x = 0; x < c.width; x++) {
      const t = (x / c.width) * Math.PI * 7 + ph;
      const y = mid + Math.sin(t) * 6 + Math.sin(t * 2 + 1) * 3;
      x === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
    }
    g.stroke();
    g.shadowBlur = 0;
    this.ph += 0.06;
    requestAnimationFrame(() => this._tick());
  }
}

/* ============================================================
   HEX TELEMETRY COLUMN
   ============================================================ */
function buildHexStream() {
  const el = $('#hexStream');
  if (!el) return;
  const chars = '0123456789ABCDEF';
  const rand6 = () => Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * 16)]).join('');
  // Build enough lines to scroll
  const lines = Array.from({ length: 80 }, (_, i) =>
    `<div>${rand6()}</div>`
  ).join('');
  // Duplicate for seamless scroll
  el.innerHTML = lines + lines;

  // Randomly flicker individual lines
  setInterval(() => {
    const all = $$('div', el);
    const pick = all[Math.floor(Math.random() * all.length)];
    if (pick) {
      pick.textContent = rand6();
      pick.style.color = Math.random() > 0.8 ? '#00e5ff' : 'rgba(236,115,35,0.5)';
    }
  }, 120);
}

/* ============================================================
   3D DEVICE POSITIONING  (place via CSS left/top)
   ============================================================ */
function positionDevices() {
  const devices = $$('.device');
  devices.forEach(d => {
    const px = parseFloat(d.dataset.px || 0.5);
    const py = parseFloat(d.dataset.py || 0.5);
    d.style.left = (px * 100) + '%';
    d.style.top  = (py * 100) + '%';
  });
}

/* ============================================================
   PARALLAX  (mouse-driven 3D depth on devices)
   ============================================================ */
function initParallax() {
  const devices = $$('.device');
  if (!devices.length) return;

  let mx = 0.5, my = 0.5;
  let cx = 0.5, cy = 0.5; // smoothed

  document.addEventListener('mousemove', e => {
    mx = e.clientX / window.innerWidth;
    my = e.clientY / window.innerHeight;
  });

  function tick() {
    // Smooth follow
    cx += (mx - cx) * 0.06;
    cy += (my - cy) * 0.06;

    const dx = (cx - 0.5) * 2; // -1 to 1
    const dy = (cy - 0.5) * 2;

    devices.forEach(d => {
      const depth = parseFloat(d.dataset.depth || 0.3);
      // Offset from base position
      const ox = dx * depth * 28;
      const oy = dy * depth * 18;
      const rx = -dy * depth * 7;
      const ry =  dx * depth * 10;

      // Combine with float animation by only adding translate via data attribute
      d.style.marginLeft = ox + 'px';
      d.style.marginTop  = oy + 'px';
    });

    requestAnimationFrame(tick);
  }
  tick();
}

/* ============================================================
   PANEL BAR ANIMATION
   ============================================================ */
function animatePanelBars() {
  $$('.pb').forEach(b => {
    setInterval(() => {
      const h = Math.floor(Math.random() * 70 + 20) + '%';
      b.style.setProperty('--ph', h);
    }, 700 + Math.random() * 500);
  });
}

/* ============================================================
   IMAGE UPLOAD  (card strips — click to swap with custom image)
   ============================================================ */
function initImageUpload() {
  // Card image strips — clicking replaces the image
  $$('.card-img-strip').forEach((strip, i) => {
    strip.style.cursor = 'pointer';
    strip.title = 'Click to replace with your own image';
    strip.addEventListener('click', () => {
      const inp = document.createElement('input');
      inp.type   = 'file';
      inp.accept = 'image/*';
      inp.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const fr = new FileReader();
        fr.onload = ev => {
          // Replace or update img inside strip
          let img = strip.querySelector('img');
          if (!img) {
            strip.innerHTML = '';
            img = document.createElement('img');
            strip.appendChild(img);
          }
          img.src = ev.target.result;
          img.alt = `Project screenshot ${i+1}`;
        };
        fr.readAsDataURL(file);
      };
      inp.click();
    });
  });
}

/* ============================================================
   BOOT SEQUENCE
   ============================================================ */
function boot() {
  const stage   = $('.stage');
  const menu    = $('.contact-menu');
  const rings   = $$('.hud-ring');
  const sch     = $$('.schematic');

  // Start invisible
  if (stage) { stage.style.opacity = '0'; }
  if (menu)  { menu.style.opacity  = '0'; }

  setTimeout(() => {
    if (stage) { stage.style.transition = 'opacity 0.6s ease'; stage.style.opacity = '1'; }
  }, 150);
  setTimeout(() => {
    if (menu)  { menu.style.transition  = 'opacity 0.6s ease'; menu.style.opacity  = '1'; }
  }, 400);
  setTimeout(() => {
    if (stage) { stage.style.transition = stage.style.opacity = ''; }
    if (menu)  { menu.style.transition  = menu.style.opacity  = ''; }
  }, 1200);
}

/* ============================================================
   YEAR
   ============================================================ */
function setYear() {
  const el = $('#yearLabel');
  if (el) el.textContent = '© ' + new Date().getFullYear();
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Inject flash keyframe
  const s = document.createElement('style');
  s.textContent = '@keyframes flashOver { from{opacity:1} to{opacity:0} }';
  document.head.appendChild(s);

  boot();
  setYear();
  positionDevices();

  new Particles('canvas-particles');
  new GridBg('canvas-grid');
  new Waveform('waveform-main');
  new MiniWave('miniWave1', '#ec7323');
  new MiniWave('miniWave2', '#00e5ff');
  new MiniWave('miniWave3', '#ef4124');

  const carousel = new Carousel();

  buildHexStream();
  animatePanelBars();
  initParallax();
  initImageUpload();

  console.log(
    '%c 🔴 PORTFOLIO HUD ONLINE ',
    'background:#000022;color:#ec7323;font-size:13px;font-weight:bold;font-family:monospace;padding:5px 12px;border:1px solid #ec7323;border-radius:3px;'
  );
});
