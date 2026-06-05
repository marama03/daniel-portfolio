# 🔴 Portfolio HUD — Backstage · AI Systems Architect

> **Netflix × Iron Man × Motion Array**  
> Brand colors: `#000022` · `#ec7323` · `#ef4124` · `#ece4b7` · `#f3f3f3` · `#666666`

---

## ✅ Layout & Features

### Top-Left — About Me Panel (STATIC across all slides)
- **Neon-ring profile photo** — spinning orange/red/cyan concentric rings (brand colors)
- Click the photo to upload your real headshot
- **YOUR NAME** — editable in HTML (`#aboutName`)
- **AI Systems Architect** — title line in orange glow
- Short bio text — editable in HTML (`#aboutBio`)
- Social links: LinkedIn, GitHub, X/Twitter

### Left Column — Contact Buttons
- **Website** · **Email** · **Schedule Call** — pill buttons, orange glow on hover
- Update URLs in `js/main.js` → `CFG.website / email / schedule`

### Center — Smart Navigation System
| Input | Action |
|---|---|
| ← Left arrow / `ArrowLeft` key / swipe left | Previous project |
| → Right arrow / `ArrowRight` key / swipe right | Next project |
| ▲ Up arrow / `ArrowUp` key / swipe up | Flip to FEATURES view |
| ▼ Down arrow / `ArrowDown` key / swipe down | Flip to BENEFITS view |
| Dot indicators | Jump to any project |

- **Left/Right** navigates between PROJECTS — title and tagline animate
- **Up/Down** stays on same project but flips between FEATURES ↔ BENEFITS
- FEATURES badge = orange, BENEFITS badge = red — visually distinct
- Swoosh sound: LR = horizontal stereo sweep, UD = pitch flip tone
- Spring-curve slide animations with rotateX depth effect

### Right Side — Galaxy Zone (floating 3D Backstage screenshots)
- **4 real screenshots** floating in a starfield nebula
- CSS-only drift animations (no JS loop = zero CPU overhead)
- Mouse parallax shifts devices in 3D depth
- Subtle static nebula glow canvas (drawn once, not animated)
- Devices: Swarm DAG (monitor), Output Review (wide), Swarm Builder (laptop), Decision Journal (tall)

### Background
- **Stars canvas** — drawn once, twinkle batch update every 2s (low bandwidth)
- **Perspective 3D grid** — CSS transform, no canvas
- **X-shape light rays** — CSS only
- **Spinning HUD rings** — SVG + CSS animation, top corners
- **Wireframe schematics** — SVG, bottom corners (cyan left, orange right)
- **Hex telemetry stream** — right edge, CSS scroll

---

## ⚙️ Customization

### 1. Your info
- **Name**: Change `YOUR NAME` text in `#aboutName` div
- **Bio**: Change text in `#aboutBio` paragraph
- **Social links**: Update `href="#"` on `.social-btn` anchors
- **Photo**: Click the profile ring to upload your photo live

### 2. Contact links (`js/main.js` top)
```js
const CFG = {
  website:  'https://yourwebsite.com',
  email:    'mailto:you@example.com',
  schedule: 'https://calendly.com/yourlink',
};
```

### 3. Add more projects
- Add a `{ title, sub }` entry to `CFG.projects`
- Add matching FEATURES slide + BENEFITS slide in `index.html`
- Follow the `data-proj` index pattern

### 4. Replace screenshots
- Swap files in `images/` folder, or click any card's image bar to upload live

---

## 📱 Mobile
- Galaxy zone hides on ≤860px (saves bandwidth)
- Left column collapses to a horizontal row
- About panel stacks vertically
- Swipe left/right for projects, up/down for features/benefits
- HUD rings + schematics hide for clean mobile layout

---

## 📂 Files
```
index.html                          — Full markup
css/style.css                       — All styles (brand colors, HUD, galaxy, mobile)
js/main.js                          — Nav, audio, stars, waveform, parallax
images/
  backstage-swarm-dag.jpg
  backstage-output-review.jpg
  backstage-swarm-builder.jpg
  backstage-decision-journal.jpg
README.md
```

## 🚀 Deploy
**Publish tab** → live with one click.
