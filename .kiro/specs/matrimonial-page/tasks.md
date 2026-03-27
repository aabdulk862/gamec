# Implementation Plan: Matrimonial Page

## Overview

Add a dedicated Matrimonial Services page to the GAMEC website and integrate it into the site's navigation, programs listing, footer sitemap, and XML sitemap. All changes are static HTML/XML edits following existing patterns.

## Tasks

- [x] 1. Create the matrimonial.html page
  - [x] 1.1 Create `matrimonial.html` in the site root using the `no-sidebar` template pattern from `relief.html`
    - Include `<head>` with title "Matrimonial | GAMEC", charset, viewport, meta description, favicon links, and `main.css` link
    - Use body class `is-preload no-sidebar`
    - Include `#page-wrapper` containing `#header-wrapper`, `#main-wrapper` (with `.container` → `#content` → `<article>`), and `#footer-wrapper`
    - Add `<h1>Matrimonial Services</h1>` heading
    - Add introductory paragraph describing the program's purpose of helping Muslim Eritrean community members find compatible partners based on shared values, faith, and cultural backgrounds
    - Add at least one `<h3>` subheading section describing program goals/services, consistent with other program sub-pages
    - Add a call-to-action button linking to an external Fillout form (use placeholder URL `https://forms.fillout.com/t/PLACEHOLDER` until the user provides the actual link), following the same button pattern used on the membership page
    - Include all script tags in correct load order: jquery.min.js, jquery.dropotron.min.js, browser.min.js, breakpoints.min.js, util.js, main.js, includes.js
    - Use only existing CSS classes from `main.css` — no new CSS
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 4.1, 4.2, 4.3, 5.1_

- [x] 2. Add navigation menu item in header.html
  - [x] 2.1 Add a new `<li><a href="./matrimonial.html">Matrimonial Services</a></li>` inside the Programs dropdown `<ul>` in `header.html`, after the "Health Services" entry
    - The existing `setActiveNav()` in `includes.js` will automatically highlight the nav item on the matrimonial page via filename matching — no JS changes needed
    - The dropotron plugin will include the new item in both desktop dropdown and mobile slide-in panel automatically
    - _Requirements: 2.1, 2.2, 2.3_

- [x] 3. Update programs.html to link to the new page
  - [x] 3.1 In `programs.html`, replace the `<h4>More information coming soon</h4>` inside the Matrimonial Services card with a call-to-action button: `<div class="signup"><a href="./matrimonial.html" class="button">Learn More</a></div>`
    - Preserve the existing description paragraph text
    - Use the same `signup` div + `button` class pattern used by the Youth Sports card above it
    - _Requirements: 3.1, 3.2, 3.3_

- [x] 4. Checkpoint
  - Ensure all HTML changes are valid and consistent with existing pages, ask the user if questions arise.

- [x] 5. Add footer sitemap link and sitemap.xml entry
  - [x] 5.1 Add `<li><a href="./matrimonial.html">Matrimonial Services</a></li>` to the Sitemap `<ul>` in `footer.html`, after the "Programs" link
    - _Requirements: 5.3_

  - [x] 5.2 Add a new `<url>` entry in `sitemap.xml` for `https://igamec.org/matrimonial.html`, after the Health Services entry (entry 16)
    - _Requirements: 5.2_

- [x] 6. Final checkpoint
  - Ensure all files are updated correctly and consistent with the design document, ask the user if questions arise.
