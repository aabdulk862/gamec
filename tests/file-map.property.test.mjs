/**
 * File Map Property Tests
 * Feature: ai-friendly-codebase
 *
 * Property-based test for file map coverage:
 * - Property 11: File map covers all project files
 *
 * Uses vitest + fast-check, reading the core overview steering file
 * and comparing against actual project files on disk.
 */
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import fs from "fs";
import path from "path";

const CORE_OVERVIEW_PATH = path.resolve(".kiro/steering/core-overview.md");
const MODULES_DIR = path.resolve("assets/css/modules");
const JS_DIR = path.resolve("assets/js");
const ROOT_DIR = path.resolve(".");

/**
 * Read the core overview steering file and extract all filenames
 * mentioned in the file map tables (backtick-wrapped names).
 */
function getFileMapEntries() {
  const content = fs.readFileSync(CORE_OVERVIEW_PATH, "utf-8");
  const entries = new Set();
  // Match backtick-wrapped filenames in table rows (e.g., `index.html`, `_variables.css`)
  const backtickRegex = /`([^`]+\.\w+)`/g;
  let match;
  while ((match = backtickRegex.exec(content)) !== null) {
    entries.add(match[1]);
  }
  return entries;
}

/** List HTML page files in the project root (all .html files) */
function getHtmlPages() {
  return fs.readdirSync(ROOT_DIR).filter((f) => f.endsWith(".html"));
}

/** List CSS module files in assets/css/modules/ */
function getCssModuleFiles() {
  return fs.readdirSync(MODULES_DIR).filter((f) => f.endsWith(".css"));
}

/** List JS files in assets/js/ */
function getJsFiles() {
  return fs.readdirSync(JS_DIR).filter((f) => f.endsWith(".js"));
}

// ─── Property 11: File map covers all project files ──────────────────────────
describe("Feature: ai-friendly-codebase, Property 11: file map covers all project files", () => {
  /** **Validates: Requirements 7.1, 7.2, 7.3** */

  const fileMapEntries = getFileMapEntries();
  const htmlPages = getHtmlPages();
  const cssModules = getCssModuleFiles();
  const jsFiles = getJsFiles();

  // Combine all files that should be referenced in the file map
  const allProjectFiles = [
    ...htmlPages.map((f) => ({ filename: f, category: "HTML page" })),
    ...cssModules.map((f) => ({ filename: f, category: "CSS module" })),
    ...jsFiles.map((f) => ({ filename: f, category: "JS file" })),
  ];

  it("should find project files to check", () => {
    expect(
      allProjectFiles.length,
      "Expected to find HTML, CSS module, and JS files in the project",
    ).toBeGreaterThan(0);
  });

  it("should have file map entries in core-overview.md", () => {
    expect(
      fileMapEntries.size,
      "Expected core-overview.md to contain file map entries",
    ).toBeGreaterThan(0);
  });

  it("property: every HTML page, CSS module, and JS file has a file map entry in core-overview.md", () => {
    fc.assert(
      fc.property(fc.constantFrom(...allProjectFiles), (file) => {
        expect(
          fileMapEntries.has(file.filename),
          `Expected core-overview.md file map to contain an entry for ${file.category} "${file.filename}"`,
        ).toBe(true);
      }),
      { numRuns: allProjectFiles.length * 2 },
    );
  });
});
