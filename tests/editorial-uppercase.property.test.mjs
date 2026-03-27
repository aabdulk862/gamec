/**
 * Property 2: Editorial uppercase styling
 * Validates: Requirements 1.5
 *
 * For any element in the set {widget h3, navigation link, footer heading},
 * the element should have text-transform: uppercase and letter-spacing
 * between 0.08em and 0.15em.
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
 * Collect all CSS rules that match a given selector predicate.
 * Returns an array of { selector, declarations } objects.
 */
function collectRulesMatching(ast, selectorPredicate) {
  const results = [];
  csstree.walk(ast, {
    visit: "Rule",
    enter(node) {
      const selectorText = csstree.generate(node.prelude);
      if (selectorPredicate(selectorText)) {
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
 * Parse a letter-spacing value in em and return the numeric value.
 * Returns null if the value is not in em units.
 */
function parseEmValue(value) {
  if (!value) return null;
  const match = value.match(/^([\d.]+)em$/);
  return match ? parseFloat(match[1]) : null;
}

/**
 * Editorial uppercase element definitions.
 * Each entry has a label and a selector predicate that matches the relevant CSS rules.
 */
const editorialElements = [
  {
    label: "widget h3",
    predicate: (sel) => {
      const parts = sel.split(",").map((s) => s.trim());
      return parts.some((part) => /\.widget\s+h3/.test(part));
    },
  },
  {
    label: "navigation link",
    predicate: (sel) => {
      const parts = sel.split(",").map((s) => s.trim());
      return parts.some(
        (part) =>
          /^#nav\b/.test(part) && (/\ba\b/.test(part) || /\bspan\b/.test(part)),
      );
    },
  },
  {
    label: "footer heading",
    predicate: (sel) => {
      const parts = sel.split(",").map((s) => s.trim());
      return parts.some((part) => /^#footer\s+h3/.test(part));
    },
  },
];

describe("Property 2: Editorial uppercase styling", () => {
  /** **Validates: Requirements 1.5** */

  it("property: for any editorial element (widget h3, nav link, footer heading), text-transform is uppercase and letter-spacing is between 0.08em and 0.15em", () => {
    fc.assert(
      fc.property(fc.constantFrom(...editorialElements), (element) => {
        const matchingRules = collectRulesMatching(ast, element.predicate);

        // There must be at least one rule for this element
        expect(
          matchingRules.length,
          `Expected at least one CSS rule for "${element.label}"`,
        ).toBeGreaterThan(0);

        // Find rules that set text-transform
        const textTransformRules = matchingRules.filter(
          (r) => r.declarations["text-transform"],
        );
        expect(
          textTransformRules.length,
          `Expected text-transform declaration for "${element.label}"`,
        ).toBeGreaterThan(0);

        // At least one rule should set text-transform: uppercase
        const hasUppercase = textTransformRules.some(
          (r) => r.declarations["text-transform"] === "uppercase",
        );
        expect(
          hasUppercase,
          `Expected text-transform: uppercase for "${element.label}"`,
        ).toBe(true);

        // Find rules that set letter-spacing
        const letterSpacingRules = matchingRules.filter(
          (r) => r.declarations["letter-spacing"],
        );
        expect(
          letterSpacingRules.length,
          `Expected letter-spacing declaration for "${element.label}"`,
        ).toBeGreaterThan(0);

        // At least one rule should have letter-spacing between 0.08em and 0.15em
        const hasValidSpacing = letterSpacingRules.some((r) => {
          const emVal = parseEmValue(r.declarations["letter-spacing"]);
          return emVal !== null && emVal >= 0.08 && emVal <= 0.15;
        });
        expect(
          hasValidSpacing,
          `Expected letter-spacing between 0.08em and 0.15em for "${element.label}", got: ${letterSpacingRules.map((r) => r.declarations["letter-spacing"]).join(", ")}`,
        ).toBe(true);
      }),
      { numRuns: 100 },
    );
  });
});
