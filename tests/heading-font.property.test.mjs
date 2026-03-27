/**
 * Property 1: Heading font application
 * Validates: Requirements 1.1, 1.2, 1.6
 *
 * For any h1 or h2 element rendered on any page, the computed font-family
 * should resolve to the secondary heading font (the serif/display font
 * defined in --font-heading), not Roboto.
 */
import { describe, it, expect, beforeAll } from "vitest";
import * as fc from "fast-check";
import * as csstree from "css-tree";
import { readFileSync } from "fs";
import { resolve } from "path";

// Read and parse the CSS once
const cssPath = resolve("assets/css/main.css");
const cssContent = readFileSync(cssPath, "utf-8");
const ast = csstree.parse(cssContent);

/**
 * Extract the value of --font-heading from :root.
 */
function getFontHeadingVariable(ast) {
  let value = null;
  csstree.walk(ast, {
    visit: "Rule",
    enter(node) {
      const selectorText = csstree.generate(node.prelude);
      if (selectorText === ":root") {
        node.block.children.forEach((decl) => {
          if (
            decl.type === "Declaration" &&
            decl.property === "--font-heading"
          ) {
            value = csstree.generate(decl.value).trim();
          }
        });
      }
    },
  });
  return value;
}

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
 * Check if a selector targets h1 or h2 elements (not just nested children).
 * We look for selectors where h1 or h2 is a top-level target.
 */
function selectorTargetsHeading(selector, tag) {
  // Split comma-separated selectors and check each part
  const parts = selector.split(",").map((s) => s.trim());
  return parts.some((part) => {
    // The selector part should be exactly the tag or start/end with it
    // e.g., "h1", "h1,h2", "h1, h2", "#banner h1" all target h1
    const segments = part.split(/\s+/);
    const lastSegment = segments[segments.length - 1];
    // Check if the last segment (the target) is or starts with the tag
    return lastSegment === tag || lastSegment.startsWith(tag + ":");
  });
}

describe("Property 1: Heading font application", () => {
  /** **Validates: Requirements 1.1, 1.2, 1.6** */

  let fontHeadingValue;

  beforeAll(() => {
    fontHeadingValue = getFontHeadingVariable(ast);
  });

  it("should define --font-heading variable in :root with Playfair Display", () => {
    expect(fontHeadingValue).toBeTruthy();
    expect(fontHeadingValue.toLowerCase()).toContain("playfair display");
    expect(fontHeadingValue.toLowerCase()).not.toContain("roboto");
  });

  it("should have a CSS rule applying var(--font-heading) to h1 and h2", () => {
    // Find rules that set font-family on h1 or h2
    const headingFontRules = collectRulesMatching(ast, (sel) => {
      return (
        selectorTargetsHeading(sel, "h1") || selectorTargetsHeading(sel, "h2")
      );
    }).filter((r) => r.declarations["font-family"]);

    expect(headingFontRules.length).toBeGreaterThan(0);

    // At least one rule should use var(--font-heading)
    const usesHeadingVar = headingFontRules.some((r) =>
      r.declarations["font-family"].includes("var(--font-heading)"),
    );
    expect(usesHeadingVar).toBe(true);
  });

  it("property: for any heading tag (h1 or h2), the resolved font-family includes Playfair Display and not Roboto alone", () => {
    const headingTags = ["h1", "h2"];

    fc.assert(
      fc.property(fc.constantFrom(...headingTags), (tag) => {
        // Collect all rules that target this heading tag and set font-family
        const matchingRules = collectRulesMatching(ast, (sel) =>
          selectorTargetsHeading(sel, tag),
        ).filter((r) => r.declarations["font-family"]);

        // There must be at least one rule setting font-family for this tag
        expect(matchingRules.length).toBeGreaterThan(0);

        // Check that the font-family resolves to the heading font, not Roboto
        const fontFamilyValues = matchingRules.map(
          (r) => r.declarations["font-family"],
        );

        // At least one rule should reference var(--font-heading) or directly
        // include Playfair Display
        const usesHeadingFont = fontFamilyValues.some(
          (val) =>
            val.includes("var(--font-heading)") ||
            val.toLowerCase().includes("playfair display"),
        );
        expect(usesHeadingFont).toBe(true);

        // None of the heading font-family rules should resolve to Roboto alone
        const isRobotoOnly = fontFamilyValues.every(
          (val) =>
            val.toLowerCase().includes("roboto") &&
            !val.includes("var(--font-heading)") &&
            !val.toLowerCase().includes("playfair display"),
        );
        expect(isRobotoOnly).toBe(false);

        // Verify the --font-heading variable itself contains the serif font
        expect(fontHeadingValue).toBeTruthy();
        expect(fontHeadingValue.toLowerCase()).toContain("playfair display");
        // Verify fallback chain includes serif
        expect(fontHeadingValue.toLowerCase()).toContain("serif");
      }),
      { numRuns: 100 },
    );
  });
});
