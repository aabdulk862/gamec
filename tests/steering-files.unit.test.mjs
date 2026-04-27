/**
 * Steering Files Unit Tests
 * Feature: ai-friendly-codebase
 *
 * Verifies frontmatter for all 7 steering files, core overview ≤200 lines,
 * and coding conventions covers all required topics.
 */
import { describe, it, expect } from "vitest";
import fs from "fs";
import { resolve } from "path";

const STEERING_DIR = resolve(".kiro/steering");

/** Read a steering file and return its content. */
function readSteering(name) {
  return fs.readFileSync(resolve(STEERING_DIR, name), "utf-8");
}

/** Extract YAML frontmatter fields from a steering file. */
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*"?([^"]*)"?\s*$/);
    if (kv) fields[kv[1]] = kv[2];
  }
  return fields;
}

// ─── 1. Frontmatter verification for all 7 steering files ───────────────────

describe("Steering file frontmatter", () => {
  const expectedFiles = [
    {
      file: "core-overview.md",
      inclusion: "always",
      fileMatchPattern: undefined,
    },
    {
      file: "css-design-system.md",
      inclusion: "fileMatch",
      fileMatchPattern: "assets/css/**",
    },
    {
      file: "js-architecture.md",
      inclusion: "fileMatch",
      fileMatchPattern: "assets/js/**",
    },
    {
      file: "html-pages.md",
      inclusion: "fileMatch",
      fileMatchPattern: "*.html",
    },
    {
      file: "coding-conventions.md",
      inclusion: "always",
      fileMatchPattern: undefined,
    },
    {
      file: "architectural-decisions.md",
      inclusion: "always",
      fileMatchPattern: undefined,
    },
    {
      file: "image-inventory.md",
      inclusion: "fileMatch",
      fileMatchPattern: "*.html",
    },
  ];

  expectedFiles.forEach(({ file, inclusion, fileMatchPattern }) => {
    describe(file, () => {
      it("exists", () => {
        expect(fs.existsSync(resolve(STEERING_DIR, file))).toBe(true);
      });

      it(`has inclusion: ${inclusion}`, () => {
        const fm = parseFrontmatter(readSteering(file));
        expect(fm.inclusion).toBe(inclusion);
      });

      if (fileMatchPattern) {
        it(`has fileMatchPattern: "${fileMatchPattern}"`, () => {
          const fm = parseFrontmatter(readSteering(file));
          expect(fm.fileMatchPattern).toBe(fileMatchPattern);
        });
      }
    });
  });
});

// ─── 2. Core overview is ≤200 lines ─────────────────────────────────────────

describe("Core overview line count", () => {
  it("is ≤200 lines", () => {
    const content = readSteering("core-overview.md");
    const lineCount = content.split(/\r?\n/).length;
    expect(lineCount).toBeLessThanOrEqual(200);
  });
});

// ─── 3. Coding conventions covers all required topics ────────────────────────

describe("Coding conventions required topics", () => {
  const content = readSteering("coding-conventions.md");

  it("covers BEM naming", () => {
    expect(content).toMatch(/BEM/i);
    expect(content).toMatch(/Block/);
    expect(content).toMatch(/Element/);
    expect(content).toMatch(/Modifier/);
  });

  it("covers meta tag pattern", () => {
    expect(content).toMatch(/meta.*tag/i);
    expect(content).toMatch(/<meta/);
  });

  it("covers script load order", () => {
    expect(content).toMatch(/script.*load.*order/i);
    expect(content).toMatch(/includes\.js/);
  });

  it('covers external link pattern (target="_blank", rel="noopener noreferrer")', () => {
    expect(content).toMatch(/target="_blank"/);
    expect(content).toMatch(/rel="noopener noreferrer"/);
  });

  it("covers utility CSS classes (.text-center, .visually-hidden, .reveal, .page-hero-img)", () => {
    expect(content).toMatch(/\.text-center/);
    expect(content).toMatch(/\.visually-hidden/);
    expect(content).toMatch(/\.reveal\b/);
    expect(content).toMatch(/\.page-hero-img/);
  });

  it("covers noscript fallback", () => {
    expect(content).toMatch(/noscript/i);
    expect(content).toMatch(/<noscript>/);
  });
});
