# Away — Stardust Design System (v2)

## Design philosophy
"Cosmic minimalism" — the UI is a window to the sky. Dark backgrounds, glass surfaces, luminescent accents. Content floats over an immersive starfield. Every interaction feels like you're manipulating the night sky itself.

## Color palette
- **Canvas void** — `#0a0a0f` (deep space black)
- **Surface glass** — `rgba(18, 18, 30, 0.75)` with `backdrop-filter: blur(24px)`
- **Accent starlight** — `#e8e8ff` (cold white-blue)
- **Accent nebula** — `#7c5cbf` (purple)
- **Accent aurora** — `#00d4aa` (teal green)
- **Warning ember** — `#ff6b35` (orange for light pollution)
- **Text primary** — `#e8e8ff`
- **Text muted** — `rgba(232, 232, 255, 0.6)`

## Typography
- Headings: `Space Grotesk` (Google Font) — bold, futuristic
- Body: `Inter` — clean, readable
- Monospace: `JetBrains Mono` — for data

## Components
- Glass cards with blur backdrop
- Gradient borders on active elements
- Smooth transitions (0.3s ease-out)
- Micro-interactions on hover/click
- Full-screen immersive layouts

## Animation
- Starfield particles (Three.js) — always moving slowly
- Content fades in on scroll (IntersectionObserver)
- Timeline scrub animates star opacity in real-time
- Page transitions: fade + slight scale