# Project Build & Structure Documentation

This file provides a quick reference overview of the **OneCreaation** project structure, current feature implementation stage, and technical stack details.

---

## Technical Stack

- **Core**: HTML5, Vanilla JavaScript (ES6+).
- **Styling**: Modern CSS3 in a dedicated stylesheet — custom properties (variables), ambient glows, glassmorphism, and responsive typography (Google Fonts: Sora, Plus Jakarta Sans).
- **Interactions**: HTML5 Canvas (Gravity Sandbox simulation), custom mouse cursor tracking, step-based forms, dynamic modal handlers.
- **Security**: Client-side honeypot field, rate limiting (sessionStorage), interaction tracking, and payload validation for form submissions.

---

## Project Structure

```
OneCreaation/
├── .git/                 # Git repository configuration
├── .gitignore            # Git exclusion config
├── build.md              # Project structure and build documentation (this file)
├── index.html            # Pure HTML structure (~680 lines)
├── css/
│   └── style.css         # All CSS rules — design tokens, layouts, animations, responsive breakpoints (~2260 lines)
├── js/
│   ├── main.js           # Site UI logic — cursor, scroll, nav, modal, form, webhook, reveals (~290 lines)
│   └── sandbox.js        # Gravity physics canvas simulation — IIFE, self-contained (~450 lines)
└── images/               # Media assets and visual representations
    ├── about_growth_visual.png
    ├── service_ai.png
    ├── service_analytics.png
    ├── service_automation.png
    └── service_content.png
```

---

## File Details

### 1. [index.html](file:///c:/Users/aditi/Desktop/OneCreaation/index.html)
Pure HTML structure. No inline CSS or JavaScript. Links to:
- `css/style.css` for all styling
- `js/main.js` for site interactions
- `js/sandbox.js` for the physics canvas

**Page Layout:**
- Hero Section (compelling headers, call-to-actions, glassmorphic dashboard cards)
- Logo Wall (trusted-by section)
- Services / Core Compounding System (4 service cards with hover effects)
- Process Steps (4-step workflow)
- Results / Metrics Grid
- Gravity Sandbox Section (interactive HTML5 Canvas)
- About Section (image + floating quote card + pillars)
- CTA Section
- Booking Modal (2-step dynamic lead generator with honeypot field)
- Footer

### 2. [style.css](file:///c:/Users/aditi/Desktop/OneCreaation/css/style.css)
Complete CSS design system including:
- CSS custom properties / design tokens
- Navigation (fixed, scrolled state, mobile drawer)
- Hero section layout and card styles
- SVG chart animations, radial gauge
- Service cards with mouse-tracking radial gradient
- Process steps, metrics grid
- About section with floating quote card
- Modal and form controls (floating labels, option plates)
- Footer (dark theme)
- All `@keyframes` animations (fadeUp, fadeIn, drawPath, drawGauge, pulseArrow, pulseSuccess)
- Reveal animation classes (reveal, reveal-left, reveal-right, reveal-zoom)
- Gravity sandbox canvas container styles
- Full responsive breakpoints: 1200px, 992px, 768px, 480px
- Ultra-wide scaling: 1400px, 1700px, 2000px

### 3. [main.js](file:///c:/Users/aditi/Desktop/OneCreaation/js/main.js)
Site-wide UI logic:
- Touch device auto-detection
- Custom cursor + ring tracking with hover expansions
- Scroll progress bar + nav scroll class toggle
- Mobile drawer menu logic with body scroll lock
- Service card mouse coordinate tracking (for radial gradient hover effect)
- Booking modal open/close/reset
- Multi-step form validation (name, email, website, phone)
- **Security layer**: honeypot check, rate limiting (30s cooldown), interaction verification, email validation
- n8n webhook submission with loading/error/success states
- IntersectionObserver-based scroll reveal animations

### 4. [sandbox.js](file:///c:/Users/aditi/Desktop/OneCreaation/js/sandbox.js)
Self-contained IIFE for the gravity physics canvas:
- Canvas setup with device pixel ratio (DPR) handling
- Bubble data definitions (8 labeled bubbles with curated colors)
- Physics engine: gravity, damping, bounce, elastic collision resolution
- Mouse/touch interaction: drag, fling (velocity-based throw), cursor repulsion
- Responsive resize handling
- Render loop: grid background, bubble drawing with drop shadows, Sora typography

---

## Active Status & Integrations

### Lead Booking Form
- **Form ID**: `#leadForm`
- **Fields Collected**:
  - `name`: User's full name (required, min 2 chars)
  - `email`: User's contact email (required, format-validated)
  - `problem`: Detailed problem the client is facing (required, min 5 chars, textarea)
  - `phone`: Optional contact number
  - `focus`: Primary channel selection (Step 2)
  - `submittedAt`: ISO timestamp of form submission
- **Security Protections**:
  - Honeypot field (`#formCompanyAddress`) — hidden, bots fill it, silently rejected
  - Rate limiting — 30-second cooldown between submissions via `sessionStorage`
  - Interaction tracking — requires user to have focused at least 2 form fields
  - Payload validation — name length and email format checks
- **Integration**: Linked via `fetch` POST to `const N8N_WEBHOOK_URL` in `js/main.js`.
- **Configuration**:
  - Set your webhook URL in [main.js](file:///c:/Users/aditi/Desktop/OneCreaation/js/main.js) at the `N8N_WEBHOOK_URL` constant.
  - While unset (empty string), the form operates in **simulation mode** with a console warning.
