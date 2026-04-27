---
inclusion: fileMatch
fileMatchPattern: "*.html"
---

# Image Inventory

> **Maintenance:** When adding a new image to `images/`, add a row to the appropriate table below with filename, description, format, and page usage. When removing an image, delete its row and verify no HTML pages still reference it. Keep descriptions specific to GAMEC context so AI assistants can select the correct image for new content.

## Site Identity & PWA Icons

| Filename                     | Description                                                               | Format      | Used In                                                 |
| ---------------------------- | ------------------------------------------------------------------------- | ----------- | ------------------------------------------------------- |
| `favicon.ico`                | Favicon ICO format                                                        | ICO         | All pages (`<link rel="icon">` in `<head>`)             |
| `favicon.png`                | Favicon PNG format                                                        | PNG 32×32   | All pages (`<link rel="icon">` in `<head>`)             |
| `apple-touch-icon.png`       | Apple touch icon for iOS home screen                                      | PNG         | All pages (`<link rel="apple-touch-icon">` in `<head>`) |
| `android-chrome-192x192.png` | PWA icon 192px                                                            | PNG 192×192 | `manifest.json`                                         |
| `android-chrome-512x512.png` | PWA icon 512px                                                            | PNG 512×512 | `manifest.json`                                         |
| `logo-bg.png`                | GAMEC logo with background                                                | PNG         | All pages (OG image and Twitter Card in `<head>`)       |
| `logo-circle.png`            | Circular GAMEC logo                                                       | PNG         | `header.html` (site header logo)                        |
| `cover.png`                  | Open Graph / social sharing cover image; also used as Quran CTA thumbnail | PNG         | `index.html` (Quran CTA section)                        |

## Hero & Page Banner Images

| Filename                | Description                                              | Format | Used In                                            |
| ----------------------- | -------------------------------------------------------- | ------ | -------------------------------------------------- |
| `hero-banner.jpg`       | Homepage hero banner — mosque/community scene            | JPG    | `index.html` (CSS background on `#banner-wrapper`) |
| `programs-hero.jpg`     | Programs page hero — colorful planning notes             | JPG    | `programs.html`                                    |
| `relief-hero.jpg`       | GAMEC Charity page hero — warm sunlight through trees    | JPG    | `relief.html`                                      |
| `seniors-hero.jpg`      | Seniors page hero — reading glasses on open book         | JPG    | `seniors.html`                                     |
| `health-hero.jpg`       | Health Services page hero — stethoscope on clean surface | JPG    | `health.html`                                      |
| `membership-hero.jpg`   | Membership page hero — warm light representing community | JPG    | `membership.html`                                  |
| `leadership-hero.jpg`   | Leadership page hero — modern conference room            | JPG    | `leadership.html`                                  |
| `matrimonial-hero.jpg`  | Matrimonial page hero — wedding rings on soft fabric     | JPG    | `matrimonial.html`                                 |
| `vision-priorities.jpg` | Vision page priorities accent — green seedling in soil   | JPG    | `vision.html` (priorities section)                 |
| `history-journey.jpg`   | History page journey image                               | JPG    | Not currently referenced in HTML                   |

## Cultural & Religious Images

| Filename            | Description                                                          | Format | Used In                                             |
| ------------------- | -------------------------------------------------------------------- | ------ | --------------------------------------------------- |
| `as-sahaba.jpg`     | The Sahaba Mosque (Masjid As-Sahaba), Massawa, Eritrea — 7th century | JPG    | `history.html`                                      |
| `asmara-mosque.jpg` | Khulafa al-Rashidun Mosque, Asmara, Eritrea                          | JPG    | `index.html` (features section)                     |
| `massawa.jpg`       | Port city of Massawa, Eritrea — coastal view                         | JPG    | `history.html`                                      |
| `kaaba1.jpg`        | The Holy Kaaba — symbol of Islamic unity                             | JPG    | `vision.html` (Who We Are section)                  |
| `kaaba2.jpg`        | The Holy Kaaba — Makkah livestream thumbnail                         | JPG    | `index.html`, `media.html` (livestream cards)       |
| `madinah.jpeg`      | The Prophet's Mosque, Madinah — livestream thumbnail                 | JPEG   | `index.html`, `media.html` (livestream cards)       |
| `mecca.png`         | Mecca/Kaaba illustration                                             | PNG    | Not currently referenced in HTML                    |
| `quran.png`         | Quran illustration                                                   | PNG    | Not currently referenced in HTML                    |
| `lantern.jpg`       | Islamic lantern — warm spiritual glow                                | JPG    | `sisters.html` (hero image)                         |
| `jebena.png`        | Traditional Eritrean coffee pot (jebena)                             | PNG    | `index.html` (features section — Get Involved card) |

## Community & Event Photos

| Filename                | Description                                                       | Format | Used In                                         |
| ----------------------- | ----------------------------------------------------------------- | ------ | ----------------------------------------------- |
| `event-room.jpg`        | GAMEC community event room                                        | JPG    | `index.html` (features section — Programs card) |
| `city.jpg`              | City skyline — professional network                               | JPG    | `professionals.html` (hero image)               |
| `awate-library1.jpg`    | Awate Library — Sister's Vocational Class, Cairo, Egypt (photo 1) | JPG    | `media.html` (gallery)                          |
| `awate-library2.jpg`    | Awate Library — Computer Class, Cairo, Egypt (photo 2)            | JPG    | `media.html` (gallery)                          |
| `awate-library3.jpg`    | Awate Library — Cairo, Egypt (photo 3)                            | JPG    | `media.html` (gallery)                          |
| `awate-library4.png`    | Awate Library — Cairo, Egypt (photo 4)                            | PNG    | `media.html` (gallery)                          |
| `soccer-ball-grass.jpg` | Soccer ball on grass field                                        | JPG    | `youth.html` (hero image)                       |

## Sports Icons

| Filename                | Description                     | Format | Used In                          |
| ----------------------- | ------------------------------- | ------ | -------------------------------- |
| `american-football.png` | American football icon (raster) | PNG    | Not currently referenced in HTML |
| `american-football.svg` | American football icon (vector) | SVG    | Not currently referenced in HTML |
| `basketball.png`        | Basketball icon                 | PNG    | Not currently referenced in HTML |
| `soccer.png`            | Soccer ball icon                | PNG    | Not currently referenced in HTML |

## Decorative & Legacy

| Filename     | Description                  | Format | Used In                                 |
| ------------ | ---------------------------- | ------ | --------------------------------------- |
| `header.png` | Header background/decoration | PNG    | Not currently referenced in HTML or CSS |
| `pic04.jpg`  | Generic photo 4 (legacy)     | JPG    | Not currently referenced in HTML        |
| `pic05.jpg`  | Generic photo 5 (legacy)     | JPG    | Not currently referenced in HTML        |
| `pic06.jpg`  | Generic photo 6 (legacy)     | JPG    | Not currently referenced in HTML        |
| `pic07.jpg`  | Generic photo 7 (legacy)     | JPG    | Not currently referenced in HTML        |

## Image Recommendations

The following recommendations come from `files/image-recommendations.md`. Use these when adding visuals to pages that currently lack them.

### Priority Order (pages most in need of images)

1. **seniors.html** — most image-starved page, needs emotional pull. Suggested: `seniors-hero.jpg` ✅ (already added)
2. **relief.html** — charity page needs visuals. Suggested: `relief-hero.jpg` ✅ (already added)
3. **health.html** — same issue. Suggested: `health-hero.jpg` ✅ (already added)
4. **programs.html** — card images would improve this page. Suggested: `programs-hero.jpg` ✅ (already added)
5. **sisters.html** — consider swapping `lantern.jpg` for a people-focused image. Suggested filename: `sisters-hero.jpg`
6. **youth.html** — consider swapping `soccer-ball-grass.jpg` for active youth photo. Suggested filename: `youth-hero.jpg`
7. **membership.html** — one community image above benefits. Suggested: `membership-hero.jpg` ✅ (already added)
8. **leadership.html** — one hero image for trust. Suggested: `leadership-hero.jpg` ✅ (already added)
9. **history.html** — one image to break up the narrative. Suggested filename: `history-hijra.jpg`
10. **matrimonial.html** — one elegant accent image. Suggested: `matrimonial-hero.jpg` ✅ (already added)

### Suggested Future Images (not yet in `images/`)

| Suggested Filename       | Description                                      | Target Page          | Target Section                                      |
| ------------------------ | ------------------------------------------------ | -------------------- | --------------------------------------------------- |
| `sisters-hero.jpg`       | Women in hijab studying or in conversation       | `sisters.html`       | Hero (replace `lantern.jpg`)                        |
| `youth-hero.jpg`         | Young people playing soccer or in a huddle       | `youth.html`         | Hero (replace `soccer-ball-grass.jpg`)              |
| `history-hijra.jpg`      | Red Sea coastline or ancient Islamic calligraphy | `history.html`       | Between "The First Hijra" and "A King's Protection" |
| `matrimonial-accent.jpg` | Warm Islamic geometric pattern or lantern        | `index.html`         | Matrimonial Services callout                        |
| `vision-community.jpg`   | Community gathering or hands joined              | `vision.html`        | Priorities section (side image)                     |
| `contact-dc.jpg`         | Washington DC skyline or landmark                | `contact.html`       | Optional banner below H1                            |
| `professionals-hero.jpg` | Professionals in a meeting or networking         | `professionals.html` | Hero (replace `city.jpg`)                           |

### Global Image Rules

- Max 1 image per section
- Consistent aspect ratio: 16:9 for heroes, 3:2 for cards
- Optimize to under 200KB each (use [squoosh.app](https://squoosh.app))
- Format: `.jpg` for photos, `.webp` for modern optimization
- Naming: descriptive, kebab-case (e.g., `sisters-hero.jpg`, `relief-hero.jpg`)
- Always add descriptive `alt` text specific to GAMEC context
- Add `loading="lazy"` to all images below the fold
- Source: [Unsplash](https://unsplash.com) — free for commercial use, no attribution required
