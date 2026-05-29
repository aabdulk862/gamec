# GAMEC Website

**Organization:** Global Association of Muslim Eritrean Communities (GAMEC)  
**Type:** 501(c)(3) non-profit voluntary membership association  
**Domain:** https://igamec.org  
**Tech Stack:** Astro 5, React 19, TypeScript, Vite

---

## Quick Start

```bash
npm install        # Install dependencies
npm run dev        # Start dev server at localhost:4321
npm run build      # Build static site to dist/
npm run preview    # Preview production build locally
npm run test       # Run test suite (Vitest + fast-check)
```

**Requirements:** Node.js >= 18.17.1

---

## Project Structure

```
gamec/
├── public/                   # Static assets (copied verbatim to dist/)
│   ├── images/               # All site images
│   ├── assets/webfonts/      # Font Awesome woff2/ttf files
│   ├── manifest.json         # PWA manifest
│   └── robots.txt            # Search engine directives
├── src/
│   ├── pages/                # Route-generating pages (1 file = 1 URL)
│   │   ├── index.astro       # Homepage
│   │   ├── vision.astro      # Mission & Vision
│   │   ├── history.astro     # History
│   │   ├── leadership.astro  # Leadership Team
│   │   ├── contact.astro     # Contact Us
│   │   ├── programs.astro    # Programs Overview
│   │   ├── relief.astro      # GAMEC Charity
│   │   ├── sisters.astro     # GAMEC Sisters
│   │   ├── youth.astro       # GAMEC Youth
│   │   ├── seniors.astro     # GAMEC Seniors
│   │   ├── professionals.astro # GAMEC Professionals
│   │   ├── health.astro      # Health Services
│   │   ├── membership.astro  # Membership
│   │   ├── donate.astro      # Donations
│   │   ├── media.astro       # Media Gallery
│   │   ├── resources.astro   # Resources + Quran Viewer
│   │   ├── matrimonial.astro # Matrimonial Services
│   │   ├── donation-receipts.astro # Receipt Generator (noindex)
│   │   ├── sign-in.astro     # Reserved for Clerk auth
│   │   └── sign-up.astro     # Reserved for Clerk auth
│   ├── layouts/
│   │   └── BaseLayout.astro  # Shared HTML shell (head, header, footer)
│   ├── components/
│   │   ├── Header.astro      # Site header with navigation
│   │   ├── Footer.astro      # Site footer (4-column layout)
│   │   ├── LivestreamCard.astro
│   │   ├── ProgramCard.astro
│   │   ├── ImpactStats.astro
│   │   ├── DonationMethods.astro
│   │   ├── CommunityGroupCard.astro
│   │   ├── react/            # React island components
│   │   │   └── QuranViewer.tsx
│   │   └── auth/             # Reserved for Clerk components
│   ├── styles/
│   │   ├── main.css          # Entry point (@imports 23 modules)
│   │   ├── media.css         # Additional media styles
│   │   ├── fontawesome-all.min.css
│   │   └── modules/          # 23 CSS module files
│   ├── scripts/              # Client-side JavaScript
│   │   ├── navigation.js     # Desktop dropdowns + mobile panel
│   │   ├── scroll-reveal.js  # IntersectionObserver animations
│   │   └── donation-receipts.js
│   ├── assets/images/        # Images processed by Astro (WebP optimization)
│   └── config.ts             # Shared typed site configuration
├── tests/                    # Vitest + fast-check test suite
├── files/                    # Content markdown files
├── astro.config.mjs          # Astro configuration
├── tsconfig.json             # TypeScript (extends astro/tsconfigs/strict)
├── package.json
└── ROADMAP.md                # Application roadmap (Phases 1-5)
```

---

## Architecture

### Static-First with React Islands

- **20 pages** rendered at build time as static HTML
- **Zero JavaScript** on content pages by default
- **React hydrates only** on the resources page (QuranViewer island)
- **View Transitions** for SPA-like navigation without SPA overhead

### Key Design Decisions

| Decision | Rationale |
|---|---|
| Astro 5 (static output) | Content-heavy nonprofit site; SEO and performance critical |
| React islands (`client:visible`) | Complex state only where needed (PDF viewer) |
| `.html` URL extensions preserved | No SEO damage from migration; existing backlinks work |
| Build-time header/footer | Eliminates layout shift and runtime fetch |
| CSS inlined (`inlineStylesheets: 'always'`) | Zero render-blocking CSS requests |
| jQuery eliminated | Navigation rewritten in vanilla JS |
| Progressive enhancement | Site works without JS; interactivity layers on top |

### Build Output

- 20 HTML files with `.html` extensions
- WebP images (quality 70-80) with content hashes
- Minified CSS inlined in each page
- JS only on pages with React islands
- Auto-generated `sitemap-index.xml`

---

## Adding a New Page

1. Create `src/pages/your-page.astro`
2. Import and wrap content with `BaseLayout`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
---
<BaseLayout
  title="Page Title | GAMEC"
  description="Page description for SEO."
  canonicalPath="/your-page.html"
  bodyClass="no-sidebar"
  dataPage="your-page"
>
  <div class="container">
    <h1>Your Page</h1>
    <!-- content -->
  </div>
</BaseLayout>
```

3. Add navigation link in `src/components/Header.astro` if needed
4. Run `npm run build` to verify

---

## CSS Architecture

23 modular CSS files imported in cascade order via `src/styles/main.css`. Uses CSS custom properties for theming (navy `#001f3f` + gold `#d4af37` palette).

Key modules: `_variables.css` (design tokens), `_reset.css` (base styles), `_site-structure.css` (header/footer/nav), `_responsive.css` (breakpoints).

See `.kiro/steering/css-design-system.md` for the full design system reference.

---

## Testing

```bash
npm run test       # Run all tests
```

- **Framework:** Vitest + fast-check (property-based testing)
- **132 tests passing** across 9 test suites
- Tests cover: SEO metadata, CSS modules, data attributes, file structure, JSDoc coverage

---

## Deployment

- **Output:** Static files in `dist/` (no server runtime needed)
- **Hosting:** Static file hosting (Netlify)
- **Build command:** `npm run build`
- **Publish directory:** `dist/`

---

## Future: Authentication

**Planned Provider:** [Clerk](https://clerk.com)

### Prerequisites Already in Place

| Prerequisite | Status |
|---|---|
| React integration (`@astrojs/react`) | ✅ Ready |
| Reserved routes (`/sign-in`, `/sign-up`) | ✅ Ready |
| Auth component directory (`src/components/auth/`) | ✅ Ready |

### Remaining Steps

1. Install `@clerk/astro`
2. Add `PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` to `.env`
3. Add Clerk middleware to `BaseLayout.astro`
4. Build auth components in `src/components/auth/`
5. Replace "Coming Soon" in sign-in/sign-up pages with Clerk UI

**No Clerk packages are installed** — intentionally deferred until authentication is actively needed.

---

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for the full 5-phase evolution plan:

1. ✅ **Static Platform Foundation** (complete)
2. ⏳ **Content & Community Engagement** (Content Collections, RSS, search)
3. ⏳ **Authentication & Member Portal** (Clerk, dashboards)
4. ⏳ **Backend Services** (Spring Boot APIs, PostgreSQL)
5. ⏳ **Mobile & Scale** (PWA, multi-chapter support)
