# Requirements Document

## Introduction

This document defines the requirements for a comprehensive quality improvement pass across the GAMEC website (igamec.org). The improvements span four categories: accessibility compliance (WCAG 2.1 AA), visual design polish, layout optimization, and cross-browser compatibility. The GAMEC site is a static HTML site with 17 pages, shared header/footer loaded dynamically via JavaScript, jQuery-based navigation, and a single main CSS file.

## Glossary

- **Site**: The GAMEC website at igamec.org, consisting of 17 HTML pages, shared header.html, footer.html, and supporting CSS/JS assets
- **Page**: Any of the 17 HTML documents in the Site (index.html, vision.html, history.html, leadership.html, contact.html, programs.html, membership.html, donate.html, resources.html, media.html, relief.html, sisters.html, youth.html, seniors.html, professionals.html, health.html, matrimonial.html)
- **Header**: The shared header.html component containing the site logo and navigation, dynamically loaded into each Page via JavaScript
- **Footer**: The shared footer.html component containing sitemap links, resource links, contact info, and social media icons, dynamically loaded into each Page via JavaScript
- **Nav**: The primary navigation menu (`#nav`) within the Header, including top-level links and dropdown sub-menus
- **Dropdown_Menu**: A nested `<ul>` within the Nav that appears on hover (desktop) or as indented links (mobile), currently powered by the jQuery Dropotron plugin
- **Mobile_Panel**: The slide-in navigation panel (`#navPanel`) created by main.js for viewports at or below the medium breakpoint (980px)
- **Nav_Toggle**: The hamburger menu button (`#navToggle`) that opens and closes the Mobile_Panel
- **Skip_Link**: A visually hidden anchor link at the top of the page that becomes visible on keyboard focus and allows users to jump directly to the main content area
- **Focus_Indicator**: A visible outline or highlight applied to interactive elements when they receive keyboard focus
- **Screen_Reader**: Assistive technology that reads page content aloud; relies on semantic HTML, ARIA attributes, and visually-hidden text labels
- **Visually_Hidden**: A CSS pattern (often called "sr-only") that hides content visually while keeping it accessible to Screen_Readers, unlike `display: none` which hides from both
- **Noscript_Fallback**: A `<noscript>` HTML element that displays content to users whose browsers have JavaScript disabled
- **ARIA_Landmark**: An HTML5 landmark role (e.g., `role="navigation"`, `role="banner"`, `role="contentinfo"`) that helps Screen_Readers identify page regions
- **Gradient_Syntax**: The CSS `linear-gradient()` function; the standard syntax uses directional keywords like `to bottom` rather than the legacy `top` keyword
- **Breakpoint**: A viewport width threshold at which the Site layout changes; defined as xlarge (1281–1680px), large (981–1280px), medium (737–980px), and small (≤736px)
- **Placeholder_Content**: Sections on Pages that display "More coming soon" or similar temporary text instead of substantive content

## Requirements

### Requirement 1: Remove Zoom Restriction

**User Story:** As a user with low vision, I want to pinch-to-zoom on any Page, so that I can enlarge text and content to a readable size.

#### Acceptance Criteria

1. THE Site SHALL set the viewport meta tag to `width=device-width, initial-scale=1` without the `user-scalable=no` parameter on every Page
2. WHEN a user performs a pinch-to-zoom gesture on a mobile device, THE Page SHALL allow zooming up to at least 200% of the original size
3. THE Site SHALL NOT include `maximum-scale=1` in the viewport meta tag on any Page

### Requirement 2: Add Skip Navigation Link

**User Story:** As a keyboard user, I want a skip-to-content link at the top of every Page, so that I can bypass the navigation and jump directly to the main content.

#### Acceptance Criteria

1. THE Header SHALL include a Skip_Link as the first focusable element, targeting the main content area (`#main-wrapper`)
2. WHILE the Skip_Link does not have keyboard focus, THE Site SHALL hide the Skip_Link visually using the Visually_Hidden pattern
3. WHEN the Skip_Link receives keyboard focus, THE Site SHALL display the Skip_Link in a visible, high-contrast style
4. WHEN a user activates the Skip_Link, THE Page SHALL move keyboard focus to the main content area

### Requirement 3: Add ARIA Landmarks to Dynamic Header and Footer

**User Story:** As a Screen_Reader user, I want the dynamically loaded Header and Footer to have proper ARIA landmarks, so that I can identify and navigate to the navigation, banner, and footer regions.

#### Acceptance Criteria

1. THE Header SHALL include `role="banner"` on the `<header>` element
2. THE Nav SHALL include `role="navigation"` and an `aria-label` attribute with the value "Main navigation"
3. THE Footer SHALL include `role="contentinfo"` on the `<footer>` element
4. WHEN the Header is loaded dynamically via JavaScript, THE Header SHALL retain all ARIA_Landmark attributes after injection into the Page

### Requirement 4: Add Keyboard Support to Dropdown Navigation

**User Story:** As a keyboard user, I want to open, navigate, and close dropdown menus using the keyboard, so that I can access all navigation links without a mouse.

#### Acceptance Criteria

1. THE Nav SHALL include `aria-haspopup="true"` on each parent link that has a Dropdown_Menu
2. THE Nav SHALL include `aria-expanded="false"` on each parent link that has a Dropdown_Menu by default
3. WHEN a user activates a parent link (via Enter or Space key) or presses the Down Arrow key, THE Dropdown_Menu SHALL open and THE parent link SHALL update `aria-expanded` to `"true"`
4. WHEN a Dropdown_Menu is open, THE Nav SHALL allow the user to navigate between menu items using the Up Arrow and Down Arrow keys
5. WHEN a user presses the Escape key while a Dropdown_Menu is open, THE Dropdown_Menu SHALL close and THE parent link SHALL update `aria-expanded` to `"false"` and receive focus
6. WHEN a Dropdown_Menu is open and the user presses Tab, THE Dropdown_Menu SHALL close and focus SHALL move to the next top-level Nav item

### Requirement 5: Make Mobile Nav Toggle Accessible

**User Story:** As a Screen_Reader user on a mobile device, I want the hamburger menu button to be properly labeled and operable, so that I can open and close the mobile navigation.

#### Acceptance Criteria

1. THE Nav_Toggle SHALL use a `<button>` element instead of an `<a>` tag
2. THE Nav_Toggle SHALL include an `aria-label` attribute with the value "Open menu"
3. THE Nav_Toggle SHALL include `aria-expanded="false"` by default
4. WHEN a user activates the Nav_Toggle and the Mobile_Panel opens, THE Nav_Toggle SHALL update `aria-expanded` to `"true"` and `aria-label` to "Close menu"
5. WHEN the Mobile_Panel closes, THE Nav_Toggle SHALL update `aria-expanded` to `"false"` and `aria-label` to "Open menu"

### Requirement 6: Fix Social Media Icon Labels for Screen Readers

**User Story:** As a Screen_Reader user, I want social media icon links to have accessible labels, so that I know which platform each link leads to.

#### Acceptance Criteria

1. THE Footer SHALL use the Visually_Hidden CSS pattern (not `display: none`) for social media icon labels
2. WHEN a Screen_Reader encounters a social media icon link, THE Screen_Reader SHALL announce the platform name (e.g., "Twitter", "Facebook", "Instagram")
3. THE Visually_Hidden CSS class SHALL position content off-screen using `clip`, `clip-path`, or equivalent technique while keeping the content in the accessibility tree

### Requirement 7: Restore Focus Indicators on Interactive Elements

**User Story:** As a keyboard user, I want to see a visible focus indicator on all interactive elements, so that I can track where my keyboard focus is on the Page.

#### Acceptance Criteria

1. THE Site SHALL remove all `outline: 0` declarations that do not provide a replacement Focus_Indicator
2. WHEN an interactive element (link, button, input, or image link) receives keyboard focus, THE Site SHALL display a visible Focus_Indicator with a contrast ratio of at least 3:1 against the surrounding background
3. THE Focus_Indicator SHALL use a consistent style (e.g., a 2px solid outline with an offset) across all interactive elements on the Site

### Requirement 8: Fix Empty Anchor Tags on Feature Images

**User Story:** As a Screen_Reader user, I want feature images on the homepage to either link to a destination or not be wrapped in anchor tags, so that I do not encounter confusing empty links.

#### Acceptance Criteria

1. WHEN a feature image on the homepage is wrapped in an `<a>` tag, THE `<a>` tag SHALL include a valid `href` attribute pointing to the relevant Page
2. IF a feature image does not need to be a link, THEN THE Site SHALL remove the wrapping `<a>` tag and use a `<div>` or no wrapper instead
3. THE Site SHALL NOT contain any `<a>` tags without an `href` attribute or with an empty `href` attribute in the features section

### Requirement 9: Improve Banner Section Visual Impact

**User Story:** As a site visitor, I want the homepage banner to have visual impact with a background image or graphic element, so that the first impression of the Site conveys professionalism and community identity.

#### Acceptance Criteria

1. THE banner section on the homepage SHALL include a background image or visual element alongside the existing text content
2. THE banner background image SHALL have sufficient contrast with overlaid text, using a dark overlay or text shadow as needed
3. THE banner section SHALL maintain readability and visual hierarchy across all Breakpoints

### Requirement 10: Replace Placeholder Content

**User Story:** As a site visitor, I want every Page to have substantive content instead of "coming soon" placeholders, so that the Site feels complete and credible.

#### Acceptance Criteria

1. THE Site SHALL NOT display "More coming soon", "Coming soon", or equivalent Placeholder_Content on any published Page
2. WHEN a Page section lacks final content, THE Site SHALL either display a meaningful short description of the planned content with an expected timeline, or remove the placeholder section entirely
3. THE Site SHALL replace Placeholder_Content on the history, sisters, health, and programs Pages

### Requirement 11: Increase Footer Social Icon Touch Targets

**User Story:** As a mobile user, I want the footer social media icons to be large enough to tap easily, so that I can access GAMEC social media profiles without difficulty.

#### Acceptance Criteria

1. THE Footer social media icon links SHALL have a minimum touch target size of 44×44 CSS pixels, per WCAG 2.5.5
2. THE Footer social media icons SHALL have adequate spacing (at least 8px) between adjacent icons to prevent accidental taps
3. THE Footer social media icons SHALL be visually distinct against the footer background

### Requirement 12: Reduce CSS Grid Repetition

**User Story:** As a developer maintaining the Site, I want the grid CSS to be DRY (Don't Repeat Yourself), so that layout changes can be made in fewer places and the stylesheet is easier to maintain.

#### Acceptance Criteria

1. THE Site stylesheet SHALL define shared row and alignment rules once in a base rule set, rather than duplicating them in each media query
2. THE Site stylesheet SHALL use media queries only for properties that change at each Breakpoint (e.g., column widths, gutters, font sizes)
3. WHEN the CSS grid refactoring is complete, THE Site SHALL render identically to the current layout at all Breakpoints

### Requirement 13: Fix Transition Zone Layout at 980px Breakpoint

**User Story:** As a user on a tablet-sized screen, I want the layout to feel spacious and readable at the 980px breakpoint, so that the transition from desktop to mobile navigation does not feel cramped.

#### Acceptance Criteria

1. WHILE the viewport width is between 737px and 980px (medium Breakpoint), THE Site container SHALL use a width of at least 95% instead of 90%
2. WHEN the Nav switches to the Mobile_Panel at the medium Breakpoint, THE Page content SHALL maintain comfortable padding and readable line lengths
3. THE Site SHALL avoid abrupt visual jumps in layout between the large and medium Breakpoints

### Requirement 14: Fix CSS Gradient Syntax

**User Story:** As a user on any modern browser, I want background gradients to render correctly, so that the Site appears as designed.

#### Acceptance Criteria

1. THE Site stylesheet SHALL use the standard `linear-gradient(to bottom, ...)` syntax instead of the legacy `linear-gradient(top, ...)` syntax
2. THE Site stylesheet SHALL include vendor-prefixed gradient declarations (`-webkit-`, `-moz-`) for older browser support alongside the standard syntax
3. WHEN the gradient syntax is corrected, THE body background SHALL render identically to the current design intent

### Requirement 15: Add Noscript Fallback for Dynamic Content

**User Story:** As a user with JavaScript disabled, I want to see basic navigation and footer content, so that I can still navigate the Site and find contact information.

#### Acceptance Criteria

1. THE Site SHALL include a `<noscript>` element on every Page
2. WHEN JavaScript is disabled, THE Noscript_Fallback SHALL display a message informing the user that JavaScript is required for full site functionality
3. WHEN JavaScript is disabled, THE Noscript_Fallback SHALL provide direct links to key Pages (Home, About, Programs, Contact, Donate) so the user can still navigate
4. THE Noscript_Fallback SHALL be styled to be clearly visible and readable without JavaScript-dependent CSS

### Requirement 16: Address Aging jQuery Dropotron Dependency

**User Story:** As a developer maintaining the Site, I want the dropdown navigation to follow modern WAI-ARIA menu patterns, so that the Nav is accessible and does not depend on an aging jQuery plugin.

#### Acceptance Criteria

1. THE Nav dropdown behavior SHALL follow WAI-ARIA Authoring Practices for disclosure navigation menus
2. THE Nav SHALL function without the jQuery Dropotron plugin after the replacement is complete
3. WHEN the Dropotron plugin is removed, THE Nav SHALL retain the same visual appearance (fade animation, positioning) as the current implementation
4. THE Nav SHALL support both mouse hover and keyboard interaction for opening and closing Dropdown_Menus

### Requirement 17: Upgrade Font Awesome to Version 6

**User Story:** As a developer maintaining the Site, I want to use Font Awesome 6, so that the Site has access to the latest icon set and improved performance.

#### Acceptance Criteria

1. THE Site SHALL load Font Awesome 6 (Free) instead of Font Awesome 5
2. WHEN Font Awesome is upgraded, THE Site SHALL update all icon class references that changed between version 5 and version 6
3. WHEN the upgrade is complete, THE Site SHALL display all existing icons identically to their current appearance
4. IF any Font Awesome 5 icon class is deprecated in version 6, THEN THE Site SHALL replace the icon class with the equivalent Font Awesome 6 class
