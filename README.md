# OneCreaation

OneCreaation is a performance marketing partner for B2B digital and technical businesses. This repository contains the source code for the agency's primary landing page and associated experimental components. The site is designed to reflect a compounding growth system, focusing on ICP-first strategy, revenue-driven marketing, and fully transparent reporting.

## Overview

The primary application is a single-page website built with a focus on modern, premium design aesthetics. It utilizes glassmorphism, fluid typography, and performant scroll-reveal animations to create a highly dynamic and engaging user experience.

### Core Disciplines Highlighted

1. AI Solutions for Business
2. Content / Social Media
3. Inbound & Outbound Automations
4. Performance Analysis & Growth Strategy

## Technology Stack

* Core Website: HTML5, CSS3 (Vanilla), JavaScript (Vanilla)
* Animations: Custom CSS transitions, keyframe animations, and IntersectionObserver for scroll-reveal effects.
* Experimental Components: React, TypeScript, Tailwind CSS, and Framer Motion.
* Deployment: Vercel

## Project Structure

* index.html: The main landing page containing all structural markup, embedded CSS styling, and vanilla JavaScript logic for animations, mobile navigation, and modal interactivity.
* components/: Contains experimental React components (such as the DynamicIslandTOC) designed for future integration into a React-based framework.
* demo.tsx: A demonstration page showcasing the integration of the React UI components.
* lib/: Shared utilities for the React components (e.g., class name merging).
* .gitignore: Standard Git ignore configurations.

## Getting Started

### Running the Static Site

Since the primary website is built using standard web technologies without a build step, you can run it locally with any simple HTTP server. 

Using Python:
```bash
python -m http.server 8000
```

Using Node.js (npx):
```bash
npx serve .
```

Navigate to `http://localhost:8000` (or the port provided by your server) in your web browser.

### Using the React Components

If you intend to use or develop the experimental React components located in the `components/` directory, ensure your environment is configured with a modern React framework (like Next.js or Vite) that supports Tailwind CSS and TypeScript.

Dependencies required for the React components:
```bash
npm install motion lucide-react
```

## Deployment

The main website is optimized and ready for production deployment on Vercel. 

To deploy updates manually via the Vercel CLI:
```bash
npx vercel --prod --project onecreaation
```
