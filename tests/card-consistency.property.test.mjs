/**
 * Property 4: Card component consistency
 * Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5
 *
 * For any card component type in the set {.box.feature, .program-card,
 * .benefit-item, .donation-section, .contact-card}, the component should have:
 * (a) white background, 1px solid border, border-radius between 10–12px,
 *     and a box-shadow using the shadow-light variable;
 * (b) a hover state with translateY(-6px), increased box-shadow, and a gold
 *     accent border-top;
 * (c) internal padding between 2em and 2.5em;
 * (d) heading elements (h2, h3, h4) using the primary navy color and heading
 *     font family.
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
 * Extract :root CSS variable values.
 */
function getRootVariables(ast) {
  const vars = new Map();
  csstree.walk(ast, {
    visit: "Rule",
    enter(node) {
      const sel = csstree.generate(node.prelude);
      if (sel === ":root") {
        node.block.children.forEach((decl) => {
          if (decl.type === "Declaration" && decl.property.startsWith("--")) {
            vars.set(decl.property, csstree.generate(decl.value).trim());
          }
        });
      }
    },
  });
  return vars;
}

/**
 * Collect all CSS rules whose selector satisfies a predicate.
 * By default, only collects rules at the top level (not inside @media blocks).
 * Returns [{ selector, declarations }].
 */
function collectRulesMatching(
  ast,
  predicate,
  { includeMediaRules = false } = {},
) {
  const results = [];
  const insideMedia = new Set();

  csstree.walk(ast, {
    visit: "Rule",
    enter(node, item, list) {
      // Skip rules inside @media blocks unless explicitly included
      if (!includeMediaRules) {
        // Walk up to check if this rule is inside an Atrule (media query)
        let parent = this.atrule;
        if (parent) return;
      }

      const sel = csstree.generate(node.prelude);
      if (predicate(sel)) {
        const declarations = {};
        node.block.children.forEach((decl) => {
          if (decl.type === "Declaration") {
            declarations[decl.property] = csstree.generate(decl.value).trim();
          }
        });
        results.push({ selector: sel, declarations });
      }
    },
  });
  return results;
}

/**
 * Parse a CSS length value in em and return the numeric value.
 */
function parseEmValue(value) {
  if (!value) return null;
  const match = value.match(/([\d.]+)em/);
  return match ? parseFloat(match[1]) : null;
}

/**
 * Parse a CSS length value in px and return the numeric value.
 */
function parsePxValue(value) {
  if (!value) return null;
  const match = value.match(/([\d.]+)px/);
  return match ? parseFloat(match[1]) : null;
}

/**
 * Check if a comma-separated selector list contains a part that targets
 * exactly the given class (not a descendant). Allows the class to appear
 * in a combined selector list like ".a,.b,.c" but not ".a .child".
 */
function selectorTargetsExactly(sel, cls) {
  return sel.split(",").some((p) => p.trim() === cls);
}

/**
 * Check if a comma-separated selector list contains a part that targets
 * the given class with :hover pseudo-class.
 */
function selectorTargetsHover(sel, cls) {
  return sel.split(",").some((p) => p.trim() === cls + ":hover");
}

/**
 * Check if a comma-separated selector list contains a part that targets
 * a heading (h2, h3, or h4) inside the given class.
 */
function selectorTargetsHeading(sel, cls) {
  return sel
    .split(",")
    .some((p) =>
      new RegExp("^" + escapeRegex(cls) + "\\s+h[2-4]$").test(p.trim()),
    );
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Card selectors to test.
 */
const cardTypes = [
  { label: ".box.feature", cls: ".box.feature" },
  { label: ".program-card", cls: ".program-card" },
  { label: ".benefit-item", cls: ".benefit-item" },
  { label: ".donation-section", cls: ".donation-section" },
  { label: ".contact-card", cls: ".contact-card" },
];

describe("Property 4: Card component consistency", () => {
  /** **Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5** */

  let rootVars;

  beforeAll(() => {
    rootVars = getRootVariables(ast);
  });

  it("should define required card-related CSS variables in :root", () => {
    expect(rootVars.has("--shadow-card")).toBe(true);
    expect(rootVars.has("--shadow-card-hover")).toBe(true);
    expect(rootVars.has("--radius-card")).toBe(true);
    expect(rootVars.has("--color-accent")).toBe(true);
    expect(rootVars.has("--color-primary")).toBe(true);
    expect(rootVars.has("--font-heading")).toBe(true);

    // --shadow-card should reference shadow-light
    expect(rootVars.get("--shadow-card")).toContain("shadow-light");
    // --radius-card should be between 10px and 12px
    const radiusPx = parsePxValue(rootVars.get("--radius-card"));
    expect(radiusPx).toBeGreaterThanOrEqual(10);
    expect(radiusPx).toBeLessThanOrEqual(12);
  });

  it("property: for any card type, base styles include white background, 1px solid border, border-radius 10-12px, and shadow-card box-shadow", () => {
    fc.assert(
      fc.property(fc.constantFrom(...cardTypes), (card) => {
        const baseRules = collectRulesMatching(ast, (sel) =>
          selectorTargetsExactly(sel, card.cls),
        );

        expect(
          baseRules.length,
          `Expected at least one base CSS rule for "${card.label}"`,
        ).toBeGreaterThan(0);

        // Merge all declarations (later rules override earlier ones)
        const merged = {};
        for (const rule of baseRules) {
          Object.assign(merged, rule.declarations);
        }

        // (a) White background
        const bg = merged["background"] || merged["background-color"];
        expect(
          bg,
          `Expected white background for "${card.label}"`,
        ).toBeTruthy();
        expect(
          bg.includes("--color-white") ||
            bg === "#ffffff" ||
            bg === "#fff" ||
            bg === "white",
          `Expected white background for "${card.label}", got: ${bg}`,
        ).toBe(true);

        // (a) 1px solid border
        expect(
          merged["border"],
          `Expected border for "${card.label}"`,
        ).toBeTruthy();
        expect(merged["border"]).toContain("1px solid");

        // (a) border-radius between 10-12px (via var or direct)
        expect(
          merged["border-radius"],
          `Expected border-radius for "${card.label}"`,
        ).toBeTruthy();
        const radiusVal = merged["border-radius"];
        if (radiusVal.includes("--radius-card")) {
          expect(radiusVal).toContain("--radius-card");
        } else {
          const px = parsePxValue(radiusVal);
          expect(px).toBeGreaterThanOrEqual(10);
          expect(px).toBeLessThanOrEqual(12);
        }

        // (a) box-shadow using shadow-card (which references shadow-light)
        expect(
          merged["box-shadow"],
          `Expected box-shadow for "${card.label}"`,
        ).toBeTruthy();
        const shadow = merged["box-shadow"];
        expect(
          shadow.includes("--shadow-card") || shadow.includes("shadow-light"),
          `Expected box-shadow referencing shadow-card or shadow-light for "${card.label}", got: ${shadow}`,
        ).toBe(true);
      }),
      { numRuns: 100 },
    );
  });

  it("property: for any card type, hover state includes translateY(-6px), increased box-shadow, and gold accent border-top", () => {
    fc.assert(
      fc.property(fc.constantFrom(...cardTypes), (card) => {
        const hoverRules = collectRulesMatching(ast, (sel) =>
          selectorTargetsHover(sel, card.cls),
        );

        expect(
          hoverRules.length,
          `Expected at least one hover CSS rule for "${card.label}"`,
        ).toBeGreaterThan(0);

        const merged = {};
        for (const rule of hoverRules) {
          Object.assign(merged, rule.declarations);
        }

        // (b) translateY(-6px)
        expect(
          merged["transform"],
          `Expected transform on hover for "${card.label}"`,
        ).toBeTruthy();
        expect(merged["transform"]).toContain("translateY(-6px)");

        // (b) increased box-shadow
        expect(
          merged["box-shadow"],
          `Expected box-shadow on hover for "${card.label}"`,
        ).toBeTruthy();
        const hoverShadow = merged["box-shadow"];
        expect(
          hoverShadow.includes("--shadow-card-hover") ||
            hoverShadow.includes("shadow-medium") ||
            hoverShadow.includes("12px 28px"),
          `Expected increased box-shadow on hover for "${card.label}", got: ${hoverShadow}`,
        ).toBe(true);

        // (b) gold accent border-top (3px solid)
        expect(
          merged["border-top"],
          `Expected border-top on hover for "${card.label}"`,
        ).toBeTruthy();
        expect(merged["border-top"]).toContain("3px solid");
        expect(
          merged["border-top"].includes("--color-accent") ||
            merged["border-top"].includes("#d4af37"),
          `Expected gold accent border-top on hover for "${card.label}", got: ${merged["border-top"]}`,
        ).toBe(true);
      }),
      { numRuns: 100 },
    );
  });

  it("property: for any card type, internal padding is between 2em and 2.5em", () => {
    fc.assert(
      fc.property(fc.constantFrom(...cardTypes), (card) => {
        const baseRules = collectRulesMatching(ast, (sel) =>
          selectorTargetsExactly(sel, card.cls),
        );

        expect(
          baseRules.length,
          `Expected at least one base CSS rule for "${card.label}"`,
        ).toBeGreaterThan(0);

        const merged = {};
        for (const rule of baseRules) {
          Object.assign(merged, rule.declarations);
        }

        // (c) padding between 2em and 2.5em
        expect(
          merged["padding"],
          `Expected padding for "${card.label}"`,
        ).toBeTruthy();

        // Padding can be shorthand (e.g. "2em 2.5em") — check all em values
        const paddingParts = merged["padding"].split(/\s+/);
        for (const part of paddingParts) {
          const emVal = parseEmValue(part);
          if (emVal !== null) {
            expect(
              emVal,
              `Expected padding between 2em and 2.5em for "${card.label}", got: ${part}`,
            ).toBeGreaterThanOrEqual(2);
            expect(
              emVal,
              `Expected padding between 2em and 2.5em for "${card.label}", got: ${part}`,
            ).toBeLessThanOrEqual(2.5);
          }
        }
      }),
      { numRuns: 100 },
    );
  });

  it("property: for any card type, heading elements (h2, h3, h4) use primary navy color and heading font family", () => {
    fc.assert(
      fc.property(fc.constantFrom(...cardTypes), (card) => {
        const headingRules = collectRulesMatching(ast, (sel) =>
          selectorTargetsHeading(sel, card.cls),
        );

        expect(
          headingRules.length,
          `Expected at least one heading CSS rule for "${card.label}"`,
        ).toBeGreaterThan(0);

        const merged = {};
        for (const rule of headingRules) {
          Object.assign(merged, rule.declarations);
        }

        // (d) color: var(--color-primary) or #001f3f
        expect(
          merged["color"],
          `Expected color on headings for "${card.label}"`,
        ).toBeTruthy();
        expect(
          merged["color"].includes("--color-primary") ||
            merged["color"].includes("#001f3f"),
          `Expected primary navy color on headings for "${card.label}", got: ${merged["color"]}`,
        ).toBe(true);

        // (d) font-family: var(--font-heading) or Playfair Display
        expect(
          merged["font-family"],
          `Expected font-family on headings for "${card.label}"`,
        ).toBeTruthy();
        expect(
          merged["font-family"].includes("--font-heading") ||
            merged["font-family"].toLowerCase().includes("playfair display"),
          `Expected heading font on headings for "${card.label}", got: ${merged["font-family"]}`,
        ).toBe(true);
      }),
      { numRuns: 100 },
    );
  });
});
