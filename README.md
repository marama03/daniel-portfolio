# 🔴 Portfolio HUD — Splash & Showcase Page

> **Netflix × Iron Man × Motion Array**  
> Holographic HUD portfolio with 3D floating device mockups in outer space, swoosh-sound carousel, and cinematic orange/cyan neon aesthetics.

---

## ✅ Completed Features

### Visual Design (matches reference image)
- 🌟 **Massive glowing PROJECT TITLE** at top-center — orange-to-gold gradient with neon drop-shadow; animates on slide change
- 🟧 **Central carousel card** — dark glassmorphic background, orange neon corner brackets, scan-sweep line on active card
- **FEATURES + BENEFITS two-column layout** inside each card — white bold headers, arrow bullet lists
- 🔺 **Left/Right navigation chevron arrows** — layered orange + cyan neon polygon glow
- ⭕ **HUD telemetry rings** — top-left and top-right spinning concentric circles with orange/cyan/red arcs, crosshair, and live readout labels
- 🔧 **Wireframe schematics** — bottom-left (cyan) and bottom-right (orange) isometric gear assembly blueprints
- 📺 **Floating 3D device mockups** — laptop ×2, phone, tablet — floating in outer space with parallax mouse-tracking depth
- 📊 **Floating data panels** — left side ×2, right side ×1 — with live waveforms and animated bar charts
- 🔢 **Right-side hex telemetry column** — scrolling orange monospace data stream with random flicker
- 🌊 **Bottom waveform visualizer** — dual-frequency animated canvas (orange + cyan)
- ✨ **X-shaped volumetric light rays** — four diagonal orange beams from the center-back
- 🌌 **Perspective 3D grid** — vanishing-point canvas grid that pulses over the dark space background
- 🪐 **Particle field** — rising orange/cyan ambient particles
- **Staggered boot sequence** — elements fade in with cinematic delay

### Left Contact Menu (3 pill buttons)
- 🌐 **Website** — globe icon, orange glow border
- ✉️ **Email** — envelope icon
- 📞 **Schedule Call** — phone icon
- Hover: slides right, intensified glow, inner highlight

### Interactivity
- 🎵 **Swoosh sound** on every carousel transition (Web Audio API — synthesized sawtooth + noise)
- ↔️ **Smooth spring-curve carousel** — cubic-bezier animation
- ⌨️ **Keyboard navigation** (← → arrow keys)
- 👆 **Touch/swipe support** on mobile
- 🖱️ **Dot indicator** navigation (bottom center)
- 🖼️ **Click-to-upload images** — click card strip OR device screen to upload project screenshots; image mirrors to matching device
- 🐭 **Mouse parallax** — device mockups shift in 3D depth as mouse moves

---

## 📂 File Structure

```
index.html      — Full page markup
css/style.css   — All styling, HUD elements, animations
js/main.js      — Carousel, audio, particles, waveform, parallax, grid
README.md
```

---

## ⚙️ Customization

### 1. Update contact links — `js/main.js` top of file
```js
const CFG = {
  website:  'https://yourwebsite.com',
  email:    'mailto:you@example.com',
  schedule: 'https://calendly.com/yourlink',
  ...
};
```

### 2. Update project titles — `js/main.js` CFG.projects array
```js
projects: [
  { title: 'MY APP NAME',   tagline: 'Short description' },
  { title: 'SECOND PROJECT', tagline: 'Another description' },
  ...
]
```

### 3. Edit features/benefits — `index.html`
Find each `<article class="proj-card">` and update the `<ul class="col-list">` bullets.

### 4. Upload project images
Click any card's image strip (dashed area) or click a floating device screen when viewing the live page. The image will mirror to the matching device mockup.

### 5. Add your name to the HUD header
The title zone shows the current project title. To add your name/brand, edit the `.hud-ring` label text in `index.html`:
```html
<span>YOUR NAME</span>
```

---

## 🎨 Color Palette

| Variable | Value | Usage |
|---|---|---|
| `--bg` | `#060b19` | Page background |
| `--bg2` | `#000022` | Deep space overlay |
| `--orange` | `#ec7323` | Primary accent, borders, glows |
| `--orange2` | `#ef4124` | Red-orange gradient end |
| `--cyan` | `#00e5ff` | Secondary accent, ring arcs, tags |
| `--gold` | `#ffb300` | Title gradient highlight |
| `--white` | `#ffffff` | Card headings |
| `--grey-lt` | `#c8cce0` | Body text |

---

## 🚀 Deploy

Go to the **Publish tab** to make it live with one click.

---

## 📋 Recommended Next Steps

1. Upload real project screenshots by clicking each card's image area
2. Replace placeholder Features/Benefits text with your real content
3. Update `CFG.projects` array with your actual project names
4. Set your contact links in `CFG`
5. Add more project cards by duplicating the `<article class="proj-card">` block and adding a matching entry to `CFG.projects`
