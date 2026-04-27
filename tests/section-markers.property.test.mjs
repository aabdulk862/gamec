/**
 * Section Markers Property Tests
 * Feature: ai-friendly-codebase
 *
 * Property-based tests for HTML section marker correctness:
 * - Property 4: Section marker format compliance
 * - Property 5: No duplicate section names per file
 * - Property 6: All HTML files have section markers
 *
 * Uses vitest + fast-check, reading HTML files from disk.
 */
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import fs from "fs";
import path from "path";

/** All 18 HTML files: 16 pages + header.html + footer.html */
const HTML_FILES = [
  "index.html",
  "vision.html",
  "history.html",
  "leadership.html",
  "contact.html",
  "programs.html",
  "relief.html",
  "sisters.html",
  "youth.html",
  "seniors.html",
  "professionals.html",
  "health.html",
  "membership.html",
  "donate.html",
  "media.html",
  "resources.html",
  "matrimonial.html",
  "donation-receipts.html",
  "header.html",
  "footer.html",
];

/** Regex for opening section markers: <!-- Section: Name --> */
const OPENING_MARKER_RE = /<!-- Section: (.+?) -->/g;

/** Regex for closing section markers: <!-- /Section: Name --> */
const CLOSING_MARKER_RE = /<!-- \/Section: (.+?) -->/g;

/**
 * Regex for any HTML comment that starts with "Section:" —
 * used to detect malformed markers that don't match the exact format.
 */
const ANY_SECTION_COMMENT_RE = /<!--\s*\/?Section:.*?-->/g;

/** Read an HTML file and return its content */
function readHtml(filename) {
  return fs.readFileSync(path.resolve(filename), "utf-8");
}

/** Extract all opening section marker names from content */
function getOpeningMarkers(content) {
  const names = [];
  let match;
  const re = new RegExp(OPENING_MARKER_RE.source, "g");
  while ((match = re.exec(content)) !== null) {
    names.push(match[1]);
  }
  return names;
}

/** Extract all closing section marker names from content */
function getClosingMarkers(content) {
  const names = [];
  let match;
  const re = new RegExp(CLOSING_MARKER_RE.source, "g");
  while ((match = re.exec(content)) !== null) {
    names.push(match[1]);
  }
  return names;
}

// ─── Property 4: Section marker format compliance ────────────────────────────
describe("Feature: ai-friendly-codebase, Property 4: Section marker format compliance", () => {
  /** **Validates: Requirements 4.1** */

  it("property: every Section comment matches the exact opening or closing format", () => {
    fc.assert(
      fc.property(fc.constantFrom(...HTML_FILES), (file) => {
        const content = readHtml(file);
        const allSectionComments = content.match(ANY_SECTION_COMMENT_RE) || [];
        const validOpening = /^<!-- Section: .+? -->$/;
        const validClosing = /^<!-- \/Section: .+? -->$/;

        for (const comment of allSectionComments) {
          const isValid =
            validOpening.test(comment) || validClosing.test(comment);
          expect(
            isValid,
            `In "${file}", found malformed section comment: "${comment}". ` +
              `Expected format: "<!-- Section: [Name] -->" or "<!-- /Section: [Name] -->"`,
          ).toBe(true);
        }
      }),
      { numRuns: 100 },
    );
  });

  it("property: every opening marker has a corresponding closing marker with the same name", () => {
    fc.assert(
      fc.property(fc.constantFrom(...HTML_FILES), (file) => {
        const content = readHtml(file);
        const opening = getOpeningMarkers(content);
        const closing = getClosingMarkers(content);

        for (const name of opening) {
          expect(
            closing,
            `In "${file}", opening marker "<!-- Section: ${name} -->" has no corresponding closing marker "<!-- /Section: ${name} -->"`,
          ).toContain(name);
        }
      }),
      { numRuns: 100 },
    );
  });
});

// ─── Property 5: No duplicate section names per file ─────────────────────────
describe("Feature: ai-friendly-codebase, Property 5: No duplicate section names per file", () => {
  /** **Validates: Requirements 4.3** */

  it("property: no file contains duplicate section marker names", () => {
    fc.assert(
      fc.property(fc.constantFrom(...HTML_FILES), (file) => {
        const content = readHtml(file);
        const names = getOpeningMarkers(content);
        const unique = new Set(names);

        expect(
          unique.size,
          `In "${file}", found duplicate section names. Names: [${names.join(", ")}]`,
        ).toBe(names.length);
      }),
      { numRuns: 100 },
    );
  });
});

// ─── Property 6: All HTML files have section markers ─────────────────────────
describe("Feature: ai-friendly-codebase, Property 6: All HTML files have section markers", () => {
  /** **Validates: Requirements 4.4** */

  it("property: every HTML file contains at least one section marker", () => {
    fc.assert(
      fc.property(fc.constantFrom(...HTML_FILES), (file) => {
        const content = readHtml(file);
        const markers = getOpeningMarkers(content);

        expect(
          markers.length,
          `Expected "${file}" to contain at least one "<!-- Section: ... -->" marker, but found none`,
        ).toBeGreaterThanOrEqual(1);
      }),
      { numRuns: 100 },
    );
  });
});
