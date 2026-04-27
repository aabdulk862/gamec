---
inclusion: always
---

# Coding Conventions

## 1. BEM Naming Convention

All CSS classes follow Block-Element-Modifier (BEM) naming:

- **Block** — standalone component: `.livestream-card`, `.program-item`, `.donation-section`, `.matrimonial-card`
- **Element** — part of a block, separated by `__`: `.livestream-card__body`, `.livestream-card__title`, `.program-item__icon`, `.matrimonial-card__content`
- **Modifier** — variation of a block or element, separated by `--`: `.button--large`, `.button--alt`

### Codebase Examples

```
.livestream-card
.livestream-card__body
.livestream-card__title
.program-item
.program-item__icon
.donation-section
.matrimonial-card
.matrimonial-card__content
```

## 2. HTML `<head>` Meta Tag Pattern

Every page must include the following tags in `<head>`, in this order:

```html
<meta charset="UTF-8" />
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, user-scalable=yes"
/>
<title>Page Name | GAMEC</title>
<meta name="description" content="..." />
<link rel="icon" href="images/favicon.png" />
<link rel="apple-touch-icon" href="images/apple-touch-icon.png" />
<link rel="manifest" href="manifest.json" />
<link rel="canonical" href="https://igamec.org/page.html" />

<!-- Open Graph -->
<meta property="og:title" content="Page Name | GAMEC" />
<meta property="og:description" content="..." />
<meta property="og:image" content="https://igamec.org/images/cover.png" />
<meta property="og:url" content="https://igamec.org/page.html" />
<meta property="og:type" content="website" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Page Name | GAMEC" />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="https://igamec.org/images/cover.png" />

<!-- Stylesheets -->
<link rel="stylesheet" href="assets/css/main.css" />
<link rel="stylesheet" href="assets/css/fontawesome-all.min.css" />
```

## 3. JS Script Load Order

Scripts load at the bottom of `<body>` in this exact order:

1. `jquery.min.js`
2. `browser.min.js`
3. `breakpoints.min.js`
4. `util.js`
5. `main.js`
6. `includes.js` — **MUST be last** (calls `window.initNavigation()`)

## 4. External Link Pattern

All external links must include `target="_blank"`, `rel="noopener noreferrer"`, and an accessible label:

```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Link Text <span class="visually-hidden">(opens in new tab)</span>
</a>
```

- `target="_blank"` — opens in new tab
- `rel="noopener noreferrer"` — security: prevents reverse tabnapping
- `<span class="visually-hidden">` — screen reader announcement for new-tab behavior

## 5. Utility CSS Classes

| Class              | Purpose                                                                             |
| ------------------ | ----------------------------------------------------------------------------------- |
| `.text-center`     | Centers text alignment                                                              |
| `.bottom-border`   | Adds bottom border separator (2px solid accent color)                               |
| `.visually-hidden` | Hides element visually but keeps it accessible to screen readers                    |
| `.reveal`          | Marks element for scroll-reveal animation (IntersectionObserver adds `.is-visible`) |
| `.reveal-stagger`  | Staggered reveal animation for child elements                                       |
| `.page-hero-img`   | Full-width hero image at top of page content                                        |

## 6. Noscript Fallback Pattern

Every page must have a `<noscript>` tag at the top of `<body>`:

```html
<noscript>
  <div class="noscript-warning">
    This site requires JavaScript for full functionality.
  </div>
</noscript>
```

This informs users with JavaScript disabled that the site needs JS to work properly.
