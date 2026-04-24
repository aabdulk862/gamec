/**
 * Quran PDF Viewer — Property-Based Tests
 * Feature: quran-pdf-viewer
 *
 * Tests pure functions extracted from quran-viewer.js.
 * Uses vitest + fast-check with 100+ runs per property.
 */
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { readFileSync } from "fs";
import { resolve } from "path";

/* ── Re-implement pure functions from quran-viewer.js for testing ── */

function clampPage(page, totalPages) {
  if (totalPages <= 0) return 1;
  return Math.max(1, Math.min(page, totalPages));
}

function clampZoom(scale, min, max) {
  return Math.max(min, Math.min(scale, max));
}

function adjustZoom(currentScale, delta, min, max) {
  return clampZoom(Math.round((currentScale + delta) * 100) / 100, min, max);
}

function getCurrentSurah(pageNum, surahData) {
  var idx = 0;
  for (var i = 0; i < surahData.length; i++) {
    if (surahData[i][2] <= pageNum) {
      idx = i;
    } else {
      break;
    }
  }
  return idx;
}

/* ── Extract SURAH_DATA from the source file ── */
const viewerSrc = readFileSync(resolve("assets/js/quran-viewer.js"), "utf-8");
const surahMatch = viewerSrc.match(/var SURAH_DATA\s*=\s*(\[[\s\S]*?\]);/);
// eslint-disable-next-line no-eval
const SURAH_DATA = eval(surahMatch[1]);
const TOTAL_PAGES = 604; // Total Quran content pages (internal numbering)
const TOTAL_PDF_PAGES = 625; // Total PDF pages including cover/title pages
const PAGE_OFFSET = 3; // PDF pages before Quran page 1

// ─── Property 1: Navigation changes page by ±1 ──────────────────────────────
// Feature: quran-pdf-viewer, Property 1: navigation changes page by ±1
describe("Property 1: Page navigation changes current page by exactly ±1", () => {
  /** Validates: Requirements 2.2, 2.3, 2.6, 2.7 */
  it("property: forward navigation increments page by 1 when not at last page", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: TOTAL_PAGES - 1 }),
        (currentPage) => {
          const next = clampPage(currentPage + 1, TOTAL_PAGES);
          expect(next).toBe(currentPage + 1);
        },
      ),
      { numRuns: 200 },
    );
  });

  it("property: backward navigation decrements page by 1 when not at first page", () => {
    fc.assert(
      fc.property(fc.integer({ min: 2, max: TOTAL_PAGES }), (currentPage) => {
        const prev = clampPage(currentPage - 1, TOTAL_PAGES);
        expect(prev).toBe(currentPage - 1);
      }),
      { numRuns: 200 },
    );
  });
});

// ─── Property 2: Page number invariant within [1, totalPages] ────────────────
// Feature: quran-pdf-viewer, Property 2: page number invariant within [1, totalPages]
describe("Property 2: Page number invariant — always within valid bounds", () => {
  /** Validates: Requirements 2.4, 2.5 */
  it("property: clampPage always returns value in [1, totalPages]", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -1000, max: 2000 }),
        fc.integer({ min: 1, max: 1000 }),
        (page, totalPages) => {
          const result = clampPage(page, totalPages);
          expect(result).toBeGreaterThanOrEqual(1);
          expect(result).toBeLessThanOrEqual(totalPages);
        },
      ),
      { numRuns: 200 },
    );
  });

  it("property: navigating backward from page 1 stays at 1", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 1000 }), (totalPages) => {
        expect(clampPage(0, totalPages)).toBe(1);
        expect(clampPage(-1, totalPages)).toBe(1);
      }),
      { numRuns: 100 },
    );
  });

  it("property: navigating forward from last page stays at last page", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 1000 }), (totalPages) => {
        expect(clampPage(totalPages + 1, totalPages)).toBe(totalPages);
      }),
      { numRuns: 100 },
    );
  });
});

// ─── Property 3: Zoom clamping to [0.5, 3.0] ────────────────────────────────
// Feature: quran-pdf-viewer, Property 3: zoom clamping to [0.5, 3.0]
describe("Property 3: Zoom adjustment and clamping", () => {
  /** Validates: Requirements 5.2, 5.3, 5.4 */
  it("property: adjustZoom result is always within [0.5, 3.0]", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.1, max: 5.0, noNaN: true }),
        fc.constantFrom(-0.25, 0.25),
        (currentScale, delta) => {
          const result = adjustZoom(currentScale, delta, 0.5, 3.0);
          expect(result).toBeGreaterThanOrEqual(0.5);
          expect(result).toBeLessThanOrEqual(3.0);
        },
      ),
      { numRuns: 200 },
    );
  });

  it("property: adjustZoom equals clamp(currentScale + delta, 0.5, 3.0)", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.1, max: 5.0, noNaN: true }),
        fc.constantFrom(-0.25, 0.25),
        (currentScale, delta) => {
          const result = adjustZoom(currentScale, delta, 0.5, 3.0);
          const expected = clampZoom(
            Math.round((currentScale + delta) * 100) / 100,
            0.5,
            3.0,
          );
          expect(result).toBe(expected);
        },
      ),
      { numRuns: 200 },
    );
  });
});

// ─── Property 4: TOC contains all 114 surahs ────────────────────────────────
// Feature: quran-pdf-viewer, Property 4: TOC contains all 114 surahs
describe("Property 4: TOC contains all 114 surahs with correct data", () => {
  /** Validates: Requirements 3.2 */
  it("property: SURAH_DATA has exactly 114 entries", () => {
    expect(SURAH_DATA.length).toBe(114);
  });

  it("property: every surah entry has valid number, name, and page", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 113 }), (idx) => {
        const entry = SURAH_DATA[idx];
        expect(entry[0]).toBe(idx + 1); // surah number is 1-indexed
        expect(typeof entry[1]).toBe("string");
        expect(entry[1].length).toBeGreaterThan(0);
        expect(entry[2]).toBeGreaterThanOrEqual(1);
        expect(entry[2]).toBeLessThanOrEqual(TOTAL_PAGES);
      }),
      { numRuns: 114 },
    );
  });

  it("property: surah page numbers are non-decreasing", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 112 }), (idx) => {
        expect(SURAH_DATA[idx][2]).toBeLessThanOrEqual(SURAH_DATA[idx + 1][2]);
      }),
      { numRuns: 113 },
    );
  });
});

// ─── Property 5: TOC selection navigates to correct page ─────────────────────
// Feature: quran-pdf-viewer, Property 5: TOC selection navigates to correct page
describe("Property 5: TOC surah selection navigates to correct page", () => {
  /** Validates: Requirements 3.3 */
  it("property: selecting any surah yields its page number via clampPage", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 113 }), (idx) => {
        const surahPage = SURAH_DATA[idx][2];
        // The pure clampPage still works on Quran page numbers
        const navigatedPage = clampPage(surahPage, TOTAL_PAGES);
        expect(navigatedPage).toBe(surahPage);
        // With offset, the PDF page should be valid
        const pdfPage = surahPage + PAGE_OFFSET;
        expect(pdfPage).toBeLessThanOrEqual(TOTAL_PDF_PAGES);
        expect(pdfPage).toBeGreaterThanOrEqual(1);
      }),
      { numRuns: 114 },
    );
  });
});

// ─── Property 6: TOC highlights correct surah for any page ──────────────────
// Feature: quran-pdf-viewer, Property 6: TOC highlights correct surah for any page
describe("Property 6: TOC highlights the correct surah for any page", () => {
  /** Validates: Requirements 3.5 */
  it("property: getCurrentSurah returns surah whose start page ≤ pageNum and next surah start > pageNum", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: TOTAL_PAGES }), (pageNum) => {
        const idx = getCurrentSurah(pageNum, SURAH_DATA);
        // Current surah's start page must be ≤ pageNum
        expect(SURAH_DATA[idx][2]).toBeLessThanOrEqual(pageNum);
        // If not the last surah, next surah's start page must be > pageNum
        if (idx < SURAH_DATA.length - 1) {
          expect(SURAH_DATA[idx + 1][2]).toBeGreaterThan(pageNum);
        }
      }),
      { numRuns: 200 },
    );
  });
});

// ─── Property 7: All toolbar buttons have aria-label ─────────────────────────
// Feature: quran-pdf-viewer, Property 7: all toolbar buttons have aria-label
describe("Property 7: All toolbar buttons have accessible labels", () => {
  /** Validates: Requirements 6.1 */
  const html = readFileSync(resolve("resources.html"), "utf-8");

  // Extract the toolbar section by finding the qv-toolbar div
  const toolbarStart = html.indexOf('class="qv-toolbar"');
  const toolbarEnd = html.indexOf("</div>", toolbarStart);
  const toolbarHtml = html.substring(toolbarStart, toolbarEnd);
  const buttons = [...toolbarHtml.matchAll(/<button[^>]*>/gi)];

  const expectedLabels = [
    "Previous page",
    "Next page",
    "Table of contents",
    "Zoom out",
    "Zoom in",
  ];

  it("property: every toolbar button has a non-empty aria-label", () => {
    expect(buttons.length).toBeGreaterThanOrEqual(5);
    fc.assert(
      fc.property(fc.constantFrom(...buttons), (btnTag) => {
        const tag = btnTag[0];
        const labelMatch = tag.match(/aria-label=["']([^"']+)["']/i);
        expect(labelMatch, `Button missing aria-label: ${tag}`).not.toBeNull();
        expect(labelMatch[1].trim().length).toBeGreaterThan(0);
      }),
      { numRuns: 100 },
    );
  });

  it("all expected aria-labels are present", () => {
    const foundLabels = buttons.map((b) => {
      const m = b[0].match(/aria-label=["']([^"']+)["']/i);
      return m ? m[1] : "";
    });
    for (const label of expectedLabels) {
      expect(foundLabels).toContain(label);
    }
  });
});
