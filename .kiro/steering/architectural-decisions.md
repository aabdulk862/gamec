---
inclusion: always
---

# Architectural Decisions

> **Maintenance:** When a new project-wide decision is made, add an entry at the top of the list below. Each entry must include a **Date**, **Summary**, and **Rationale**. Keep entries in reverse-chronological order (newest first). This ensures AI assistants always see the most recent decisions first and avoid suggesting outdated patterns.

---

## 2026-04-26 — Unused CSS Cleanup — Removed Legacy Selectors

**Summary:** Removed ~75 confirmed-unused CSS selectors across 10 module files (~280 lines removed). Categories of removed selectors: legacy login/signup UI (`.login-button`, `.signup`, `.login-form`, `.logo-login`), legacy card/grid layouts (`.card-container`, `.card1`, `.programs-list`, `.program-card`, `.additional-programs`, `.additional-cards-grid`, `.programs-cta-grid`), legacy page sections (`.programs-section`, `.programs-hero`, `.programs-cta`, `.membership-content`, `.membership-details`, `.membership-hero h1`, `.intro`, `.resource-list`, `.about-list`), unused image variants (`.image.fit`, `.image.left`, `.image.centered`, `.image-gallery`), legacy typography/utility classes (`#quote`, `.homepage-fb-btn`, `.fb-subtext`, `.gameclist`, `.gbutton`, `.gameclist2`, `.banner-subtitle`), and unused vision page selectors (`.vision-card-icon`, `.vision-priorities-grid`, `.vision-priority-item`, `.vision-priority-icon`). Grid framework utilities, CSS reset rules, JS-generated selectors (already annotated with `/* Dynamic */` comments), and responsive overrides of matched selectors were retained.

**Rationale:** Dead CSS selectors confuse AI assistants by presenting patterns that no longer apply to any page, increasing context waste and the risk of AI tools copying or referencing obsolete styles. Removing them reduces stylesheet size and ensures AI suggestions are based only on actively-used patterns.

---

## 2026-04-26 — CSS Custom Property Audit — Hardcoded Color Replacement

**Summary:** Replaced 74 hardcoded color values across 7 CSS module files with `var(--color-*)` references. Created 18 new custom properties in `_variables.css` (9 Quran viewer colors, 5 shared utility colors, 4 black-based shadow colors). Task 9.1 replaced 24 values matching existing variables; Task 9.2 created 18 new variables and replaced ~50 additional occurrences.

**Rationale:** Centralizing all color values as CSS custom properties ensures design consistency, makes future palette changes a single-file edit, and helps AI assistants reference variable names instead of raw hex values when suggesting style changes.

---

## 2026-04-26 — Added Quran PDF Viewer to Resources Page

**Summary:** Integrated a PDF.js-based Quran viewer component on `resources.html`, with page navigation, surah table of contents, zoom controls, and localStorage state persistence. The viewer is implemented in `quran-viewer.js` (14 functions) and styled in `_quran-viewer.css`.

**Rationale:** Community members requested direct Quran reading access without leaving the site. PDF.js was chosen over an `<iframe>` embed to provide custom navigation (surah jump, page input), zoom controls, and a consistent UI that matches the site's design system. The Quran PDF is hosted on Cloudflare R2 CDN for fast delivery. PDF.js is loaded via CDN `<script type="module">` to avoid bundling a large library locally.

---

## 2026-04-26 — Added Donation Receipts Feature

**Summary:** Created `donation-receipts.html` and `donation-receipts.js` — a CSV-based donation receipt generator that parses uploaded CSV files, previews donor records, generates printable/downloadable receipts with sequential receipt numbers, and supports mailto links for emailing receipts. The page is marked `noindex, nofollow` as it is an internal admin tool.

**Rationale:** GAMEC needed an efficient way to generate year-end tax-deductible donation receipts for their 501(c)(3) donors. A client-side solution was chosen to avoid server infrastructure costs and keep donor data private (no data leaves the browser). localStorage is used for receipt number sequencing across sessions.

---

## 2025-03-20 — Added Matrimonial Services Page

**Summary:** Created `matrimonial.html` with sections covering the Islamic perspective on marriage, nikah elements, rights and responsibilities, an FAQ accordion, and a CTA for community members to register interest. Styled with dedicated matrimonial CSS classes (`.matrimonial-card`, `.matrimonial-accordion`, `.matrimonial-purposes`, etc.).

**Rationale:** Community feedback identified matrimonial support as a high-priority service. The page educates members on Islamic marriage principles and provides a pathway to GAMEC's matrimonial facilitation services. An accordion pattern was used for the FAQ to keep the page scannable without overwhelming visitors with content.

---

## 2025-02-10 — Refactored Navigation from Dropotron to WAI-ARIA Disclosure Pattern

**Summary:** Replaced the jQuery Dropotron plugin for desktop dropdown menus with a custom WAI-ARIA disclosure pattern in `main.js`. Desktop dropdowns now use `aria-expanded`, keyboard navigation (Enter/Space/ArrowDown to open, ArrowUp/ArrowDown to navigate, Escape to close), and `mouseenter`/`mouseleave` with a 200ms delay. Mobile navigation retained the slide-in panel approach with ARIA attributes on the toggle button.

**Rationale:** Dropotron lacked keyboard accessibility and ARIA support, making the site inaccessible to screen reader and keyboard-only users. The WAI-ARIA disclosure pattern is the W3C-recommended approach for dropdown menus. This change also removed a jQuery plugin dependency, simplifying the JS stack. Do not reintroduce Dropotron or any non-accessible dropdown library.

---

## 2025-01-15 — Added Playfair Display as Heading Font

**Summary:** Introduced Playfair Display (Google Fonts, weights 400 and 700) as the heading font for `h1` and `h2` elements. Defined as `--font-heading: "Playfair Display", Georgia, serif` in CSS custom properties. Body text remains Roboto.

**Rationale:** The previous design used Roboto for all text, which lacked visual hierarchy between headings and body copy. Playfair Display is a serif font that provides a more distinguished, formal appearance appropriate for a community organization's website. Georgia is the fallback for systems without the web font loaded.

---

## 2025-01-05 — Updated Color Palette to Navy and Gold

**Summary:** Established a navy (`#001f3f`) and gold (`#d4af37`) color palette as the site's primary design system. Defined comprehensive CSS custom properties in `:root` covering primary colors, accent colors, neutrals, borders, text, buttons, widgets, donation sections, shadows, and overlays — all derived from the navy/gold base.

**Rationale:** The navy and gold palette was chosen to reflect GAMEC's brand identity — navy from the organization's text logo and gold from the crescent moon symbol. Previous colors were inconsistent and lacked a cohesive system. All colors are now centralized as CSS custom properties (`--color-*`) to ensure consistency and make future palette adjustments a single-file change in `_variables.css`.
