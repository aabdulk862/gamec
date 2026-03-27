# Requirements Document

## Introduction

This feature adds a dedicated Matrimonial Services page (`matrimonial.html`) to the GAMEC website and a corresponding navigation menu item in the shared header. The page will provide information about GAMEC's matrimonial program, which helps Muslim Eritrean community members find compatible partners based on shared values, faith, and cultural backgrounds. The programs.html page already references this service with a "More information coming soon" placeholder — this feature replaces that placeholder with a link to the new dedicated page.

## Glossary

- **Matrimonial_Page**: The new `matrimonial.html` static HTML page that presents GAMEC's matrimonial services information
- **Header_Component**: The shared `header.html` file that provides the site-wide navigation bar, loaded dynamically via `includes.js`
- **Navigation_Menu**: The `<nav id="nav">` element within the Header_Component containing desktop dropdowns and mobile slide-in panel links
- **Programs_Dropdown**: The "Programs" dropdown submenu within the Navigation_Menu that lists program sub-pages
- **Programs_Page**: The existing `programs.html` page that contains a Matrimonial Services card with placeholder text
- **Active_Nav_System**: The filename-based navigation highlighting system in `includes.js` that adds a `current` class to the nav item matching the current page
- **Design_System**: The existing GAMEC visual identity including teal green (#437D6F) primary color, orange (#e67e22) accent, Roboto font, and shared CSS in `main.css`
- **Page_Template**: The standard HTML structure used by existing program sub-pages (e.g., `relief.html`, `sisters.html`) including dynamic header/footer loading, meta tags, and script includes

## Requirements

### Requirement 1: Create Matrimonial Page

**User Story:** As a community member, I want to visit a dedicated matrimonial services page, so that I can learn about GAMEC's matrimonial program offerings and how to participate.

#### Acceptance Criteria

1. THE Matrimonial_Page SHALL be created as `matrimonial.html` in the site root directory, following the same Page_Template structure as existing program sub-pages (relief.html, sisters.html, youth.html)
2. THE Matrimonial_Page SHALL include a valid `<head>` section with a unique title ("Matrimonial | GAMEC"), charset meta tag, viewport meta tag, a descriptive meta description, favicon links, and a link to `assets/css/main.css`
3. THE Matrimonial_Page SHALL use the `no-sidebar` body class and include `#header-wrapper` and `#footer-wrapper` divs for dynamic header and footer injection
4. THE Matrimonial_Page SHALL include all required script tags in the correct load order: jquery.min.js, jquery.dropotron.min.js, browser.min.js, breakpoints.min.js, util.js, main.js, includes.js
5. THE Matrimonial_Page SHALL display an `<h1>` heading of "Matrimonial Services"
6. THE Matrimonial_Page SHALL contain introductory content describing the matrimonial program's purpose of helping Muslim Eritrean community members find compatible partners based on shared values, faith, and cultural backgrounds
7. THE Matrimonial_Page SHALL include at least one content section describing the services or goals of the matrimonial program, using `<h3>` subheadings and `<p>` paragraph elements consistent with other program sub-pages

### Requirement 2: Add Navigation Menu Item

**User Story:** As a site visitor, I want to see a "Matrimonial" link in the Programs dropdown menu, so that I can navigate to the matrimonial page from any page on the site.

#### Acceptance Criteria

1. THE Header_Component SHALL include a new list item (`<li>`) within the Programs_Dropdown linking to `./matrimonial.html` with the link text "Matrimonial Services"
2. WHEN a visitor is on the Matrimonial_Page, THE Active_Nav_System SHALL highlight the corresponding navigation item by adding the `current` class to the matching nav list item
3. THE Navigation_Menu SHALL display the "Matrimonial Services" link in both the desktop dropdown and the mobile slide-in panel without requiring any changes to `includes.js` or `main.js`

### Requirement 3: Update Programs Page Link

**User Story:** As a site visitor, I want the Matrimonial Services card on the programs page to link to the new dedicated page, so that I can access detailed information instead of seeing a placeholder.

#### Acceptance Criteria

1. THE Programs_Page SHALL update the existing "Matrimonial Services" card section to include a link to `./matrimonial.html`
2. THE Programs_Page SHALL replace the "More information coming soon" placeholder text with a call-to-action element (button or link) directing visitors to the Matrimonial_Page
3. THE Programs_Page Matrimonial Services card SHALL retain the existing description text about the program

### Requirement 4: Visual Consistency with Design System

**User Story:** As a site visitor, I want the matrimonial page to look and feel consistent with the rest of the GAMEC website, so that the browsing experience is cohesive.

#### Acceptance Criteria

1. THE Matrimonial_Page SHALL use only styles from the existing Design_System defined in `assets/css/main.css` without requiring new CSS additions
2. THE Matrimonial_Page SHALL use the same HTML structure and CSS classes as other program sub-pages (e.g., `<article>` wrapper, `<div id="content">`, `<div class="container">`)
3. THE Matrimonial_Page SHALL render correctly across all supported responsive breakpoints: desktop (>1280px), xlarge (1281-1680px), large (981-1280px), medium (737-980px), and small (≤736px)

### Requirement 5: SEO and Discoverability

**User Story:** As the GAMEC web team, I want the matrimonial page to be properly indexed by search engines, so that community members can find it through web searches.

#### Acceptance Criteria

1. THE Matrimonial_Page SHALL include a unique and descriptive meta description tag summarizing the matrimonial services offered by GAMEC
2. WHEN the sitemap is updated, THE `sitemap.xml` SHALL include an entry for `https://igamec.org/matrimonial.html`
3. THE Footer_Component sitemap section SHALL include a link to the Matrimonial_Page under the existing sitemap links list
