# Requirements Document

## Introduction

This document defines the requirements for a visual design upgrade of the GAMEC (Global Association of Muslim Eritrean Communities) nonprofit website. The goal is to elevate the site's visual presentation to match the professionalism and credibility of an established 501(c)(3) organization while preserving the existing page structure, content, and technical stack (HTML5, CSS3, jQuery). The upgrade focuses on typography, color refinement, spacing, component polish, and subtle motion — reusing existing CSS architecture (variables, grid system, component classes) as much as possible while introducing creative enhancements.

## Glossary

- **Design_System**: The collection of CSS custom properties, reusable component classes, grid system, and responsive breakpoints defined in `assets/css/main.css`
- **Homepage**: The `index.html` landing page containing the banner, feature cards, membership/donation CTAs, media gallery, and community groups section
- **Inner_Page**: Any page other than the homepage (e.g., vision.html, programs.html, donate.html, membership.html)
- **Header_Component**: The shared `header.html` containing the logo and navigation bar, dynamically injected into all pages
- **Footer_Component**: The shared `footer.html` containing sitemap links, resources, quick links, and contact info, dynamically injected into all pages
- **Feature_Card**: The `.box.feature` component used on the homepage to display mission, programs, and get-involved sections with an image and text
- **Program_Card**: The `.program-card` component used on the programs page and additional initiatives section
- **Banner_Section**: The `#banner` hero area on the homepage containing the organization name, tagline, CTA buttons, and quote
- **CTA_Button**: Any call-to-action button using the `.button` class, including primary and `.alt` variants
- **Navigation_Bar**: The `#nav` desktop navigation and `#navPanel` mobile navigation system
- **Donation_Section**: The payment method sections (Square, PayPal, Zelle) on the donate page using `.donation-section`
- **Benefit_Item**: The `.benefit-item` cards on the membership page displaying membership advantages
- **CSS_Variable**: A custom property defined in the `:root` selector of `main.css` used for consistent theming

## Requirements

### Requirement 1: Typography Enhancement

**User Story:** As a site visitor, I want the website typography to feel refined and hierarchical, so that content is easy to scan and the site feels professionally designed.

#### Acceptance Criteria

1. THE Design_System SHALL introduce a secondary font family (a serif or display font from Google Fonts) for headings (h1, h2) while retaining Roboto for body text
2. THE Design_System SHALL define CSS_Variables for the heading font family, and apply the heading font to all h1 and h2 elements site-wide
3. THE Design_System SHALL increase the base line-height for body text from 2.25em to a value between 1.7 and 1.85 to improve readability
4. THE Design_System SHALL add letter-spacing of 0.01em to 0.03em on body text for improved legibility
5. THE Design_System SHALL apply subtle uppercase letter-spacing (0.08em to 0.15em) to section labels, widget headings (h3), and navigation links for a polished editorial feel
6. WHEN a heading (h1 or h2) is rendered on any page, THE Design_System SHALL display the heading with the secondary font family at the existing size values

### Requirement 2: Color Palette Refinement

**User Story:** As a site visitor, I want the color palette to feel cohesive and intentional, so that the site conveys trust and professionalism.

#### Acceptance Criteria

1. THE Design_System SHALL retain the existing navy primary (#001f3f) and gold accent (#d4af37) as the core brand colors
2. THE Design_System SHALL introduce a warm off-white background tone (e.g., #FAF8F5 or similar) to replace the current #e8eef5 body background, creating a warmer, more inviting feel
3. THE Design_System SHALL update the `--color-background-light`, `--color-background-alt`, and `--color-background-section` variables to harmonize with the new warm off-white base
4. THE Design_System SHALL define a CSS_Variable `--color-accent-subtle` for a muted gold tone (e.g., rgba(212, 175, 55, 0.12)) to use as light background tints on hover states and section highlights
5. THE Design_System SHALL ensure all text-on-background color combinations meet WCAG 2.1 AA contrast ratio (4.5:1 for normal text, 3:1 for large text)
6. THE Design_System SHALL update the `--color-text-light`, `--color-text-lighter`, and `--color-text-lightest` variables to darker values that pass WCAG AA contrast against the new background colors

### Requirement 3: Homepage Banner Upgrade

**User Story:** As a first-time visitor, I want the homepage banner to feel impactful and modern, so that I immediately understand the organization's purpose and feel compelled to engage.

#### Acceptance Criteria

1. THE Banner_Section SHALL display a subtle gradient overlay (using the primary navy and a transparent endpoint) behind the banner content to add visual depth
2. THE Banner_Section SHALL render the organization name (h1) in the new heading font with a gold accent underline decoration (using a pseudo-element or border-bottom)
3. THE Banner_Section SHALL display the tagline paragraph with increased font-weight (500 or 600) and a slightly reduced opacity (0.85 to 0.9) for visual hierarchy
4. THE Banner_Section SHALL render CTA_Buttons with increased padding (0.8em 2em), a subtle box-shadow, and rounded corners (8px to 10px) for a modern button appearance
5. THE Banner_Section SHALL style the blockquote with a left gold accent border (3px to 4px solid gold), italic serif font, and slightly reduced font-size for an elegant pull-quote effect

### Requirement 4: Feature Card Redesign

**User Story:** As a site visitor, I want the homepage feature cards to look polished and inviting, so that I am drawn to explore the organization's mission, programs, and involvement opportunities.

#### Acceptance Criteria

1. THE Feature_Card SHALL display with a subtle border (1px solid) using a light border color variable instead of relying solely on box-shadow for definition
2. THE Feature_Card SHALL apply a hover state that includes a translateY(-6px) lift, increased box-shadow depth, and a gold accent border-top or border-bottom (3px solid gold)
3. THE Feature_Card SHALL transition hover effects over 0.3s with an ease timing function
4. THE Feature_Card image SHALL display with an aspect-ratio of 16/9 and object-fit: cover for consistent image presentation across all three cards
5. THE Feature_Card `.inner` section SHALL increase padding to 2.5em horizontally and 3em vertically for more breathing room
6. THE Feature_Card `.more-link` SHALL display as an inline element with a right-arrow icon, gold text color, font-weight 600, and an underline-on-hover effect

### Requirement 5: Section Spacing and Rhythm

**User Story:** As a site visitor, I want consistent and generous spacing between page sections, so that the content feels organized and not cramped.

#### Acceptance Criteria

1. THE Design_System SHALL increase the `#features-wrapper` padding from 3em to 5em vertically to give feature cards more visual breathing room
2. THE Design_System SHALL increase the `#main-wrapper` padding from 5em to 6em on desktop viewports (above 980px)
3. THE Design_System SHALL add a top margin of 3em to 4em before each `<section>` within `#main-wrapper` (except the first section) to create clear visual separation
4. THE Design_System SHALL replace the `.bottom-border` double-border divider with a centered decorative divider (a short horizontal line of 60px to 80px width, 2px to 3px height, using the gold accent color)
5. WHILE the viewport width is 736px or less, THE Design_System SHALL reduce section spacing proportionally (by approximately 30% to 40%) to prevent excessive whitespace on mobile

### Requirement 6: Navigation Bar Polish

**User Story:** As a site visitor, I want the navigation to feel clean and modern, so that I can easily find my way around the site.

#### Acceptance Criteria

1. THE Navigation_Bar SHALL display a subtle bottom border (1px solid) using a light border color to visually separate the header from page content
2. THE Navigation_Bar SHALL apply a smooth background-color transition (0.2s ease) on link hover states, using the `--color-accent-subtle` tint as the hover background
3. THE Navigation_Bar current-page indicator SHALL use a gold bottom-border (3px solid) instead of the current dark background fill, keeping the text color as the primary navy
4. THE Navigation_Bar link text SHALL use uppercase letter-spacing (0.08em to 0.1em) and font-size of 0.85em to 0.9em for a refined navigation appearance
5. WHEN a dropdown menu is displayed, THE Navigation_Bar SHALL render the `.dropotron` panel with a 1px border, 8px border-radius, and a box-shadow with 12px to 16px blur for a floating card effect

### Requirement 7: Footer Redesign

**User Story:** As a site visitor, I want the footer to feel substantial and well-organized, so that I can easily find contact information and important links.

#### Acceptance Criteria

1. THE Footer_Component SHALL display with a dark navy background (using `--color-primary` or `--color-primary-dark`) and light text (white or off-white) for strong visual contrast with the page content
2. THE Footer_Component heading elements (h3) SHALL display in the gold accent color with uppercase letter-spacing for visual consistency with the refined navigation style
3. THE Footer_Component link elements SHALL display in a light gray or off-white color with a hover transition to the gold accent color over 0.25s
4. THE Footer_Component social media icons SHALL display at 2.8em to 3em size with circular backgrounds using a semi-transparent white (rgba(255,255,255,0.1)) and a hover state that fills with the gold accent color
5. THE Footer_Component SHALL include a top decorative border (3px to 4px solid gold) spanning the full width to create a clear visual break from the main content
6. THE Footer_Component `#copyright` section SHALL display centered text in a smaller font-size (0.85em to 0.9em) with reduced opacity (0.6 to 0.7)

### Requirement 8: Button System Upgrade

**User Story:** As a site visitor, I want buttons to feel tactile and consistent across all pages, so that interactive elements are clearly identifiable and inviting to click.

#### Acceptance Criteria

1. THE CTA_Button SHALL display with a border-radius of 8px (increased from 6px) for a softer, more modern appearance
2. THE CTA_Button SHALL apply a box-shadow of `0 4px 12px` using the shadow variable on its default state, increasing to `0 8px 20px` on hover
3. THE CTA_Button SHALL include a subtle translateY(-2px) lift on hover, combined with the shadow increase, for a tactile press effect
4. THE CTA_Button `.alt` variant SHALL display with a transparent background, a 2px solid border using the gold accent color, and gold text color, transitioning to a filled gold background with dark text on hover
5. THE CTA_Button SHALL maintain consistent padding of 0.7em 1.8em across all non-mobile viewports
6. WHILE the viewport width is 980px or less, THE CTA_Button SHALL expand to full width with centered text and padding of 0.85em 0

### Requirement 9: Card and Component Consistency

**User Story:** As a site visitor, I want all card-style components (feature cards, program cards, benefit items, donation sections, contact cards) to share a consistent visual language, so that the site feels cohesive.

#### Acceptance Criteria

1. THE Design_System SHALL define a shared card style with: white background, 1px solid light border, 10px to 12px border-radius, and a box-shadow of `0 4px 16px` using the shadow-light variable
2. THE Design_System SHALL apply a consistent hover state to all card components: translateY(-6px), box-shadow increase to `0 12px 28px`, and a gold accent border-top (3px solid)
3. THE Design_System SHALL apply the shared card style to Feature_Card, Program_Card, Benefit_Item, Donation_Section, and contact-card components
4. THE Design_System SHALL ensure all card components use consistent internal padding of 2em to 2.5em
5. THE Design_System SHALL ensure card heading elements (h2, h3, h4) within cards use the primary navy color and the heading font family

### Requirement 10: Subtle Animation and Micro-Interactions

**User Story:** As a site visitor, I want subtle animations on interactive elements, so that the site feels responsive and alive without being distracting.

#### Acceptance Criteria

1. THE Design_System SHALL define a CSS transition shorthand variable or consistent transition value of `all 0.3s ease` to apply uniformly to hover-interactive elements
2. WHEN a card component is hovered, THE Design_System SHALL animate the translateY and box-shadow properties over 0.3s with an ease timing function
3. WHEN a CTA_Button is hovered, THE Design_System SHALL animate the background-color, transform, and box-shadow properties over 0.25s
4. THE Design_System SHALL add a subtle gold underline animation on `.more-link` elements that expands from left to right on hover using a pseudo-element with `transform: scaleX(0)` transitioning to `scaleX(1)`
5. THE Design_System SHALL ensure all transition and animation durations remain between 0.2s and 0.4s to maintain a snappy, professional feel
6. IF a user has enabled `prefers-reduced-motion` in their operating system, THEN THE Design_System SHALL disable all transform-based animations and transitions by setting `transition: none` and `transform: none`

### Requirement 11: Donation Page Visual Enhancement

**User Story:** As a potential donor, I want the donation page to feel trustworthy and well-organized, so that I feel confident contributing to the organization.

#### Acceptance Criteria

1. THE Donation_Section SHALL display with the shared card style (white background, border, border-radius, shadow) instead of the current flat background
2. THE Donation_Section SHALL include a colored left border (4px solid) using each payment method's brand color (black for Square, #002c8b for PayPal, #6c1cd3 for Zelle) for quick visual identification
3. THE Donation_Section heading (h2) SHALL display with an icon (using Font Awesome) preceding the payment method name for visual recognition
4. THE Donation_Section CTA_Button SHALL use the respective payment method's brand color as the button background, with white text and the standard button hover effects
5. THE Donation_Section Zelle instructions (ordered list) SHALL display with numbered step indicators using a styled counter with the gold accent background and white text in a circular badge

### Requirement 12: Responsive Design Refinement

**User Story:** As a mobile user, I want the site to feel equally polished on smaller screens, so that the professional experience is consistent across devices.

#### Acceptance Criteria

1. WHILE the viewport width is 980px or less, THE Header_Component logo image SHALL scale to a maximum width of 120px and center horizontally
2. WHILE the viewport width is 736px or less, THE Banner_Section SHALL reduce heading font-size to 2em, tagline to 1.3em, and apply padding of 2em 1.5em
3. WHILE the viewport width is 736px or less, THE Feature_Card SHALL stack vertically with a maximum width of 100% and margin-bottom of 1.5em between cards
4. WHILE the viewport width is 736px or less, THE Footer_Component SHALL stack all columns vertically with centered text alignment and 2em spacing between sections
5. WHILE the viewport width is 736px or less, THE Design_System SHALL reduce all card internal padding to 1.5em and card border-radius to 8px
6. THE Design_System SHALL ensure touch targets (buttons, links, interactive elements) maintain a minimum size of 44px by 44px on all viewport sizes

### Requirement 13: Accessibility Improvements

**User Story:** As a site visitor using assistive technology, I want the design upgrade to maintain and improve accessibility, so that the site is usable by all community members.

#### Acceptance Criteria

1. THE Design_System SHALL ensure all interactive elements (buttons, links, form inputs) display a visible focus indicator using a 2px solid outline in the gold accent color with a 2px offset
2. THE Design_System SHALL ensure the focus indicator is visible on both light and dark backgrounds
3. THE Design_System SHALL maintain a minimum font-size of 16px (1rem) for all body text to ensure readability
4. IF a decorative element (divider, accent border, icon) is added, THEN THE Design_System SHALL ensure the element does not convey essential information that would be lost without visual rendering
5. THE Design_System SHALL ensure all color changes in the upgrade maintain WCAG 2.1 AA contrast ratios (4.5:1 for normal text, 3:1 for large text and UI components)
