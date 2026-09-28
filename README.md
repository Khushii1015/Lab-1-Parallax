# The Climb — A Scrolling Story

A single-page website that tells the story of a mountain climb from pre-dawn to nightfall. The story is driven entirely by scrolling: the sky changes colour, the sun arcs across and sets, mountains move in parallax, and each chapter reveals itself progressively.

Built with plain **HTML, CSS and JavaScript** — no frameworks or libraries.

## Story structure

| Section | Technique |
|---|---|
| Hero — "The Climb" | Load-in animation, hero text parallax + fade-out on scroll |
| Chapter 1 · Before Dawn | Sticky (pinned) section; text lights up **word by word** as you scroll |
| Chapter 2 · The Forest | Pinned section; two layers of pine trees **slide apart** to reveal the text |
| Chapter 3 · The Ridge | Vertical scroll converted into **horizontal movement** through five checkpoints, with a trail/hiker progress line |
| Chapter 4 · The Summit | Staggered **scroll-reveal** cards and **count-up** numbers |
| Chapter 5 · Nightfall | Sky fades to night, stars twinkle, moon rises; directional reveals |

## Technical focus (lab requirements)

- **Scroll events** — one passive `scroll` listener throttled with `requestAnimationFrame`; it calculates global story progress and per-section progress.
- **CSS transforms** — `translate3d`, `scale`, `scaleX`, `skewY` and `rotate` drive every moving element (GPU-friendly, no layout thrashing).
- **Transitions & animations** — `transition` on reveals, word highlights and hover states; `@keyframes` for twinkling stars, bobbing clouds, the waving flag and the scroll hint.
- **Layered layouts** — a fixed background scene (4 sky layers, sun, moon, stars, clouds, 4 mountain layers) sits behind the content using `z-index`; each mountain layer uses a different `data-speed` for depth.
- **Progressive reveal** — `IntersectionObserver` for reveal-on-scroll, number counters and active chapter dots; `position: sticky` for pinned chapters.

## Extras

- Reading progress bar and clickable chapter navigation dots with labels
- CSS custom property `--p` passed from JS to CSS so layout math lives in the stylesheet
- Responsive down to phone width
- Accessibility: skip link, `aria-label`s, visible focus states, and full `prefers-reduced-motion` support
- Custom SVG favicon (`assets/favicon.svg`); all scenery drawn with inline SVG/CSS, so no external media is required

## File structure

```
index.html        page structure and story content
style.css         layout, layers, transforms, transitions, animations
script.js         scroll handling, parallax, reveals, counters
assets/
  favicon.svg     site icon
README.md
```

## Run locally

Open `index.html` in a browser — no build step needed.
