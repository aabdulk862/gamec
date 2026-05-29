# GAMEC Application Roadmap

## Vision

Evolve GAMEC from a static community website into a full-service digital platform — while keeping the site fast, accessible, and maintainable at every stage.

---

## Phase 1: Static Platform Foundation ✅ (Complete)

**Goal:** Modern static site with component architecture, optimized performance, and future-ready structure.

| Deliverable | Status |
|---|---|
| Astro 5 migration (20 pages) | ✅ |
| Component-based architecture (Header, Footer, reusable cards) | ✅ |
| React island — QuranViewer with PDF.js | ✅ |
| Build-time image optimization (WebP) | ✅ |
| Critical CSS inlining | ✅ |
| SEO: sitemap, robots.txt, JSON-LD structured data | ✅ |
| WAI-ARIA accessible navigation | ✅ |
| View Transitions (SPA-like navigation) | ✅ |
| Shared typed site config | ✅ |
| Clerk auth preparation (reserved routes, directory) | ✅ |
| jQuery eliminated, zero-JS on static pages | ✅ |

**Tech:** Astro 5, React 19, TypeScript, Vite, Vitest

---

## Phase 2: Content & Community Engagement

**Goal:** Enable recurring content publishing and community interaction without backend infrastructure.

### 2A — Content Collections & Publishing

| Feature | Approach | Astro Benefit |
|---|---|---|
| Community announcements | `src/content/announcements/` with Markdown | Auto-generated pages, typed schemas |
| Event listings (upcoming/past) | `src/content/events/` with date filtering | Build-time sorting, archive pages |
| Khutba summaries | `src/content/khutbas/` | Searchable, categorized |
| RSS feed | `@astrojs/rss` integration | Auto-generated from collections |
| Newsletter archive | MDX pages with rich formatting | Non-dev contributors can write content |

### 2B — Enhanced UX

| Feature | Approach |
|---|---|
| Pagefind static search | Build-time index across all content |
| Responsive `srcset` images | Multiple sizes per viewport |
| Prefetch on hover | `prefetch: true` in Astro config |
| Dark mode toggle | CSS custom properties + localStorage |
| Prayer times widget | React island (`client:visible`) with API |

### 2C — Internationalization (i18n)

| Feature | Approach |
|---|---|
| Arabic content support | Astro i18n routing (`/ar/`) |
| RTL layout support | CSS logical properties |
| Tigrinya content (future) | Same i18n infrastructure |

**Tech additions:** MDX, @astrojs/rss, Pagefind, Astro i18n

---

## Phase 3: Authentication & Member Portal

**Goal:** Add identity, protected pages, and personalized member experiences.

### 3A — Clerk Integration

| Feature | Approach |
|---|---|
| Sign in / Sign up | Clerk React components in reserved routes |
| Session management | Clerk middleware for route protection |
| User profile | React island (`client:load`) |
| Role-based access | Clerk roles (member, board, admin) |
| Auth-aware navigation | Server Islands for personalized header |

### 3B — Member Dashboard

| Feature | React Island | Hydration |
|---|---|---|
| Membership status & renewal | `<MemberDashboard />` | `client:load` |
| Event RSVP management | `<EventManager />` | `client:visible` |
| Donation history | `<DonationHistory />` | `client:visible` |
| Profile settings | `<ProfileSettings />` | `client:load` |
| Announcements (personalized) | Server Island | Server-rendered |

### 3C — Community Features

| Feature | Approach |
|---|---|
| Member directory (opt-in) | Protected page with search/filter island |
| Matrimonial matching portal | Protected React island with form wizard |
| Volunteer sign-up | React island with Clerk-linked forms |

**Tech additions:** @clerk/astro, Astro middleware, Server Islands

---

## Phase 4: Backend Services & Platform APIs

**Goal:** Add server-side business logic for membership, events, donations, and communications.

### 4A — API Layer (Spring Boot)

| Service | Endpoints | Purpose |
|---|---|---|
| Membership API | CRUD members, renewals, status | Membership lifecycle |
| Events API | CRUD events, RSVPs, attendance | Event management |
| Donations API | Record donations, receipts, campaigns | Financial tracking |
| Communications API | Email templates, notifications | Member outreach |
| Content API | Headless CMS endpoints | Dynamic content delivery |

### 4B — Database & Infrastructure

| Component | Technology | Purpose |
|---|---|---|
| Primary database | PostgreSQL | Members, events, donations |
| Cache layer | Redis | Session data, rate limiting |
| File storage | Cloudflare R2 | Documents, receipts, media |
| Email service | SendGrid / Resend | Transactional + marketing |
| Hosting | Netlify (frontend) + Railway/Fly.io (API) | Separated concerns |

### 4C — Advanced Features

| Feature | Approach |
|---|---|
| Recurring donations | Stripe integration via API |
| Automated receipts | Spring Boot scheduled jobs + PDF generation |
| Event reminders | Notification service + email |
| Membership renewal reminders | Cron jobs + email templates |
| Admin dashboard | Protected Astro page with React islands |
| Analytics dashboard | Plausible Analytics (privacy-first) |

**Tech additions:** Spring Boot, PostgreSQL, Redis, Stripe, SendGrid

---

## Phase 5: Mobile & Scale

**Goal:** Extend reach with mobile experience and handle organizational growth.

| Feature | Approach |
|---|---|
| PWA enhancements | Service worker, offline support, push notifications |
| Mobile app (if needed) | React Native sharing components with web islands |
| Multi-chapter support | Tenant-aware API, chapter-specific content |
| Kafka event streaming | Async processing for notifications, analytics |
| CDN optimization | Edge caching, regional deployments |

---

## Architecture Evolution

```
Phase 1 (Now)          Phase 3               Phase 4+
─────────────          ───────               ────────
Astro Static    →    Astro + Clerk    →    Astro + Clerk + Spring Boot
     │                    │                        │
  20 pages           Protected pages         Full platform
  1 React island     Member dashboard        APIs + Database
  Zero JS default    Server Islands          Event system
  Netlify            Netlify                  Netlify + Railway
```

## Guiding Principles

1. **Ship static first** — every feature starts as static HTML, adds interactivity only where needed
2. **Progressive enhancement** — site works without JS, gets better with it
3. **No premature complexity** — don't build Phase 4 infrastructure until Phase 3 features demand it
4. **Accessibility always** — WCAG 2.1 AA compliance at every phase
5. **Performance budget** — LCP < 2.5s, CLS < 0.1, zero JS on content pages
6. **Data privacy** — client-side processing where possible, minimal data collection
7. **Community-first** — features prioritized by member impact, not technical novelty
