/**
 * SEO Meta Property Tests
 * Feature: seo-improvement
 *
 * Property-based tests for all 15 correctness properties from the design document.
 * Uses vitest + fast-check, reading HTML files from disk.
 */
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { readFileSync } from "fs";
import { resolve } from "path";

const ALL_PAGES = [
  "index.html", "vision.html", "history.html", "leadership.html",
  "contact.html", "programs.html", "membership.html", "donate.html",
  "resources.html", "media.html", "relief.html", "sisters.html",
  "youth.html", "seniors.html", "professionals.html", "health.html",
  "matrimonial.html",
];
const INNER_PAGES = ALL_PAGES.filter((p) => p !== "index.html");

/** Read an HTML file and return its content as a string. */
function readPage(page) {
  return readFileSync(resolve(page), "utf-8");
}

/** Read sitemap.xml content. */
function readSitemap() {
  return readFileSync(resolve("sitemap.xml"), "utf-8");
}

/**
 * Expected canonical URL for a given page filename.
 */
function expectedCanonical(page) {
  return page === "index.html"
    ? "https://igamec.org/"
    : `https://igamec.org/${page}`;
}

// ─── Property 1 ──────────────────────────────────────────────────────────────
describe("Property 1: Every page declares English language", () => {
  /** **Validates: Requirements 1.1** */
  it("property: <html> element has lang=\"en\"", () => {
    fc.assert(
      fc.property(fc.constantFrom(...ALL_PAGES), (page) => {
        const html = readPage(page);
        expect(html).toMatch(/<html[^>]*\slang=["']en["']/i);
      }),
      { numRuns: 100 },
    );
  });
});


// ─── Property 2 ──────────────────────────────────────────────────────────────
describe("Property 2: Every page has correctly formatted canonical URL", () => {
  /** **Validates: Requirements 2.1, 2.2, 2.3** */
  it("property: <link rel=\"canonical\"> has correct href", () => {
    fc.assert(
      fc.property(fc.constantFrom(...ALL_PAGES), (page) => {
        const html = readPage(page);
        const match = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
        expect(match, `Missing canonical link in ${page}`).not.toBeNull();
        expect(match[1]).toBe(expectedCanonical(page));
      }),
      { numRuns: 100 },
    );
  });
});

// ─── Property 3 ──────────────────────────────────────────────────────────────
describe("Property 3: Social meta title tags match page title", () => {
  /** **Validates: Requirements 3.1, 4.2** */
  it("property: og:title and twitter:title match <title>", () => {
    fc.assert(
      fc.property(fc.constantFrom(...ALL_PAGES), (page) => {
        const html = readPage(page);
        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        expect(titleMatch, `Missing <title> in ${page}`).not.toBeNull();
        const title = titleMatch[1].trim();

        const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
        expect(ogTitle, `Missing og:title in ${page}`).not.toBeNull();
        expect(ogTitle[1].trim()).toBe(title);

        const twTitle = html.match(/<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']+)["']/i);
        expect(twTitle, `Missing twitter:title in ${page}`).not.toBeNull();
        expect(twTitle[1].trim()).toBe(title);
      }),
      { numRuns: 100 },
    );
  });
});

// ─── Property 4 ──────────────────────────────────────────────────────────────
describe("Property 4: Social meta description tags match page meta description", () => {
  /** **Validates: Requirements 3.2, 4.3** */
  it("property: og:description and twitter:description match <meta name=\"description\">", () => {
    fc.assert(
      fc.property(fc.constantFrom(...ALL_PAGES), (page) => {
        const html = readPage(page);
        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
        expect(descMatch, `Missing meta description in ${page}`).not.toBeNull();
        const desc = descMatch[1].trim();

        const ogDesc = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
        expect(ogDesc, `Missing og:description in ${page}`).not.toBeNull();
        expect(ogDesc[1].trim()).toBe(desc);

        const twDesc = html.match(/<meta[^>]*name=["']twitter:description["'][^>]*content=["']([^"']+)["']/i);
        expect(twDesc, `Missing twitter:description in ${page}`).not.toBeNull();
        expect(twDesc[1].trim()).toBe(desc);
      }),
      { numRuns: 100 },
    );
  });
});


// ─── Property 5 ──────────────────────────────────────────────────────────────
describe("Property 5: Social meta image tags reference GAMEC logo", () => {
  /** **Validates: Requirements 3.5, 4.4** */
  it("property: og:image and twitter:image = https://igamec.org/images/logo-bg.png", () => {
    const LOGO_URL = "https://igamec.org/images/logo-bg.png";
    fc.assert(
      fc.property(fc.constantFrom(...ALL_PAGES), (page) => {
        const html = readPage(page);

        const ogImage = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
        expect(ogImage, `Missing og:image in ${page}`).not.toBeNull();
        expect(ogImage[1]).toBe(LOGO_URL);

        const twImage = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
        expect(twImage, `Missing twitter:image in ${page}`).not.toBeNull();
        expect(twImage[1]).toBe(LOGO_URL);
      }),
      { numRuns: 100 },
    );
  });
});

// ─── Property 6 ──────────────────────────────────────────────────────────────
describe("Property 6: Every page has all required static OG and Twitter Card tags", () => {
  /** **Validates: Requirements 3.3, 3.4, 3.6, 3.7, 4.1** */
  it("property: og:url matches canonical, og:type=website, og:site_name=GAMEC, og:locale=en_US, twitter:card=summary", () => {
    fc.assert(
      fc.property(fc.constantFrom(...ALL_PAGES), (page) => {
        const html = readPage(page);
        const canonical = expectedCanonical(page);

        // og:url matches canonical
        const ogUrl = html.match(/<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']+)["']/i);
        expect(ogUrl, `Missing og:url in ${page}`).not.toBeNull();
        expect(ogUrl[1]).toBe(canonical);

        // og:type = website
        const ogType = html.match(/<meta[^>]*property=["']og:type["'][^>]*content=["']([^"']+)["']/i);
        expect(ogType, `Missing og:type in ${page}`).not.toBeNull();
        expect(ogType[1]).toBe("website");

        // og:site_name = GAMEC
        const ogSiteName = html.match(/<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i);
        expect(ogSiteName, `Missing og:site_name in ${page}`).not.toBeNull();
        expect(ogSiteName[1]).toBe("GAMEC");

        // og:locale = en_US
        const ogLocale = html.match(/<meta[^>]*property=["']og:locale["'][^>]*content=["']([^"']+)["']/i);
        expect(ogLocale, `Missing og:locale in ${page}`).not.toBeNull();
        expect(ogLocale[1]).toBe("en_US");

        // twitter:card = summary
        const twCard = html.match(/<meta[^>]*name=["']twitter:card["'][^>]*content=["']([^"']+)["']/i);
        expect(twCard, `Missing twitter:card in ${page}`).not.toBeNull();
        expect(twCard[1]).toBe("summary");
      }),
      { numRuns: 100 },
    );
  });
});


// ─── Property 7 ──────────────────────────────────────────────────────────────
describe("Property 7: Every inner page has valid BreadcrumbList", () => {
  /** **Validates: Requirements 6.1, 6.2, 6.3, 6.4** */

  // Parent section mapping from the design document
  const PARENT_MAP = {
    "vision.html": "About Us",
    "history.html": "About Us",
    "leadership.html": "About Us",
    "contact.html": "About Us",
    "relief.html": "Programs",
    "sisters.html": "Programs",
    "youth.html": "Programs",
    "seniors.html": "Programs",
    "professionals.html": "Programs",
    "health.html": "Programs",
    "matrimonial.html": "Programs",
    // Top-level pages (no parent): programs, membership, media, resources, donate
  };

  it("property: JSON-LD BreadcrumbList has Home at position 1 and correct final item", () => {
    fc.assert(
      fc.property(fc.constantFrom(...INNER_PAGES), (page) => {
        const html = readPage(page);

        // Extract JSON-LD blocks
        const jsonLdBlocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
        const breadcrumb = jsonLdBlocks
          .map((m) => JSON.parse(m[1]))
          .find((obj) => obj["@type"] === "BreadcrumbList");

        expect(breadcrumb, `Missing BreadcrumbList JSON-LD in ${page}`).toBeDefined();

        const items = breadcrumb.itemListElement;
        expect(items.length).toBeGreaterThanOrEqual(2);

        // Position 1 must be Home
        expect(items[0].position).toBe(1);
        expect(items[0].name).toBe("Home");
        expect(items[0].item).toBe("https://igamec.org/");

        // Final item must reference the current page URL
        const lastItem = items[items.length - 1];
        expect(lastItem.item).toBe(`https://igamec.org/${page}`);

        // If page has a parent section, check intermediate breadcrumb
        const parent = PARENT_MAP[page];
        if (parent) {
          expect(items.length).toBeGreaterThanOrEqual(3);
          expect(items[1].name).toBe(parent);
        }

        // Positions must be sequential
        items.forEach((item, idx) => {
          expect(item.position).toBe(idx + 1);
        });
      }),
      { numRuns: 100 },
    );
  });
});

// ─── Property 8 ──────────────────────────────────────────────────────────────
describe("Property 8: Every page has exactly one h1 and no skipped heading levels", () => {
  /** **Validates: Requirements 8.1, 8.2, 8.3** */
  it("property: exactly one <h1> and heading levels do not skip", () => {
    fc.assert(
      fc.property(fc.constantFrom(...ALL_PAGES), (page) => {
        const html = readPage(page);

        // Count h1 elements
        const h1Matches = html.match(/<h1[\s>]/gi) || [];
        expect(h1Matches.length, `Expected exactly one <h1> in ${page}`).toBe(1);

        // Extract all heading levels in order
        const headings = [...html.matchAll(/<h([1-6])[\s>]/gi)].map((m) =>
          parseInt(m[1], 10),
        );

        // Check no skipped levels: for each heading, all lower levels must have appeared before
        let maxSeen = 0;
        for (const level of headings) {
          if (level > maxSeen + 1 && maxSeen > 0) {
            expect.fail(
              `Skipped heading level in ${page}: h${level} after h${maxSeen}`,
            );
          }
          if (level > maxSeen) maxSeen = level;
        }
      }),
      { numRuns: 100 },
    );
  });
});


// ─── Property 9 ──────────────────────────────────────────────────────────────
describe("Property 9: Every image has non-empty alt attribute", () => {
  /** **Validates: Requirements 9.1** */
  it("property: all <img> elements have non-empty alt (unless decorative)", () => {
    fc.assert(
      fc.property(fc.constantFrom(...ALL_PAGES), (page) => {
        const html = readPage(page);
        const imgTags = [...html.matchAll(/<img\s[^>]*>/gi)];

        for (const imgMatch of imgTags) {
          const tag = imgMatch[0];
          // Skip decorative images
          if (/role=["']presentation["']/i.test(tag)) continue;

          const altMatch = tag.match(/alt=["']([^"']*)["']/i);
          expect(altMatch, `Missing alt attribute on <img> in ${page}: ${tag.substring(0, 80)}`).not.toBeNull();
          expect(altMatch[1].trim().length, `Empty alt attribute on <img> in ${page}`).toBeGreaterThan(0);
        }
      }),
      { numRuns: 100 },
    );
  });
});

// ─── Property 10 ─────────────────────────────────────────────────────────────
describe("Property 10: Sitemap entries use .html format and include required metadata", () => {
  /** **Validates: Requirements 10.1, 10.2, 10.3, 10.4** */
  it("property: every <url> entry has correct loc format, lastmod, changefreq, priority", () => {
    const sitemap = readSitemap();
    const urlBlocks = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/gi)];

    expect(urlBlocks.length).toBeGreaterThan(0);

    fc.assert(
      fc.property(fc.constantFrom(...urlBlocks), (block) => {
        const content = block[1];

        // Extract <loc>
        const locMatch = content.match(/<loc>([^<]+)<\/loc>/i);
        expect(locMatch, "Missing <loc> in sitemap entry").not.toBeNull();
        const loc = locMatch[1].trim();

        // Homepage uses /, all others use .html
        if (loc !== "https://igamec.org/") {
          expect(loc, `Sitemap URL should use .html format: ${loc}`).toMatch(/\.html$/);
        }

        // Required metadata elements
        expect(content).toMatch(/<lastmod>[^<]+<\/lastmod>/i);
        expect(content).toMatch(/<changefreq>[^<]+<\/changefreq>/i);
        expect(content).toMatch(/<priority>[^<]+<\/priority>/i);
      }),
      { numRuns: 100 },
    );
  });
});

// ─── Property 11 ─────────────────────────────────────────────────────────────
describe("Property 11: Every page wraps content in semantic main element", () => {
  /** **Validates: Requirements 12.1** */
  it("property: every page contains a <main> element", () => {
    fc.assert(
      fc.property(fc.constantFrom(...ALL_PAGES), (page) => {
        const html = readPage(page);
        expect(html).toMatch(/<main[\s>]/i);
      }),
      { numRuns: 100 },
    );
  });
});


// ─── Property 12 ─────────────────────────────────────────────────────────────
describe("Property 12: Every page includes meta robots tag", () => {
  /** **Validates: Requirements 13.1** */
  it('property: <meta name="robots" content="index, follow"> exists', () => {
    fc.assert(
      fc.property(fc.constantFrom(...ALL_PAGES), (page) => {
        const html = readPage(page);
        const match = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i);
        expect(match, `Missing meta robots in ${page}`).not.toBeNull();
        expect(match[1]).toBe("index, follow");
      }),
      { numRuns: 100 },
    );
  });
});

// ─── Property 13 ─────────────────────────────────────────────────────────────
describe("Property 13: All internal links use consistent ./page.html format", () => {
  /** **Validates: Requirements 14.1** */
  it("property: internal href links use ./page.html format", () => {
    fc.assert(
      fc.property(fc.constantFrom(...ALL_PAGES, "header.html", "footer.html"), (page) => {
        const html = readPage(page);

        // Find all href attributes
        const hrefMatches = [...html.matchAll(/href=["']([^"'#]+)["']/gi)];

        for (const m of hrefMatches) {
          const href = m[1].trim();

          // Skip non-internal links
          if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//")) continue;
          if (href.startsWith("mailto:") || href.startsWith("tel:")) continue;
          // Skip asset references (css, js, images, icons)
          if (/\.(css|js|png|jpg|jpeg|svg|ico|gif|woff|woff2|eot|ttf)$/i.test(href)) continue;
          // Skip fragment-only links
          if (href === "#" || href.startsWith("#")) continue;

          // Internal HTML page links should use ./page.html format
          if (href.endsWith(".html")) {
            expect(href, `Internal link in ${page} should use ./ prefix: ${href}`).toMatch(/^\.\//);
          }
        }
      }),
      { numRuns: 100 },
    );
  });
});

// ─── Property 14 ─────────────────────────────────────────────────────────────
describe("Property 14: All external links have security attributes", () => {
  /** **Validates: Requirements 15.1, 15.2** */
  it("property: external links have target=\"_blank\" and rel with noopener and noreferrer", () => {
    fc.assert(
      fc.property(fc.constantFrom(...ALL_PAGES, "header.html", "footer.html"), (page) => {
        const html = readPage(page);

        // Find all <a> tags with href
        const anchorTags = [...html.matchAll(/<a\s[^>]*>/gi)];

        for (const aMatch of anchorTags) {
          const tag = aMatch[0];
          const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
          if (!hrefMatch) continue;

          const href = hrefMatch[1].trim();

          // Only check external links (http/https to non-igamec domains)
          if (!href.startsWith("http://") && !href.startsWith("https://")) continue;
          if (href.includes("igamec.org")) continue;

          // Skip placeholder # links
          if (href === "#") continue;

          // Must have target="_blank"
          expect(tag, `External link missing target="_blank" in ${page}: ${href}`).toMatch(/target=["']_blank["']/i);

          // Must have rel containing noopener and noreferrer
          const relMatch = tag.match(/rel=["']([^"']+)["']/i);
          expect(relMatch, `External link missing rel attribute in ${page}: ${href}`).not.toBeNull();
          const relValue = relMatch[1].toLowerCase();
          expect(relValue, `External link missing noopener in ${page}: ${href}`).toContain("noopener");
          expect(relValue, `External link missing noreferrer in ${page}: ${href}`).toContain("noreferrer");
        }
      }),
      { numRuns: 100 },
    );
  });
});

// ─── Property 15 ─────────────────────────────────────────────────────────────
describe("Property 15: Every page includes performance hint meta tags", () => {
  /** **Validates: Requirements 16.1, 16.2, 16.3** */
  it('property: dns-prefetch for fonts.googleapis.com exists', () => {
    fc.assert(
      fc.property(fc.constantFrom(...ALL_PAGES), (page) => {
        const html = readPage(page);
        expect(
          html,
          `Missing dns-prefetch in ${page}`,
        ).toMatch(/<link[^>]*rel=["']dns-prefetch["'][^>]*href=["']https:\/\/fonts\.googleapis\.com["']/i);
      }),
      { numRuns: 100 },
    );
  });
});
