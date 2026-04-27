# GAMEC — Unsplash Image Recommendations

Rules: no people, no Islamic/Eritrean/religious stock imagery. Objects, nature, textures only. Your own community photos stay as-is.

> Click a link → download "Regular" size → optimize at [squoosh.app](https://squoosh.app) → save to `/images`.

---

## index.html (Homepage)

**Current images:**

- Features: `asmara-mosque.jpg`, `event-room.jpg`, `jebena.png` — your own photos ✅ keep
- Livestream: `kaaba2.jpg`, `madinah.jpeg` — tied to the feature ✅ keep
- Quran CTA: `cover.png` — your own asset ✅ keep

**What's missing:**

1. Banner (`#banner-wrapper`) — text-only right now, no background image. This is the first thing visitors see.

   | Search                              | Mood                  | Link                                                                                             |
   | ----------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------ |
   | Warm golden sunrise over calm water | Hope, warmth, welcome | [unsplash.com/s/photos/golden-sunrise-water](https://unsplash.com/s/photos/golden-sunrise-water) |
   | Soft light breaking through clouds  | Uplifting, peaceful   | [unsplash.com/s/photos/sun-rays-clouds](https://unsplash.com/s/photos/sun-rays-clouds)           |

   Save as: `hero-banner.jpg` — use as CSS background with dark overlay on `#banner-wrapper`

2. "Our History" section — short text + button, no image. Fine as-is. ✅ skip

3. "Our Impact" section — stat numbers, no image. Fine as-is. ✅ skip

4. "Support Our Mission" (donate CTA) — text + button. Clean. ✅ skip

5. "Matrimonial Services" callout — text + 2 buttons. Clean. ✅ skip

6. "Community Groups" — icon buttons. Clean. ✅ skip

7. "Stay Connected" — social links. Clean. ✅ skip

**Summary for homepage: add 1 image (banner background). Everything else is fine.**

---

## vision.html (Mission & Vision)

**Current images:**

- "Who We Are" section: `kaaba1.jpg` — your own photo ✅ keep

**What's missing:**

1. "Our Priorities" section — 8-item bullet list, long, no visual break.

   | Search                          | Mood               | Link                                                                                       |
   | ------------------------------- | ------------------ | ------------------------------------------------------------------------------------------ |
   | Seedling growing from soil      | Growth, foundation | [unsplash.com/s/photos/seedling](https://unsplash.com/s/photos/seedling)                   |
   | Notebook and pen on wooden desk | Planning, purpose  | [unsplash.com/s/photos/notebook-pen-desk](https://unsplash.com/s/photos/notebook-pen-desk) |

   Save as: `vision-priorities.jpg` — place as side image next to the list

2. Mission/Vision cards — text cards. ✅ skip
3. Quote section — short. ✅ skip
4. Get Involved buttons — CTA row. ✅ skip

**Summary: add 1 image next to priorities list. Rest is fine.**

---

## history.html

**Current images:**

- `as-sahaba.jpg` next to Masjid As-Sahaba text — your own photo ✅ keep

**What's missing:**

1. "The First Hijra" + "A King's Protection" + "Legacy" — three long text sections back-to-back with zero images.

   | Search                           | Mood              | Link                                                                                               |
   | -------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------- |
   | Calm ocean horizon at dawn       | Journey, crossing | [unsplash.com/s/photos/ocean-horizon-dawn](https://unsplash.com/s/photos/ocean-horizon-dawn)       |
   | Coastline with warm golden light | Arrival, new land | [unsplash.com/s/photos/coastline-golden-hour](https://unsplash.com/s/photos/coastline-golden-hour) |

   Save as: `history-journey.jpg` — wide image between "The First Hijra" and "A King's Protection"

**Summary: add 1 landscape image to break up the long narrative.**

---

## leadership.html

**Current images:** none at all. Just text + 4 placeholder icon cards.

1. Page hero — needs one image for visual weight.

   | Search                             | Mood                  | Link                                                                                                   |
   | ---------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------ |
   | Empty conference table, warm light | Governance, structure | [unsplash.com/s/photos/conference-table-empty](https://unsplash.com/s/photos/conference-table-empty)   |
   | Wooden table with notebooks        | Organization          | [unsplash.com/s/photos/meeting-table-notebooks](https://unsplash.com/s/photos/meeting-table-notebooks) |

   Save as: `leadership-hero.jpg` — wide image below H1

**Summary: add 1 image. That's it.**

---

## contact.html

**Current images:** none. Page is short — 3 contact cards + a note.

**Verdict: skip. Page is functional and clean as-is.** ✅

---

## programs.html

**Current images:** none. 6 text-only program link cards + 3 initiative text blocks.

1. Page hero or one image per program card.

   **Option A — one hero image at top:**

   | Search                           | Mood              | Link                                                                                         |
   | -------------------------------- | ----------------- | -------------------------------------------------------------------------------------------- |
   | Colorful sticky notes on a board | Variety, planning | [unsplash.com/s/photos/sticky-notes-board](https://unsplash.com/s/photos/sticky-notes-board) |

   Save as: `programs-hero.jpg`

   **Option B — one small image per card (stronger):**

   | Card          | Search                   | Link                                                                                             |
   | ------------- | ------------------------ | ------------------------------------------------------------------------------------------------ |
   | Charity       | Cardboard donation boxes | [unsplash.com/s/photos/donation-box](https://unsplash.com/s/photos/donation-box)                 |
   | Sisters       | Warm tea cup on table    | [unsplash.com/s/photos/tea-cup-table](https://unsplash.com/s/photos/tea-cup-table)               |
   | Youth         | Soccer ball on grass     | [unsplash.com/s/photos/soccer-ball-grass](https://unsplash.com/s/photos/soccer-ball-grass)       |
   | Seniors       | Reading glasses on book  | [unsplash.com/s/photos/reading-glasses-book](https://unsplash.com/s/photos/reading-glasses-book) |
   | Professionals | Laptop + coffee on desk  | [unsplash.com/s/photos/laptop-and-coffee](https://unsplash.com/s/photos/laptop-and-coffee)       |
   | Health        | Stethoscope on surface   | [unsplash.com/s/photos/stethescope](https://unsplash.com/s/photos/stethescope)                   |

   All same aspect ratio (16:9), all same dimensions.

**Summary: pick Option A or B. Either way, max 1 image per card.**

---

## relief.html (Charity)

**Current images:** zero. Just headings + paragraphs + a bullet list.

1. Page hero:

   | Search                               | Mood              | Link                                                                           |
   | ------------------------------------ | ----------------- | ------------------------------------------------------------------------------ |
   | Cardboard boxes packed with supplies | Aid, giving       | [unsplash.com/s/photos/charity-box](https://unsplash.com/s/photos/charity-box) |
   | Grocery bags lined up                | Provision, relief | [unsplash.com/s/photos/food-bank](https://unsplash.com/s/photos/food-banks)    |

   Save as: `relief-hero.jpg` — wide image below H1

**Summary: add 1 image.**

---

## sisters.html

**Current images:**

- Hero: `lantern.jpg` — warm object shot, no people ✅ keep

**Rest of page:** 4 sections with icon headers + bullet lists. No additional images needed. ✅

**Summary: no changes needed.**

---

## youth.html

**Current images:**

- Hero: `soccer-ball-grass.jpg` — object on grass, no people ✅ keep

**Rest of page:** 8 program sections with icon headers + lists + a quote. No additional images needed. ✅

**Summary: no changes needed.**

---

## seniors.html

**Current images:** zero. Just one H1 + one paragraph. The emptiest page on the site.

1. Page hero:

   | Search                                      | Mood                  | Link                                                                                             |
   | ------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------ |
   | Reading glasses on an open book, warm light | Wisdom, quiet dignity | [unsplash.com/s/photos/reading-glasses-book](https://unsplash.com/s/photos/reading-glasses-book) |
   | Warm tea by a window, soft light            | Comfort, care         | [unsplash.com/s/photos/tea-window-light](https://unsplash.com/s/photos/tea-window-light)         |
   | Garden path with soft morning light         | Peaceful journey      | [unsplash.com/s/photos/garden-pathway](https://unsplash.com/s/photos/garden-pathway)             |

   Save as: `seniors-hero.jpg` — wide image below H1. Pick ONE.

**Summary: add 1 image. This page needs it the most.**

---

## professionals.html

**Current images:**

- Hero: `city.jpg` — city skyline, no people ✅ acceptable

**Optional swap:**

| Search                                     | Mood                  | Link                                                                       |
| ------------------------------------------ | --------------------- | -------------------------------------------------------------------------- |
| Clean desk with laptop + notebook + coffee | Professional, focused | [unsplash.com/s/photos/workspace](https://unsplash.com/s/photos/workspace) |

Save as: `professionals-hero.jpg` — only if you want something warmer than the skyline.

**Summary: optional swap. Current image works.**

---

## health.html

**Current images:** zero. H1 + paragraph + bullet list + "Get Involved" text.

1. Page hero:

   | Search                       | Mood              | Link                                                                               |
   | ---------------------------- | ----------------- | ---------------------------------------------------------------------------------- |
   | Stethoscope on clean surface | Healthcare, trust | [unsplash.com/s/photos/stethescope](https://unsplash.com/s/photos/stethescope)     |
   | First aid kit                | Preparedness      | [unsplash.com/s/photos/first-aid-kit](https://unsplash.com/s/photos/first-aid-kit) |

   Save as: `health-hero.jpg` — wide image below H1

**Summary: add 1 image.**

---

## membership.html

**Current images:** zero. Intro paragraph + 3 benefit icon cards + FAQ accordion + CTA buttons.

1. Between intro and benefits grid:

   | Search                         | Mood                | Link                                                                                   |
   | ------------------------------ | ------------------- | -------------------------------------------------------------------------------------- |
   | Open door with warm light      | Welcome, invitation | [unsplash.com/s/photos/open-door-light](https://unsplash.com/s/photos/open-door-light) |
   | Puzzle pieces fitting together | Unity, belonging    | [unsplash.com/s/photos/puzzle-pieces](https://unsplash.com/s/photos/puzzle-pieces)     |

   Save as: `membership-hero.jpg`

**Summary: add 1 image between intro and benefits. Optional — page works without it too.**

---

## donate.html

**Current images:** zero. Trust badge + 3 payment method sections.

**Verdict: skip. Donate pages should stay clean and action-focused.** ✅

---

## matrimonial.html

**Current images:** zero. Very long page — intro, 4 purpose cards, 3 accordion sections, closing CTA.

1. Near the top, after the intro blockquote:

   | Search                                | Mood                  | Link                                                                                     |
   | ------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------- |
   | Two rings on soft fabric              | Partnership, marriage | [unsplash.com/s/photos/wedding-rings](https://unsplash.com/s/photos/wedding-rings)       |
   | Simple flower arrangement, warm tones | Celebration           | [unsplash.com/s/photos/wedding-bouquets](https://unsplash.com/s/photos/wedding-bouquets) |

   Save as: `matrimonial-hero.jpg` — one image only, near the top.

**Summary: add 1 image. Don't add more even though the page is long — the accordion sections keep it structured.**

---

## media.html

**Current images:** `kaaba2.jpg`, `madinah.jpeg`, `logo-bg.png`, `asmara-mosque.jpg`, `as-sahaba.jpg`, `event-room.jpg`, `jebena.png`, 4x `awate-library` photos — all your own. ✅

**Verdict: don't add stock here. This is your authentic gallery.** ✅

---

## resources.html

**Current images:** Quran viewer (canvas-based) + `cover.png` on homepage CTA.

**Verdict: skip. The Quran viewer is already visual.** ✅

---

## Priority Order

| #   | Page                           | What to Add              | Urgency                        |
| --- | ------------------------------ | ------------------------ | ------------------------------ |
| 1   | seniors.html                   | 1 hero image             | High — completely empty        |
| 2   | relief.html                    | 1 hero image             | High — no visuals at all       |
| 3   | health.html                    | 1 hero image             | High — same issue              |
| 4   | index.html                     | 1 banner background      | High — first impression        |
| 5   | matrimonial.html               | 1 accent image           | Medium — long text wall        |
| 6   | programs.html                  | hero or card images      | Medium — all text              |
| 7   | leadership.html                | 1 hero image             | Medium — sparse                |
| 8   | history.html                   | 1 landscape break        | Low — already has mosque photo |
| 9   | membership.html                | 1 welcome image          | Low — works without it         |
| 10  | vision.html                    | 1 accent near priorities | Low — already has kaaba photo  |
| —   | professionals.html             | optional swap            | Optional                       |
| —   | contact/donate/media/resources | nothing                  | Skip ✅                        |

---

## Technical Notes

- Aspect ratio: 16:9 for all hero/banner images, 3:2 for cards
- Max file size: 200KB after optimization
- Format: `.jpg` (or `.webp` for modern browsers)
- Always add `loading="lazy"` for images below the fold
- Alt text: describe the object/scene, not the page context

_All images from [Unsplash](https://unsplash.com) — free under the [Unsplash License](https://unsplash.com/license)._
