# Implementation Plan: Holy Cities Livestream

## Overview

Add a "Live from the Holy Cities" section with Makkah and Madinah livestream cards to both the homepage (compact) and media page (detailed). Implementation covers CSS styles in `main.css`, HTML markup in `index.html` and `media.html`, and property-based tests using fast-check + vitest.

## Tasks

- [x] 1. Add livestream CSS styles to main.css
  - [x] 1.1 Add livestream section, grid, card base, image container, live badge, card body, and button styles
    - Append all `.livestream-section`, `.livestream-grid`, `.livestream-card`, `.livestream-card__image`, `.livestream-card__live-badge`, `.livestream-card__body` rules to `assets/css/main.css`
    - Include `@keyframes live-pulse` animation for the live badge icon
    - Use existing CSS variables: `--color-white`, `--radius-card`, `--shadow-card`, `--shadow-card-hover`, `--color-border-light`, `--color-primary`, `--color-text-medium`, `--font-heading`
    - Card hover: `translateY(-4px)` + `--shadow-card-hover`
    - Image hover: `scale(1.03)` with `transition: transform 0.4s ease`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  - [x] 1.2 Add responsive breakpoints and reduced motion styles
    - Medium breakpoint (≤980px): tighter grid gap
    - Small breakpoint (≤736px): single-column grid, reduced padding/font sizes
    - `@media (prefers-reduced-motion: reduce)`: disable transitions, animations, and transforms on card, image, and badge
    - _Requirements: 1.2, 1.3, 2.2, 2.3, 6.2, 6.3_

- [x] 2. Add livestream section to homepage (index.html)
  - [x] 2.1 Insert the "Live from the Holy Cities" section HTML into index.html
    - Add `<section class="livestream-section">` with `<h2>Live from the Holy Cities</h2>` and `.livestream-grid` containing two `.livestream-card` elements (Makkah and Madinah)
    - Place between the "Community Groups" section and the "Stay Connected" section inside `#main-wrapper > .container`
    - Makkah card: `images/kaaba2.jpg`, alt "Live stream from Makkah - The Holy Kaaba", heading "Makkah", CTA linking to `https://www.youtube.com/live/JRRtm-adKvc?si=TmUeIlhqXGG3rRYI`
    - Madinah card: `images/madinah.jpeg`, alt "Live stream from Madinah - The Prophet's Mosque", heading "Madinah", CTA linking to `https://www.youtube.com/live/dFMegZR036Y?si=99vM0eFVKZefJaM0`
    - Each card includes `.livestream-card__live-badge` with `<i class="fas fa-circle"></i> Live`
    - Each CTA: `<a href="..." class="button icon solid fa-video" target="_blank" rel="noopener noreferrer">Watch Live <span class="visually-hidden">(opens in new tab)</span></a>`
    - Images use `loading="lazy"`
    - _Requirements: 1.1, 1.2, 1.4, 1.5, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 6.1, 7.1, 7.2, 7.3, 7.4_
  - [ ]\* 2.2 Write property test: Card content correctness
    - **Property 1: Card content correctness**
    - **Validates: Requirements 3.1, 3.2, 4.1, 4.2**
    - Create `tests/livestream-card-content.property.test.mjs`
    - Parse both `index.html` and `media.html`, for each page randomly selected via `fc.constantFrom`, verify every `.livestream-card` has correct `img[src]`, `img[alt]`, and heading text for its city
  - [ ]\* 2.3 Write property test: CTA button link integrity
    - **Property 2: CTA button link integrity**
    - **Validates: Requirements 3.3, 3.4, 3.5, 3.6, 4.3, 4.4, 4.5, 4.6**
    - Create `tests/livestream-cta-integrity.property.test.mjs`
    - For all `.livestream-card` CTA anchors across both pages, verify `href`, `target="_blank"`, `rel="noopener noreferrer"`, "Watch Live" text, and `fa-video` class

- [x] 3. Checkpoint - Verify homepage section and CSS
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Add livestream section to media page (media.html)
  - [x] 4.1 Insert the "Live from the Holy Cities" section HTML into media.html
    - Add `<section class="livestream-section">` with `<h2>Live from the Holy Cities</h2>`, an introductory `<p>` paragraph, and `.livestream-grid` containing two `.livestream-card` elements
    - Place between the Photo Gallery `<div class="bottom-border"></div>` and the Video Production `<section class="media-category">`, with its own `<div class="bottom-border"></div>` separator after it
    - Each card uses the `.livestream-card--detailed` modifier (or same base class) and includes a description `<p>` in `.livestream-card__body`:
      - Makkah: "Watch the live broadcast from the Holy Kaaba in Makkah, the most sacred site in Islam."
      - Madinah: "Watch the live broadcast from the Prophet's Mosque in Madinah, the second holiest site in Islam."
    - Same image, alt text, live badge, and CTA structure as homepage cards
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 6.1, 7.1, 7.2, 7.3, 7.4_
  - [ ]\* 4.2 Write property test: Card visual design consistency
    - **Property 3: Card visual design consistency**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.6**
    - Create `tests/livestream-card-visual.property.test.mjs`
    - Parse `main.css` and verify `.livestream-card` rules include `border-radius` using `var(--radius-card)`, `box-shadow` using `var(--shadow-card)`, hover rule with `var(--shadow-card-hover)`, and white background
  - [ ]\* 4.3 Write property test: Image responsive behavior and attributes
    - **Property 4: Image responsive behavior and attributes**
    - **Validates: Requirements 5.4, 6.1, 6.2, 7.2**
    - Create `tests/livestream-image-responsive.property.test.mjs`
    - For all `img` elements within `.livestream-card` across both HTML files, verify `loading="lazy"`, non-empty `alt`, and CSS rules specifying `object-fit: cover` and `width: 100%`

- [x] 5. Add CTA button accessibility property test
  - [ ]\* 5.1 Write property test: CTA button accessibility
    - **Property 5: CTA button accessibility**
    - **Validates: Requirements 5.5, 7.1, 7.3**
    - Create `tests/livestream-cta-accessibility.property.test.mjs`
    - For all CTA anchors within `.livestream-card` across both pages, verify the element is an `<a>` tag with `href`, has the `.button` class, and contains a visually-hidden span with "(opens in new tab)" or equivalent `aria-label`

- [x] 6. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests use fast-check with vitest, following the existing project test patterns in `tests/`
- All CSS uses existing design tokens from `:root` variables — no new colors or values introduced
- Checkpoints ensure incremental validation
