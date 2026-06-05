# 🔴 Portfolio HUD — Splash & Showcase Page

> **Netflix × Iron Man × Motion Array** — A holographic HUD-style portfolio with a swoosh-sound carousel

---

## ✅ Completed Features

### Layout & Structure
- Full-screen dark navy (`#000022`) immersive layout
- **Left-side contact menu** with pill-shaped buttons: Website, Email, Schedule Call
- **Central carousel** section with arrow navigation and dot indicators
- **HUD header** with name, subtitle, and live scanning bars
- **HUD footer** with animated waveform visualizer, progress indicators, and status bar

### Visual Effects
- 🌌 **Animated particle system** (floating orange/cyan particles rising from the bottom)
- 🔶 **3D perspective grid** background with pulsing animation
- 🌅 **Volumetric light rays** emanating from behind the main card
- 🔮 **Corner HUD telemetry dials** (spinning with radial tick marks, orange/cyan rings)
- 📐 **Wireframe schematics** in the bottom corners (isometric technical blueprints)
- 🖥️ **3D floating device mockups** (laptop, phone, tablet) with parallax mouse-tracking

### Interactive Features
- 🎵 **Swoosh sound effect** on every slide transition (Web Audio API synthesized)
- ↔️ **Smooth carousel slider** with cubic-bezier spring animation
- ⌨️ **Keyboard navigation** (← → arrow keys)
- 👆 **Touch/swipe support** for mobile
- 🖱️ **Dot indicator** navigation
- 🖼️ **Click-to-upload** project images on each card banner
- 🌙 **Boot sequence** intro animation on page load
- 📍 **Live mouse coordinate tracker** in HUD panel

### Project Cards (4 demo projects included)
Each card features:
- Big gradient title with neon glow
- Tagline / description
- Clickable image banner (upload your screenshot!)
- FEATURES column + BENEFITS column (5 bullets each)
- Tech stack tags
- "VIEW PROJECT" CTA button

---

## 📂 File Structure

```
index.html          — Main HTML with all layout sections
css/
  style.css         — All styles, animations, HUD aesthetics
js/
  main.js           — Carousel, particles, waveform, audio, parallax
README.md
```

---

## ⚙️ Customization Guide

### 1. Update your contact links (js/main.js lines 10–14)
```js
const CONFIG = {
  website:  'https://yourwebsite.com',
  email:    'mailto:you@example.com',
  schedule: 'https://calendly.com/yourlink',
};
```

### 2. Update your name (index.html)
```html
<div class="hud-name">YOUR NAME</div>
```

### 3. Add/edit projects
Each `<article class="project-card">` in `index.html` is one project. Copy/paste to add more. Update:
- `card-number` — e.g. `01`
- `card-title` — your project name
- `card-tagline` — brief description
- `feature-list` — 5 features
- `feature-list` (second column) — 5 benefits
- `.tag` spans — tech stack
- Click the image banner when live to upload your screenshot

### 4. Add real project images
Upload images by clicking each card's image banner on the live page, **or** replace the placeholder div with a real `<img>` tag:
```html
<div class="card-image-banner">
  <img src="images/project-nexus.png" alt="Project Nexus screenshot" />
</div>
```

---

## 🎨 Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#000022` | Page background |
| `--primary` | `#ec7323` | Orange glow, borders, accents |
| `--primary-alt` | `#ef4124` | Red gradient endpoint |
| `--cyan` | `#00e5ff` | HUD highlights, ring accent |
| `--cream` | `#ece4b7` | Soft accent text |
| `--white` | `#ffffff` | Headlines |
| `--grey` | `#666666` | Body text, status labels |

---

## 🚀 To Deploy

Go to the **Publish tab** to publish your portfolio and get a live URL.

---

## 📋 Recommended Next Steps

1. **Upload project screenshots** by clicking each card's image banner
2. **Replace placeholder text** with your real project names, features, and benefits
3. **Update contact links** in `js/main.js` CONFIG
4. **Add your name** in `hud-name` element
5. **Add more project cards** by duplicating the `<article class="project-card">` block
6. Consider connecting the "VIEW PROJECT" button to a real project URL
7. Add a hero/intro card at position 0 with your photo and tagline
