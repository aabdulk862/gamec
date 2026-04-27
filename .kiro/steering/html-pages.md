---
inclusion: fileMatch
fileMatchPattern: "*.html"
---

# HTML Pages

## Shared Component Structure

Every page follows the same shell:

- `<body class="is-preload">` — the `is-preload` class is removed by JS after 100ms to enable animations
- `<noscript>` fallback message at top of `<body>`
- `<div id="header-wrapper">` — `header.html` is injected here dynamically by `includes.js`
- Main page content (varies per page)
- `<div id="footer-wrapper">` — `footer.html` is injected here dynamically by `includes.js`

### header.html

- Site logo linking to `index.html`
- Main `<nav>` with dropdown menus (About Us, Programs, Get Involved submenus)
- Mobile hamburger toggle button (`#navToggle`)

### footer.html

- 4-column layout:
  - **Sitemap** — links to all main pages
  - **Resources** — external Islamic/educational links
  - **Quick Links** — membership, donate, contact shortcuts
  - **Contact** — email, phone, address, social media icons
- Social icons row (Facebook, Twitter, Instagram)
- Copyright notice

## SEO Metadata Pattern

Every page `<head>` must include these elements:

```html
<title>Page Name | GAMEC</title>
<meta charset="UTF-8" />
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, user-scalable=yes"
/>
<meta name="description" content="Unique description for this page" />
<link rel="icon" href="images/favicon.png" />
<link rel="apple-touch-icon" href="images/apple-touch-icon.png" />
<link rel="manifest" href="manifest.json" />
<link rel="canonical" href="https://igamec.org/page.html" />

<!-- Open Graph -->
<meta property="og:title" content="Page Name | GAMEC" />
<meta property="og:description" content="Same as meta description" />
<meta property="og:image" content="https://igamec.org/images/og-image.png" />
<meta property="og:url" content="https://igamec.org/page.html" />
<meta property="og:type" content="website" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Page Name | GAMEC" />
<meta name="twitter:description" content="Same as meta description" />
<meta name="twitter:image" content="https://igamec.org/images/og-image.png" />
```

Title format: `"Page Name | GAMEC"` — each page has a unique title and description.

## Page Content Summaries

| Page                     | Main Content Sections                                                                                                                              |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.html`             | Hero banner, 3 feature boxes (Mission/Programs/Get Involved), membership CTA, donations, resources preview, media gallery, affiliated associations |
| `vision.html`            | Mission statement, 501(c)(3) status, 8 priority areas, core belief, 3 action buttons                                                               |
| `history.html`           | Origin story, founding values (placeholder for expansion)                                                                                          |
| `leadership.html`        | Leadership philosophy, board members section (placeholder)                                                                                         |
| `contact.html`           | Email/phone/address, social media icons, response time note                                                                                        |
| `programs.html`          | 5 program cards, youth sports section, matrimonial services, sidebar (Da'wah, events, contact)                                                     |
| `relief.html`            | Mission, vision, 3 objectives (Empowering, Strengthening, Forging)                                                                                 |
| `sisters.html`           | Women's empowerment, Islamic education focus, diversity emphasis                                                                                   |
| `youth.html`             | Vision, short/long-term missions, 6 program areas                                                                                                  |
| `seniors.html`           | Vision, services, diversity commitment, culture of belonging                                                                                       |
| `professionals.html`     | Target audience, services (networking, development, community), new graduates section                                                              |
| `health.html`            | Healthcare support, 4 service areas, collaboration note                                                                                            |
| `membership.html`        | Benefits, member opportunities, sign-up and donate buttons                                                                                         |
| `donate.html`            | 3 donation methods (Square, PayPal, Zelle with step-by-step)                                                                                       |
| `media.html`             | Photo gallery with captions, video/audio sections, social media links                                                                              |
| `resources.html`         | Islamic resources (5 links), educational resources (3 links), Quran viewer                                                                         |
| `matrimonial.html`       | Community matrimonial support services                                                                                                             |
| `donation-receipts.html` | CSV upload, receipt generation, print/download                                                                                                     |

## Common Page Layout Pattern

- Pages use either **full-width** or **right-sidebar** layout
- Main content wrapped in `<main>` or `<div id="main">`
- Sections use `<section>` tags with descriptive classes
- Hero images use `.page-hero-img` class
- Content sections use `.reveal` class for scroll animations
