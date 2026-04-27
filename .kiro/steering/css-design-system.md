---
inclusion: fileMatch
fileMatchPattern: "assets/css/**"
---

# CSS Design System

## Color Palette (CSS Custom Properties)

All colors are defined as custom properties in `:root` (in `_variables.css` / the Variables section of `main.css`).

### Primary Colors — Navy

| Variable                | Value     | Usage                    |
| ----------------------- | --------- | ------------------------ |
| `--color-primary`       | `#001f3f` | Navy blue — brand color  |
| `--color-primary-hover` | `#002b55` | Button/link hover states |
| `--color-primary-dark`  | `#0a2342` | Dark navy accents        |

### Accent Colors — Gold & Green

| Variable                   | Value                      | Usage                       |
| -------------------------- | -------------------------- | --------------------------- |
| `--color-accent`           | `#d4af37`                  | Gold — crescent moon accent |
| `--color-accent-green`     | `#228b22`                  | Forest green                |
| `--color-accent-green-alt` | `#2e8b57`                  | Sea green variant           |
| `--color-accent-subtle`    | `rgba(212, 175, 55, 0.12)` | Subtle gold tint            |

### Neutral Colors

| Variable                     | Value     | Usage                    |
| ---------------------------- | --------- | ------------------------ |
| `--color-black`              | `#000000` | Pure black               |
| `--color-white`              | `#ffffff` | Pure white               |
| `--color-background`         | `#faf8f5` | Page background          |
| `--color-background-light`   | `#fdf9f3` | Light background variant |
| `--color-background-alt`     | `#f5efe6` | Alternate background     |
| `--color-background-gray`    | `#f5f5f5` | Gray background          |
| `--color-background-section` | `#f8f4ed` | Section background       |

### Border Colors

| Variable                | Value     | Usage             |
| ----------------------- | --------- | ----------------- |
| `--color-border`        | `#e0d9c9` | Default border    |
| `--color-border-alt`    | `#d9d0bd` | Alternate border  |
| `--color-border-dark`   | `#b0a68a` | Dark border       |
| `--color-border-darker` | `#8c7f5f` | Darker border     |
| `--color-border-light`  | `#eee8d9` | Light border      |
| `--color-border-nav`    | `#d4c9b0` | Navigation border |
| `--color-border-footer` | `#c0b59e` | Footer border     |

### Text Colors

| Variable                | Value     | Usage               |
| ----------------------- | --------- | ------------------- |
| `--color-text`          | `#001f3f` | Primary text (navy) |
| `--color-text-dark`     | `#0a2342` | Dark text           |
| `--color-text-gray`     | `#2c3e50` | Gray text           |
| `--color-text-medium`   | `#34495e` | Medium text         |
| `--color-text-light`    | `#4a4a4a` | Light text          |
| `--color-text-lighter`  | `#525252` | Lighter text        |
| `--color-text-lightest` | `#5a5a5a` | Lightest text       |
| `--color-text-link`     | `#006994` | Link color          |
| `--color-text-muted`    | `#555555` | Muted text          |
| `--color-text-footer`   | `#666666` | Footer text         |

### Form Colors

| Variable             | Value     | Usage              |
| -------------------- | --------- | ------------------ |
| `--color-form-focus` | `#d4af37` | Input focus border |

### Button Colors

| Variable                         | Value                      | Usage                         |
| -------------------------------- | -------------------------- | ----------------------------- |
| `--color-button-alt`             | `#e8e0d0`                  | Alt button background         |
| `--color-button-alt-hover`       | `#f0e8d8`                  | Alt button hover              |
| `--color-button-alt-active`      | `#e0d8c8`                  | Alt button active             |
| `--color-button-alt-rgba`        | `rgba(212, 175, 55, 0.08)` | Alt button transparent bg     |
| `--color-button-alt-hover-rgba`  | `rgba(212, 175, 55, 0.15)` | Alt button transparent hover  |
| `--color-button-alt-active-rgba` | `rgba(212, 175, 55, 0.25)` | Alt button transparent active |

### Widget Colors

| Variable                | Value     | Usage                  |
| ----------------------- | --------- | ---------------------- |
| `--color-widget-bg`     | `#001f3f` | Widget dark background |
| `--color-widget-hover`  | `#003366` | Widget hover state     |
| `--color-widget-active` | `#004080` | Widget active state    |
| `--color-widget-text`   | `#f3f3f3` | Widget text color      |

### Donation Section Colors

| Variable                              | Value     | Usage                    |
| ------------------------------------- | --------- | ------------------------ |
| `--color-donation-square`             | `#000000` | Square button background |
| `--color-donation-square-hover`       | `#3e4348` | Square button hover      |
| `--color-donation-paypal`             | `#002c8b` | PayPal button background |
| `--color-donation-paypal-hover`       | `#019be1` | PayPal button hover      |
| `--color-donation-zelle`              | `#6c1cd3` | Zelle section accent     |
| `--color-donation-zelle-button`       | `#228b22` | Zelle button background  |
| `--color-donation-zelle-button-hover` | `#006400` | Zelle button hover       |

### Table & Overlay Colors

| Variable                   | Value                   | Usage                  |
| -------------------------- | ----------------------- | ---------------------- |
| `--color-table-header`     | `#001f3f`               | Table header bg (navy) |
| `--color-transparent`      | `transparent`           | Transparent utility    |
| `--color-overlay-dark`     | `rgba(0, 0, 0, 0.04)`   | Dark overlay           |
| `--color-shadow`           | `rgba(0, 31, 63, 0.08)` | Default shadow         |
| `--color-shadow-light`     | `rgba(0, 31, 63, 0.04)` | Light shadow           |
| `--color-shadow-medium`    | `rgba(0, 31, 63, 0.12)` | Medium shadow          |
| `--color-shadow-dark`      | `rgba(0, 31, 63, 0.2)`  | Dark shadow            |
| `--color-shadow-darker`    | `rgba(0, 31, 63, 0.3)`  | Darker shadow          |
| `--color-dropotron-border` | `rgba(0, 0, 0, 0.08)`   | Dropdown border        |
| `--color-nav-bg`           | `rgba(0, 31, 63, 0.85)` | Nav overlay background |

### Design Tokens (Non-Color)

| Variable               | Value                                 | Usage              |
| ---------------------- | ------------------------------------- | ------------------ |
| `--font-heading`       | `"Playfair Display", Georgia, serif`  | Heading font stack |
| `--transition-default` | `all 0.3s ease`                       | Default transition |
| `--shadow-card`        | `0 2px 8px var(--color-shadow-light)` | Card shadow        |
| `--shadow-card-hover`  | `0 6px 16px var(--color-shadow)`      | Card hover shadow  |
| `--radius-card`        | `8px`                                 | Card border radius |

---

## Typography System

### Font Families

| Role     | Font                                    | Source                              |
| -------- | --------------------------------------- | ----------------------------------- |
| Body     | `"Roboto", sans-serif`                  | Google Fonts                        |
| Headings | `"Playfair Display", Georgia, serif`    | Google Fonts (via `--font-heading`) |
| Icons    | Font Awesome 5 (solid, regular, brands) | Local webfonts                      |

### Font Sizes

| Element     | Size     | Notes                        |
| ----------- | -------- | ---------------------------- |
| Base (body) | `1.02em` | ~16.3px                      |
| H1          | `2.25em` | Playfair Display, weight 700 |
| H2          | `2.25em` | Playfair Display, weight 700 |
| H3          | `1.35em` | Roboto, weight 700           |
| Buttons     | `1.1em`  | Large variant: `1.25em`      |
| Form inputs | `13pt`   | Explicit pt sizing           |
| Form labels | `0.8em`  | Weight 600                   |

### Line Heights

| Context     | Value    |
| ----------- | -------- |
| Body        | `1.75`   |
| Form inputs | `2.25em` |
| Form fields | `3em`    |

### Font Weights

| Weight | Name       | Usage                              |
| ------ | ---------- | ---------------------------------- |
| 400    | Regular    | Body text, Playfair Display normal |
| 500    | Medium     | —                                  |
| 600    | Semi-bold  | Labels, strong text, buttons       |
| 700    | Bold       | Headings, Playfair Display bold    |
| 800    | Extra-bold | Navigation links (desktop)         |

### Letter Spacing

- Body: `0.02em`

---

## Component Styles Overview

### Buttons

- Primary: Navy bg (`--color-primary`), white text, `8px` border-radius
- Hover: `--color-primary-hover` bg, elevated shadow
- Alt: Gold bg (`--color-accent`), dark navy text, 2px gold border
- Large variant: `1.25em` font, `0.7em 1.5em` padding
- Icon support: Font Awesome icon before text with `0.5em` right margin
- Transition: `background-color 0.25s ease-in-out, box-shadow 0.25s ease-in-out, transform 0.25s ease-in-out`
- Shadow: `0 2px 6px var(--color-shadow-light)`

### Forms

- Input line-height: `3em`, padding: `0 1em`
- Border: `1px solid var(--color-border)`, radius: `8px`
- Focus: border-color changes to `--color-form-focus` (gold)
- Textarea: min-height `9em`, padding `1em`
- Labels: weight 600, size `0.8em`, block display

### Tables

- Collapsed borders
- Header: `--color-table-header` (navy) background, white text
- Row borders: `1px solid #cecece`
- Cell padding: `0.5em 1em`

### Boxes

- Background: white
- Border-radius: `var(--radius-card)` (8px)
- Box-shadow: `var(--shadow-card)`
- Padding: `2em`
- Feature variant with image support

### Images & Gallery

- Border-radius: `8px`
- Display variants: inline-block, fit, featured, left, centered
- Gallery: flexbox layout with `2em` gap, `17em` width items

### Icons

- Font Awesome 5 integration (solid, regular, brands)
- Inline with text support via `.icon:before` pseudo-element

---

## Responsive Breakpoints

| Name    | Range           | Container Width | Font Size | Notes                    |
| ------- | --------------- | --------------- | --------- | ------------------------ |
| Default | > 1680px        | `1400px`        | `1.02em`  | Full desktop             |
| XLarge  | 1281px – 1680px | `1200px`        | `1.02em`  | Large desktop            |
| Large   | 981px – 1280px  | `960px`         | inherited | Reduced gutters (25px)   |
| Medium  | 737px – 980px   | `95%`           | inherited | Fluid container          |
| Small   | ≤ 736px         | `100%`          | inherited | Full-width, mobile-first |

Breakpoint definitions (used by `breakpoints.min.js`):

```js
xlarge: ["1281px", "1680px"];
large: ["981px", "1280px"];
medium: ["737px", "980px"];
small: [null, "736px"];
```

Grid gutter sizes scale down at each breakpoint. Mobile navigation panel activates at ≤980px.

---

## CSS Module Map

All modules live in `assets/css/modules/`. The entry-point `main.css` imports them via `@import` in cascade order.

| #   | Filename                | Category                                                              |
| --- | ----------------------- | --------------------------------------------------------------------- |
| 1   | `_imports-fonts.css`    | Font imports (Google Fonts: Roboto, Playfair Display)                 |
| 2   | `_variables.css`        | CSS custom properties — all `:root` color, spacing, typography tokens |
| 3   | `_reset.css`            | Reset and base element styles (box-sizing, body, preload)             |
| 4   | `_typography.css`       | Headings, paragraphs, lists, links, blockquotes, text utilities       |
| 5   | `_layout.css`           | 12-column flexbox grid, containers, gutters, row/col classes          |
| 6   | `_forms.css`            | Input fields, textareas, selects, form layout, login form             |
| 7   | `_buttons.css`          | Button variants (primary, alt, large, icon, signup)                   |
| 8   | `_tables.css`           | Table styling (header, rows, cells, collapsed borders)                |
| 9   | `_images-gallery.css`   | Image display variants, gallery flexbox grid                          |
| 10  | `_components.css`       | Boxes, icons, lists, widgets, common UI patterns                      |
| 11  | `_page-sections.css`    | Shared page section styles (banner, features, CTAs)                   |
| 12  | `_page-home.css`        | Homepage-specific styles (hero, feature boxes)                        |
| 13  | `_page-donate.css`      | Donation page (Square, PayPal, Zelle sections)                        |
| 14  | `_page-programs.css`    | Programs page card layout and sidebar                                 |
| 15  | `_page-membership.css`  | Membership page list and CTA styles                                   |
| 16  | `_page-media.css`       | Media gallery and video embed styles                                  |
| 17  | `_page-resources.css`   | Resources page section and link styles                                |
| 18  | `_page-matrimonial.css` | Matrimonial page styles (accordion, cards, CTA)                       |
| 19  | `_site-structure.css`   | Header, footer, nav, wrapper, panel layout                            |
| 20  | `_responsive.css`       | Responsive overrides for all breakpoints                              |
| 21  | `_animations.css`       | Transitions, scroll-reveal, preload state                             |
| 22  | `_livestream.css`       | Holy Cities livestream embed styles                                   |
| 23  | `_quran-viewer.css`     | Quran PDF viewer component styles                                     |

Import order in `main.css`:

```css
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

> **Note:** The modules directory and split files will be created by Task 5. Until then, all styles remain in the monolithic `main.css`. The module map above reflects the planned structure from the design document.
