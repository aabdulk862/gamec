/**
 * Property 5: Transition duration bounds
 * Validates: Requirements 10.5
 *
 * For any CSS transition declaration in the stylesheet that applies to
 * hover-interactive elements, the duration value should be between 0.2s
 * and 0.4s.
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
 * Selectors for structural/navigation panel elements whose transitions
 * are slide-in animations (0.5s), not hover micro-interactions.
 */
const structuralSelectors = ["#page-wrapper", "#navToggle", "#navPanel"];

/**
 * Check whether a rule lives inside a @media (prefers-reduced-motion) block
 * or a body.is-preload context. We track this via the parent Atrule node.
 */
function isInsideReducedMotionOrPreload(parents) {
  return parents.some(
    (p) =>
      (p.type === "Atrule" &&
        p.prelude &&
        csstree.generate(p.prelude).includes("prefers-reduced-motion")) ||
      (p.type === "Rule" &&
        csstree.generate(p.prelude).includes("body.is-preload")),
  );
}

/**
 * Parse duration strings like "0.3s", "0.25s", "300ms" and return seconds.
 */
function parseDuration(raw) {
  const trimmed = raw.trim();
  if (trimmed.endsWith("ms")) {
    return parseFloat(trimmed) / 1000;
  }
  if (trimmed.endsWith("s")) {
    return parseFloat(trimmed);
  }
  return null;
}

/**
 * Extract all duration values (in seconds) from a transition value string.
 * Transition shorthand: [property] [duration] [timing-fn] [delay]
 * Multiple transitions are comma-separated.
 *
 * Duration is the first time value in each comma-separated segment.
 */
function extractDurations(transitionValue) {
  const durations = [];
  // Split by comma for multiple transitions
  const segments = transitionValue.split(",");
  for (const segment of segments) {
    // Find all time-like tokens (e.g. 0.3s, 300ms, 0.25s)
    const timePattern = /(?<!\w)([\d.]+(?:ms|s))\b/g;
    let match;
    let first = true;
    while ((match = timePattern.exec(segment)) !== null) {
      if (first) {
        // The first time value in a transition segment is the duration
        const secs = parseDuration(match[1]);
        if (secs !== null) {
          durations.push(secs);
        }
        first = false;
      }
      // Subsequent time values are delays — skip them
    }
  }
  return durations;
}

/**
 * Resolve var(--transition-default) by looking up the :root value.
 */
function getTransitionDefaultValue() {
  let value = null;
  csstree.walk(ast, {
    visit: "Rule",
    enter(node) {
      const sel = csstree.generate(node.prelude);
      if (sel === ":root") {
        node.block.children.forEach((decl) => {
          if (
            decl.type === "Declaration" &&
            decl.property === "--transition-default"
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
 * Collect all standard `transition` declarations that apply to
 * hover-interactive elements (excluding vendor-prefixed, `none`,
 * prefers-reduced-motion, is-preload, and structural nav panel selectors).
 *
 * Returns [{ selector, rawValue, durations }].
 */
function collectTransitionDeclarations() {
  const results = [];
  const transitionDefault = getTransitionDefaultValue();

  // Walk the AST manually to track parent context
  csstree.walk(ast, {
    visit: "Declaration",
    enter(node, item, list) {
      // Only standard `transition` property (not vendor-prefixed)
      if (node.property !== "transition") return;

      const rawValue = csstree.generate(node.value).trim();

      // Skip `none` declarations (prefers-reduced-motion, is-preload)
      if (rawValue === "none !important" || rawValue === "none") return;

      // Walk up to find the parent Rule and any enclosing Atrule
      const parents = [];
      let current = this;
      // css-tree walk doesn't give us a parent chain easily,
      // so we'll use a different approach below
    },
  });

  // Use a more robust approach: walk Rules and check context
  const walkContext = [];

  csstree.walk(ast, {
    enter(node) {
      if (node.type === "Atrule" || node.type === "Rule") {
        walkContext.push(node);
      }

      if (node.type === "Declaration" && node.property === "transition") {
        const rawValue = csstree.generate(node.value).trim();

        // Skip `none` declarations
        if (rawValue === "none !important" || rawValue === "none") return;

        // Skip if inside prefers-reduced-motion or is-preload
        if (isInsideReducedMotionOrPreload(walkContext)) return;

        // Find the parent Rule selector
        let selector = "";
        for (let i = walkContext.length - 1; i >= 0; i--) {
          if (walkContext[i].type === "Rule") {
            selector = csstree.generate(walkContext[i].prelude);
            break;
          }
        }

        // Skip structural/navigation panel selectors
        const isStructural = structuralSelectors.some((s) =>
          selector.split(",").some((part) => part.trim().startsWith(s)),
        );
        if (isStructural) return;

        // Resolve var(--transition-default) references
        let resolvedValue = rawValue;
        if (
          rawValue.includes("var(--transition-default)") &&
          transitionDefault
        ) {
          resolvedValue = rawValue.replace(
            /var\(--transition-default\)/g,
            transitionDefault,
          );
        }

        const durations = extractDurations(resolvedValue);
        if (durations.length > 0) {
          results.push({ selector, rawValue, durations });
        }
      }
    },
    leave(node) {
      if (node.type === "Atrule" || node.type === "Rule") {
        walkContext.pop();
      }
    },
  });

  return results;
}

describe("Property 5: Transition duration bounds", () => {
  /** **Validates: Requirements 10.5** */

  const transitions = collectTransitionDeclarations();

  it("should find at least one transition declaration in the stylesheet", () => {
    expect(transitions.length).toBeGreaterThan(0);
  });

  it("property: for any transition declaration on hover-interactive elements, duration is between 0.2s and 0.4s", () => {
    fc.assert(
      fc.property(fc.constantFrom(...transitions), (entry) => {
        for (const duration of entry.durations) {
          expect(
            duration,
            `Transition duration ${duration}s in "${entry.selector}" (${entry.rawValue}) should be >= 0.2s`,
          ).toBeGreaterThanOrEqual(0.2);
          expect(
            duration,
            `Transition duration ${duration}s in "${entry.selector}" (${entry.rawValue}) should be <= 0.4s`,
          ).toBeLessThanOrEqual(0.4);
        }
      }),
      { numRuns: 100 },
    );
  });
});
