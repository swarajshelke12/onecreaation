# Project Build & Structure Documentation

This file provides a quick reference overview of the **OneCreaation** project structure, current feature implementation stage, and technical stack details.

---

## Technical Stack

- **Core**: HTML5, Vanilla JavaScript.
- **Styling**: Modern CSS3 using custom properties (variables), custom ambient glows, and responsive typography (Google Fonts: Sora, Plus Jakarta Sans).
- **Interactions**: HTML5 Canvas (Gravity Sandbox simulation), custom mouse cursor tracking, step-based forms, dynamic modal handlers.

---

## Project Structure

```
OneCreaation/
├── .git/                 # Git repository configuration
├── .gitignore            # Git exclusion config
├── build.md              # Project structure and build documentation (this file)
├── index.html            # Main site bundle (HTML, inline CSS, inline JS)
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
The central document containing the structure, design, stylesheet rules, and interactions of the site. It contains:
- **Head metadata**: Font preconnects, SEO titles, responsive viewport parameters.
- **Global CSS Rules (`<style>`)**: Variable design tokens (`--bg-base`, colors, fonts), structural grids, layouts, animations, transitions, and hover properties.
- **Page Layout**:
  - Hero Section (compelling headers, call-to-actions).
  - Services / Core Compounding System (AI Integration, Social Authority, SEO & Content, Funnel Systems).
  - Gravity Sandbox Section (interactive HTML5 Canvas simulation showcasing interactive physics elements).
  - Booking Modal (2-step dynamic lead generator).
  - Footer & Branding.
- **Vanilla JS Script (`<script>`)**:
  - Touch device auto-detection.
  - Interactive Custom Cursor & Ring tracking.
  - Gravity Sandbox physics engine simulation (handles collision, restitution, screen boundaries, drag/throw controls, and device-pixel ratios).
  - Multi-step modal navigation controls (Step 1 -> Step 2 validation).
  - n8n integration handler.

---

## Active Status & Integrations

### Lead Booking Form
- **Form ID**: `#leadForm`
- **Fields Collected**:
  - `name`: User's full name
  - `email`: User's contact email
  - `website`: Company website URL
  - `phone`: Optional contact number
  - `focus`: Primary channel selection (Step 2)
  - `submittedAt`: ISO timestamp of form submission
- **Integration**: Linked via `fetch` POST to `const N8N_WEBHOOK_URL` in the scripts.
- **Configuration Stage**:
  - Current configuration uses a blank `N8N_WEBHOOK_URL` string fallback.
  - While unset, the form operates in **simulation mode** (logs a warning, waits 1 second to mimic network delay, and displays the success screen).
  - To finalize deployment, change `const N8N_WEBHOOK_URL` inside the `<script>` tag in [index.html](file:///c:/Users/aditi/Desktop/OneCreaation/index.html) to your production n8n webhook URL.
