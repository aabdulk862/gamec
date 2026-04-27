/**
 * CSS Audit Property Tests
 * Feature: ai-friendly-codebase
 *
 * Property-based tests for CSS custom property audit correctness:
 * - Property 14: No hardcoded colors matching existing CSS variables
 * - Property 15: Repeated hardcoded colors have corresponding variables
 *
 * Uses vitest + fast-check, reading CSS files from disk and parsing with css-tree.
 */
import { describe, it, expect, beforeAll } from "vitest";
import * as fc from "fast-check";
import * as csstree from "css-tree";
import fs from "fs";
import path from "path";

const MODULES_DIR = path.resolve("assets/css/modules");
const VARIABLES_FILE = path.join(MODULES_DIR, "_variables.css");

/**
 * CSS properties where hardcoded color values are acceptable exceptions.
 * Shadow properties use rgba for opacity control, not semantic design-system colors.
 */
const SHADOW_PROPERTIES = new Set([
  "box-shadow",
  "text-shadow",
  "-webkit-box-shadow",
  "-moz-box-shadow",
]);

/**
 * Extract all --color-* custom property names and their raw values from :root.
 * Returns maps for both forward and reverse lookup.
 */
function getColorVariables() {
  const content = fs.readFileSync(VARIABLES_FILE, "utf-8");
  const ast = csstree.parse(content);
  /** @type {Map<string, string>} normalized value → variable name */
  const valueToVar = new Map();
  /** @type {Map<string, string>} variable name → normalized value */
  const varToValue = new Map();

  csstree.walk(ast, {
    visit: "Rule",
    enter(node) {
      const selector = csstree.generate(node.prelude);
      if (selector !== ":root") return;
      node.block.children.forEach((decl) => {
        if (
          decl.type === "Declaration" &&
          decl.property.startsWith("--color-")
        ) {
          const value = normalizeColor(csstree.generate(decl.value).trim());
          if (value) {
            varToValue.set(decl.property, value);
            // First variable wins for a given value (avoids ambiguity)
            if (!valueToVar.has(value)) {
              valueToVar.set(value, decl.property);
            }
          }
        }
      });
    },
  });

  return { valueToVar, varToValue };
}

/**
 * Normalize a color string for comparison:
 * - lowercase, collapse whitespace in rgba/rgb, strip trailing semicolons
 */
function normalizeColor(raw) {
  if (!raw) return null;
  let s = raw.toLowerCase().trim().replace(/;$/, "").trim();
  s = s.replace(/\s*,\s*/g, ",");
  s = s.replace(/\(\s+/g, "(").replace(/\s+\)/g, ")");
  return s;
}

/**
 * Get all CSS module files except _variables.css.
 */
function getNonVariableModules() {
  return fs
    .readdirSync(MODULES_DIR)
    .filter((f) => f.endsWith(".css") && f !== "_variables.css");
}

/**
 * Check if a raw CSS value contains a gradient function.
 */
function isGradientValue(rawValue) {
  return /(?:linear|radial|conic)-gradient\s*\(/i.test(rawValue);
}

/**
 * Extract hardcoded color literals from a CSS declaration value string.
 * Strips var() and url() expressions before scanning.
 * Returns an array of normalized color strings found.
 */
function extractColorLiterals(rawValue) {
  const colors = [];
  // Remove var(...) expressions entirely (including fallback values)
  let cleaned = rawValue.replace(/var\s*\([^)]*\)/gi, "");
  // Remove url(...) expressions
  cleaned = cleaned.replace(/url\s*\([^)]*\)/gi, "");

  // Match hex colors: #xxx, #xxxxxx, #xxxxxxxx
  const hexPattern = /#[0-9a-fA-F]{3,8}\b/g;
  let match;
  while ((match = hexPattern.exec(cleaned)) !== null) {
    const normalized = normalizeColor(match[0]);
    if (normalized) colors.push(normalized);
  }

  // Match rgb/rgba colors
  const rgbPattern = /rgba?\s*\([^)]+\)/gi;
  while ((match = rgbPattern.exec(cleaned)) !== null) {
    const normalized = normalizeColor(match[0]);
    if (normalized) colors.push(normalized);
  }

  return colors;
}

/**
 * Scan a CSS module file and collect all hardcoded color values outside :root.
 * Skips: shadow properties, gradient values, var() fallbacks, url() values, comments.
 * Returns an array of { file, selector, property, color, line } objects.
 */
function scanFileForHardcodedColors(filename) {
  const filePath = path.join(MODULES_DIR, filename);
  const content = fs.readFileSync(filePath, "utf-8");
  const results = [];

  // Remove CSS comments to avoid false positives
  const noComments = content.replace(/\/\*[\s\S]*?\*\//g, (m) =>
    " ".repeat(m.length),
  );

  let ast;
  try {
    ast = csstree.parse(noComments, {
      positions: true,
      parseCustomProperty: false,
    });
  } catch {
    return results;
  }

  csstree.walk(ast, {
    visit: "Declaration",
    enter(node) {
      // Skip custom property definitions
      if (node.property.startsWith("--")) return;

      // Skip shadow properties — they use rgba for opacity, not semantic colors
      if (SHADOW_PROPERTIES.has(node.property)) return;

      // Check if we're inside :root
      const parent = this.atrule || this.rule;
      if (parent && parent.type === "Rule") {
        const sel = csstree.generate(parent.prelude);
        if (sel === ":root") return;
      }

      const rawValue = csstree.generate(node.value);

      // Skip gradient values — color stops are intentionally distinct
      if (isGradientValue(rawValue)) return;

      const colorLiterals = extractColorLiterals(rawValue);

      for (const color of colorLiterals) {
        const selectorText =
          parent && parent.prelude
            ? csstree.generate(parent.prelude)
            : "(unknown)";
        results.push({
          file: filename,
          selector: selectorText,
          property: node.property,
          color,
          line: node.loc ? node.loc.start.line : 0,
        });
      }
    },
  });

  return results;
}

// ─── Shared data loaded once ─────────────────────────────────────────────────

let colorVars;
let allHardcodedEntries;
let moduleFiles;

beforeAll(() => {
  colorVars = getColorVariables();
  moduleFiles = getNonVariableModules();
  allHardcodedEntries = [];
  for (const file of moduleFiles) {
    allHardcodedEntries.push(...scanFileForHardcodedColors(file));
  }
});

// ─── Property 14: No hardcoded colors matching existing CSS variables ────────
describe("Feature: ai-friendly-codebase, Property 14: No hardcoded colors matching existing CSS variables", () => {
  /** **Validates: Requirements 10.1, 10.2** */

  it("property: for any CSS declaration outside :root, hardcoded color literals should not match an existing --color-* variable value", () => {
    // Collect violations: hardcoded colors that match a known variable value
    const violations = allHardcodedEntries.filter((entry) =>
      colorVars.valueToVar.has(entry.color),
    );

    // Use fast-check to iterate over violations (if any exist, the test fails)
    if (violations.length > 0) {
      fc.assert(
        fc.property(fc.constantFrom(...violations), (violation) => {
          const varName = colorVars.valueToVar.get(violation.color);
          expect.unreachable(
            `Hardcoded color "${violation.color}" in ${violation.file} ` +
              `(selector: ${violation.selector}, property: ${violation.property}) ` +
              `matches variable ${varName} — should use var(${varName}) instead`,
          );
        }),
        { numRuns: Math.min(violations.length * 2, 100) },
      );
    }

    // If no violations, verify we actually scanned files
    expect(
      moduleFiles.length,
      "Expected to scan at least one CSS module file",
    ).toBeGreaterThan(0);
  });
});

// ─── Property 15: Repeated hardcoded colors have corresponding variables ─────
describe("Feature: ai-friendly-codebase, Property 15: Repeated hardcoded colors have corresponding variables", () => {
  /** **Validates: Requirements 10.3** */

  it("property: for any hardcoded color appearing in 2+ rules outside :root, a --color-* variable should exist with that value", () => {
    // Count occurrences of each hardcoded color across all files
    /** @type {Map<string, Array<{file: string, selector: string, property: string}>>} */
    const colorOccurrences = new Map();

    for (const entry of allHardcodedEntries) {
      if (!colorOccurrences.has(entry.color)) {
        colorOccurrences.set(entry.color, []);
      }
      colorOccurrences.get(entry.color).push({
        file: entry.file,
        selector: entry.selector,
        property: entry.property,
      });
    }

    // Find colors used in 2+ distinct rules (by selector+file) without a variable
    const repeatedWithoutVar = [];
    for (const [color, occurrences] of colorOccurrences) {
      // Deduplicate by file+selector to count distinct rules
      const uniqueRules = new Set(
        occurrences.map((o) => `${o.file}::${o.selector}`),
      );
      if (uniqueRules.size >= 2 && !colorVars.valueToVar.has(color)) {
        repeatedWithoutVar.push({
          color,
          count: uniqueRules.size,
          locations: occurrences.slice(0, 3),
        });
      }
    }

    if (repeatedWithoutVar.length > 0) {
      fc.assert(
        fc.property(fc.constantFrom(...repeatedWithoutVar), (violation) => {
          const locationStr = violation.locations
            .map((l) => `${l.file} (${l.selector})`)
            .join(", ");
          expect.unreachable(
            `Hardcoded color "${violation.color}" appears in ${violation.count} rules ` +
              `but has no --color-* variable. Locations: ${locationStr}`,
          );
        }),
        { numRuns: Math.min(repeatedWithoutVar.length * 2, 100) },
      );
    }

    // Verify we scanned files
    expect(
      moduleFiles.length,
      "Expected to scan at least one CSS module file",
    ).toBeGreaterThan(0);
  });
});
