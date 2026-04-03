# Implementation Plan: Site Quality Improvements

## Overview

Implement a comprehensive quality improvement pass across the GAMEC website, organized into four layers that build on each other: Foundation CSS → Accessibility HTML/JS → Content/Visual → Dependency Modernization. Each layer depends on the previous one being in place.

## Tasks

- [x] 1. Foundation CSS layer — utilities, fixes, and DRY-up in main.css
  - [x] 1.1 Add `.visually-hidden` utility class to main.css
    - Add the clip/clip-path visually-hidden pattern as a new utility class at the top of the common UI section
    - This class is referenced by skip link (Req 2), social icon labels (Req 6), and other accessibility work
    - _Requirements: 2.2, 6.1, 6.3_

  - [x] 1.2 Restore focus indicators on interactive elements
    - Remove all bare `outline: 0` declarations that suppress the browser default without providing a replacement
    - Add a `:focus-visible` rule for `a`, `button`, `.button`, `input`, `select`, `textarea`, `.image` with `outline: 2px solid var(--color-accent); outline-offset: 2px;`
    - Verify the existing `:focus-visible` block covers all affected selectors
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 1.3 Fix CSS gradient syntax
    - In the body background section (~lines 241–252), change the unprefixed `linear-gradient(top, ...)` to `linear-gradient(to bottom, ...)`
    - Keep `-moz-` and `-webkit-` prefixed versions with legacy `top` keyword
    - Remove the `-ms-` prefixed version (unnecessary for modern Edge)
    - _Requirements: 14.1, 14.2, 14.3_

  - [x] 1.4 DRY up the CSS grid system
    - Ensure the base `.row` flexbox rules (display, flex-wrap, alignment utilities) are defined once at the top level
    - Remove duplicated `.row` display/flex/alignment declarations from the xlarge, large, medium, and small media query blocks
    - Keep only breakpoint-specific column widths, gutter overrides, and font-size changes in each media query
    - _Requirements: 12.1, 12.2, 12.3_

  - [x] 1.5 Fix 980px transition zone layout
    - In the medium breakpoint (737–980px), change the container width from `90%` to `95%`
    - Ensure `#main-wrapper` and `#banner` have at least 1.5em horizontal padding at this breakpoint
    - _Requirements: 13.1, 13.2, 13.3_

  - [x] 1.6 Add dropdown menu CSS (replacing Dropotron-injected styles)
    - Add CSS rules for `#nav > ul > li` (relative positioning), the nested `<ul>` (absolute positioning, min-width 15em, fade transition via opacity), and an `.is-open` state class
    - Style dropdown items to match the current Dropotron visual appearance (background, shadow, border-radius)
    - _Requirements: 16.3_

  - [x] 1.7 Add footer social icon touch target styles
    - Set `#footer .widget.contact ul li a` to `width: 44px; height: 44px; line-height: 44px; min-width: 44px; min-height: 44px;`
    - Set `#footer .widget.contact ul li` margin to at least 8px spacing between icons
    - Use fixed `px` values to guarantee 44px minimum regardless of font-size scaling
    - _Requirements: 11.1, 11.2, 11.3_

  - [x] 1.8 Add skip link focus styles to main.css
    - Add `.skip-link:focus` rule: fixed positioning, top-left, high z-index, high-contrast background, override visually-hidden properties (width auto, clip auto, etc.)
    - _Requirements: 2.3_

- [x] 2. Checkpoint — Verify foundation CSS
  - Ensure all CSS changes render correctly at each breakpoint (1680px, 1280px, 980px, 736px)
  - Verify no visual regressions in existing layout
  - Ask the user if questions arise.

- [x] 3. Accessibility HTML/JS layer — landmarks, skip link, keyboard nav, ARIA
  - [x] 3.1 Add skip navigation link to header.html
    - Insert `<a href="#main-wrapper" class="skip-link visually-hidden">Skip to main content</a>` as the first element inside header.html, before the logo
    - _Requirements: 2.1, 2.2, 2.4_

  - [x] 3.2 Add ARIA landmarks to header.html
    - Add `role="banner"` to the `<header id="header">` element
    - Add `role="navigation"` and `aria-label="Main navigation"` to the `<nav id="nav">` element
    - Add `aria-haspopup="true"` and `aria-expanded="false"` to each parent `<a>` that has a dropdown `<ul>`
    - _Requirements: 3.1, 3.2, 3.4, 4.1, 4.2_

  - [x] 3.3 Add ARIA landmarks to footer.html and fix social icon labels
    - Add `role="contentinfo"` to the `<footer id="footer">` element
    - Replace `class="label"` with `class="visually-hidden"` on all social media icon label `<span>` elements
    - _Requirements: 3.3, 6.1, 6.2_

  - [x] 3.4 Rewrite `initNavigation()` in main.js — desktop dropdown keyboard support
    - Remove the `$nav.find("ul").dropotron(...)` call
    - Implement desktop dropdown logic: mouseenter/mouseleave to show/hide `<ul>` and toggle `aria-expanded`
    - Add keyboard handlers: Enter/Space/ArrowDown opens dropdown and focuses first item; ArrowUp/ArrowDown navigates within dropdown; Escape closes and returns focus to parent; Tab closes dropdown and moves to next top-level item
    - _Requirements: 4.3, 4.4, 4.5, 4.6, 16.1, 16.2, 16.4_

  - [x] 3.5 Rewrite mobile nav toggle in main.js
    - Replace the `<div id="navToggle"><a>` pattern with a `<button id="navToggle">` element with `aria-label="Open menu"` and `aria-expanded="false"`
    - Update panel open/close handlers to toggle `aria-expanded` and `aria-label` between "Open menu" / "Close menu"
    - Keep the existing slide-in panel behavior and visual appearance
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 3.6 Fix empty anchor tags on homepage feature images in index.html
    - Add `href` attributes to the three `<a class="image featured">` elements, pointing to the same destinations as their corresponding "Learn More" links (vision.html, programs.html, membership.html)
    - _Requirements: 8.1, 8.3_

  - [x] 3.7 Add `tabindex="-1"` to `#main-wrapper` on all 17 HTML pages
    - On each page, find the element with `id="main-wrapper"` (the `<main>` tag) and add `tabindex="-1"` so the skip link can programmatically move focus there
    - _Requirements: 2.4_

- [x] 4. Checkpoint — Verify accessibility layer
  - Tab through the site to verify skip link, focus indicators, dropdown keyboard navigation, and mobile toggle
  - Verify ARIA attributes are present after dynamic header/footer injection
  - Ask the user if questions arise.

- [x] 5. Bulk HTML changes across all 17 pages
  - [x] 5.1 Fix viewport meta tag on all 17 HTML pages
    - Find and replace `content="width=device-width, initial-scale=1, user-scalable=no"` with `content="width=device-width, initial-scale=1"` on every page
    - Also remove `maximum-scale=1` if present on any page
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 5.2 Add noscript fallback to all 17 HTML pages
    - Add the `<noscript>` block (with inline-styled message and basic nav links to Home, About, Programs, Contact, Donate) right after the opening `<body>` tag on every page
    - _Requirements: 15.1, 15.2, 15.3, 15.4_

  - [x] 5.3 Remove Dropotron script tag from all 17 HTML pages
    - Remove `<script src="assets/js/jquery.dropotron.min.js"></script>` from every page
    - _Requirements: 16.2_

- [x] 6. Content and visual layer
  - [x] 6.1 Improve banner section visual impact on index.html
    - Add a CSS background image to `#banner-wrapper` using `images/city.jpg` with a dark overlay via `linear-gradient`
    - Adjust banner text colors to white/light for readability over the dark background
    - Ensure the banner remains readable at all breakpoints
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 6.2 Replace placeholder content across content pages
    - **history.html**: Remove the `<h2>More coming soon</h2>` heading
    - **sisters.html**: Remove `<h2>More coming sooon</h2>`, add a brief "Get Involved" CTA with contact link
    - **health.html**: Remove `<h2>More coming soon</h2>`, add a "Get Involved" CTA linking to contact page
    - **youth.html**: Replace `<h3>Youth Sports are coming soon</h3>` with a brief description of the planned sports program and a contact/signup link
    - **professionals.html**: Rephrase "WhatsApp Group — Coming Soon." to "WhatsApp Group — launching soon. Contact us to express interest."
    - **media.html**: Rephrase "Coming soon:" and "Audio collection coming soon." to describe what's planned without "coming soon" phrasing
    - _Requirements: 10.1, 10.2, 10.3_

- [x] 7. Checkpoint — Verify content and visual changes
  - Verify banner looks correct with background image at all breakpoints
  - Confirm no placeholder "coming soon" text remains on any page
  - Ask the user if questions arise.

- [x] 8. Dependency modernization layer
  - [x] 8.1 Upgrade Font Awesome 5 to Font Awesome 6
    - Replace `assets/css/fontawesome-all.min.css` with the Font Awesome 6 Free `all.min.css`
    - Replace webfont files in `assets/webfonts/` with FA6 versions
    - Update any deprecated class names (audit all HTML files for `fab`, `fas`, `far` usage and check for renamed/removed icons)
    - Update the `font-family` reference in `#navToggle .toggle:before` from `"Font Awesome 5 Free"` to `"Font Awesome 6 Free"` (or equivalent)
    - _Requirements: 17.1, 17.2, 17.3, 17.4_

  - [x] 8.2 Delete the Dropotron plugin file
    - Remove `assets/js/jquery.dropotron.min.js` from the project (script tags already removed in task 5.3, dropotron call removed in task 3.4)
    - _Requirements: 16.2_

- [x] 9. Final checkpoint — Verify all changes
  - Ensure the site renders correctly across Chrome, Firefox, Safari, and Edge
  - Verify all icons display correctly after FA6 upgrade
  - Confirm dropdown navigation works with mouse hover and keyboard
  - Confirm mobile nav toggle works with proper ARIA states
  - Ask the user if questions arise.

## Notes

- Tasks follow the design's four-layer ordering: Foundation CSS → Accessibility HTML/JS → Content/Visual → Dependency Modernization
- Each layer depends on the previous one (e.g., `.visually-hidden` must exist before skip link and social icon label tasks reference it)
- Bulk HTML operations (viewport meta, noscript, dropotron removal) are grouped in task 5 for efficiency across all 17 pages
- The navigation rewrite (tasks 3.4, 3.5) is the most complex piece — it replaces Dropotron with custom WAI-ARIA disclosure nav and rewrites the mobile toggle
- All changes target source files directly (no build step)
