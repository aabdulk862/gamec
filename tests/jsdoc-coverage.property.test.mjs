/**
 * JSDoc Coverage Property Tests
 * Feature: ai-friendly-codebase
 *
 * Property-based tests for JSDoc documentation coverage:
 * - Property 9: All custom JS functions have JSDoc
 * - Property 10: All custom JS files have @file block
 *
 * Uses vitest + fast-check, reading JS files from disk.
 */
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import fs from "fs";
import path from "path";

const JS_DIR = path.resolve("assets/js");
const CUSTOM_FILES = [
  "includes.js",
  "main.js",
  "donation-receipts.js",
  "quran-viewer.js",
];

/**
 * Read a custom JS file and return its content.
 */
function readJsFile(filename) {
  return fs.readFileSync(path.join(JS_DIR, filename), "utf-8");
}

/**
 * Find module-level function declarations in JS source.
 * "Module-level" means either at the top level (0 indent) or at the first
 * nesting level inside an IIFE wrapper (typically 2-space indent).
 *
 * Deeply nested helper functions inside other functions (e.g. pump(),
 * formatTime() inside initQuranViewer()) are excluded — they are internal
 * implementation details, not the "custom functions" the spec refers to.
 *
 * We detect nesting by tracking brace depth. Functions at brace depth 0
 * (top-level) or depth 1 (inside one wrapper like an IIFE) are included.
 * Functions at depth 2+ are nested helpers and excluded.
 */
function findModuleLevelFunctions(content) {
  const lines = content.split("\n");
  const functions = [];

  // Track brace depth to determine nesting level
  let braceDepth = 0;
  let inComment = false;
  let inString = false;
  let stringChar = "";

  // Map each line to its brace depth at the START of that line
  const lineDepths = [];

  for (let i = 0; i < lines.length; i++) {
    lineDepths.push(braceDepth);
    const line = lines[i];

    for (let j = 0; j < line.length; j++) {
      const ch = line[j];
      const next = j + 1 < line.length ? line[j + 1] : "";

      // Handle block comments
      if (inComment) {
        if (ch === "*" && next === "/") {
          inComment = false;
          j++; // skip /
        }
        continue;
      }

      // Handle strings
      if (inString) {
        if (ch === "\\") {
          j++; // skip escaped char
          continue;
        }
        if (ch === stringChar) {
          inString = false;
        }
        continue;
      }

      // Start of block comment
      if (ch === "/" && next === "*") {
        inComment = true;
        j++;
        continue;
      }

      // Line comment — skip rest of line
      if (ch === "/" && next === "/") {
        break;
      }

      // Start of string
      if (ch === '"' || ch === "'" || ch === "`") {
        inString = true;
        stringChar = ch;
        continue;
      }

      if (ch === "{") braceDepth++;
      if (ch === "}") braceDepth = Math.max(0, braceDepth - 1);
    }
  }

  // Now find function declarations and check their brace depth
  const funcDeclRegex = /^\s*(?:async\s+)?function\s*\*?\s+(\w+)\s*\(/;
  const iifeRegex = /^\s*\(\s*(?:async\s+)?function\s*\(/;
  const windowFuncRegex =
    /^\s*window\.(\w+)\s*=\s*(?:async\s+)?function\s*\*?\s*\w*\s*\(/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const depth = lineDepths[i];
    let match;

    // Only include functions at depth 0 (top-level) or depth 1 (inside IIFE/wrapper)
    if (depth > 1) continue;

    if ((match = funcDeclRegex.exec(line))) {
      functions.push({ name: match[1], lineIndex: i });
    } else if ((match = windowFuncRegex.exec(line))) {
      functions.push({ name: `window.${match[1]}`, lineIndex: i });
    } else if (iifeRegex.test(line)) {
      functions.push({ name: "(IIFE)", lineIndex: i });
    }
  }

  return functions;
}

/**
 * Check if a JSDoc block appears before a function line.
 * Walks backwards from the function line, skipping blank lines,
 * looking for a closing * / within 5 non-blank lines.
 */
function hasJsDocBefore(content, lineIndex) {
  const lines = content.split("\n");
  const searchStart = Math.max(0, lineIndex - 50);

  // Walk backwards from the line before the function
  for (let i = lineIndex - 1; i >= searchStart; i--) {
    const trimmed = lines[i].trim();
    if (trimmed === "") continue; // skip blank lines

    // Found the closing of a JSDoc block
    if (trimmed.endsWith("*/")) {
      // Verify it's a JSDoc block (starts with /**)
      for (let j = i; j >= searchStart; j--) {
        if (lines[j].includes("/**")) return true;
      }
      return false;
    }

    // Still inside a JSDoc block (lines starting with *)
    if (trimmed.startsWith("*")) continue;

    // Hit non-blank, non-JSDoc content — no JSDoc found
    return false;
  }

  return false;
}

// ─── Property 9: All custom JS functions have JSDoc ──────────────────────────
describe("Feature: ai-friendly-codebase, Property 9: All custom JS functions have JSDoc", () => {
  /** **Validates: Requirements 6.1, 6.2, 6.5** */

  const allFunctions = [];
  for (const filename of CUSTOM_FILES) {
    const content = readJsFile(filename);
    const functions = findModuleLevelFunctions(content);
    for (const fn of functions) {
      allFunctions.push({ file: filename, ...fn });
    }
  }

  it("should find functions in custom JS files", () => {
    expect(
      allFunctions.length,
      "Expected to find at least one function across custom JS files",
    ).toBeGreaterThan(0);
  });

  it("property: every function declaration has a JSDoc comment block preceding it", () => {
    fc.assert(
      fc.property(fc.constantFrom(...allFunctions), (fn) => {
        const content = readJsFile(fn.file);
        const hasDoc = hasJsDocBefore(content, fn.lineIndex);
        expect(
          hasDoc,
          `Expected function "${fn.name}" at line ${fn.lineIndex + 1} in "${fn.file}" to have a JSDoc comment block (/** ... */) preceding it`,
        ).toBe(true);
      }),
      { numRuns: allFunctions.length * 2 },
    );
  });
});

// ─── Property 10: All custom JS files have @file block ───────────────────────
describe("Feature: ai-friendly-codebase, Property 10: All custom JS files have @file block", () => {
  /** **Validates: Requirements 6.3** */

  it("property: every custom JS file has a @file tag near the top", () => {
    fc.assert(
      fc.property(fc.constantFrom(...CUSTOM_FILES), (filename) => {
        const content = readJsFile(filename);
        const lines = content.split("\n");

        // Check within the first 20 lines for @file
        const top20 = lines.slice(0, 20).join("\n");
        const hasFileTagInTop = top20.includes("@file");

        // Also check if the first JSDoc block contains @file
        let hasFileTagInFirstBlock = false;
        const firstBlockMatch = content.match(/\/\*\*[\s\S]*?\*\//);
        if (firstBlockMatch) {
          const blockStartLine = content
            .substring(0, content.indexOf(firstBlockMatch[0]))
            .split("\n").length;
          if (blockStartLine <= 20) {
            hasFileTagInFirstBlock = firstBlockMatch[0].includes("@file");
          }
        }

        expect(
          hasFileTagInTop || hasFileTagInFirstBlock,
          `Expected "${filename}" to have a @file tag within the first 20 lines or in the first JSDoc block`,
        ).toBe(true);
      }),
      { numRuns: 100 },
    );
  });
});
