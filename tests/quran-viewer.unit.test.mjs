/**
 * Quran PDF Viewer — Unit Tests
 * Feature: quran-pdf-viewer
 *
 * Edge-case unit tests for the viewer: boundary disabling, error overlay,
 * noscript fallback, fit-to-width default, TOC scrollability CSS.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import * as csstreeModule from "css-tree";
const csstree = csstreeModule.default || csstreeModule;

const html = readFileSync(resolve("resources.html"), "utf-8");
const css = readFileSync(resolve("assets/css/main.css"), "utf-8");
const jsSrc = readFileSync(resolve("assets/js/quran-viewer.js"), "utf-8");

describe("Edge case: first/last page boundary button disabling", () => {
  it("prev button starts with disabled attribute on page 1", () => {
    const prevBtn = html.match(
      /<button[^>]*class=["'][^"']*qv-prev[^"']*["'][^>]*>/i,
    );
    expect(prevBtn).not.toBeNull();
    expect(prevBtn[0]).toMatch(/disabled/i);
  });

  it("renderPage disables prev button when pageNum <= 1", () => {
    expect(jsSrc).toContain("prevBtn.disabled = pageNum <= 1");
  });

  it("renderPage disables next button when pageNum >= totalPages", () => {
    expect(jsSrc).toContain(
      "nextBtn.disabled = pageNum >= ViewerState.totalPages",
    );
  });
});

describe("Edge case: error overlay on failed load", () => {
  it("showError function exists and sets error message", () => {
    expect(jsSrc).toContain("function showError(message)");
    expect(jsSrc).toContain("qv-error-message");
  });

  it("showError creates a retry button", () => {
    expect(jsSrc).toContain("qv-retry-btn");
    expect(jsSrc).toContain("Retry");
  });

  it("retry button re-calls initQuranViewer", () => {
    expect(jsSrc).toContain("initQuranViewer()");
  });
});

describe("Edge case: noscript fallback link", () => {
  it("resources.html contains a noscript block inside the viewer", () => {
    // The noscript should be inside #quran-viewer
    const viewerSection = html.substring(html.indexOf('id="quran-viewer"'));
    expect(viewerSection).toContain("<noscript>");
  });

  it("noscript contains a direct link to the PDF", () => {
    const noscriptMatch = html.match(/<noscript>([\s\S]*?)<\/noscript>/gi);
    const viewerNoscript = noscriptMatch.find((ns) =>
      ns.includes("pub-859f42e20e3a4f7bb6787dd54417300a.r2.dev/quran.pdf"),
    );
    expect(viewerNoscript).toBeDefined();
    expect(viewerNoscript).toContain("Download the Quran PDF");
  });
});

describe("Edge case: fit-to-width default scale", () => {
  it("ViewerState.scale defaults to null (fit-to-width)", () => {
    expect(jsSrc).toMatch(/scale:\s*null/);
  });

  it("renderPage handles null scale with fit-to-width logic", () => {
    expect(jsSrc).toContain("ViewerState.scale === null");
    expect(jsSrc).toContain("wrapperWidth / unscaledViewport.width");
  });
});

describe("Edge case: TOC scrollability CSS", () => {
  it("TOC panel has overflow-y: auto in CSS", () => {
    const ast = csstree.parse(css);
    let found = false;
    csstree.walk(ast, {
      visit: "Rule",
      enter(node) {
        const sel = csstree.generate(node.prelude);
        if (sel.includes(".qv-toc-panel") && !sel.includes(".qv-toc-open")) {
          csstree.walk(node.block, {
            visit: "Declaration",
            enter(decl) {
              if (
                decl.property === "overflow-y" &&
                csstree.generate(decl.value) === "auto"
              ) {
                found = true;
              }
            },
          });
        }
      },
    });
    expect(found, "Expected .qv-toc-panel to have overflow-y: auto").toBe(true);
  });

  it("TOC panel has max-height set", () => {
    const ast = csstree.parse(css);
    let found = false;
    csstree.walk(ast, {
      visit: "Rule",
      enter(node) {
        const sel = csstree.generate(node.prelude);
        if (sel.includes(".qv-toc-panel") && !sel.includes(".qv-toc-open")) {
          csstree.walk(node.block, {
            visit: "Declaration",
            enter(decl) {
              if (decl.property === "max-height") {
                found = true;
              }
            },
          });
        }
      },
    });
    expect(found, "Expected .qv-toc-panel to have max-height").toBe(true);
  });
});
