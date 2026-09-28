# Mission to the Moon

A one-page scrolling story about Maya's trip from a launch pad on Earth to the Moon.

## What happens as you scroll
1. **Launch** – the rocket flies up off the screen.
2. **Countdown** – the numbers 3, 2, 1 appear one after another.
3. **Liftoff** – clouds move sideways at different speeds (parallax).
4. **Into Space** – the sky fades to black, stars appear, and Earth shrinks and spins.
5. **The Landing** – the Moon rises up and gets bigger.
6. **The End** – a button takes you back to the top.

## Techniques used
- **Scroll events:** `window.addEventListener("scroll", ...)` in `script.js`
- **CSS transforms:** `translateY`, `translateX`, `scale` and `rotate`
- **Transitions:** text fades and slides in using the `.reveal` and `.show` classes
- **Layered layout:** fixed sky, space and star layers behind the content, using `z-index`

## Files
- `index.html` – page content
- `style.css` – styles and animations
- `script.js` – scroll effects
- `images/` – rocket, earth, moon and cloud images
