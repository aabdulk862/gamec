/**
 * Data Attributes Property Tests
 * Feature: ai-friendly-codebase
 *
 * Property-based tests for HTML data attribute correctness:
 * - Property 7: data-page matches filename
 * - Property 8: data-section values are kebab-case
 *
 * Uses vitest + fast-check, reading HTML files from disk.
 */
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import fs from "fs";
import path from "path";

/** List all .html files in root, excluding header.html and footer.html (page files only) */
function getPageFiles() {
  return fs
    .readdirSync(path.resolve("."))
    .filter(
      (f) => f.endsWith(".html") && !["header.html", "footer.html"].includes(f),
    );
}

/** List all .html files in root (all 18, including header and footer) */
function getAllHtmlFiles() {
  return fs.readdirSync(path.resolve(".")).filter((f) => f.endsWith(".html"));
}

/** Read an HTML file and return its content */
function readHtml(filename) {
  return fs.readFileSync(path.resolve(filename), "utf-8");
}

/**
 * Extract the data-page attribute value from the <body> tag.
 * Returns null if no data-page is found on the body tag.
 */
function getDataPage(content) {
  const match = content.match(/<body[^>]*\bdata-page="([^"]*)"[^>]*>/);
  return match ? match[1] : null;
}

/**
 * Extract all data-section attribute values from the HTML content.
 */
function getDataSections(content) {
  const values = [];
  const re = /\bdata-section="([^"]*)"/g;
  let match;
  while ((match = re.exec(content)) !== null) {
    values.push(match[1]);
  }
  return values;
}

// ─── Property 7: data-page matches filename ──────────────────────────────────
describe("Feature: ai-friendly-codebase, Property 7: data-page matches filename", () => {
  /** **Validates: Requirements 5.1, 5.4** */

  const pageFiles = getPageFiles();

  it("property: every HTML page file has a data-page attribute on <body> matching the filename without .html", () => {
    fc.assert(
      fc.property(fc.constantFrom(...pageFiles), (file) => {
        const content = readHtml(file);
        const expectedPage = file.replace(".html", "");
        const dataPage = getDataPage(content);

        expect(
          dataPage,
          `Expected "${file}" to have a data-page attribute on <body>, but none was found`,
        ).not.toBeNull();

        expect(
          dataPage,
          `Expected "${file}" to have data-page="${expectedPage}" but found data-page="${dataPage}"`,
        ).toBe(expectedPage);
      }),
      { numRuns: 100 },
    );
  });
});

// ─── Property 8: data-section values are kebab-case ──────────────────────────
describe("Feature: ai-friendly-codebase, Property 8: data-section kebab-case", () => {
  /** **Validates: Requirements 5.2** */

  const allHtmlFiles = getAllHtmlFiles();
  const KEBAB_CASE_RE = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

  it("property: every data-section value across all HTML files is valid kebab-case", () => {
    fc.assert(
      fc.property(fc.constantFrom(...allHtmlFiles), (file) => {
        const content = readHtml(file);
        const sections = getDataSections(content);

        for (const value of sections) {
          expect(
            KEBAB_CASE_RE.test(value),
            `In "${file}", data-section="${value}" does not match kebab-case pattern: ^[a-z][a-z0-9]*(-[a-z0-9]+)*$`,
          ).toBe(true);
        }
      }),
      { numRuns: 100 },
    );
  });
});
