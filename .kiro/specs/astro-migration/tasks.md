# Implementation Plan: Astro Migration

## Overview

Migrate the GAMEC website from static HTML5 with jQuery-based dynamic component injection to an Astro 5.x static site generator. The implementation proceeds incrementally: project scaffolding → CSS integration → layout/components → page migrations → React islands → reusable components → image optimization → SEO enhancements → auth preparation → build verification → testing.

## Tasks

- [x] 1. Project initialization and configuration
  - [x] 1.1 Create package.json with Astro dependencies and scripts
    - Initialize `package.json` with `astro >=5.0.0 <6.0.0`, `@astrojs/react`, `react`, `react-dom`, `@astrojs/sitemap` as dependencies
    - Add scripts: `"dev": "astro dev"`, `"build": "astro build"`, `"preview": "astro preview"`
    - Declare `"engines": { "node": ">=18.17.1" }`
    - Add `vitest` and `fast-check` as devDependencies (existing test infrastructure)
    - _Requirements: 1.1, 1.2, 13.1_

  - [x] 1.2 Create astro.config.mjs with static output and integrations
    - Configure `output: 'static'`, `site: 'https://igamec.org'`, `build: { format: 'file' }`
    - Register `react()` and `sitemap()` integrations
    - Configure sitemap filter to exclude `donation-receipts`, `sign-in`, `sign-up`
    - _Requirements: 1.4, 13.1, 15.1_

  - [x] 1.3 Create tsconfig.json with strict mode and path aliases
    - Extend `astro/tsconfigs/strict`
    - Configure path aliases: `@components/*`, `@layouts/*`, `@styles/*`
    - _Requirements: 1.3, 10.4_

  - [x] 1.4 Create src/ directory structure
    - Create `src/pages/`, `src/layouts/`, `src/components/`, `src/components/react/`, `src/components/auth/`, `src/styles/`, `src/styles/modules/`
    - Create `public/` directory with subdirectories `images/`, `assets/webfonts/`
    - Add `.gitkeep` to `src/components/auth/`
    - _Requirements: 1.5, 1.6, 10.5, 14.3_

- [x] 2. CSS migration
  - [x] 2.1 Move CSS modules to src/styles/
    - Copy all 23 CSS module files from `assets/css/modules/` to `src/styles/modules/`
    - Copy `main.css`, `media.css`, `fontawesome-all.min.css` to `src/styles/`
    - Update `@import` paths in `main.css` to reference `./modules/` prefix
    - Preserve cascade order exactly as defined in original `main.css`
    - _Requirements: 4.1, 4.2_

  - [x] 2.2 Configure Font Awesome webfonts in public/
    - Copy webfont files (woff2, ttf) from `assets/webfonts/` to `public/assets/webfonts/`
    - Verify `fontawesome-all.min.css` font-face paths resolve to `/assets/webfonts/`
    - _Requirements: 4.3_

  - [x] 2.3 Verify Google Fonts imports are preserved
    - Confirm `_imports-fonts.css` retains Roboto (400, 500, 700) and Playfair Display (400, 700) with `display=swap`
    - Confirm dns-prefetch and preconnect hints will be in layout
    - _Requirements: 4.5, 7.6_

- [x] 3. BaseLayout.astro creation
  - [x] 3.1 Implement BaseLayout.astro with HTML shell and metadata
    - Create `src/layouts/BaseLayout.astro` with Props interface (title, description, canonicalPath, ogImage, robots, bodyClass, dataPage, structuredData, pageScripts)
    - Render `<!DOCTYPE html>`, `<html lang="en">`, `<head>`, `<body class="is-preload {bodyClass}">`
    - Implement default values: title → "GAMEC", description → org tagline, robots → "index, follow", ogImage → logo URL
    - _Requirements: 2.1, 2.2, 7.7_

  - [x] 3.2 Add SEO meta tags and social sharing tags to BaseLayout
    - Render charset, viewport, title, description, robots meta tags
    - Render canonical URL link using `site` + `canonicalPath`
    - Render Open Graph tags (og:title, og:description, og:image, og:url, og:type "website", og:site_name "GAMEC", og:locale "en_US")
    - Render Twitter Card tags (twitter:card "summary", twitter:title, twitter:description, twitter:image)
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 3.3 Add favicon, manifest, and resource hints to BaseLayout
    - Render favicon ICO with `sizes="any"`, PNG with `type="image/png" sizes="32x32"`, apple-touch-icon
    - Render manifest.json link
    - Render dns-prefetch for fonts.googleapis.com, preconnect for fonts.googleapis.com, preconnect with crossorigin for fonts.gstatic.com
    - _Requirements: 7.5, 7.6_

  - [x] 3.4 Add structured data rendering and global CSS imports
    - Render JSON-LD `<script type="application/ld+json">` blocks from `structuredData` prop array
    - Import global CSS: `main.css`, `media.css`, `fontawesome-all.min.css`
    - Render `<noscript>` fallback with `.noscript-warning` class
    - Render `<slot />` for page content between Header and Footer
    - Include page-specific scripts from `pageScripts` prop
    - _Requirements: 2.6, 4.1, 7.4_

- [x] 4. Header.astro component
  - [x] 4.1 Implement Header.astro with navigation and active highlighting
    - Create `src/components/Header.astro` accepting `currentPath` prop
    - Define navigation data structure as typed constant (NavItem interface with label, href, children)
    - Render skip-to-content link (`<a href="#main-wrapper" class="skip-link visually-hidden">`)
    - Render logo section with link to index.html
    - Render `<nav>` with `role="navigation"` and `aria-label="Main navigation"`
    - _Requirements: 2.3, 6.1, 11.1, 11.2, 11.5_

  - [x] 4.2 Implement build-time .current class logic
    - Apply `.current` class to `<li>` whose child `<a>` href matches `currentPath`
    - For submenu pages: apply `.current` to both submenu `<li>` and parent dropdown `<li>`
    - For top-level pages: apply `.current` only to top-level `<li>`
    - For unmatched paths (sign-in, sign-up): no `.current` applied
    - Preserve `aria-haspopup="true"` and `aria-expanded="false"` on dropdown parent links
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 5. Footer.astro component
  - [x] 5.1 Implement Footer.astro with 4-column layout
    - Create `src/components/Footer.astro`
    - Render 4-column layout: Sitemap, Resources, Quick Links, Contact
    - Render social media links with `target="_blank"`, `rel="noopener noreferrer"`, `.visually-hidden` labels
    - Render copyright notice and site credit
    - Add `role="contentinfo"` on footer element
    - _Requirements: 2.4, 11.3, 11.5_

- [x] 6. Client-side JavaScript migration
  - [x] 6.1 Rewrite navigation logic in vanilla JavaScript
    - Create navigation initialization script (replace jQuery `.panel()` and `.navList()`)
    - Implement desktop dropdowns: mouseenter/mouseleave with 200ms delay
    - Implement keyboard navigation: Enter/Space/ArrowDown to open, ArrowUp/ArrowDown to navigate, Escape to close
    - Implement `aria-expanded` toggling on parent links
    - Implement mobile slide-in panel with toggle button, `aria-expanded` and `aria-label` state management
    - _Requirements: 5.2, 5.7, 11.4, 11.6_

  - [x] 6.2 Implement scroll reveal and preload removal scripts
    - Implement IntersectionObserver for `.reveal` and `.reveal-stagger` elements (threshold 0.15)
    - Add `.is-visible` on first intersection, unobserve after
    - Fallback: add `.is-visible` immediately if IntersectionObserver unsupported
    - Implement preload removal: remove `.is-preload` from body 100ms after window load
    - _Requirements: 5.3, 5.4_

  - [x] 6.3 Wire shared scripts into BaseLayout
    - Include navigation init, scroll reveal, and preload scripts in BaseLayout
    - Ensure no `includes.js`, `jquery.min.js`, `browser.min.js`, `breakpoints.min.js`, or `util.js` in output
    - Verify layout produces no runtime fetch for `header.html` or `footer.html`
    - _Requirements: 2.5, 2.7, 5.1, 5.7_

- [x] 7. Checkpoint - Verify core infrastructure
  - Ensure all tests pass, ask the user if questions arise.
  - Verify `astro build` completes without errors
  - Verify BaseLayout, Header, Footer render correctly

- [x] 8. Page migrations (all 18 pages)
  - [x] 8.1 Migrate homepage (index.astro)
    - Convert `index.html` to `src/pages/index.astro` using BaseLayout
    - Preserve all 10 `data-section` attributes: banner, features, history, impact, donate-cta, livestream, matrimonial-callout, resources, community-groups, stay-connected
    - Set `bodyClass: "homepage"`, `dataPage: "index"`
    - Add JSON-LD: NonprofitOrganization + WebSite structured data
    - _Requirements: 3.1, 3.2, 3.7, 7.4_

  - [x] 8.2 Migrate About Us pages (vision, history, leadership, contact)
    - Convert `vision.html`, `history.html`, `leadership.html`, `contact.html` to `.astro` pages
    - Preserve all semantic HTML, ARIA attributes, `data-section` attributes, `visually-hidden` spans
    - Set appropriate `bodyClass` and `dataPage` for each
    - Add ContactPoint structured data on contact page
    - _Requirements: 3.1, 3.5, 3.7, 15.7_

  - [x] 8.3 Migrate Programs pages (programs, relief, sisters, youth, seniors, professionals, health)
    - Convert all 7 program pages to `.astro` files
    - Preserve all semantic HTML, ARIA attributes, `data-section` attributes
    - Add NonprofitOrganization + department structured data on each program page
    - _Requirements: 3.1, 3.5, 3.7, 15.7_

  - [x] 8.4 Migrate Membership and Donate pages
    - Convert `membership.html` and `donate.html` to `.astro` pages
    - Preserve all content, classes, and structure
    - _Requirements: 3.1, 3.5, 3.7_

  - [x] 8.5 Migrate Media and Resources pages
    - Convert `media.html` to `.astro` page
    - Convert `resources.html` to `.astro` page with QuranViewer placeholder (React island added later)
    - Load page-specific scripts only on their pages
    - _Requirements: 3.1, 3.6_

  - [x] 8.6 Migrate Matrimonial page with native details/summary accordion
    - Convert `matrimonial.html` to `.astro` page
    - Render FAQ accordion as native `<details>/<summary>` elements (no custom JS)
    - All panels default to collapsed (no `open` attribute)
    - _Requirements: 3.1, 12.1, 12.2, 12.3, 12.4_

  - [x] 8.7 Migrate Donation Receipts page
    - Convert `donation-receipts.html` to `.astro` page
    - Set `robots: "noindex, nofollow"` via layout props
    - Load `donation-receipts.js` as page-specific script preserving all receipt generator functions
    - _Requirements: 3.1, 3.4, 3.6, 5.6_

  - [x] 8.8 Create reserved auth pages (sign-in, sign-up)
    - Create `src/pages/sign-in.astro` and `src/pages/sign-up.astro` with "Coming Soon" message
    - Use BaseLayout with `robots: "noindex, nofollow"`
    - _Requirements: 14.2, 14.6_

- [x] 9. Checkpoint - Verify page migrations
  - Ensure all tests pass, ask the user if questions arise.
  - Verify `astro build` produces 20 HTML files (18 pages + sign-in + sign-up)
  - Verify URL structure matches original filenames

- [x] 10. React integration and QuranViewer island
  - [x] 10.1 Implement QuranViewer.tsx React island
    - Create `src/components/react/QuranViewer.tsx` with props: `pdfUrl`, `workerUrl`
    - Implement all 14 viewer functions: goToPage, clampPage, doZoom, resetZoom, clampZoom, adjustZoom, buildToc, toggleToc, getCurrentSurah, saveState, loadState, renderPage, showError, and initialization
    - Implement localStorage state persistence for page/zoom
    - Render canvas element, navigation controls, zoom controls, surah TOC
    - _Requirements: 5.5, 13.2, 13.3_

  - [x] 10.2 Integrate QuranViewer into resources page with client:visible
    - Add `<QuranViewer client:visible pdfUrl="..." workerUrl="..." />` to resources.astro
    - Remove the placeholder/script-based viewer from resources page
    - Verify React only loads on resources page (not other pages)
    - _Requirements: 13.3, 13.5, 13.6_

- [x] 11. Reusable Astro components
  - [x] 11.1 Create LivestreamCard.astro component
    - Accept props: `title`, `thumbnailSrc`, `thumbnailAlt`, `embedUrl`
    - Render livestream embed card with BEM classes
    - Use in homepage and media page
    - _Requirements: 10.2_

  - [x] 11.2 Create ProgramCard.astro component
    - Accept props: `title`, `description`, `icon`, `href`
    - Render program card with icon, title, description, link
    - Use in programs page
    - _Requirements: 10.2_

  - [x] 11.3 Create ImpactStats.astro component
    - Accept props: `stats: {label, value}[]`
    - Render impact statistics section
    - Use in homepage
    - _Requirements: 10.2_

  - [x] 11.4 Create DonationMethods.astro and CommunityGroupCard.astro
    - DonationMethods: self-contained component for Square/PayPal/Zelle section
    - CommunityGroupCard: accept props `title`, `description`, `href`, `icon`
    - Use in donate page and homepage respectively
    - _Requirements: 10.2_

- [x] 12. Image optimization
  - [x] 12.1 Move images to public/ and configure Astro Image
    - Move all images from `images/` to `public/images/`
    - Move favicon files and manifest.json to `public/`
    - Use Astro's `<Image>` component for content images (JPG, PNG) to generate WebP at quality 70-80
    - _Requirements: 1.6, 8.1_

  - [x] 12.2 Add width/height attributes and loading optimization
    - Ensure all `<img>` elements have `width` and `height` attributes
    - Preserve `loading="lazy"` on images that already have it
    - Add `fetchpriority="high"` on above-the-fold hero images
    - Preserve all existing `alt` text without modification
    - Keep CSS background images in `public/` without build-time conversion
    - Pass through SVG files without raster conversion
    - _Requirements: 8.2, 8.3, 8.4, 8.5, 8.6, 15.8_

- [x] 13. SEO enhancements
  - [x] 13.1 Configure sitemap and robots.txt
    - Verify `@astrojs/sitemap` generates `sitemap-index.xml` excluding noindex pages
    - Create `public/robots.txt` with `User-agent: *`, `Allow: /`, `Sitemap: https://igamec.org/sitemap-index.xml`
    - _Requirements: 15.1, 15.2, 15.11_

  - [x] 13.2 Expand structured data across program and contact pages
    - Add NonprofitOrganization + department JSON-LD on all 7 program pages
    - Add NonprofitOrganization + ContactPoint JSON-LD on contact page
    - Verify homepage has both NonprofitOrganization and WebSite JSON-LD
    - _Requirements: 7.4, 15.7_

  - [x] 13.3 Enforce heading hierarchy across all pages
    - Ensure exactly one `<h1>` per page
    - Ensure heading levels descend sequentially (no skipped levels)
    - Use semantic HTML elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
    - Add `aria-label` or `aria-labelledby` on `<section>` elements
    - _Requirements: 15.5, 15.6_

  - [x] 13.4 Configure critical CSS inlining and asset optimization
    - Configure Astro/Vite to inline critical above-the-fold CSS
    - Ensure minified HTML, CSS, and JS in build output
    - Verify content-hash-based filenames on processed CSS/JS assets
    - Ensure zero render-blocking JavaScript by default
    - _Requirements: 15.4, 15.9, 15.10_

- [x] 14. Future Clerk auth preparation
  - [x] 14.1 Document authentication preparation in README
    - Add "Future: Authentication" section to README.md
    - Document Clerk as planned auth provider
    - List prerequisites in place: React integration, reserved routes, auth component directory
    - List remaining steps: install `@clerk/astro`, add env vars, wrap layouts with ClerkProvider
    - Confirm no Clerk packages installed or env vars configured
    - _Requirements: 14.1, 14.4, 14.5, 14.6_

- [x] 15. Build output verification and .gitignore
  - [x] 15.1 Verify build output structure and update .gitignore
    - Run `astro build` and verify `dist/` contains 20 HTML files
    - Verify `.html` extensions on all output files (donate.html, contact.html, etc.)
    - Verify `public/` assets copied to `dist/` root with structure preserved
    - Add `dist/` and `node_modules/` to `.gitignore`
    - Verify no jQuery, browser.min.js, breakpoints.min.js, util.js, or includes.js in output
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.6_

- [x] 16. Checkpoint - Full build verification
  - Ensure all tests pass, ask the user if questions arise.
  - Verify complete build succeeds with all pages, components, and optimizations

- [ ] 17. Testing
  - [ ]* 17.1 Write property test for navigation highlighting (Property 1)
    - **Property 1: Navigation highlighting applies `.current` to exactly the correct nav items**
    - Generate random page paths from nav data structure
    - Verify `.current` applied to exactly the correct `<li>` elements
    - Verify submenu pages get `.current` on both submenu and parent `<li>`
    - Verify unmatched paths get no `.current` class
    - **Validates: Requirements 2.3, 6.1, 6.2, 6.3, 6.4**

  - [ ]* 17.2 Write property test for layout metadata rendering (Property 2)
    - **Property 2: Layout metadata rendering produces correct tags from props**
    - Generate random title/description/canonicalPath/ogImage/robots combinations
    - Verify `<title>`, `<meta name="description">`, OG tags, Twitter Card tags, canonical link all correctly populated
    - Verify defaults applied when props omitted
    - **Validates: Requirements 2.2, 7.1, 7.2, 7.3, 7.7**

  - [ ]* 17.3 Write property test for sitemap exclusion (Property 3)
    - **Property 3: Sitemap excludes noindex pages and includes all public pages**
    - Generate random sets of pages with/without noindex directive
    - Verify sitemap contains exactly the public (non-noindex) pages
    - **Validates: Requirements 15.1, 15.11**

  - [ ]* 17.4 Write property test for heading hierarchy (Property 4)
    - **Property 4: Valid heading hierarchy on every page**
    - Parse built HTML pages
    - Verify exactly one `<h1>` per page and sequential heading levels
    - **Validates: Requirements 15.5**

  - [ ]* 17.5 Write property test for semantic landmarks (Property 5)
    - **Property 5: Semantic HTML landmark elements on every page**
    - Parse built HTML pages
    - Verify `<header>`, `<nav>`, `<main>`, `<footer>` elements exist
    - **Validates: Requirements 15.6**

  - [ ]* 17.6 Write property test for image dimensions (Property 7)
    - **Property 7: Image dimension attributes prevent layout shift**
    - Parse built HTML pages
    - Verify all `<img>` elements have numeric `width` and `height` attributes
    - **Validates: Requirements 15.8**

  - [ ]* 17.7 Write property test for React bundle isolation (Property 8)
    - **Property 8: No React runtime on pages without React islands**
    - Check built page assets for pages without React islands
    - Verify no React runtime JS (react, react-dom) referenced
    - **Validates: Requirements 13.6**

  - [ ]* 17.8 Write smoke tests for build output
    - Verify build completes without errors
    - Verify `dist/` contains exactly 20 HTML files
    - Verify all expected static assets present
    - Verify no legacy scripts in output (includes.js, jquery.min.js, etc.)
    - Verify `robots.txt` and `sitemap-index.xml` present and valid
    - Verify Font Awesome webfont files accessible
    - **Validates: Requirements 9.1, 9.2, 9.6, 15.1, 15.2**

- [x] 18. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation after major phases
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The existing Vitest + fast-check test infrastructure in `tests/` is reused
- CSS modules are preserved unmodified — only import paths are updated
- jQuery is fully eliminated; navigation rewritten in vanilla JS
- React is only loaded on the resources page (QuranViewer island)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3", "1.4"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3"] },
    { "id": 2, "tasks": ["3.1"] },
    { "id": 3, "tasks": ["3.2", "3.3", "3.4"] },
    { "id": 4, "tasks": ["4.1", "5.1"] },
    { "id": 5, "tasks": ["4.2", "6.1", "6.2"] },
    { "id": 6, "tasks": ["6.3"] },
    { "id": 7, "tasks": ["8.1", "8.2", "8.3", "8.4", "8.6", "8.7", "8.8"] },
    { "id": 8, "tasks": ["8.5"] },
    { "id": 9, "tasks": ["10.1", "11.1", "11.2", "11.3", "11.4"] },
    { "id": 10, "tasks": ["10.2"] },
    { "id": 11, "tasks": ["12.1"] },
    { "id": 12, "tasks": ["12.2", "13.1", "13.2", "13.3"] },
    { "id": 13, "tasks": ["13.4", "14.1"] },
    { "id": 14, "tasks": ["15.1"] },
    { "id": 15, "tasks": ["17.1", "17.2", "17.3", "17.4", "17.5", "17.6", "17.7", "17.8"] }
  ]
}
```
