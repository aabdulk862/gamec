# Design Document: AI-Friendly Codebase Restructuring

## Overview

This design restructures the GAMEC website codebase — a static HTML/CSS/jQuery site with 16 pages — to be more navigable and understandable by AI coding assistants. The changes are purely organizational: splitting a monolithic steering file into conditional pieces, splitting a 6800+ line CSS file into modules, adding HTML section markers and data attributes, adding JSDoc to custom scripts, creating new steering files (coding conventions, architectural decisions, image inventory), auditing CSS custom properties, and removing unused CSS. No user-facing behavior changes.

The core problem: AI assistants waste context window tokens loading irrelevant information and make mistakes when navigating large monolithic files. Smaller, well-labeled files with machine-readable metadata let AI tools load only what's relevant and locate sections precisely.

## Architecture

The restructuring touches four layers of the codebase:

```mermaid
graph TD
    A[Steering Layer<br>.kiro/steering/] --> B[HTML Layer<br>16 pages + header/footer]
    A --> C[CSS Layer<br>assets/css/]
    A --> D[JS Layer<br>assets/js/]

    subgraph "Steering Layer Changes"
        A1[core-overview.md<br>always]
        A2[css-design-system.md<br>fileMatch: assets/css/**]
        A3[js-architecture.md<br>fileMatch: assets/js/**]
        A4[html-pages.md<br>fileMatch: *.html]
        A5[coding-conventions.md<br>always]
        A6[architectural-decisions.md<br>always]
        A7[image-inventory.md<br>fileMatch: *.html]
    end

    subgraph "CSS Layer Changes"
        C1[main.css<br>@import entry point]
        C2[modules/_variables.css]
        C3[modules/_reset.css]
        C4[modules/_typography.css]
        C5[modules/_layout.css]
        C6[modules/_buttons.css]
        C7[modules/_page-sections.css]
        C8[modules/...more]
    end

    subgraph "HTML Layer Changes"
        B1["Section markers<br>&lt;!-- Section: Name --&gt;"]
        B2["Data attributes<br>data-page, data-section"]
    end

    subgraph "JS Layer Changes"
        D1[JSDoc blocks on<br>all custom functions]
    end
```

All changes are additive or reorganizational. The browser receives identical rendered output. No build tools, bundlers, or frameworks are introduced.

## Components and Interfaces

### 1. Steering File System

The existing monolithic `gamec.md` (~800 lines, always-included) is replaced by seven focused files:

| File                         | Inclusion Mode             | Content                                                                                                     | Max Lines |
| ---------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------- | --------- |
| `core-overview.md`           | `always`                   | Project structure, page inventory, tech stack, file map, deployment info                                    | ≤200      |
| `css-design-system.md`       | `fileMatch: assets/css/**` | Color palette, typography, component styles, responsive breakpoints, CSS module map                         | —         |
| `js-architecture.md`         | `fileMatch: assets/js/**`  | Script load order, library dependencies, dynamic loading patterns, navigation init                          | —         |
| `html-pages.md`              | `fileMatch: *.html`        | Page content summaries, SEO metadata patterns, shared component structure                                   | —         |
| `coding-conventions.md`      | `always`                   | BEM naming, head meta pattern, script order, external link pattern, utility classes, noscript pattern       | —         |
| `architectural-decisions.md` | `always`                   | Reverse-chronological decision log with dates and rationale                                                 | —         |
| `image-inventory.md`         | `fileMatch: *.html`        | Image filename → description, dimensions, format, page usage; incorporates `files/image-recommendations.md` | —         |

Each file uses the standard Kiro frontmatter format:

```markdown
---
inclusion: always | fileMatch
fileMatch: "glob-pattern"
---
```

The `gamec.md` file is deleted after all content is migrated to the new files. No information is lost.

### 2. CSS Module System

The monolithic `main.css` is split following its existing table-of-contents structure. The entry-point `main.css` becomes a list of `@import` statements. All modules live in `assets/css/modules/`.

Module map (matching existing TOC sections):

| Module File             | Source Section                  | Approx Lines |
| ----------------------- | ------------------------------- | ------------ |
| `_imports-fonts.css`    | 1. Imports & Fonts              | ~5           |
| `_variables.css`        | 2. Variables (:root)            | ~120         |
| `_reset.css`            | 3. Reset & Base Styles          | ~500         |
| `_typography.css`       | 4. Typography                   | ~380         |
| `_layout.css`           | 5. Layout & Grid System         | ~980         |
| `_forms.css`            | 6. Forms                        | ~400         |
| `_buttons.css`          | 7. Buttons                      | ~170         |
| `_tables.css`           | 8. Tables                       | ~30          |
| `_images-gallery.css`   | 9. Images & Gallery             | ~100         |
| `_components.css`       | 10. Common UI Components        | ~315         |
| `_page-sections.css`    | 11. Page Sections (shared)      | varies       |
| `_page-donate.css`      | 11. Donate-specific styles      | varies       |
| `_page-programs.css`    | 11. Programs-specific styles    | varies       |
| `_page-membership.css`  | 11. Membership-specific styles  | varies       |
| `_page-media.css`       | 11. Media-specific styles       | varies       |
| `_page-resources.css`   | 11. Resources-specific styles   | varies       |
| `_page-matrimonial.css` | 11. Matrimonial-specific styles | varies       |
| `_page-home.css`        | 11. Homepage-specific styles    | varies       |
| `_site-structure.css`   | 12. Site Structure              | ~500         |
| `_responsive.css`       | 13. Responsive Site Overrides   | ~1000        |
| `_animations.css`       | Animations & Effects section    | varies       |
| `_quran-viewer.css`     | Quran PDF Viewer section        | varies       |
| `_livestream.css`       | Holy Cities Livestream section  | varies       |

The new `main.css` entry point:

```css
/* main.css — Entry point. Imports all modules in cascade order. */
@import "modules/_imports-fonts.css";
@import "modules/_variables.css";
@import "modules/_reset.css";
@import "modules/_typography.css";
@import "modules/_layout.css";
@import "modules/_forms.css";
@import "modules/_buttons.css";
@import "modules/_tables.css";
@import "modules/_images-gallery.css";
@import "modules/_components.css";
@import "modules/_page-sections.css";
@import "modules/_page-home.css";
@import "modules/_page-donate.css";
@import "modules/_page-programs.css";
@import "modules/_page-membership.css";
@import "modules/_page-media.css";
@import "modules/_page-resources.css";
@import "modules/_page-matrimonial.css";
@import "modules/_site-structure.css";
@import "modules/_responsive.css";
@import "modules/_animations.css";
@import "modules/_livestream.css";
@import "modules/_quran-viewer.css";
```

Native CSS `@import` is used — no build tools. The underscore prefix convention signals "partial/module" (borrowed from Sass convention already present in the project's `assets/sass/` directory).

### 3. HTML Section Markers and Data Attributes

Every HTML page gets two additions:

**a) `data-page` on `<body>`:**

```html
<body class="is-preload no-sidebar" data-page="donate"></body>
```

**b) Section markers and `data-section` attributes on major content regions:**

```html
<!-- Section: Donation Methods -->
<section
  class="donation-section"
  id="square-donation"
  data-section="square-donation"
>
  ...
</section>
<!-- /Section: Donation Methods -->
```

Naming rules:

- `data-page` = filename without extension (e.g., `index`, `programs`, `donate`)
- `data-section` = kebab-case describing the section's purpose
- No duplicate section names within a single HTML file
- Markers applied to all 16 pages + `header.html` + `footer.html`

### 4. JSDoc Documentation

All custom JS files get JSDoc blocks. The files in scope:

| File                   | Functions                                                         | Has JSDoc? |
| ---------------------- | ----------------------------------------------------------------- | ---------- |
| `includes.js`          | `getFileName`, `setActiveNav`, `loadHTML`                         | No         |
| `main.js`              | IIFE with `initNavigation` (exposed on `window`)                  | No         |
| `donation-receipts.js` | 17 functions (`formatCurrency`, `validateForm`, `parseCSV`, etc.) | No         |
| `quran-viewer.js`      | 14 functions (`clampPage`, `goToPage`, `renderPage`, etc.)        | No         |

Each function gets:

- `@description` — purpose and side effects
- `@param {type} name` — for each parameter
- `@returns {type}` — return value
- `@sideeffect` — DOM manipulation, class toggling, localStorage writes (where applicable)

Each file gets a `@file` block at the top describing its role.

### 5. CSS Custom Property Audit

Process:

1. Scan all rules in `main.css` (post-split: across all modules) for hardcoded color values
2. For each hardcoded value that matches an existing `--color-*` variable in `:root`, replace with `var(--color-*)`
3. For hardcoded values used in 2+ rules with no existing variable, create a new `--color-*` variable in `_variables.css`
4. Document changes in `architectural-decisions.md`

### 6. Unused CSS Cleanup

Process:

1. Parse all CSS selectors from the stylesheet
2. Check each selector against all 18 HTML files (16 pages + header + footer)
3. For selectors targeting JS-generated elements (e.g., `#navPanel`, `#navToggle`, `.navPanel-visible`, `.link`, `.indent-*`, `.depth-*`), retain and add a comment: `/* Dynamic: generated by main.js */`
4. Remove confirmed-unused selectors
5. Document removals in `architectural-decisions.md`

## Data Models

This feature does not introduce new data models. The changes are structural:

- **Steering files**: Markdown files with YAML frontmatter (`inclusion`, `fileMatch` fields)
- **CSS modules**: Plain CSS files with no special data structures
- **HTML markers**: Standard HTML comments and `data-*` attributes
- **JSDoc**: Standard JSDoc comment blocks

The only "schema" is the steering file frontmatter format:

```yaml
---
inclusion: always | fileMatch | manual
fileMatch: "glob-pattern" # only when inclusion is fileMatch
---
```

And the section marker format:

```
<!-- Section: [PascalCase Name] -->
...content...
<!-- /Section: [PascalCase Name] -->
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: CSS module ↔ @import round trip

_For any_ CSS file in `assets/css/modules/`, the entry-point `main.css` shall contain a corresponding `@import` statement referencing that file, and conversely every `@import` in `main.css` shall point to an existing file in `modules/`.

**Validates: Requirements 3.2, 3.4**

### Property 2: CSS split preserves rule count

_For any_ CSS rule present in the original monolithic `main.css`, that rule shall exist in exactly one of the CSS module files, and the total number of CSS rules across all modules shall equal the total in the original file.

**Validates: Requirements 3.3**

### Property 3: Page-specific CSS modules named after pages

_For any_ CSS module file matching the pattern `_page-*.css`, the `*` portion shall correspond to an HTML page filename (without extension) that exists in the project root.

**Validates: Requirements 3.5**

### Property 4: Section marker format compliance

_For any_ HTML comment in any of the 18 HTML files that begins with `Section:`, it shall match the exact format `<!-- Section: [Name] -->` for opening markers and `<!-- /Section: [Name] -->` for closing markers, and every opening marker shall have a corresponding closing marker with the same name.

**Validates: Requirements 4.1**

### Property 5: No duplicate section names per file

_For any_ single HTML file, the set of section marker names extracted from `<!-- Section: [Name] -->` comments shall contain no duplicates.

**Validates: Requirements 4.3**

### Property 6: All HTML files have section markers

_For any_ HTML file in the project (16 pages + `header.html` + `footer.html`), the file shall contain at least one `<!-- Section: ... -->` marker.

**Validates: Requirements 4.4**

### Property 7: data-page matches filename

_For any_ of the 16 HTML page files, the `<body>` tag shall have a `data-page` attribute whose value equals the filename without the `.html` extension.

**Validates: Requirements 5.1, 5.4**

### Property 8: data-section values are kebab-case

_For any_ `data-section` attribute value across all HTML files, the value shall match the pattern `^[a-z][a-z0-9]*(-[a-z0-9]+)*$` (kebab-case).

**Validates: Requirements 5.2**

### Property 9: All custom JS functions have JSDoc

_For any_ function declaration or function expression in the custom script files (`includes.js`, `main.js`, `donation-receipts.js`, `quran-viewer.js`), there shall be a JSDoc comment block (`/** ... */`) immediately preceding the function.

**Validates: Requirements 6.1, 6.2, 6.5**

### Property 10: All custom JS files have @file block

_For any_ custom script file (`includes.js`, `main.js`, `donation-receipts.js`, `quran-viewer.js`), the file shall begin with a JSDoc block containing the `@file` tag.

**Validates: Requirements 6.3**

### Property 11: File map covers all project files

_For any_ HTML page file, CSS module file, or JavaScript file in the project, the core overview steering file shall contain a file map entry referencing that filename.

**Validates: Requirements 7.1, 7.2, 7.3**

### Property 12: Decision entries have required fields

_For any_ entry in the architectural decisions steering file, the entry shall contain a date, a summary of the change, and a rationale for the decision.

**Validates: Requirements 8.2**

### Property 13: Image inventory covers all images with required fields

_For any_ image file in the `images/` directory, the image inventory steering file shall contain an entry with the filename, a description, dimensions/format information, and page usage information.

**Validates: Requirements 9.1, 9.2**

### Property 14: No hardcoded colors matching existing CSS variables

_For any_ CSS declaration outside the `:root` block, if the declaration value contains a color literal (hex, rgb, rgba, hsl, or named color) that is identical to the value of an existing `--color-*` custom property, then that literal shall be replaced with the corresponding `var(--color-*)` reference.

**Validates: Requirements 10.1, 10.2**

### Property 15: Repeated hardcoded colors have corresponding variables

_For any_ hardcoded color value that appears in two or more CSS rules (outside `:root`), there shall exist a `--color-*` custom property in the `:root` block with that value, and all occurrences shall use the `var()` reference.

**Validates: Requirements 10.3**

### Property 16: All CSS selectors match HTML or are marked dynamic

_For any_ CSS selector in the final stylesheet, the selector shall either match at least one element across the 18 HTML files (16 pages + header + footer), or be annotated with a comment indicating it targets dynamically-generated elements.

**Validates: Requirements 11.1, 11.2**

## Error Handling

Since this feature is purely structural reorganization with no runtime behavior changes, error handling focuses on preventing regressions:

1. **CSS @import failures**: If a module file is missing or misnamed, the browser silently skips it. The Property 1 test (round-trip between modules directory and @import statements) catches this at test time.

2. **Broken section markers**: Unclosed or mismatched markers don't affect rendering but confuse AI tools. Property 4 (format compliance) and Property 5 (no duplicates) catch these.

3. **Invalid data attributes**: Malformed `data-page` or `data-section` values don't break rendering but reduce AI utility. Properties 7 and 8 catch these.

4. **JSDoc parse errors**: Malformed JSDoc blocks may confuse IDE tooling. The getDiagnostics tool can catch syntax issues in JS files after JSDoc is added.

5. **CSS variable audit false positives**: Some hardcoded colors may intentionally differ from variables (e.g., in vendor-prefixed fallbacks or one-off overrides). The audit should skip colors inside comments, `url()` values, and gradient color stops that are intentionally distinct from the design system.

6. **Unused CSS false positives**: Selectors targeting JS-generated elements (navPanel, navToggle, dropotron dropdowns) must be retained. The cleanup process explicitly checks `main.js` and `includes.js` for dynamically-created class names and IDs.

## Testing Strategy

### Testing Framework

- **Test runner**: Vitest (already configured in `package.json` with `vitest --run`)
- **Property-based testing**: fast-check (already a devDependency)
- **DOM parsing**: jsdom (already a devDependency)
- **CSS parsing**: css-tree (already a devDependency)

### Property-Based Tests

Each correctness property maps to a single property-based test using fast-check. Tests run a minimum of 100 iterations where randomization applies. For structural checks (e.g., "all files have markers"), the test iterates over the actual file set rather than generating random inputs.

Tag format for each test: `Feature: ai-friendly-codebase, Property {N}: {title}`

Key property tests:

- **Properties 1, 2, 3**: Parse `main.css` for @import statements, list `modules/` directory, verify bidirectional mapping and rule count preservation
- **Properties 4, 5, 6**: Parse all 18 HTML files, extract section markers via regex, verify format, uniqueness, and coverage
- **Properties 7, 8**: Parse all HTML files, extract `data-page` and `data-section` attributes, verify against filename and kebab-case regex
- **Properties 9, 10**: Parse custom JS files, extract function declarations, verify preceding JSDoc blocks and @file tags
- **Property 11**: Parse core overview steering file, extract file map entries, verify against actual project files
- **Properties 14, 15**: Parse CSS with css-tree, extract color values, compare against `:root` variables
- **Property 16**: Parse CSS selectors, check against HTML DOM using jsdom, verify matches or dynamic annotations

### Unit Tests

Unit tests cover specific examples and edge cases:

- Steering file frontmatter parsing (verify `inclusion` and `fileMatch` values for each file)
- Core overview file is ≤200 lines
- Specific expected section markers exist in key pages (e.g., `index.html` has "Banner", "Features")
- Known dynamic CSS selectors (`#navPanel`, `#navToggle`, `.navPanel-visible`) are retained with comments
- Architectural decisions file contains initial entries with dates
- Image inventory includes entries from `files/image-recommendations.md`
- Coding conventions file covers all required topics (BEM, meta tags, script order, external links, utility classes, noscript)

### Test File Organization

All tests go in the existing `tests/` directory:

- `tests/css-modules.property.test.mjs` — Properties 1, 2, 3
- `tests/section-markers.property.test.mjs` — Properties 4, 5, 6
- `tests/data-attributes.property.test.mjs` — Properties 7, 8
- `tests/jsdoc-coverage.property.test.mjs` — Properties 9, 10
- `tests/file-map.property.test.mjs` — Property 11
- `tests/css-audit.property.test.mjs` — Properties 14, 15
- `tests/css-cleanup.property.test.mjs` — Property 16
- `tests/steering-files.unit.test.mjs` — Unit tests for steering file structure
- `tests/ai-friendly.unit.test.mjs` — Unit tests for specific examples and edge cases
