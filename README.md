# 🔴 Portfolio HUD — BACKSTAGE Showcase

> **Netflix × Iron Man × Motion Array**  
> Holographic HUD portfolio showcasing **Backstage** — AI Agent Command Center

---

## ✅ Completed Features

### Current Project: Backstage
- **Card 1** — Command Center + Swarm Orchestration (7 features / 7 benefits)
- **Card 2** — Output Review + Intelligence Layer (7 features / 7 benefits)
- **Floating 3D monitors** showing 4 real Backstage screenshots in outer space:
  - `backstage-swarm-dag.jpg` — Swarm Orchestration DAG flowchart
  - `backstage-output-review.jpg` — Output Review workspace
  - `backstage-swarm-builder.jpg` — Swarm Builder canvas
  - `backstage-decision-journal.jpg` — Decision Journal timeline

### Visual Design
- 🌟 **BACKSTAGE title** with orange-gold gradient neon glow, animated tagline
- 🟧 **Central carousel card** — dark glassmorphic background, orange neon corner brackets, scan sweep
- **FEATURES + BENEFITS two-column layout** — 7 bullet points each, real product copy
- 🔺 **Left/Right navigation chevron arrows** — layered orange + cyan neon glow
- ⭕ **HUD telemetry rings** — top-left/right spinning with "AGENT HEALTH" / "TRIGGER SCAN" labels
- 🔧 **Wireframe schematics** — bottom corners (cyan/orange)
- 📺 **3D floating device mockups** — 2 monitors + 1 laptop + 1 tablet with real screenshots
- 📊 **Floating data panels** — Agent Health / Swarm Ops / Trigger Engine with live waveforms
- 🔢 **Right-side hex telemetry stream** — scrolling monospace data
- 🌊 **Bottom waveform** — dual-frequency canvas
- ✨ **X-shaped light rays** + perspective grid + particle field

### Interactivity
- 🎵 **Swoosh sound** on carousel transitions
- ⌨️ Keyboard ← → navigation
- 👆 Touch/swipe support
- 🖱️ Mouse parallax on all floating devices
- 🖼️ Click card image strip to replace with your own screenshot
- ⭕ Dot indicators + staggered boot sequence

---

## 📂 File Structure

```
index.html                          — Full page markup (Backstage content)
css/style.css                       — All styling, HUD elements, animations
js/main.js                          — Carousel, audio, particles, waveform, parallax
images/
  backstage-swarm-dag.jpg           — Swarm Orchestration DAG screenshot
  backstage-output-review.jpg       — Output Review workspace screenshot
  backstage-swarm-builder.jpg       — Swarm Builder canvas screenshot
  backstage-decision-journal.jpg    — Decision Journal timeline screenshot
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
};
```

### 2. Add more projects / cards
- Duplicate an `<article class="proj-card">` block in `index.html`
- Add matching entry to `CFG.projects` array in `js/main.js`
- Update `totIdx` if hardcoded

### 3. Swap floating device images
Replace files in `images/` folder or update `src` attributes on `.dev-img` elements in `index.html`

---

## 🚀 Deploy

Go to the **Publish tab** to make it live with one click.
