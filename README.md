# Daniel Marama — Portfolio HUD

AI Systems Architect portfolio. Netflix × Iron Man aesthetic.  
Live: [portfolio.maramamarketing.com](https://portfolio.maramamarketing.com)

## Structure

```
index.html        ← entire site (HTML + CSS + JS, self-contained)
images/           ← all project screenshots + profile photo
.gitignore
README.md
```

## Deploy

Production is **Vercel**, connected to this repo (`marama03/daniel-portfolio`).
Push to `main` and it deploys automatically — no build step, no CLI needed.

- Production: https://portfolio.maramamarketing.com
- Mirror: https://marama03.github.io/daniel-portfolio/ (GitHub Pages, also builds from `main`)

Note: this repo previously had a second remote pointing at a Genspark code sandbox.
It was removed because `vercel git connect` offered it *ahead of* GitHub in the remote
picker, so accepting the default would have wired production to the sandbox. If it is
ever re-added, pass the repo URL to `vercel git connect` explicitly rather than picking
from the list.

## Projects

Carousel order is driven by `CFG.projects` in `index.html`; each project needs two
`.proj-slide` blocks (features + benefits) in matching DOM order, plus four
`gd-img-<brand>` images in the galaxy zone.

- **THE COCKPIT** — Sovereign AI Agent Platform (customer-hosted)
- **BACKSTAGE** — AI Agent Command Center (Windows Native)
- **PIZZA HOUSE** — Full-Stack Restaurant Web System (Gettysburg, PA)
- **RAFIKI** — AI Personal Assistant built on n8n

## Contact

- Site: [maramamarketing.com](https://www.maramamarketing.com)
- Email: daniel@maramamarketing.com
- Schedule: [lets.confirmatime.com/virtual-coffee](https://lets.confirmatime.com/virtual-coffee)
