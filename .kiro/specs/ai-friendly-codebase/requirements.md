# Requirements Document

## Introduction

The GAMEC website codebase is a static HTML/CSS/JS community site with 16 pages, a shared dynamically-loaded header/footer, one 6800+ line CSS file, jQuery-based JavaScript, and a single ~800-line always-included steering file. This feature restructures the codebase so that AI coding assistants (Kiro, Copilot, Cursor, etc.) can understand, navigate, and modify it faster, with fewer mistakes, and with less context overhead. The changes are purely structural and organizational — no user-facing behavior changes.

## Glossary

- **Steering_File**: A Kiro `.md` file in `.kiro/steering/` that provides context to AI assistants. Each file has an `inclusion` mode (`always`, `fileMatch`, or `manual`) controlling when it is loaded into context.
- **Section_Marker**: A standardized HTML comment pattern (e.g., `<!-- Section: Banner -->`) used to delimit logical regions of a page so AI assistants can locate and reference them reliably.
- **Data_Attribute**: An HTML `data-*` attribute (e.g., `data-page="home"`, `data-section="banner"`) that provides machine-readable metadata about an element's role without affecting rendering.
- **CSS_Module**: A separate CSS file containing styles for one logical concern (e.g., base reset, layout grid, buttons, page-specific styles) that replaces a monolithic stylesheet.
- **JSDoc_Comment**: A structured JavaScript documentation comment following the JSDoc format (`/** ... */`) that describes a function's purpose, parameters, and return value.
- **BEM**: Block-Element-Modifier naming convention for CSS classes (e.g., `.livestream-card__body`), already partially used in the codebase.
- **AI_Assistant**: Any AI coding tool (Kiro, GitHub Copilot, Cursor, Claude, etc.) that reads codebase files to suggest or generate code changes.
- **Context_Window**: The limited token budget an AI_Assistant has available for reading files; smaller, targeted files reduce waste and improve accuracy.
- **Conditional_Inclusion**: A steering file inclusion mode (`fileMatch`) that loads the file only when the developer is working on files matching a glob pattern.
- **Architectural_Decisions**: A steering file that records recent project-wide decisions in reverse-chronological order with dates and rationale, so AI assistants avoid suggesting outdated patterns.
- **Image_Inventory**: A steering file that maps each image filename to a description, dimensions/format, and current page usage, enabling AI assistants to select the correct image for new content.
- **CSS_Audit**: The process of identifying hardcoded color values in stylesheets and replacing them with references to CSS custom properties defined in the `:root` block.
- **CSS_Cleanup**: The process of identifying and removing CSS selectors that are not matched by any element in the project's HTML files.

## Requirements

### Requirement 1: Split the Monolithic Steering File

**User Story:** As a developer using an AI assistant, I want the steering context split into smaller, conditionally-included files, so that the AI only loads context relevant to the files I am editing and does not waste its context window.

#### Acceptance Criteria

1. WHEN a developer opens any project file, THE Steering_File system SHALL provide a core overview file (always-included) containing only project structure, page inventory, tech stack, and deployment info — no longer than 200 lines.
2. WHEN a developer opens a CSS file matching `assets/css/**`, THE Steering_File system SHALL conditionally include a CSS-specific steering file containing the design system, color palette, typography, component styles, and responsive breakpoints.
3. WHEN a developer opens a JavaScript file matching `assets/js/**`, THE Steering_File system SHALL conditionally include a JS-specific steering file containing script load order, library dependencies, dynamic loading patterns, and navigation initialization details.
4. WHEN a developer opens an HTML file matching `*.html`, THE Steering_File system SHALL conditionally include an HTML-specific steering file containing page content summaries, SEO metadata patterns, shared component structure, and content strategy.
5. THE Steering_File system SHALL remove the existing single `gamec.md` file and replace it with the new split files without losing any information from the original document.

### Requirement 2: Create a Coding Conventions Steering File

**User Story:** As a developer using an AI assistant, I want a coding conventions reference, so that the AI generates code that matches the project's existing patterns and avoids introducing inconsistencies.

#### Acceptance Criteria

1. THE Coding_Conventions steering file SHALL document the BEM naming convention with examples from the existing codebase (e.g., `.livestream-card__body`, `.program-item`).
2. THE Coding_Conventions steering file SHALL document the required HTML `<head>` meta tag pattern including title, charset, viewport, description, favicon, manifest, canonical URL, Open Graph, and Twitter Card tags.
3. THE Coding_Conventions steering file SHALL document the JavaScript script load order (jQuery → browser.min.js → breakpoints.min.js → util.js → main.js → includes.js last).
4. THE Coding_Conventions steering file SHALL document the external link pattern requiring `target="_blank"`, `rel="noopener noreferrer"`, and a `<span class="visually-hidden">(opens in new tab)</span>` label.
5. THE Coding_Conventions steering file SHALL document the utility CSS classes used across pages (e.g., `.text-center`, `.bottom-border`, `.visually-hidden`, `.reveal`, `.page-hero-img`).
6. THE Coding_Conventions steering file SHALL document the noscript fallback pattern used at the top of every page body.
7. THE Coding_Conventions steering file SHALL use `always` inclusion mode so it is available regardless of which file the developer is editing.

### Requirement 3: Split the Monolithic CSS File

**User Story:** As a developer using an AI assistant, I want the 6800+ line CSS file split into logical modules, so that the AI can read only the relevant CSS module instead of the entire file, reducing errors and improving suggestions.

#### Acceptance Criteria

1. THE CSS_Module system SHALL split `main.css` into separate files following the existing table-of-contents structure: imports/fonts, variables, reset/base, typography, layout/grid, forms, buttons, tables, images/gallery, common UI components, page sections, site structure, and responsive overrides.
2. THE CSS_Module system SHALL use a single entry-point file (`main.css`) that imports all modules via `@import` statements in the correct cascade order.
3. WHEN a CSS_Module is loaded by the browser, THE CSS_Module system SHALL produce identical rendered output to the original monolithic `main.css` file.
4. THE CSS_Module system SHALL place all module files in `assets/css/modules/` with descriptive filenames (e.g., `_variables.css`, `_buttons.css`, `_layout.css`, `_page-sections.css`).
5. IF a CSS_Module contains page-specific styles for a single page, THEN THE CSS_Module system SHALL name the file to reflect the page (e.g., `_page-donate.css`, `_page-programs.css`).

### Requirement 4: Add Standardized HTML Section Markers

**User Story:** As a developer using an AI assistant, I want consistent comment markers in every HTML page, so that the AI can locate and reference specific sections reliably across all 16 pages.

#### Acceptance Criteria

1. THE Section_Marker system SHALL use the format `<!-- Section: [Name] -->` at the start and `<!-- /Section: [Name] -->` at the end of each major content region in every HTML page.
2. THE Section_Marker system SHALL mark the following regions in every page that contains them: Header wrapper, Main content, Banner (homepage), Features (homepage), Footer wrapper, and each distinct `<section>` within main content.
3. WHEN an AI_Assistant searches for a section by name, THE Section_Marker system SHALL return a unique match per page (no duplicate section names within a single HTML file).
4. THE Section_Marker system SHALL apply markers to all 16 HTML pages plus `header.html` and `footer.html` shared components.

### Requirement 5: Add Machine-Readable Data Attributes

**User Story:** As a developer using an AI assistant, I want data attributes on key HTML elements, so that the AI can programmatically identify page identity and section roles without parsing comment text.

#### Acceptance Criteria

1. THE Data_Attribute system SHALL add a `data-page` attribute to the `<body>` tag of every HTML page with a value matching the page filename without extension (e.g., `data-page="index"`, `data-page="programs"`, `data-page="donate"`).
2. THE Data_Attribute system SHALL add a `data-section` attribute to each major content container (`<section>`, wrapper `<div>`) with a kebab-case value describing its purpose (e.g., `data-section="banner"`, `data-section="core-programs"`, `data-section="donation-methods"`).
3. WHEN a `data-page` attribute is added, THE Data_Attribute system SHALL use the same value consistently across the HTML file, its Section_Markers, and any page-specific CSS_Module filename.
4. THE Data_Attribute system SHALL apply data attributes to all 16 HTML pages plus `header.html` and `footer.html`.

### Requirement 6: Add JSDoc Documentation to Custom Scripts

**User Story:** As a developer using an AI assistant, I want JSDoc comments on all custom JavaScript functions, so that the AI understands each function's purpose, parameters, and return values without reading the full implementation.

#### Acceptance Criteria

1. THE JSDoc_Comment system SHALL add a JSDoc block to every exported or globally-accessible function in `includes.js` documenting its purpose, parameters (with types), and return value.
2. THE JSDoc_Comment system SHALL add a JSDoc block to every exported or globally-accessible function in `main.js` documenting its purpose, parameters (with types), and return value.
3. THE JSDoc_Comment system SHALL add a file-level JSDoc block (`@file`) at the top of each custom script file (`includes.js`, `main.js`) describing the file's role in the application.
4. WHEN a function has side effects (e.g., DOM manipulation, class toggling), THE JSDoc_Comment system SHALL document those side effects in the JSDoc description.
5. IF additional custom script files exist (e.g., `donation-receipts.js`, `quran-viewer.js`), THEN THE JSDoc_Comment system SHALL add JSDoc blocks to those files following the same pattern.

### Requirement 7: Create a File Map for AI Navigation

**User Story:** As a developer using an AI assistant, I want a machine-readable file map in the steering files, so that the AI can quickly determine which file to edit for a given task without scanning the entire project.

#### Acceptance Criteria

1. THE Steering_File system SHALL include a file map section in the core overview steering file that lists every HTML page with its filename, page title, and one-line purpose description.
2. THE Steering_File system SHALL include a file map entry for every CSS module with its filename and the category of styles it contains.
3. THE Steering_File system SHALL include a file map entry for every JavaScript file with its filename, whether it is a library or custom script, and its role.
4. WHEN a new page or file is added to the project, THE file map SHALL be updated to include the new entry (documented as a maintenance instruction in the steering file).

### Requirement 8: Create an Architectural Decisions Steering File

**User Story:** As a developer using an AI assistant, I want a chronological log of recent architectural decisions in a steering file, so that the AI does not suggest outdated patterns or revert changes that were intentionally made.

#### Acceptance Criteria

1. THE Steering_File system SHALL include an architectural decisions file in `.kiro/steering/` that documents recent project-wide decisions (e.g., design system changes, library swaps, navigation refactors) in reverse-chronological order.
2. WHEN a decision entry is added, THE Architectural_Decisions file SHALL record the date, a summary of the change, and the rationale for the decision.
3. THE Architectural_Decisions file SHALL use `always` inclusion mode so that the AI_Assistant has access to decision history regardless of which file the developer is editing.
4. WHEN an AI_Assistant generates a suggestion that contradicts a documented decision, THE Architectural_Decisions file SHALL provide sufficient context for the AI_Assistant to recognize the outdated pattern and avoid it.
5. THE Architectural_Decisions file SHALL include an initial set of entries covering decisions already made in the project (e.g., color palette updates, font additions, navigation refactors, new page additions).

### Requirement 9: Create an Image Inventory Steering File

**User Story:** As a developer using an AI assistant, I want a steering file that maps every image filename to a description of what it shows, so that the AI can select the correct image for new sections without guessing or hallucinating filenames.

#### Acceptance Criteria

1. THE Steering_File system SHALL include an image inventory file in `.kiro/steering/` that lists every image in the `images/` directory.
2. THE Image_Inventory file SHALL record for each image: the filename, a description of what the image shows, the image dimensions and format, and which HTML pages currently reference the image.
3. THE Image_Inventory file SHALL use `fileMatch` inclusion mode matching `*.html` files so that the AI_Assistant receives image context only when editing HTML pages where image selection is relevant.
4. THE Image_Inventory file SHALL incorporate information from the existing `files/image-recommendations.md` file, including recommended images for pages that lack visuals and suggested filenames for future additions.
5. WHEN a new image is added to or removed from the `images/` directory, THE Image_Inventory file SHALL be updated to reflect the change (documented as a maintenance instruction in the file).

### Requirement 10: CSS Custom Property Audit

**User Story:** As a developer using an AI assistant, I want all hardcoded color values in the CSS replaced with their corresponding CSS custom properties, so that the AI only needs to reference variable names when making style changes and the design system stays consistent.

#### Acceptance Criteria

1. THE CSS_Audit system SHALL identify every hardcoded color value (hex, rgb, rgba, hsl, named colors) in `main.css` that duplicates an existing CSS custom property defined in the `:root` block.
2. WHEN a hardcoded color value matches an existing `--color-*` custom property, THE CSS_Audit system SHALL replace the hardcoded value with the corresponding `var(--color-*)` reference.
3. IF a hardcoded color value is used in two or more rules and does not have a corresponding CSS custom property, THEN THE CSS_Audit system SHALL create a new descriptively-named custom property in the `:root` block and replace all occurrences with the new variable reference.
4. WHEN all replacements are complete, THE CSS_Audit system SHALL produce identical rendered output to the original stylesheet — no visual changes to any of the 16 HTML pages.
5. THE CSS_Audit system SHALL document a summary of changes (number of replacements, new variables created) in the Architectural_Decisions steering file.

### Requirement 11: Unused CSS Cleanup

**User Story:** As a developer using an AI assistant, I want dead CSS selectors removed from the stylesheet, so that the AI does not reference or copy patterns from selectors that no longer apply to any page in the site.

#### Acceptance Criteria

1. THE CSS_Cleanup system SHALL identify every CSS selector in `main.css` that is not matched by any element across all 16 HTML pages, `header.html`, and `footer.html`.
2. WHEN a selector is confirmed unused across all 18 HTML files (16 pages plus header and footer), THE CSS_Cleanup system SHALL remove the selector and its associated rule block from the stylesheet.
3. IF a selector targets elements generated dynamically by JavaScript (e.g., navigation panel elements created by `main.js` or `includes.js`), THEN THE CSS_Cleanup system SHALL retain the selector and add a comment noting the dynamic dependency.
4. WHEN all removals are complete, THE CSS_Cleanup system SHALL produce identical rendered output to the original stylesheet — no visual changes to any page.
5. THE CSS_Cleanup system SHALL document what was removed (selector names and approximate line count) as an entry in the Architectural_Decisions steering file.
