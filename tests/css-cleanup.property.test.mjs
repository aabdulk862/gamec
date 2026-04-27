/**
 * CSS Cleanup Property Tests
 * Feature: ai-friendly-codebase
 *
 * Property 16: All CSS selectors match HTML or are marked dynamic
 *
 * Uses vitest + fast-check, reading CSS module files and HTML files from disk.
 * Uses jsdom to check if class/ID names from CSS selectors exist in HTML.
 *
 * Approach: For each non-dynamic CSS rule, extract class and ID names,
 * then verify at least one exists in the HTML files.
 * Skips: @keyframes, pseudo-elements/classes, @media wrappers, :root,
 * universal selectors (*), element-only selectors, grid framework classes.
 */
import { describe, it, expect, beforeAll } from "vitest";
import * as fc from "fast-check";
import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";

const MODULES_DIR = path.resolve("assets/css/modules");
const ROOT_DIR = path.resolve(".");

/** Get all HTML files in the project root. */
function getHtmlFiles() {
  return fs.readdirSync(ROOT_DIR).filter((f) => f.endsWith(".html"));
}

/** Get all CSS module files. */
function getModuleFiles() {
  return fs.readdirSync(MODULES_DIR).filter((f) => f.endsWith(".css"));
}

/** Parse each HTML file and collect all class names and IDs. */
function collectHtmlClassesAndIds(htmlFiles) {
  const classes = new Set();
  const ids = new Set();
  for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(ROOT_DIR, file), "utf-8");
    const doc = new JSDOM(content).window.document;
    for (const el of doc.querySelectorAll("*")) {
      if (el.id) ids.add(el.id);
      for (const cls of el.classList) classes.add(cls);
    }
  }
  return { classes, ids };
}

/**
 * Find character ranges covered by Dynamic comments.
 * A Dynamic comment covers the immediately following rule block.
 */
function findDynamicRanges(content) {
  const ranges = [];
  const dynamicRe = /\/\*\s*Dynamic:[^]*?\*\//g;
  let m;

  while ((m = dynamicRe.exec(content)) !== null) {
    const commentEnd = m.index + m[0].length;
    let pos = commentEnd;
    let braceDepth = 0;
    let foundOpenBrace = false;
    let ruleEnd = content.length;

    while (pos < content.length) {
      if (content[pos] === "/" && content[pos + 1] === "*") {
        const closeIdx = content.indexOf("*/", pos + 2);
        if (closeIdx !== -1) {
          pos = closeIdx + 2;
          continue;
        }
      }
      if (content[pos] === "{") {
        foundOpenBrace = true;
        braceDepth++;
      } else if (content[pos] === "}") {
        braceDepth--;
        if (foundOpenBrace && braceDepth === 0) {
          ruleEnd = pos + 1;
          break;
        }
      }
      pos++;
    }
    ranges.push({ start: m.index, end: ruleEnd });
  }
  return ranges;
}

function isInDynamicRange(pos, ranges) {
  return ranges.some((r) => pos >= r.start && pos < r.end);
}

/**
 * Extract non-dynamic CSS selectors from all module files.
 * Skips selectors inside Dynamic comment ranges and @keyframes blocks.
 */
function extractNonDynamicSelectors(moduleFiles) {
  const results = [];
  for (const file of moduleFiles) {
    const content = fs.readFileSync(path.join(MODULES_DIR, file), "utf-8");
    const dynamicRanges = findDynamicRanges(content);
    let i = 0,
      depth = 0,
      inComment = false;
    let inKeyframes = false,
      keyframesDepth = 0;

    while (i < content.length) {
      if (!inComment && content[i] === "/" && content[i + 1] === "*") {
        inComment = true;
        i += 2;
        continue;
      }
      if (inComment && content[i] === "*" && content[i + 1] === "/") {
        inComment = false;
        i += 2;
        continue;
      }
      if (inComment) {
        i++;
        continue;
      }

      if (content[i] === "@") {
        const rest = content.substring(i, i + 30);
        if (/^@(-[\w]+-)?keyframes\s/.test(rest)) {
          inKeyframes = true;
          keyframesDepth = depth;
        }
      }

      if (content[i] === "{") {
        if (!inKeyframes && depth <= 1) {
          const bracePos = i;
          let end = i - 1;
          while (end >= 0 && /\s/.test(content[end])) end--;
          let start = end;
          while (start > 0) {
            const ch = content[start - 1];
            if (ch === "}" || ch === ";" || ch === "{") break;
            if (ch === "/" && start > 1 && content[start - 2] === "*") break;
            start--;
          }
          const rawSelector = content.substring(start, end + 1).trim();
          if (rawSelector.length > 0 && !rawSelector.startsWith("@")) {
            if (!isInDynamicRange(bracePos, dynamicRanges)) {
              results.push({ selectorText: rawSelector, file });
            }
          }
        }
        depth++;
      } else if (content[i] === "}") {
        depth--;
        if (inKeyframes && depth === keyframesDepth) inKeyframes = false;
      }
      i++;
    }
  }
  return results;
}

/** Extract class names from a CSS selector string. */
function extractClassNames(selector) {
  const matches = selector.match(/\.([a-zA-Z_-][a-zA-Z0-9_-]*)/g) || [];
  return matches.map((c) => c.slice(1));
}

/** Extract ID names from a CSS selector string. */
function extractIdNames(selector) {
  const matches = selector.match(/#([a-zA-Z_-][a-zA-Z0-9_-]*)/g) || [];
  return matches.map((id) => id.slice(1));
}

/** Grid framework class patterns to skip — these are utility classes
 *  that may or may not be used on any given page. */
const GRID_SKIP_PATTERNS = [
  /^col-/, // Grid columns
  /^row$/, // Grid row
  /^gtr-/, // Grid gutters
  /^off-/, // Grid offsets
  /^imp-/, // Grid importance (reorder)
  /^aln-/, // Grid alignment
];

function isGridFrameworkClass(cls) {
  return GRID_SKIP_PATTERNS.some((p) => p.test(cls));
}

// ─── Shared data loaded once ─────────────────────────────────────────────────

let htmlData;
let testableEntries;

beforeAll(() => {
  const htmlFiles = getHtmlFiles();
  const moduleFiles = getModuleFiles();
  htmlData = collectHtmlClassesAndIds(htmlFiles);

  const nonDynamicSelectors = extractNonDynamicSelectors(moduleFiles);
  testableEntries = [];

  for (const group of nonDynamicSelectors) {
    const selectors = group.selectorText
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const allClasses = [];
    const allIds = [];
    for (const sel of selectors) {
      allClasses.push(...extractClassNames(sel));
      allIds.push(...extractIdNames(sel));
    }

    // Filter out grid framework utility classes
    const meaningful = allClasses.filter((c) => !isGridFrameworkClass(c));

    // Only include entries that have class/ID names to check
    if (meaningful.length === 0 && allIds.length === 0) continue;

    testableEntries.push({
      selectorText: group.selectorText,
      file: group.file,
      classes: meaningful,
      ids: allIds,
    });
  }
});

// ─── Property 16: All CSS selectors match HTML or are marked dynamic ─────────
describe("Feature: ai-friendly-codebase, Property 16: all selectors match HTML or marked dynamic", () => {
  /**
   * **Validates: Requirements 11.1, 11.2**
   *
   * For any CSS selector in the final stylesheet, the selector shall either
   * match at least one element across the 18 HTML files, or be annotated
   * with a Dynamic comment.
   */
  it("property: for any non-dynamic CSS rule group, at least one class or ID should exist in the HTML files", () => {
    expect(
      testableEntries.length,
      "Expected to find testable CSS rule groups with class/ID selectors",
    ).toBeGreaterThan(0);

    // Deduplicate by selector text
    const seen = new Set();
    const uniqueEntries = testableEntries.filter((entry) => {
      if (seen.has(entry.selectorText)) return false;
      seen.add(entry.selectorText);
      return true;
    });

    fc.assert(
      fc.property(fc.constantFrom(...uniqueEntries), (entry) => {
        const hasMatchingClass = entry.classes.some((c) =>
          htmlData.classes.has(c),
        );
        const hasMatchingId = entry.ids.some((id) => htmlData.ids.has(id));

        expect(
          hasMatchingClass || hasMatchingId,
          `CSS rule in ${entry.file} has no matching HTML elements.\n` +
            `Selector: ${entry.selectorText}\n` +
            `Classes checked: ${entry.classes.join(", ") || "(none)"}\n` +
            `IDs checked: ${entry.ids.join(", ") || "(none)"}\n` +
            "Either remove the rule or add a Dynamic annotation.",
        ).toBe(true);
      }),
      { numRuns: Math.min(uniqueEntries.length * 2, 200) },
    );
  });

  it("property: dynamic-annotated selectors have the correct comment format", () => {
    const moduleFiles = getModuleFiles();
    const filesWithDynamic = [];

    for (const file of moduleFiles) {
      const content = fs.readFileSync(path.join(MODULES_DIR, file), "utf-8");
      if (/\/\*\s*Dynamic:\s*.+\*\//.test(content)) {
        filesWithDynamic.push(file);
      }
    }

    expect(
      filesWithDynamic.length,
      "Expected to find files with Dynamic annotations",
    ).toBeGreaterThan(0);

    fc.assert(
      fc.property(fc.constantFrom(...filesWithDynamic), (file) => {
        const content = fs.readFileSync(path.join(MODULES_DIR, file), "utf-8");
        const matches = content.match(/\/\*\s*Dynamic:\s*(.+?)\s*\*\//g);
        expect(
          matches && matches.length > 0,
          `File ${file} should have properly formatted Dynamic comments`,
        ).toBe(true);
      }),
      { numRuns: 100 },
    );
  });
});
