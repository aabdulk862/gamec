---
inclusion: fileMatch
fileMatchPattern: "assets/js/**"
---

# JavaScript Architecture

## Script Load Order

Every HTML page loads scripts at the bottom of `<body>` in this exact order. **`includes.js` must be last** because it calls `window.initNavigation()` defined in `main.js`.

| #   | File                   | Role                                                 | Pages                       |
| --- | ---------------------- | ---------------------------------------------------- | --------------------------- |
| 1   | `jquery.min.js`        | jQuery core — DOM manipulation, events, AJAX         | All pages                   |
| 2   | `browser.min.js`       | Browser detection — adds classes to `<body>`         | All pages                   |
| 3   | `breakpoints.min.js`   | Fires events when viewport crosses breakpoint widths | All pages                   |
| 4   | `util.js`              | Helper functions for events and CSS support checks   | All pages                   |
| 5   | `main.js`              | Navigation init, scroll reveal, preload removal      | All pages                   |
| 6   | `includes.js`          | Dynamic header/footer loading — **MUST be last**     | All pages                   |
| 7   | `donation-receipts.js` | CSV parsing, receipt generation, print/download      | donation-receipts.html only |
| 8   | `quran-viewer.js`      | PDF.js-based Quran page viewer with navigation       | resources.html only         |

On `resources.html`, a `<script type="module">` block loads PDF.js from CDN and sets `window.pdfjsLib` before `quran-viewer.js` runs.

## Library Dependencies

| Library           | File                 | What It Provides                                                   |
| ----------------- | -------------------- | ------------------------------------------------------------------ |
| jQuery            | `jquery.min.js`      | DOM manipulation, event handling, AJAX. Used by `main.js` for nav. |
| Browser detection | `browser.min.js`     | Detects browser type/version, adds classes to `<body>`             |
| Breakpoints       | `breakpoints.min.js` | Fires events when viewport crosses breakpoint thresholds           |
| Util              | `util.js`            | Helper functions for events and CSS support checks                 |

## Dynamic Loading Patterns

`includes.js` handles dynamic component injection on every page:

1. On `DOMContentLoaded`, `loadHTML()` fires
2. `header.html` is fetched via `fetch()` API and injected into `#header-wrapper`
3. `footer.html` is fetched via `fetch()` API and injected into `#footer-wrapper`
4. After header loads:
   - `setActiveNav()` is called — compares `window.location.pathname` filename with nav link `href` values, adds `.current` class to matching `<li>`
   - `window.initNavigation()` is called — sets up desktop dropdowns and mobile menu panel
5. Active nav detection uses `getFileName()` which strips query strings, hashes, and path segments to compare bare filenames (defaults to `index.html` for empty paths)

### Key functions in `includes.js`

| Function         | Purpose                                                             |
| ---------------- | ------------------------------------------------------------------- |
| `getFileName()`  | Extracts bare filename from a path (strips folders, query, hash)    |
| `setActiveNav()` | Highlights current page in nav by comparing filenames               |
| `loadHTML()`     | Fetches and injects `header.html` and `footer.html`, then inits nav |

## Navigation Initialization (`main.js`)

`main.js` is an IIFE wrapping jQuery. It exposes `window.initNavigation()` for `includes.js` to call after header injection.

### Desktop Navigation (>980px)

- WAI-ARIA disclosure pattern for dropdown menus
- Parent `<li>` items with nested `<ul>` get hover and keyboard handlers
- Opens on `mouseenter`, closes on `mouseleave` with 200ms delay
- Keyboard: Enter/Space/ArrowDown opens dropdown, ArrowUp/ArrowDown navigates items, Escape closes
- `aria-expanded` attribute toggled on parent links
- `.is-open` class toggled on dropdown `<ul>`

### Mobile Navigation (≤980px)

- Toggle button: `<button id="navToggle">` appended to `<body>`, fixed position top-left, Font Awesome bars icon
- Panel: `<div id="navPanel">` with slide-in from left (275px width)
- Panel features: `hideOnClick`, `hideOnSwipe`, `resetScroll`, `resetForms`, delay 500ms
- Body class toggle: `.navPanel-visible`
- Transform animation: `translateX(275px)` on body when panel is open
- ARIA: `aria-expanded` and `aria-label` toggled on button
- MutationObserver watches body class changes to sync ARIA state

### Cleanup

`initNavigation()` removes any existing `#navToggle` and `#navPanel` before creating new ones, preventing duplicates if called multiple times.

## Scroll Reveal (`main.js`)

- On `window.load`, an `IntersectionObserver` watches elements with `.reveal` or `.reveal-stagger` class
- Adds `.is-visible` class when element enters viewport
- Threshold: `0.15` (15% visible triggers reveal)
- Observer unobserves element after first intersection (one-shot)
- Fallback: if `IntersectionObserver` is not supported, all elements get `.is-visible` immediately

## Preload State (`main.js`)

- Body starts with `.is-preload` class (disables CSS transitions during load)
- Removed after 100ms via `setTimeout` on `window.load` to enable animations

## Custom Script Architecture

### `includes.js` — Dynamic Component Injection

- 3 functions: `getFileName()`, `setActiveNav()`, `loadHTML()`
- Vanilla JS (no jQuery dependency)
- Runs on `DOMContentLoaded`
- Global scope functions

### `main.js` — Navigation & Scroll Reveal

- IIFE pattern wrapping jQuery: `(function($) { ... })(jQuery)`
- Exposes `window.initNavigation()` on the global object
- Uses jQuery for DOM manipulation and the `.panel()` / `.navList()` jQuery plugins
- Breakpoint configuration: xlarge 1281-1680px, large 981-1280px, medium 737-980px, small ≤736px

### `donation-receipts.js` — Receipt Generator (donation-receipts.html only)

17 functions for CSV-based donation receipt generation:

| Function                     | Purpose                                        |
| ---------------------------- | ---------------------------------------------- |
| `formatCurrency()`           | Format number as USD currency string           |
| `formatReceiptNumber()`      | Generate receipt number from year + sequence   |
| `getNextSequence()`          | Get next sequence number from localStorage     |
| `setSequence()`              | Save sequence number to localStorage           |
| `buildMailtoLink()`          | Build mailto: link for emailing receipt        |
| `validateForm()`             | Validate form data before receipt generation   |
| `parseCSVLine()`             | Parse a single CSV line handling quoted fields |
| `parseCSV()`                 | Parse full CSV text into structured records    |
| `generateReceipt()`          | Generate HTML receipt from donor record        |
| `escapeHTML()`               | Escape HTML special characters                 |
| `renderPreviewTable()`       | Render preview table of parsed CSV data        |
| `filterByYear()`             | Filter donation records by year                |
| `isLocalStorageAvailable()`  | Check if localStorage is accessible            |
| `updateNextReceiptDisplay()` | Update UI with next receipt number             |
| `clearFormErrors()`          | Clear validation error messages from UI        |
| `showFormErrors()`           | Display validation errors in UI                |
| `initReceiptGenerator()`     | Initialize the receipt generator on page load  |

### `quran-viewer.js` — Quran PDF Viewer (resources.html only)

14 functions for PDF.js-based Quran page viewer:

| Function            | Purpose                                   |
| ------------------- | ----------------------------------------- |
| `clampPage()`       | Clamp page number within valid range      |
| `clampZoom()`       | Clamp zoom scale within min/max bounds    |
| `adjustZoom()`      | Calculate new zoom level from delta       |
| `getCurrentSurah()` | Determine current surah from page number  |
| `saveState()`       | Persist current page/zoom to localStorage |
| `loadState()`       | Restore page/zoom from localStorage       |
| `buildToc()`        | Build table of contents from surah data   |
| `toggleToc()`       | Show/hide table of contents panel         |
| `doZoom()`          | Apply zoom delta and re-render            |
| `resetZoom()`       | Reset zoom to default scale               |
| `goToPage()`        | Navigate to specific page number          |
| `renderPage()`      | Render a PDF page to canvas               |
| `showError()`       | Display error message in viewer           |
| `initQuranViewer()` | Initialize viewer on `pdfjsReady` event   |

Depends on PDF.js loaded via CDN `<script type="module">` that sets `window.pdfjsLib` and dispatches `pdfjsReady` event.

## Key Patterns

- All custom scripts use vanilla JS except `main.js` which uses jQuery for navigation plugins
- No module bundler — scripts loaded via `<script>` tags in HTML
- No ES modules in custom scripts — all use global scope or IIFE pattern (`quran-viewer.js` consumes `window.pdfjsLib` set by an inline module script)
- Preload state: body has `.is-preload` class, removed after 100ms to enable CSS animations
- Dynamic elements created by JS: `#navPanel`, `#navToggle`, `.navPanel-visible` — CSS for these must be retained even though they don't exist in static HTML
