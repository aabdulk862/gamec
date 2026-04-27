---
inclusion: always
---

# GAMEC Website — Core Overview

## Project Identity

- **Organization:** GAMEC (Global Association of Muslim Eritrean Communities)
- **Type:** 501(c)(3) non-profit voluntary membership association
- **Domain:** https://igamec.org
- **Location:** 3420 13th St SE, Washington, DC 20032
- **Contact:** contact@igamec.org | +1 (202) 440-9089

## Tech Stack

- **Markup:** Static HTML5 (no build tools, no frameworks)
- **Styling:** CSS3 with custom properties, Font Awesome 5 icons
- **JavaScript:** jQuery, custom vanilla JS scripts
- **Fonts:** Roboto (Google Fonts), Playfair Display (headings), Font Awesome
- **Deployment:** Static file hosting at https://igamec.org

## Project Structure

```
├── *.html                    # 18 HTML pages in root
├── header.html               # Shared header (dynamically injected)
├── footer.html               # Shared footer (dynamically injected)
├── assets/
│   ├── css/
│   │   ├── main.css          # Entry point — @imports all modules
│   │   ├── modules/          # CSS modules (one per concern)
│   │   ├── media.css         # Additional media styles
│   │   └── fontawesome-all.min.css
│   ├── js/                   # jQuery + custom scripts
│   ├── sass/                 # Legacy Sass source (not actively used)
│   └── webfonts/             # Font Awesome font files
├── images/                   # All site images
├── files/                    # Markdown content files
├── tests/                    # Vitest + fast-check test suite
├── .kiro/steering/           # AI steering files
└── .kiro/specs/              # Feature specifications
```

## Page Inventory

| #   | Filename                 | Page Title           | Purpose                                                  |
| --- | ------------------------ | -------------------- | -------------------------------------------------------- |
| 1   | `index.html`             | Homepage             | Landing page with hero banner, feature boxes, CTAs       |
| 2   | `vision.html`            | Mission & Vision     | Organization mission, 8 priority areas, 501(c)(3) status |
| 3   | `history.html`           | History              | Origin story and founding values                         |
| 4   | `leadership.html`        | Leadership Team      | Board members and leadership philosophy                  |
| 5   | `contact.html`           | Contact Us           | Email, phone, address, social media links                |
| 6   | `programs.html`          | Programs Overview    | 5 program cards, youth sports, sidebar with events       |
| 7   | `relief.html`            | GAMEC Relief         | Charity mission, vision, 3 objectives                    |
| 8   | `sisters.html`           | GAMEC Sisters        | Women's empowerment through Islamic education            |
| 9   | `youth.html`             | GAMEC Youth          | Youth programs, workshops, cultural celebrations         |
| 10  | `seniors.html`           | GAMEC Seniors        | Senior care, community connections, independence         |
| 11  | `professionals.html`     | GAMEC Professionals  | Networking, professional development, new graduates      |
| 12  | `health.html`            | Health Services      | Medical assistance, health education, wellness           |
| 13  | `membership.html`        | Membership           | Benefits, sign-up form link, donate CTA                  |
| 14  | `donate.html`            | Donations            | Square, PayPal, and Zelle donation methods               |
| 15  | `media.html`             | Media Gallery        | Photo gallery, video/audio sections, social links        |
| 16  | `resources.html`         | Resources            | Islamic and educational resource links                   |
| 17  | `matrimonial.html`       | Matrimonial Services | Community matrimonial support                            |
| 18  | `donation-receipts.html` | Donation Receipts    | CSV-based donation receipt generator                     |

### Shared Components

| Filename      | Role                                                                           |
| ------------- | ------------------------------------------------------------------------------ |
| `header.html` | Site header with navigation — dynamically injected into `#header-wrapper`      |
| `footer.html` | Site footer with sitemap, resources, contact — injected into `#footer-wrapper` |

## File Map — CSS Modules

All modules live in `assets/css/modules/`. Entry point `main.css` imports them in cascade order.

| Filename                | Category                                                        |
| ----------------------- | --------------------------------------------------------------- |
| `_imports-fonts.css`    | Font imports (Google Fonts, Playfair Display)                   |
| `_variables.css`        | CSS custom properties (:root color, spacing, typography tokens) |
| `_reset.css`            | Reset and base element styles                                   |
| `_typography.css`       | Headings, paragraphs, lists, links, text utilities              |
| `_layout.css`           | 12-column flexbox grid, containers, gutters, row/col classes    |
| `_forms.css`            | Input fields, textareas, selects, form layout                   |
| `_buttons.css`          | Button variants (primary, alt, large, icon)                     |
| `_tables.css`           | Table styling (header, rows, cells)                             |
| `_images-gallery.css`   | Image display variants, gallery grid                            |
| `_components.css`       | Boxes, icons, lists, widgets, common UI patterns                |
| `_page-sections.css`    | Shared page section styles (banner, features, CTAs)             |
| `_page-home.css`        | Homepage-specific styles                                        |
| `_page-donate.css`      | Donation page styles (Square, PayPal, Zelle sections)           |
| `_page-programs.css`    | Programs page card layout and sidebar                           |
| `_page-membership.css`  | Membership page list and CTA styles                             |
| `_page-media.css`       | Media gallery and video embed styles                            |
| `_page-resources.css`   | Resources page section and link styles                          |
| `_page-matrimonial.css` | Matrimonial page styles                                         |
| `_site-structure.css`   | Header, footer, nav, wrapper, and panel layout                  |
| `_responsive.css`       | Responsive overrides for all breakpoints                        |
| `_animations.css`       | Transitions, scroll-reveal, preload state                       |
| `_livestream.css`       | Holy Cities livestream embed styles                             |
| `_quran-viewer.css`     | Quran PDF viewer component styles                               |

Other CSS files in `assets/css/`:

| Filename                  | Category                                |
| ------------------------- | --------------------------------------- |
| `main.css`                | Entry point — `@import` statements only |
| `media.css`               | Additional media page styles            |
| `fontawesome-all.min.css` | Font Awesome 5 icon library (vendor)    |

## File Map — JavaScript

| Filename               | Type    | Role                                                                       |
| ---------------------- | ------- | -------------------------------------------------------------------------- |
| `jquery.min.js`        | Library | jQuery core — DOM manipulation, AJAX, events                               |
| `browser.min.js`       | Library | Browser detection utility                                                  |
| `breakpoints.min.js`   | Library | Responsive breakpoint event manager                                        |
| `util.js`              | Library | Utility functions (event helpers, CSS support checks)                      |
| `main.js`              | Custom  | Navigation init (desktop dropdowns, mobile panel), scroll reveal           |
| `includes.js`          | Custom  | Dynamic header/footer loading, active nav detection (must load last)       |
| `donation-receipts.js` | Custom  | CSV parsing, receipt generation, print/download for donation-receipts page |
| `quran-viewer.js`      | Custom  | PDF.js-based Quran page viewer with navigation controls                    |

## Deployment

- **URL:** https://igamec.org
- **Hosting:** Static file hosting (no server-side processing)
- **Organization:** GAMEC Inc — 501(c)(3) non-profit
- **Address:** 3420 13th St SE, Washington, DC 20032

## Maintenance

> **When adding or removing files:** Update the relevant file map table above (Page Inventory, CSS Modules, or JavaScript) so AI assistants can locate files accurately. Keep this file under 200 lines.
