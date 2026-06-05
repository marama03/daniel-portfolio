/* ============================================================
   PORTFOLIO HUD  ·  Backstage — AI Systems Architect
   Nav: LEFT/RIGHT = project, UP/DOWN = features ↔ benefits
   ============================================================ */
'use strict';

/* ── CONFIG ── */
const CFG = {
  website:  'https://yourwebsite.com',
  email:    'mailto:you@example.com',
  schedule: 'https://calendly.com/yourlink',

  /* Each project has 2 faces: features (even index) + benefits (odd index) */
  projects: [
    { title:'BACKSTAGE', sub:'AI Agent Command Center — Windows Native' },
    { title:'BACKSTAGE', sub:'Intelligence Layer — Output Review & Decision Journal' },
  ],
};

/* ── GLOBALS ── */
let audioCtx = null;
let currentProj = 0;          // 0 = project 1, 1 = project 2
let currentFace = 'features'; // 'features' | 'benefits'
let busy = false;

/* Slide index map: proj * 2 + (face=='benefits' ? 1 : 0) */
const slideIndex = () => currentProj * 2 + (currentFace === 'benefits' ? 1 : 0);

/* ── HELPERS ── */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

function openLink(type) {
  const map = { website:CFG.website, email:CFG.email, schedule:CFG.schedule };
  if (map[type]) window.open(map[type], '_blank', 'noopener');
}
window.openLink = openLink;

/* ── WEB AUDIO SWOOSH ── */
function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function swoosh(type = 'lr') {
  /* type: 'next' | 'prev' | 'up' | 'down' */
  try {
    const ctx = getAudio();
    const t = ctx.currentTime;
    const dur = type === 'up' || type === 'down' ? 0.32 : 0.46;

    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    const bpf  = ctx.createBiquadFilter();
    const pan  = ctx.createStereoPanner();
    osc.connect(bpf); bpf.connect(gain); gain.connect(pan); pan.connect(ctx.destination);

    osc.type = 'sawtooth';
    bpf.type = 'bandpass'; bpf.Q.value = 1.2;

    if (type === 'next') {
      osc.frequency.setValueAtTime(70,t);
      osc.frequency.exponentialRampToValueAtTime(1400,t+.13);
      osc.frequency.exponentialRampToValueAtTime(180,t+dur);
      pan.pan.setValueAtTime(-.7,t); pan.pan.linearRampToValueAtTime(.7,t+dur);
      bpf.frequency.setValueAtTime(300,t); bpf.frequency.exponentialRampToValueAtTime(5000,t+.13);
    } else if (type === 'prev') {
      osc.frequency.setValueAtTime(1400,t);
      osc.frequency.exponentialRampToValueAtTime(70,t+.13);
      osc.frequency.exponentialRampToValueAtTime(700,t+dur);
      pan.pan.setValueAtTime(.7,t); pan.pan.linearRampToValueAtTime(-.7,t+dur);
      bpf.frequency.setValueAtTime(5000,t); bpf.frequency.exponentialRampToValueAtTime(300,t+.13);
    } else {
      /* up/down — vertical flip tone */
      const up = type === 'up';
      osc.frequency.setValueAtTime(up?300:600,t);
      osc.frequency.exponentialRampToValueAtTime(up?900:200,t+dur);
      bpf.frequency.setValueAtTime(800,t); bpf.frequency.linearRampToValueAtTime(3000,t+.12);
    }

    gain.gain.setValueAtTime(0,t);
    gain.gain.linearRampToValueAtTime(.15,t+.04);
    gain.gain.exponentialRampToValueAtTime(.001,t+dur);
    osc.start(t); osc.stop(t+dur);

    /* noise layer */
    const sz = Math.floor(ctx.sampleRate*dur);
    const buf = ctx.createBuffer(1,sz,ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i=0;i<sz;i++) d[i]=(Math.random()*2-1)*.2;
    const ns = ctx.createBufferSource(); ns.buffer = buf;
    const nf = ctx.createBiquadFilter(); nf.type='bandpass'; nf.frequency.value=1200;
    const ng = ctx.createGain(); ng.gain.setValueAtTime(.06,t); ng.gain.exponentialRampToValueAtTime(.001,t+dur);
    ns.connect(nf); nf.connect(ng); ng.connect(ctx.destination);
    ns.start(t); ns.stop(t+dur);
  } catch(_) {}
}

/* ── SLIDE MANAGER ── */
const slides = $$('.proj-slide');

function showSlide(newIdx, direction = 'down') {
  const current = slides.findIndex(s => s.classList.contains('active-slide'));
  if (current === newIdx) return;

  // Exit current
  if (current >= 0) {
    const exitClass = (direction === 'up' || direction === 'prev') ? 'exit-up' : 'exit-down';
    slides[current].classList.remove('active-slide');
    slides[current].classList.add(exitClass);
    setTimeout(() => slides[current]?.classList.remove(exitClass), 520);
  }

  // Enter new
  slides[newIdx].classList.add('active-slide');

  // Update info panel
  updateInfo();
}

function updateInfo() {
  // Title + sub
  const p = CFG.projects[currentProj];
  const titleEl = $('#projTitle');
  const subEl   = $('#projSub');
  if (titleEl) {
    titleEl.style.opacity = '0'; titleEl.style.transform = 'translateY(-6px)';
    setTimeout(() => {
      titleEl.textContent = p.title;
      titleEl.style.transition = 'opacity .35s ease,transform .35s ease';
      titleEl.style.opacity = '1'; titleEl.style.transform = 'translateY(0)';
    }, 180);
  }
  if (subEl) {
    subEl.style.opacity = '0';
    setTimeout(() => { subEl.textContent = p.sub; subEl.style.transition='opacity .4s ease'; subEl.style.opacity='1'; }, 220);
  }

  // Up/down labels
  const projLbl = $('#udProjLabel');
  const faceLbl = $('#udFaceLabel');
  if (projLbl) projLbl.textContent = `0${currentProj+1} / 0${CFG.projects.length}`;
  if (faceLbl) {
    faceLbl.textContent = currentFace.toUpperCase();
    faceLbl.style.color = currentFace === 'benefits' ? 'var(--o2)' : 'var(--o1)';
  }

  // Dots
  updateDots();

  // Ring vals
  animRingVal('rval1', 70, 99);
  animRingVal('rval2', 60, 98);
}

/* ── NAVIGATION ── */
function navRight() {
  if (busy || currentProj >= CFG.projects.length - 1) return;
  busy = true;
  currentProj++;
  // Stay on same face
  showSlide(slideIndex(), 'next');
  swoosh('next');
  screenFlash('next');
  flashBtn($('#btnRight'));
  setTimeout(() => { busy = false; }, 580);
}

function navLeft() {
  if (busy || currentProj <= 0) return;
  busy = true;
  currentProj--;
  showSlide(slideIndex(), 'prev');
  swoosh('prev');
  screenFlash('prev');
  flashBtn($('#btnLeft'));
  setTimeout(() => { busy = false; }, 580);
}

function navUp() {
  if (busy) return;
  busy = true;
  // Toggle face upward
  currentFace = currentFace === 'benefits' ? 'features' : 'benefits';
  showSlide(slideIndex(), 'up');
  swoosh('up');
  setTimeout(() => { busy = false; }, 540);
}

function navDown() {
  if (busy) return;
  busy = true;
  currentFace = currentFace === 'features' ? 'benefits' : 'features';
  showSlide(slideIndex(), 'down');
  swoosh('down');
  setTimeout(() => { busy = false; }, 540);
}

function flashBtn(btn) {
  if (!btn) return;
  btn.style.transform = 'scale(1.28)';
  setTimeout(() => { btn.style.transform = ''; }, 180);
}

function screenFlash(dir) {
  const d = document.createElement('div');
  const side = dir === 'next' ? 'to right' : 'to left';
  d.style.cssText = `position:fixed;inset:0;pointer-events:none;z-index:999;
    background:linear-gradient(${side},transparent,rgba(236,115,35,.07),transparent);
    animation:flashOver .38s ease-out forwards;`;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 420);
}

/* ── DOTS ── */
function buildDots() {
  const wrap = $('#hudDots');
  if (!wrap) return;
  wrap.innerHTML = '';
  CFG.projects.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'hdot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Project ${i+1}`);
    d.addEventListener('click', () => {
      if (busy || i === currentProj) return;
      const dir = i > currentProj ? 'next' : 'prev';
      busy = true;
      currentProj = i;
      showSlide(slideIndex(), dir);
      swoosh(dir);
      setTimeout(() => { busy = false; }, 580);
    });
    wrap.appendChild(d);
  });
}

function updateDots() {
  $$('.hdot').forEach((d,i) => d.classList.toggle('active', i === currentProj));
}

/* ── RING VALUE ANIMATION ── */
function animRingVal(id, lo, hi) {
  const el = document.getElementById(id);
  if (!el) return;
  const target = Math.floor(Math.random() * (hi-lo) + lo);
  const start  = parseInt(el.textContent) || lo;
  const steps  = 16;
  let n = 0;
  const iv = setInterval(() => {
    n++;
    el.textContent = Math.round(start + (target-start)/steps*n) + '%';
    if (n >= steps) clearInterval(iv);
  }, 28);
}

/* ── STAR CANVAS (lightweight — no requestAnimationFrame loop) ── */
function buildStars(canvasId) {
  const c = document.getElementById(canvasId);
  if (!c) return;
  const g = c.getContext('2d');

  function draw() {
    c.width  = window.innerWidth;
    c.height = window.innerHeight;
    const count = Math.floor((c.width * c.height) / 6000);
    for (let i = 0; i < count; i++) {
      const x = Math.random() * c.width;
      const y = Math.random() * c.height;
      const r = Math.random() * 1.2 + 0.2;
      const a = Math.random() * 0.6 + 0.1;
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI*2);
      g.fillStyle = Math.random() > 0.85 ? `rgba(0,200,224,${a})` : `rgba(236,115,35,${a * 0.7})`;
      g.fill();
    }
    // Occasional brighter stars
    for (let i = 0; i < 12; i++) {
      const x = Math.random() * c.width;
      const y = Math.random() * c.height;
      g.beginPath();
      g.arc(x, y, 1.5, 0, Math.PI*2);
      g.fillStyle = `rgba(255,255,255,${Math.random()*.8+.2})`;
      g.shadowColor = '#fff';
      g.shadowBlur = 4;
      g.fill();
      g.shadowBlur = 0;
    }
  }

  draw();
  window.addEventListener('resize', draw);

  /* Twinkle: redraw a subset every 2s — low CPU */
  setInterval(() => {
    const slice = Math.floor(c.width * c.height / 25000);
    for (let i = 0; i < slice; i++) {
      const x = Math.random() * c.width;
      const y = Math.random() * c.height;
      g.clearRect(x-2, y-2, 6, 6);
      const r = Math.random() * 1.4 + 0.2;
      const a = Math.random() * 0.5 + 0.1;
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI*2);
      g.fillStyle = `rgba(236,115,35,${a})`;
      g.fill();
    }
  }, 2000);
}

/* ── NEBULA CANVAS (galaxy glow behind devices, static draw) ── */
function buildNebula(canvasId) {
  const c = document.getElementById(canvasId);
  if (!c) return;
  const g = c.getContext('2d');

  function draw() {
    c.width  = c.parentElement.clientWidth;
    c.height = c.parentElement.clientHeight;
    g.clearRect(0, 0, c.width, c.height);

    // Soft orange nebula blobs
    const blobs = [
      { x:.7, y:.25, r:.28, col:'rgba(236,115,35,.06)' },
      { x:.5, y:.65, r:.32, col:'rgba(239,65,36,.05)' },
      { x:.85, y:.55, r:.22, col:'rgba(0,200,224,.04)' },
      { x:.3, y:.4,  r:.2,  col:'rgba(236,228,183,.03)' },
    ];
    blobs.forEach(b => {
      const grd = g.createRadialGradient(
        b.x*c.width, b.y*c.height, 0,
        b.x*c.width, b.y*c.height, b.r*Math.max(c.width,c.height)
      );
      grd.addColorStop(0, b.col);
      grd.addColorStop(1, 'transparent');
      g.fillStyle = grd;
      g.fillRect(0,0,c.width,c.height);
    });
  }
  draw();
  window.addEventListener('resize', draw);
}

/* ── WAVEFORM (canvas, 30fps cap) ── */
class Waveform {
  constructor(id) {
    this.c = document.getElementById(id);
    if (!this.c) return;
    this.g  = this.c.getContext('2d');
    this.ph = 0;
    this._resize();
    this._tick();
    window.addEventListener('resize', () => this._resize());
  }
  _resize() {
    const wrap = this.c.parentElement;
    this.c.width  = wrap ? Math.min(wrap.clientWidth - 40, 280) : 240;
    this.c.height = 28;
  }
  _draw() {
    const {c,g,ph} = this;
    g.clearRect(0,0,c.width,c.height);
    const mid = c.height/2;
    // Orange wave
    g.beginPath(); g.strokeStyle='#ec7323'; g.lineWidth=1.5;
    g.shadowColor='#ec7323'; g.shadowBlur=5;
    for (let x=0;x<c.width;x++) {
      const t=(x/c.width)*Math.PI*9+ph;
      const y=mid+Math.sin(t)*8+Math.sin(t*2.2+1)*3.5+Math.sin(t*.5)*4.5;
      x===0?g.moveTo(x,y):g.lineTo(x,y);
    }
    g.stroke();
    // Subtle red wave
    g.beginPath(); g.strokeStyle='rgba(239,65,36,.4)'; g.lineWidth=1;
    g.shadowColor='#ef4124'; g.shadowBlur=3;
    for (let x=0;x<c.width;x++) {
      const t=(x/c.width)*Math.PI*6+ph*.7;
      const y=mid+Math.sin(t+1.1)*6+Math.cos(t*1.6)*2.5;
      x===0?g.moveTo(x,y):g.lineTo(x,y);
    }
    g.stroke(); g.shadowBlur=0;
  }
  _tick() {
    this.ph += .05;
    this._draw();
    setTimeout(() => requestAnimationFrame(() => this._tick()), 33); /* ~30fps */
  }
}

/* ── HEX STREAM ── */
function buildHex() {
  const el = $('#hexInner');
  if (!el) return;
  const chars = '0123456789ABCDEF';
  const rand8 = () => Array.from({length:8}, ()=>chars[Math.floor(Math.random()*16)]).join('');
  const lines = Array.from({length:90}, ()=>`<div>${rand8()}</div>`).join('');
  el.innerHTML = lines + lines;
  setInterval(() => {
    const all = $$('div', el);
    const p = all[Math.floor(Math.random()*all.length)];
    if (p) {
      p.textContent = rand8();
      p.style.color = Math.random()>.8 ? 'rgba(0,200,224,.6)' : 'rgba(236,115,35,.45)';
    }
  }, 140);
}

/* ── MOUSE PARALLAX on galaxy devices (throttled) ── */
function initParallax() {
  const devices = $$('.gal-device');
  if (!devices.length) return;
  let mx=.5, my=.5, cx=.5, cy=.5;
  let ticking = false;

  document.addEventListener('mousemove', e => {
    mx = e.clientX / window.innerWidth;
    my = e.clientY / window.innerHeight;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        cx += (mx-cx)*.05;
        cy += (my-cy)*.05;
        const dx = (cx-.5)*2, dy = (cy-.5)*2;
        devices.forEach(d => {
          const depth = parseFloat(d.dataset.drift || 1);
          const ox = dx * depth * 18;
          const oy = dy * depth * 12;
          d.style.marginLeft = ox + 'px';
          d.style.marginTop  = oy + 'px';
        });
        ticking = false;
      });
    }
  });
}

/* ── ABOUT PHOTO UPLOAD ── */
function initPhotoUpload() {
  const photo = $('#aboutPhoto');
  if (!photo) return;
  photo.addEventListener('click', () => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const fr = new FileReader();
      fr.onload = ev => {
        photo.innerHTML = `<img src="${ev.target.result}" alt="Profile photo" />`;
      };
      fr.readAsDataURL(file);
    };
    inp.click();
  });
}

/* ── IMAGE BAR UPLOAD (card screenshots) ── */
function initImageUpload() {
  $$('.slide-img-bar').forEach(bar => {
    bar.addEventListener('click', () => {
      const inp = document.createElement('input');
      inp.type = 'file'; inp.accept = 'image/*';
      inp.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const fr = new FileReader();
        fr.onload = ev => {
          const imgIdx = bar.dataset.imgbar;
          // Update all bars with same imgbar index
          $$(`[data-imgbar="${imgIdx}"] img`).forEach(img => { img.src = ev.target.result; });
          // Update matching galaxy device
          const devImg = $(`.gd-${+imgIdx+1} .gd-img`);
          if (devImg) devImg.src = ev.target.result;
        };
        fr.readAsDataURL(file);
      };
      inp.click();
    });
  });
}

/* ── KEYBOARD ── */
function initKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') navRight();
    if (e.key === 'ArrowLeft')  navLeft();
    if (e.key === 'ArrowUp')    navUp();
    if (e.key === 'ArrowDown')  navDown();
  });
}

/* ── TOUCH / SWIPE ── */
function initSwipe() {
  let sx=0, sy=0;
  const stage = $('#cardStage');
  if (!stage) return;
  stage.addEventListener('touchstart', e => {
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
  }, {passive:true});
  stage.addEventListener('touchend', e => {
    const dx = sx - e.changedTouches[0].clientX;
    const dy = sy - e.changedTouches[0].clientY;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > 44) dx > 0 ? navRight() : navLeft();
    } else {
      if (Math.abs(dy) > 44) dy > 0 ? navDown() : navUp();
    }
  }, {passive:true});
}

/* ── BOOT SEQUENCE ── */
function boot() {
  const stage   = $('.stage');
  const leftCol = $('#leftCol');
  [stage, leftCol].forEach(el => { if (el) el.style.opacity='0'; });
  setTimeout(() => {
    [stage, leftCol].forEach(el => {
      if (el) { el.style.transition='opacity .6s ease'; el.style.opacity='1'; }
    });
  }, 150);
  setTimeout(() => {
    [stage, leftCol].forEach(el => {
      if (el) { el.style.transition=el.style.opacity=''; }
    });
  }, 1000);
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  // Inject flash keyframe
  const s = document.createElement('style');
  s.textContent = '@keyframes flashOver{from{opacity:.5}to{opacity:0}}';
  document.head.appendChild(s);

  boot();
  buildDots();
  buildStars('canvas-stars');
  buildNebula('canvas-nebula');
  buildHex();
  new Waveform('waveform');
  initParallax();
  initKeyboard();
  initSwipe();
  initPhotoUpload();
  initImageUpload();

  // Wire nav buttons
  $('#btnRight')?.addEventListener('click', navRight);
  $('#btnLeft')?.addEventListener('click',  navLeft);
  $('#btnUp')?.addEventListener('click',    navUp);
  $('#btnDown')?.addEventListener('click',  navDown);

  // Initial state
  updateInfo();

  // Year
  const yr = $('#yearLbl');
  if (yr) yr.textContent = '© ' + new Date().getFullYear();

  console.log('%c 🔴 BACKSTAGE HUD ONLINE ', 'background:#000022;color:#ec7323;font-size:13px;font-weight:bold;font-family:monospace;padding:5px 12px;border:1px solid #ec7323;border-radius:3px;');
});
