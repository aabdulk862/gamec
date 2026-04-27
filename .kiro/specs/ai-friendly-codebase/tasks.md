# Tasks

## Task 1: Split the Monolithic Steering File (Req 1, 7)

- [x] 1.1 Create `core-overview.md` steering file with `always` inclusion, containing project structure, tech stack, page inventory, file map (HTML pages, CSS modules, JS files), and deployment info — max 200 lines
- [x] 1.2 Create `css-design-system.md` steering file with `fileMatch: assets/css/**` inclusion, containing color palette, typography, component styles, responsive breakpoints, and CSS module map
- [x] 1.3 Create `js-architecture.md` steering file with `fileMatch: assets/js/**` inclusion, containing script load order, library dependencies, dynamic loading patterns, and navigation initialization details
- [x] 1.4 Create `html-pages.md` steering file with `fileMatch: *.html` inclusion, containing page content summaries, SEO metadata patterns, and shared component structure
- [x] 1.5 Delete the original `gamec.md` steering file after verifying all content is migrated to the new split files

## Task 2: Create Coding Conventions Steering File (Req 2)

- [x] 2.1 Create `coding-conventions.md` in `.kiro/steering/` with `always` inclusion, documenting: BEM naming convention with codebase examples, HTML `<head>` meta tag pattern, JS script load order, external link pattern (`target="_blank"`, `rel="noopener noreferrer"`, visually-hidden label), utility CSS classes (`.text-center`, `.bottom-border`, `.visually-hidden`, `.reveal`, `.page-hero-img`), and noscript fallback pattern

## Task 3: Create Architectural Decisions Steering File (Req 8)

- [x] 3.1 Create `architectural-decisions.md` in `.kiro/steering/` with `always` inclusion, containing reverse-chronological decision entries with date, summary, and rationale — include initial entries for existing decisions (color palette update to navy/gold, Playfair Display heading font, navigation refactor from dropotron to WAI-ARIA, matrimonial page addition, donation receipts feature, Quran viewer addition)

## Task 4: Create Image Inventory Steering File (Req 9)

- [x] 4.1 Create `image-inventory.md` in `.kiro/steering/` with `fileMatch: *.html` inclusion, listing every image in `images/` with filename, description, dimensions/format, and page usage — incorporate recommendations from `files/image-recommendations.md` — include maintenance instruction for adding/removing images

## Task 5: Split the Monolithic CSS File (Req 3)

- [x] 5.1 Create `assets/css/modules/` directory and extract sections 1-2 into `_imports-fonts.css` and `_variables.css`
- [x] 5.2 Extract section 3 (Reset & Base Styles) into `_reset.css`
- [x] 5.3 Extract section 4 (Typography) into `_typography.css`
- [x] 5.4 Extract section 5 (Layout & Grid System) into `_layout.css`
- [x] 5.5 Extract section 6 (Forms) into `_forms.css`
- [x] 5.6 Extract sections 7-9 (Buttons, Tables, Images & Gallery) into `_buttons.css`, `_tables.css`, `_images-gallery.css`
- [x] 5.7 Extract section 10 (Common UI Components) into `_components.css`
- [x] 5.8 Extract section 11 (Page Sections) into shared `_page-sections.css` and page-specific modules: `_page-home.css`, `_page-donate.css`, `_page-programs.css`, `_page-membership.css`, `_page-media.css`, `_page-resources.css`, `_page-matrimonial.css`
- [x] 5.9 Extract section 12 (Site Structure) into `_site-structure.css`
- [x] 5.10 Extract section 13 (Responsive Overrides) into `_responsive.css`
- [x] 5.11 Extract Animations & Effects into `_animations.css`, Livestream section into `_livestream.css`, Quran Viewer section into `_quran-viewer.css`
- [x] 5.12 Replace `main.css` content with `@import` statements for all modules in correct cascade order — verify the import list matches the modules directory contents

## Task 6: Add HTML Section Markers (Req 4)

- [x] 6.1 Add `<!-- Section: Name -->` / `<!-- /Section: Name -->` markers to `header.html` and `footer.html`
- [x] 6.2 Add section markers to `index.html` (Banner, Features, History, Impact, Donate CTA, Livestream, Matrimonial Callout, Resources, Community Groups, Stay Connected)
- [x] 6.3 Add section markers to About Us pages: `vision.html`, `history.html`, `leadership.html`, `contact.html`
- [x] 6.4 Add section markers to Programs pages: `programs.html`, `relief.html`, `sisters.html`, `youth.html`, `seniors.html`, `professionals.html`, `health.html`
- [x] 6.5 Add section markers to remaining pages: `membership.html`, `donate.html`, `media.html`, `resources.html`, `matrimonial.html`

## Task 7: Add Data Attributes (Req 5)

- [x] 7.1 Add `data-page` attribute to `<body>` tag of all 16 HTML pages (value = filename without extension)
- [x] 7.2 Add `data-section` attributes (kebab-case) to major content containers across all 16 pages plus `header.html` and `footer.html`

## Task 8: Add JSDoc to Custom Scripts (Req 6)

- [x] 8.1 Add `@file` block and JSDoc comments to all functions in `includes.js` (`getFileName`, `setActiveNav`, `loadHTML`)
- [x] 8.2 Add `@file` block and JSDoc comments to `main.js` (IIFE, `initNavigation`, scroll reveal observer)
- [x] 8.3 Add `@file` block and JSDoc comments to all 17 functions in `donation-receipts.js`
- [x] 8.4 Add `@file` block and JSDoc comments to all 14 functions in `quran-viewer.js`

## Task 9: CSS Custom Property Audit (Req 10)

- [x] 9.1 Scan all CSS module files for hardcoded color values that match existing `--color-*` custom properties in `_variables.css` and replace them with `var(--color-*)` references
- [x] 9.2 Identify hardcoded color values used in 2+ rules without an existing variable, create new `--color-*` properties in `_variables.css`, and replace all occurrences
- [x] 9.3 Add a summary entry to `architectural-decisions.md` documenting the number of replacements and new variables created

## Task 10: Unused CSS Cleanup (Req 11)

- [x] 10.1 Identify all CSS selectors not matched by any element across the 18 HTML files (16 pages + header + footer), retaining selectors for JS-generated elements (`#navPanel`, `#navToggle`, `.navPanel-visible`, `.link`, `.indent-*`, `.depth-*`) with `/* Dynamic: generated by main.js */` comments
- [x] 10.2 Remove confirmed unused selectors and add an entry to `architectural-decisions.md` documenting what was removed

## Task 11: Write Property-Based Tests

- [x] 11.1 Create `tests/css-modules.property.test.mjs` — Property 1 (CSS module ↔ @import round trip), Property 2 (rule count preservation), Property 3 (page-specific module naming)
- [x] 11.2 Create `tests/section-markers.property.test.mjs` — Property 4 (marker format), Property 5 (no duplicates), Property 6 (all files have markers)
- [x] 11.3 Create `tests/data-attributes.property.test.mjs` — Property 7 (data-page matches filename), Property 8 (data-section kebab-case)
- [x] 11.4 Create `tests/jsdoc-coverage.property.test.mjs` — Property 9 (all functions have JSDoc), Property 10 (all files have @file block)
- [x] 11.5 Create `tests/file-map.property.test.mjs` — Property 11 (file map covers all project files)
- [x] 11.6 Create `tests/css-audit.property.test.mjs` — Property 14 (no hardcoded colors matching variables), Property 15 (repeated colors have variables)
- [x] 11.7 Create `tests/css-cleanup.property.test.mjs` — Property 16 (all selectors match HTML or marked dynamic)

## Task 12: Write Unit Tests

- [x] 12.1 Create `tests/steering-files.unit.test.mjs` — verify frontmatter for all 7 steering files, core overview ≤200 lines, coding conventions covers all required topics
- [x] 12.2 Create `tests/ai-friendly.unit.test.mjs` — verify specific section markers in key pages, dynamic CSS selectors retained with comments, architectural decisions has initial entries, image inventory includes recommendation data
