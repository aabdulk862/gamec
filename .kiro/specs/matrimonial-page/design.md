# Design Document: Matrimonial Page

## Overview

This feature adds a dedicated `matrimonial.html` page to the GAMEC website and integrates it into the site's navigation, programs listing, footer sitemap, and XML sitemap. The page follows the exact same static HTML template pattern used by existing program sub-pages (`relief.html`, `sisters.html`, `youth.html`, etc.) and requires no new CSS, JavaScript, or backend changes.

The implementation touches five files:

1. **New file:** `matrimonial.html` — the dedicated page
2. **Modified:** `header.html` — add nav menu item under Programs dropdown
3. **Modified:** `programs.html` — replace placeholder with link to new page
4. **Modified:** `footer.html` — add sitemap link
5. **Modified:** `sitemap.xml` — add URL entry for SEO

## Architecture

The GAMEC site is a static HTML website with dynamically injected header/footer components. There is no build step, no framework, and no server-side rendering. All pages follow a consistent template:

```
┌─────────────────────────────────┐
│  <head> (title, meta, CSS)      │
├─────────────────────────────────┤
│  <body class="is-preload ...">  │
│    #page-wrapper                │
│      #header-wrapper (injected) │
│      #main-wrapper              │
│        .container               │
│          #content               │
│            <article>            │
│              Page content       │
│            </article>           │
│      #footer-wrapper (injected) │
│    Scripts (jQuery → includes)  │
└─────────────────────────────────┘
```

The `includes.js` script fetches `header.html` and `footer.html` at runtime, injects them into the wrapper divs, then calls `setActiveNav()` which matches the current page filename against nav link `href` attributes to apply the `current` class. No changes to `includes.js` or `main.js` are needed — the existing filename-based matching will automatically highlight the "Matrimonial Services" nav item when the user is on `matrimonial.html`.

## Components and Interfaces

### 1. matrimonial.html (New File)

Follows the `no-sidebar` template pattern identical to `relief.html` and `sisters.html`:

- **Body class:** `is-preload no-sidebar`
- **Structure:** `#page-wrapper` → `#header-wrapper` + `#main-wrapper` → `.container` → `#content` → `<article>`
- **Head section:**
  - Title: `Matrimonial | GAMEC`
  - Meta charset, viewport, description
  - Favicon links (`.ico` and `.png`)
  - Link to `assets/css/main.css`
- **Content:**
  - `<h1>Matrimonial Services</h1>`
  - Introductory `<p>` describing the program purpose
  - `<h3>` subheading sections describing program goals/services
  - A call-to-action button linking to an external Fillout form for matrimonial registration/interest (placeholder URL until the user provides the actual Fillout link)
  - Uses only existing CSS classes from `main.css`
- **Scripts:** Same load order as all other pages:
  1. `assets/js/jquery.min.js`
  2. `assets/js/jquery.dropotron.min.js`
  3. `assets/js/browser.min.js`
  4. `assets/js/breakpoints.min.js`
  5. `assets/js/util.js`
  6. `assets/js/main.js`
  7. `./assets/js/includes.js`

### 2. header.html (Modified)

Add a new `<li>` inside the Programs dropdown `<ul>`:

```html
<li><a href="./matrimonial.html">Matrimonial Services</a></li>
```

Placement: after the existing "Health Services" entry (last item in the Programs dropdown), keeping alphabetical grouping by program type.

The `setActiveNav()` function in `includes.js` uses filename matching (`getFileName()` extracts `matrimonial.html` from the href and compares it to `window.location.pathname`). This means the nav item will automatically receive the `current` class when the user is on the matrimonial page — no JS changes needed.

The dropotron plugin initializes dropdowns dynamically after header injection, so the new item will appear in both desktop dropdown and mobile slide-in panel automatically.

### 3. programs.html (Modified)

The existing Matrimonial Services card in `programs.html` currently shows:

```html
<div class="card1">
  <h3>Matrimonial Services</h3>
  <p>...description...</p>
  <h4>More information coming soon</h4>
</div>
```

Replace the `<h4>More information coming soon</h4>` with a call-to-action button linking to the new page:

```html
<div class="signup">
  <a href="./matrimonial.html" class="button">Learn More</a>
</div>
```

This uses the same `signup` div + `button` class pattern already used by the Youth Sports card directly above it on the same page. The existing description text is preserved.

### 4. footer.html (Modified)

Add a new `<li>` to the Sitemap `<ul>` in the first column:

```html
<li><a href="./matrimonial.html">Matrimonial Services</a></li>
```

Placement: after the existing "Programs" link, since matrimonial is a sub-program page.

### 5. sitemap.xml (Modified)

Add a new `<url>` entry:

```xml
<!-- 17. Matrimonial Page -->
<url>
  <loc>https://igamec.org/matrimonial.html</loc>
</url>
```

Placement: after the Health Services entry (entry 16).

## Data Models

No data models are needed. This is a static HTML page with no dynamic data, no forms, no API calls, and no local storage. All content is hardcoded in HTML.

## Error Handling

No custom error handling is required. The page relies on the same error handling already present in `includes.js`:

- If `header.html` fails to load, the fetch catch handler logs `HEADER ERROR` to console
- If `footer.html` fails to load, the fetch catch handler logs `FOOTER ERROR` to console
- If `initNavigation` is not defined (main.js failed to load), an error is logged to console

These are existing behaviors that apply to all pages uniformly. No new error scenarios are introduced by this feature.
