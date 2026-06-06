# 🔴 Portfolio HUD — Daniel · AI Systems Architect
### Marama Marketing · [maramamarketing.com](https://www.maramamarketing.com)

> **Netflix × Iron Man × Motion Array aesthetic**  
> Brand: `#000022` bg · `#ec7323` orange · `#ef4124` red · `#ece4b7` cream · `#f3f3f3` light · `#666666` grey

**Live URL:** https://yngstbec.gensparkspace.com/

---

## ✅ Completed Features

### About Me Panel (top-left, always visible)
- **Large neon-ring profile photo** — 162×162px ring wrap, 108×108px photo circle
- 3 spinning SVG arcs: orange (6s) · red (9s counter) · cream (13s) — all brand-color gradient strokes
- Animated **conic-gradient border** on photo circle — orange → red → cream, rotating 3s/cycle
- Two pulsing outer halo rings (CSS `::before` / `::after`)
- Daniel's profile photo auto-loads from `images/profile-photo.jpg`
- Click photo to swap with any image via file picker
- Name: **DANIEL** · Title: AI Systems Architect
- LinkedIn button (centered, single social)

### Contact Buttons
| Button | Links To |
|---|---|
| Website | https://www.maramamarketing.com |
| Email | daniel@maramamrketing.com |
| Schedule Call | https://lets.confirmatime.com/virtual-coffee |

### Navigation System
| Input | Action |
|---|---|
| ← / `ArrowLeft` / swipe left | Previous project |
| → / `ArrowRight` / swipe right | Next project |
| ▲ / `ArrowUp` / swipe up | Flip to FEATURES |
| ▼ / `ArrowDown` / swipe down | Flip to BENEFITS |
| Dot indicators (bottom) | Jump to any project |

- Directional swoosh sound (Web Audio API, stereo pan)
- Spring-curve slide animations with rotateX depth
- HUD dot indicators animate on project change
- Ring telemetry readouts animate on every nav

### Projects (4 total · 8 slides · Left/Right to navigate)

| # | Title | Sub | Slides |
|---|---|---|---|
| 1 | BACKSTAGE | AI Agent Command Center — Windows Native | Features · Benefits |
| 2 | BACKSTAGE | Intelligence Layer — Output Review & Decision Journal | Features · Benefits |
| 3 | PIZZA HOUSE | Full-Stack Restaurant Web System — Gettysburg, PA | Features · Benefits |
| 4 | PIZZA HOUSE | AI Ordering · Growth Engine · Owner Dashboard | Features · Benefits |

### Galaxy Zone (right side, desktop only)
- 4 floating device mockups with CSS-only drift animations
- **Auto-swaps images** when you navigate to Pizza House vs Backstage
- Mouse parallax on all 4 devices (throttled via rAF)
- Static nebula canvas (drawn once, brand orange/red blobs)
- Hides on mobile ≤860px

### Background & HUD Chrome
- Star particle field — batch twinkle every 2s (low CPU)
- Perspective 3D grid (CSS-only)
- X-shape volumetric light rays
- Spinning SVG HUD rings — top corners, orange/cream arcs
- Wireframe schematics — bottom corners (cream left, orange right)
- Hex telemetry data stream — right edge, CSS scroll
- Bottom waveform visualizer — 30fps cap, orange + red wave
- All **100% brand color** — zero teal/cyan anywhere

### Mobile
- Galaxy zone hidden ≤860px
- Left column collapses to horizontal row
- Ring scales to 130px · photo to 86px
- Swipe all 4 directions supported

---

## 📂 File Structure
```
index.html
css/
  style.css
js/
  main.js
images/
  profile-photo.jpg               ← Daniel's headshot
  backstage-swarm-dag.jpg
  backstage-output-review.jpg
  backstage-swarm-builder.jpg
  backstage-decision-journal.jpg
  pizza-dashboard.jpg
  pizza-menu.jpg
  pizza-track-order.jpg
  pizza-account.jpg
  pizza-marketing.jpg
```

---

## ⚙️ Quick Customization

### Contact links — `js/main.js` top
```js
const CFG = {
  website:  'https://www.maramamarketing.com',
  email:    'mailto:daniel@maramamrketing.com',
  schedule: 'https://lets.confirmatime.com/virtual-coffee',
};
```

### Add a new project
1. Add `{ title, sub, brand }` to `CFG.projects` in `js/main.js`
2. Add matching FEATURES + BENEFITS `.proj-slide` pair in `index.html`
3. Add a `data-imgbar` image bar pointing to your new image index
4. Add galaxy images for the new brand if needed

### LinkedIn URL
Find in `index.html`:
```html
<a href="https://www.linkedin.com/in/" ...>
```
Replace `/in/` with your actual LinkedIn profile slug.

---

## 🔜 Suggested Next Steps
- [ ] Add LinkedIn profile URL
- [ ] Add a 3rd client project (same dual-axis nav pattern)
- [ ] Dashboard screenshot for Pizza House once available
- [ ] Add your own domain via Publish settings
- [ ] Add a mobile-friendly "tap to expand" for slide bullets on small screens

---

## 🚀 Deploy
**Publish tab** → one click → live at https://yngstbec.gensparkspace.com/
