/**
 * Property 7: Focus indicator on interactive elements
 * Validates: Requirements 13.1
 *
 * For any interactive element (button, link, form input) in the design system,
 * a :focus-visible or :focus rule should apply a visible outline of 2px solid
 * in the gold accent color with a 2px offset.
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
 * Interactive element selectors that must have focus-visible rules.
 */
const interactiveElements = [
  "a",
  "button",
  ".button",
  "input",
  "select",
  "textarea",
];

/**
 * Collect all CSS rules whose selector contains :focus-visible or :focus
 * for a given base selector. Returns an array of { selector, declarations }.
 */
function collectFocusRules(ast, baseSelector) {
  const results = [];
  csstree.walk(ast, {
    visit: "Rule",
    enter(node) {
      const selectorText = csstree.generate(node.prelude);
      // Split comma-separated selectors and check each part
      const parts = selectorText.split(",").map((s) => s.trim());
      const matches = parts.some((part) => {
        // Match baseSelector:focus-visible or baseSelector:focus
        return (
          part === `${baseSelector}:focus-visible` ||
          part === `${baseSelector}:focus`
        );
      });
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

describe("Property 7: Focus indicator on interactive elements", () => {
  /** **Validates: Requirements 13.1** */

  it("should have at least one :focus-visible rule for interactive elements", () => {
    let totalFocusRules = 0;
    for (const el of interactiveElements) {
      totalFocusRules += collectFocusRules(ast, el).length;
    }
    expect(totalFocusRules).toBeGreaterThan(0);
  });

  it("property: for any interactive element type, a :focus-visible rule exists with outline 2px solid gold accent and 2px offset", () => {
    fc.assert(
      fc.property(fc.constantFrom(...interactiveElements), (element) => {
        const focusRules = collectFocusRules(ast, element);

        // There must be at least one focus rule for this element
        expect(
          focusRules.length,
          `Expected a :focus-visible or :focus rule for "${element}"`,
        ).toBeGreaterThan(0);

        // At least one rule must have the correct outline and outline-offset
        const hasCorrectOutline = focusRules.some((rule) => {
          const outline = rule.declarations["outline"] || "";
          const offset = rule.declarations["outline-offset"] || "";

          const outlineCorrect =
            outline.includes("2px") &&
            outline.includes("solid") &&
            outline.includes("var(--color-accent)");
          const offsetCorrect = offset === "2px";

          return outlineCorrect && offsetCorrect;
        });

        expect(
          hasCorrectOutline,
          `Expected "${element}" :focus-visible rule to have outline: 2px solid var(--color-accent) and outline-offset: 2px`,
        ).toBe(true);
      }),
      { numRuns: 100 },
    );
  });
});
