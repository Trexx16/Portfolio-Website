# Personal Portfolio — Mcdaniel Ologun

A production-quality personal portfolio website for an AI developer/ML engineer, built with **plain HTML, CSS, and JavaScript** (no build step, no dependencies to install).

## Files

- `index.html` — page structure and all sections (preloader, navbar, hero, about, skills, projects, modal, experience, testimonials, contact, footer).
- `styles.css` — design system (CSS variables for theming), components, animations, responsive rules, reduced-motion support.
- `script.js` — all interactivity (preloader, theme toggle, mobile menu, smooth scroll, active nav, typing effect, reveal animations, counters, skill bars, project filtering + modal, experience toggle, carousel, toast, CV fallback, back-to-top, contact form validation + submit, particle canvas, auto year).
- `cv.pdf` — your CV (you must add this file yourself).

## How to run

No installation needed. Just open `index.html` in any modern browser:

```bash
# Option 1: double-click index.html
# Option 2: serve locally (optional)
npx serve .
# or
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Customization checklist

1. **Name / links**: Search `mcdanielologun` and `hello@mcdanielologun.dev` across all three files; replace with your GitHub / LinkedIn / Twitter / email and demo URLs.
2. **CV**: Place a real `cv.pdf` next to `index.html` (Download CV buttons point to `cv.pdf`). A toast warns if it's missing when served over HTTP.
3. **Photo**: Replace the `.photo-placeholder` div in the About section with an `<img src="assets/photo.jpg" alt="...">`.
4. **Form endpoint**: In `script.js`, set `ENDPOINT` to your Formspree URL (or swap in an EmailJS call per the comments). A mailto fallback is included.
5. **OG image**: Add `assets/og-image.png` for social previews.
6. **Projects**: Edit the `projectData` array in `script.js` and the matching cards in `index.html`.
7. **Theme colors**: Adjust CSS variables in `:root` / `[data-theme="light"]` in `styles.css`.

## Features

- Dark/light theme persisted via `localStorage`; CSS variables for easy theming.
- `IntersectionObserver` for active nav highlighting and scroll-reveal; animated counters and skill bars.
- Particle / neural-network canvas background; `prefers-reduced-motion` respected.
- Project modal closes via X button, overlay click, and Escape.
- Testimonials carousel with prev/next, dots, and autoplay that pauses on hover.
- Contact form validates in real time with inline errors, loading state, success/error states, and mailto fallback.
- Back-to-top button, preloader fade-out, auto-updating footer year.

## Accessibility

- Semantic HTML, ARIA labels, keyboard-navigable modal and filters.
- Focus-visible outlines.
- Reduced-motion media query disables animations.

## Browser support

Modern browsers (Chrome, Firefox, Safari, Edge). Uses `IntersectionObserver`, `fetch`, and CSS `backdrop-filter`.

## License

Personal use. Replace content and assets with your own before publishing.
