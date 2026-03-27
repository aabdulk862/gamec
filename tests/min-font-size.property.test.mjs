/**
 * Property 8: Minimum body text font-size
 * Validates: Requirements 13.3
 *
 * For any body text element (p, li, td, span, label, input) across all
 * viewport breakpoints, the computed font-size should be at least 16px (1rem).
 *
 * The CSS enforces this with: font-size: max(1rem, 1em);
 * The max() function guarantees the minimum is 1rem (16px).
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
 * Body text element types that must have a minimum font-size of 1rem.
 */
const bodyTextElements = ["p", "li", "td", "span", "label", "input"];

/**
 * Collect all CSS rules that target a given element and have a font-size
 * declaration. Returns an array of { selector, fontSize }.
 */
function collectFontSizeRules(ast, element) {
  const results = [];
  csstree.walk(ast, {
    visit: "Rule",
    enter(node) {
      const selectorText = csstree.generate(node.prelude);
      const parts = selectorText.split(",").map((s) => s.trim());
      // Check if any part of the comma-separated selector is exactly the element
      const matches = parts.some((part) => part === element);
      if (matches) {
        node.block.children.forEach((decl) => {
          if (decl.type === "Declaration" && decl.property === "font-size") {
            const value = csstree.generate(decl.value).trim();
            results.push({ selector: selectorText, fontSize: value });
          }
        });
      }
    },
  });
  return results;
}

/**
 * Check if a font-size value guarantees at least 1rem (16px).
 * Accepts:
 *  - max() with 1rem as one of the arguments
 *  - a direct value of 1rem or larger (e.g. 1rem, 1.2rem, 16px, 18px)
 */
function guaranteesMinOneRem(fontSize) {
  // Case 1: uses max() with 1rem as an argument
  if (fontSize.includes("max(") && fontSize.includes("1rem")) {
    return true;
  }

  // Case 2: direct rem value >= 1rem
  const remMatch = fontSize.match(/^([\d.]+)rem$/);
  if (remMatch) {
    return parseFloat(remMatch[1]) >= 1;
  }

  // Case 3: direct px value >= 16px
  const pxMatch = fontSize.match(/^([\d.]+)px$/);
  if (pxMatch) {
    return parseFloat(pxMatch[1]) >= 16;
  }

  return false;
}

describe("Property 8: Minimum body text font-size", () => {
  /** **Validates: Requirements 13.3** */

  it("should have a CSS rule targeting body text elements with a font-size declaration", () => {
    // At least one rule should exist that sets font-size on body text elements
    let totalRules = 0;
    for (const el of bodyTextElements) {
      totalRules += collectFontSizeRules(ast, el).length;
    }
    expect(totalRules).toBeGreaterThan(0);
  });

  it("property: for any body text element, the font-size guarantees at least 1rem (16px)", () => {
    fc.assert(
      fc.property(fc.constantFrom(...bodyTextElements), (element) => {
        const rules = collectFontSizeRules(ast, element);

        // There must be at least one font-size rule for this element
        expect(
          rules.length,
          `Expected a font-size rule targeting "${element}"`,
        ).toBeGreaterThan(0);

        // At least one rule must guarantee a minimum of 1rem
        const hasMinOneRem = rules.some((rule) =>
          guaranteesMinOneRem(rule.fontSize),
        );

        expect(
          hasMinOneRem,
          `Expected "${element}" font-size to guarantee at least 1rem (16px). Found: ${rules.map((r) => r.fontSize).join(", ")}`,
        ).toBe(true);
      }),
      { numRuns: 100 },
    );
  });
});
