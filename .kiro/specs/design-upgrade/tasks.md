# Implementation Plan: Design Upgrade

## Overview

CSS-only visual refresh of the GAMEC website. All changes target `assets/css/main.css` with minimal markup adjustments in `header.html` and `footer.html`. Tasks are ordered so each builds on the previous: tokens first, then base typography/colors, then component styles, then page-specific sections, then animations/accessibility, and finally responsive refinements.

## Tasks

- [x] 1. Update design tokens and Google Fonts import
  - [x] 1.1 Add Google Fonts import for Playfair Display (weights 400, 700) alongside existing Roboto import in `assets/css/main.css`
    - Update the `@import` line to include `Playfair+Display:wght@400;700`
    - _Requirements: 1.1, 1.2_

  - [x] 1.2 Add new CSS custom properties and update existing variables in `:root`
    - Add `--font-heading: 'Playfair Display', Georgia, serif`
    - Add `--color-accent-subtle: rgba(212, 175, 55, 0.12)`
    - Add `--transition-default: all 0.3s ease`
    - Add `--shadow-card: 0 4px 16px var(--color-shadow-light)`
    - Add `--shadow-card-hover: 0 12px 28px var(--color-shadow-medium)`
    - Add `--radius-card: 10px`
    - Update `--color-background` from `#e8eef5` to `#faf8f5`
    - Update `--color-background-light` to `#fdf9f3`
    - Update `--color-background-alt` to `#f5efe6`
    - Update `--color-background-section` to `#f8f4ed`
    - Update `--color-text-light` to `#4a4a4a`
    - Update `--color-text-lighter` to `#525252`
    - Update `--color-text-lightest` to `#5a5a5a`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6_

- [x] 2. Apply typography and color base styles
  - [x] 2.1 Update base typography in `assets/css/main.css`
    - Set `h1, h2` to `font-family: var(--font-heading)`
    - Update body `line-height` from `2.25em` to `1.8`
    - Add `letter-spacing: 0.02em` to body
    - Add `text-transform: uppercase; letter-spacing: 0.1em` to widget `h3`, nav links, and footer headings
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [x] 2.2 Write property test for heading font application
    - **Property 1: Heading font application**
    - **Validates: Requirements 1.1, 1.2, 1.6**

  - [x] 2.3 Write property test for editorial uppercase styling
    - **Property 2: Editorial uppercase styling**
    - **Validates: Requirements 1.5**

  - [x] 2.4 Write property test for WCAG AA contrast compliance
    - **Property 3: WCAG AA contrast compliance**
    - **Validates: Requirements 2.5, 2.6, 13.5**

- [x] 3. Implement shared card component and button system
  - [x] 3.1 Add shared card base and hover styles in `assets/css/main.css`
    - Apply to `.box.feature`, `.program-card`, `.benefit-item`, `.donation-section`, `.contact-card`
    - Base: white background, `1px solid var(--color-border-light)`, `border-radius: var(--radius-card)`, `box-shadow: var(--shadow-card)`, `transition: var(--transition-default)`, padding `2em 2.5em`
    - Hover: `transform: translateY(-6px)`, `box-shadow: var(--shadow-card-hover)`, `border-top: 3px solid var(--color-accent)`
    - Card headings (h2, h3, h4): `color: var(--color-primary)`, `font-family: var(--font-heading)`
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [x] 3.2 Update button system in `assets/css/main.css`
    - Change `border-radius` from `6px` to `8px`
    - Update default `box-shadow` to `0 4px 12px var(--color-shadow)`
    - Add hover: `transform: translateY(-2px)`, `box-shadow: 0 8px 20px var(--color-shadow-medium)`
    - Restyle `.button.alt`: transparent background, `2px solid var(--color-accent)` border, gold text; hover fills gold background with dark text
    - Set consistent padding `0.7em 1.8em` on desktop
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 3.3 Write property test for card component consistency
    - **Property 4: Card component consistency**
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5**

- [x] 4. Checkpoint - Verify tokens, typography, cards, and buttons
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Style banner section and feature cards
  - [x] 5.1 Upgrade banner section in `assets/css/main.css`
    - Add `#banner::before` gradient overlay (navy to transparent)
    - Add `#banner h1::after` gold underline pseudo-element
    - Set tagline `font-weight: 500`, `opacity: 0.88`
    - Style blockquote with `border-left: 4px solid var(--color-accent)`, serif italic font, reduced font-size
    - Set banner CTA buttons: `padding: 0.8em 2em`, `border-radius: 10px`, subtle box-shadow
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 5.2 Enhance feature card specifics in `assets/css/main.css`
    - Feature card images: `aspect-ratio: 16/9`, `object-fit: cover`
    - `.inner` padding: `2.5em` horizontal, `3em` vertical
    - `.more-link`: inline with right-arrow icon, gold text, `font-weight: 600`, underline-on-hover
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 6. Update navigation bar and footer
  - [x] 6.1 Polish navigation bar in `assets/css/main.css`
    - Add bottom border `1px solid var(--color-border-light)` on `#header`
    - Hover: `background: var(--color-accent-subtle)` with `0.2s ease` transition
    - Current page: gold `border-bottom: 3px solid var(--color-accent)` instead of dark background fill
    - Link text: `text-transform: uppercase`, `letter-spacing: 0.09em`, `font-size: 0.88em`
    - Dropdown `.dropotron`: `border-radius: 8px`, `box-shadow: 0 8px 16px var(--color-shadow-medium)`, `1px` border
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 6.2 Redesign footer in `assets/css/main.css` and `footer.html`
    - Set `#footer-wrapper` background to `var(--color-primary)` with light text (`#f0f0f0`)
    - Footer `h3`: gold accent color, uppercase, letter-spacing
    - Footer links: light gray default, gold on hover (0.25s transition)
    - Social icons: `3em` size, circular `rgba(255,255,255,0.1)` background, gold fill on hover
    - Top decorative border: `4px solid var(--color-accent)` on `#footer-wrapper`
    - `#copyright`: centered, `0.88em`, `opacity: 0.65`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 7. Update section spacing and decorative dividers
  - [x] 7.1 Adjust section spacing in `assets/css/main.css`
    - `#features-wrapper` padding: `5em 0` (from `3em`)
    - `#main-wrapper` padding: `6em` on desktop (from `5em`)
    - Add `margin-top: 3.5em` to sections within `#main-wrapper` (except `:first-child`)
    - Replace `.bottom-border` double-border with centered gold divider: `70px` wide, `2px` height, gold accent color, centered via `margin: 0 auto`
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 8. Checkpoint - Verify banner, nav, footer, and spacing
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Add animations, micro-interactions, and accessibility
  - [x] 9.1 Implement animation system in `assets/css/main.css`
    - Apply `transition: var(--transition-default)` to all hover-interactive elements
    - Add `.more-link::after` pseudo-element: gold underline expanding from left (`scaleX(0)` to `scaleX(1)` on hover)
    - Add `@media (prefers-reduced-motion: reduce)` rule: set `transition: none` and `transform: none` on all elements
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [x] 9.2 Add accessibility focus indicators and minimum font-size in `assets/css/main.css`
    - Add `:focus-visible` rule on buttons, links, form inputs: `outline: 2px solid var(--color-accent); outline-offset: 2px`
    - Ensure focus indicator works on both light and dark backgrounds
    - Enforce minimum `font-size: 1rem` (16px) for body text elements
    - Ensure decorative pseudo-elements don't convey essential information
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [x] 9.3 Write property test for transition duration bounds
    - **Property 5: Transition duration bounds**
    - **Validates: Requirements 10.5**

  - [x] 9.4 Write property test for focus indicator on interactive elements
    - **Property 7: Focus indicator on interactive elements**
    - **Validates: Requirements 13.1**

  - [x] 9.5 Write property test for minimum body text font-size
    - **Property 8: Minimum body text font-size**
    - **Validates: Requirements 13.3**

- [x] 10. Enhance donation page styles
  - [x] 10.1 Style donation sections in `assets/css/main.css`
    - Apply shared card style to `.donation-section`
    - Add colored left borders: Square (`4px solid #000`), PayPal (`4px solid #002c8b`), Zelle (`4px solid #6c1cd3`)
    - Style donation h2 with Font Awesome icon prefix via `::before` pseudo-element
    - Style Zelle ordered list with gold circular step badges using CSS counter
    - Set donation CTA buttons to use respective brand colors as backgrounds with white text
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 11. Implement responsive refinements
  - [x] 11.1 Add responsive overrides in `assets/css/main.css`
    - At 980px or less: logo `max-width: 120px`, centered; buttons full-width with `padding: 0.85em 0`
    - At 736px or less: banner h1 `2em`, tagline `1.3em`, padding `2em 1.5em`
    - At 736px or less: cards stack full-width, `1.5em` padding, `8px` border-radius, `margin-bottom: 1.5em`
    - At 736px or less: footer columns stack centered, `2em` spacing between sections
    - At 736px or less: section spacing reduced approximately 35%
    - Ensure all touch targets minimum `44px x 44px`
    - _Requirements: 5.5, 8.6, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

  - [x] 11.2 Write property test for touch target minimum size
    - **Property 6: Touch target minimum size**
    - **Validates: Requirements 12.6**

- [x] 12. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- All changes are CSS-only in `assets/css/main.css` except minor footer markup in `footer.html`
