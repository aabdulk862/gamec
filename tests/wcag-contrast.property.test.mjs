/**
 * Property 3: WCAG AA contrast compliance
 * Validates: Requirements 2.5, 2.6, 13.5
 *
 * For any text color variable and background color variable pair used together
 * in the design system, the computed contrast ratio should be at least 4.5:1
 * for normal text and 3:1 for large text, meeting WCAG 2.1 AA.
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
 * Parse a hex color string (#rrggbb or #rgb) into { r, g, b } (0–255).
 */
function parseHex(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

/**
 * Compute the relative luminance of an sRGB color per WCAG 2.1.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function relativeLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Compute the contrast ratio between two colors per WCAG 2.1.
 * Returns a value >= 1.
 */
function contrastRatio(color1, color2) {
  const l1 = relativeLuminance(color1);
  const l2 = relativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Extract all CSS custom property values from :root.
 * Returns a Map of property name → resolved hex value.
 */
function getRootVariables(ast) {
  const vars = new Map();
  csstree.walk(ast, {
    visit: "Rule",
    enter(node) {
      const selectorText = csstree.generate(node.prelude);
      if (selectorText === ":root") {
        node.block.children.forEach((decl) => {
          if (decl.type === "Declaration" && decl.property.startsWith("--")) {
            const value = csstree.generate(decl.value).trim();
            vars.set(decl.property, value);
          }
        });
      }
    },
  });
  return vars;
}

/**
 * The text/background color pairs from the design system that are used together.
 * Each entry specifies the CSS variable names and the expected minimum contrast
 * ratio (4.5 for normal text, 3.0 for large text).
 */
const colorPairs = [
  {
    label: "--color-text on --color-background",
    textVar: "--color-text",
    bgVar: "--color-background",
    minRatio: 4.5,
  },
  {
    label: "--color-text-light on --color-background",
    textVar: "--color-text-light",
    bgVar: "--color-background",
    minRatio: 4.5,
  },
  {
    label: "--color-text-lighter on --color-background",
    textVar: "--color-text-lighter",
    bgVar: "--color-background",
    minRatio: 4.5,
  },
  {
    label: "--color-text-lightest on --color-background",
    textVar: "--color-text-lightest",
    bgVar: "--color-background",
    minRatio: 4.5,
  },
  {
    label: "--color-text-light on --color-background-light",
    textVar: "--color-text-light",
    bgVar: "--color-background-light",
    minRatio: 4.5,
  },
  {
    label: "--color-text-lighter on --color-background-alt",
    textVar: "--color-text-lighter",
    bgVar: "--color-background-alt",
    minRatio: 4.5,
  },
  {
    label: "--color-text-lightest on --color-background-section",
    textVar: "--color-text-lightest",
    bgVar: "--color-background-section",
    minRatio: 4.5,
  },
  {
    label: "--color-white on --color-primary (footer text on dark bg)",
    textVar: "--color-white",
    bgVar: "--color-primary",
    minRatio: 4.5,
  },
];

describe("Property 3: WCAG AA contrast compliance", () => {
  /** **Validates: Requirements 2.5, 2.6, 13.5** */

  let rootVars;

  beforeAll(() => {
    rootVars = getRootVariables(ast);
  });

  it("should define all required color variables in :root", () => {
    const requiredVars = [
      "--color-text",
      "--color-text-light",
      "--color-text-lighter",
      "--color-text-lightest",
      "--color-background",
      "--color-background-light",
      "--color-background-alt",
      "--color-background-section",
      "--color-white",
      "--color-primary",
    ];
    for (const varName of requiredVars) {
      expect(rootVars.has(varName), `Expected :root to define ${varName}`).toBe(
        true,
      );
      // Each value should be a valid hex color
      const val = rootVars.get(varName);
      expect(
        val,
        `Expected ${varName} to have a hex color value, got: ${val}`,
      ).toMatch(/^#[0-9a-fA-F]{3,6}$/);
    }
  });

  it("property: for any text/background color pair in the design system, the contrast ratio meets WCAG AA (>= 4.5:1 for normal text)", () => {
    fc.assert(
      fc.property(fc.constantFrom(...colorPairs), (pair) => {
        const textHex = rootVars.get(pair.textVar);
        const bgHex = rootVars.get(pair.bgVar);

        expect(
          textHex,
          `Expected ${pair.textVar} to be defined in :root`,
        ).toBeTruthy();
        expect(
          bgHex,
          `Expected ${pair.bgVar} to be defined in :root`,
        ).toBeTruthy();

        const textColor = parseHex(textHex);
        const bgColor = parseHex(bgHex);
        const ratio = contrastRatio(textColor, bgColor);

        expect(
          ratio,
          `${pair.label}: contrast ratio ${ratio.toFixed(2)}:1 is below the minimum ${pair.minRatio}:1 (text: ${textHex}, bg: ${bgHex})`,
        ).toBeGreaterThanOrEqual(pair.minRatio);
      }),
      { numRuns: 100 },
    );
  });
});
