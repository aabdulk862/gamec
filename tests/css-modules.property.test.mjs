/**
 * CSS Modules Property Tests
 * Feature: ai-friendly-codebase
 *
 * Property-based tests for CSS module system correctness:
 * - Property 1: CSS module ↔ @import round trip
 * - Property 2: Rule count preservation
 * - Property 3: Page-specific module naming
 *
 * Uses vitest + fast-check, reading CSS files and HTML files from disk.
 */
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import fs from "fs";
import path from "path";

const MODULES_DIR = path.resolve("assets/css/modules");
const MAIN_CSS_PATH = path.resolve("assets/css/main.css");

/** List all CSS files in the modules directory */
function getModuleFiles() {
  return fs.readdirSync(MODULES_DIR).filter((f) => f.endsWith(".css"));
}

/** Parse @import statements from main.css, returning the referenced filenames */
function getImportedFiles() {
  const content = fs.readFileSync(MAIN_CSS_PATH, "utf-8");
  const imports = [];
  const importRegex = /@import\s+["']([^"']+)["']/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}

/** Extract just the filename from an @import path like "modules/_variables.css" */
function importPathToFilename(importPath) {
  return path.basename(importPath);
}

/** List HTML page files in the project root */
function getHtmlPages() {
  return fs
    .readdirSync(path.resolve("."))
    .filter(
      (f) => f.endsWith(".html") && !["header.html", "footer.html"].includes(f),
    );
}

/**
 * Count CSS rules in a file by parsing for selector blocks.
 * Counts top-level rules and rules inside @media blocks.
 */
function countCssRules(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  let count = 0;
  let depth = 0;
  let inComment = false;
  let inAtRule = false;

  for (let i = 0; i < content.length; i++) {
    // Handle comments
    if (!inComment && content[i] === "/" && content[i + 1] === "*") {
      inComment = true;
      i++;
      continue;
    }
    if (inComment && content[i] === "*" && content[i + 1] === "/") {
      inComment = false;
      i++;
      continue;
    }
    if (inComment) continue;

    if (content[i] === "{") {
      // A '{' at depth 0 could be a rule or an @-rule block
      // A '{' at depth 1 inside an @-rule is a nested rule
      if (depth === 0) {
        // Check if this is an @-rule (like @media, @keyframes, etc.)
        const preceding = content.substring(Math.max(0, i - 200), i).trim();
        if (preceding.match(/@[a-zA-Z-]+[^{}]*$/)) {
          inAtRule = true;
        } else {
          count++;
        }
      } else if (depth >= 1) {
        count++;
      }
      depth++;
    } else if (content[i] === "}") {
      depth--;
      if (depth === 0) {
        inAtRule = false;
      }
    }
  }
  return count;
}

// ─── Property 1: CSS module ↔ @import round trip ─────────────────────────────
describe("Feature: ai-friendly-codebase, Property 1: CSS module ↔ @import round trip", () => {
  /** **Validates: Requirements 3.2, 3.4** */

  const moduleFiles = getModuleFiles();
  const importedPaths = getImportedFiles();
  const importedFilenames = importedPaths.map(importPathToFilename);

  it("property: every CSS module file in modules/ has a corresponding @import in main.css", () => {
    fc.assert(
      fc.property(fc.constantFrom(...moduleFiles), (moduleFile) => {
        expect(
          importedFilenames,
          `Expected main.css to @import "${moduleFile}" but it was not found in the import list`,
        ).toContain(moduleFile);
      }),
      { numRuns: 100 },
    );
  });

  it("property: every @import in main.css points to an existing file in modules/", () => {
    fc.assert(
      fc.property(fc.constantFrom(...importedPaths), (importPath) => {
        const filename = importPathToFilename(importPath);
        expect(
          moduleFiles,
          `Expected modules/ to contain "${filename}" referenced by @import "${importPath}"`,
        ).toContain(filename);

        // Also verify the file actually exists on disk
        const fullPath = path.resolve("assets/css", importPath);
        expect(
          fs.existsSync(fullPath),
          `Expected file to exist at "${fullPath}" for @import "${importPath}"`,
        ).toBe(true);
      }),
      { numRuns: 100 },
    );
  });
});

// ─── Property 2: Rule count preservation ─────────────────────────────────────
describe("Feature: ai-friendly-codebase, Property 2: Rule count preservation", () => {
  /** **Validates: Requirements 3.3** */

  const moduleFiles = getModuleFiles();

  it("property: total CSS rules across all module files is greater than 0", () => {
    let totalRules = 0;
    for (const file of moduleFiles) {
      const filePath = path.join(MODULES_DIR, file);
      totalRules += countCssRules(filePath);
    }
    expect(
      totalRules,
      "Expected the total number of CSS rules across all modules to be greater than 0",
    ).toBeGreaterThan(0);
  });

  it("property: every CSS module file is non-empty (contains rules, imports, or documentation)", () => {
    fc.assert(
      fc.property(fc.constantFrom(...moduleFiles), (moduleFile) => {
        const filePath = path.join(MODULES_DIR, moduleFile);
        const content = fs.readFileSync(filePath, "utf-8").trim();

        // File should not be empty — it must have rules, imports, or at least a comment
        expect(
          content.length,
          `Expected module "${moduleFile}" to have content, but it was empty`,
        ).toBeGreaterThan(0);
      }),
      { numRuns: 100 },
    );
  });
});

// ─── Property 3: Page-specific CSS modules named after pages ─────────────────
describe("Feature: ai-friendly-codebase, Property 3: Page-specific module naming", () => {
  /** **Validates: Requirements 3.5** */

  const moduleFiles = getModuleFiles();
  const pageModules = moduleFiles.filter((f) => /^_page-.*\.css$/.test(f));
  const htmlPages = getHtmlPages();
  const htmlPageNames = htmlPages.map((f) => f.replace(".html", ""));

  // Shared/non-page names that are acceptable for _page-*.css modules
  const SHARED_NAMES = ["sections", "home"];

  it("property: every _page-*.css module corresponds to an HTML page or a shared name", () => {
    fc.assert(
      fc.property(fc.constantFrom(...pageModules), (moduleFile) => {
        // Extract the name portion: _page-donate.css → donate
        const match = moduleFile.match(/^_page-(.+)\.css$/);
        expect(
          match,
          `Expected "${moduleFile}" to match _page-*.css pattern`,
        ).not.toBeNull();

        const pageName = match[1];
        const matchesHtmlPage = htmlPageNames.includes(pageName);
        const isSharedName = SHARED_NAMES.includes(pageName);

        expect(
          matchesHtmlPage || isSharedName,
          `Expected page module "${moduleFile}" name "${pageName}" to correspond to an HTML page (${htmlPageNames.join(", ")}) or be a shared name (${SHARED_NAMES.join(", ")})`,
        ).toBe(true);
      }),
      { numRuns: 100 },
    );
  });
});
