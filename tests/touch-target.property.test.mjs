/**
 * Property 6: Touch target minimum size
 * Validates: Requirements 12.6
 *
 * For any interactive element (button, link, or form input) at any viewport
 * size, the element's computed clickable area (considering padding, min-height,
 * min-width) should be at least 44px × 44px.
 */
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import * as csstree from "css-tree";
import { readFileSync } from "fs";
import { resolve } from "path";

// Read and parse the CSS once
const cssPath = resolve("assets/css/main.css");
const cssContent = readFileSync(cssPath, "utf-8");
const ast = csstree.parse(cssContent);

/**
 * Interactive element selectors that must have touch target sizing.
 */
const interactiveElements = [
  "a",
  "button",
  ".button",
  'input[type="button"]',
  'input[type="submit"]',
  'input[type="reset"]',
  "select",
];

const MIN_TARGET_SIZE = 44;

/**
 * Collect all CSS rules whose selector includes the given base selector.
 * Returns an array of { selector, declarations } objects.
 */
function collectRulesForSelector(ast, baseSelector) {
  const results = [];
  csstree.walk(ast, {
    visit: "Rule",
    enter(node) {
      const selectorText = csstree.generate(node.prelude);
      const parts = selectorText.split(",").map((s) => s.trim());
      const matches = parts.some((part) => part === baseSelector);
      if (matches) {
        const declarations = {};
        node.block.children.forEach((decl) => {
          if (decl.type === "Declaration") {
            declarations[decl.property] = csstree.generate(decl.value).trim();
          }
        });
        results.push({ selector: selectorText, declarations });
      }
    },
  });
  return results;
}

/**
 * Parse a CSS pixel value string (e.g. "44px") and return the numeric value.
 * Returns null if the value is not a simple px value.
 */
function parsePx(value) {
  if (!value) return null;
  const match = value.match(/^(\d+(?:\.\d+)?)px$/);
  return match ? parseFloat(match[1]) : null;
}

describe("Property 6: Touch target minimum size", () => {
  /** **Validates: Requirements 12.6** */

  it("should have at least one rule setting min-height and min-width for interactive elements", () => {
    // Check that at least one interactive element has touch target rules
    let found = false;
    for (const el of interactiveElements) {
      const rules = collectRulesForSelector(ast, el);
      const hasMinSize = rules.some(
        (r) => r.declarations["min-height"] && r.declarations["min-width"],
      );
      if (hasMinSize) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });

  it("property: for any interactive element type, a CSS rule sets min-height >= 44px and min-width >= 44px", () => {
    fc.assert(
      fc.property(fc.constantFrom(...interactiveElements), (element) => {
        const rules = collectRulesForSelector(ast, element);

        // Filter to rules that set min-height or min-width
        const touchRules = rules.filter(
          (r) => r.declarations["min-height"] || r.declarations["min-width"],
        );

        // There must be at least one rule setting touch target size
        expect(
          touchRules.length,
          `Expected a CSS rule setting min-height/min-width for "${element}"`,
        ).toBeGreaterThan(0);

        // At least one rule must set both min-height >= 44px and min-width >= 44px
        const meetsMinSize = touchRules.some((rule) => {
          const minHeight = parsePx(rule.declarations["min-height"]);
          const minWidth = parsePx(rule.declarations["min-width"]);
          return (
            minHeight !== null &&
            minWidth !== null &&
            minHeight >= MIN_TARGET_SIZE &&
            minWidth >= MIN_TARGET_SIZE
          );
        });

        expect(
          meetsMinSize,
          `Expected "${element}" to have min-height >= ${MIN_TARGET_SIZE}px and min-width >= ${MIN_TARGET_SIZE}px`,
        ).toBe(true);
      }),
      { numRuns: 100 },
    );
  });
});
