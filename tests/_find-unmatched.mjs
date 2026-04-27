import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";

const MODULES_DIR = path.resolve("assets/css/modules");
const ROOT_DIR = path.resolve(".");

// Get all HTML files
const htmlFiles = fs.readdirSync(ROOT_DIR).filter((f) => f.endsWith(".html"));

// Parse HTML and collect classes/IDs
const classes = new Set();
const ids = new Set();
for (const file of htmlFiles) {
  const content = fs.readFileSync(path.join(ROOT_DIR, file), "utf-8");
  const doc = new JSDOM(content).window.document;
  for (const el of doc.querySelectorAll("*")) {
    if (el.id) ids.add(el.id);
    for (const cls of el.classList) classes.add(cls);
  }
}

// Get CSS module files
const moduleFiles = fs
  .readdirSync(MODULES_DIR)
  .filter((f) => f.endsWith(".css"));

// Grid framework patterns to skip
const SKIP = [/^col-/, /^row$/, /^gtr-/, /^off-/, /^imp$/, /^aln-/];
function shouldSkip(cls) {
  return SKIP.some((p) => p.test(cls));
}

// For each CSS file, find selectors with classes/IDs not in HTML
for (const file of moduleFiles) {
  const content = fs.readFileSync(path.join(MODULES_DIR, file), "utf-8");
  const lines = content.split("\n");
  let inDynamic = false;
  let braceCount = 0;
  let dynamicBraceTarget = -1;
  let inKeyframes = false;
  let keyframesBraceTarget = -1;
  let inComment = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track block comments
    if (inComment) {
      if (line.includes("*/")) inComment = false;
      continue;
    }
    if (line.trim().startsWith("/*") && !line.includes("*/")) {
      // Check for Dynamic comment
      if (/\/\*\s*Dynamic:/.test(line)) {
        inDynamic = true;
        dynamicBraceTarget = braceCount;
      }
      inComment = true;
      continue;
    }

    // Check for Dynamic comment (single-line)
    if (/\/\*\s*Dynamic:/.test(line)) {
      inDynamic = true;
      dynamicBraceTarget = braceCount;
    }

    // Check for @keyframes
    if (/@(-[\w]+-)?keyframes\s/.test(line)) {
      inKeyframes = true;
      keyframesBraceTarget = braceCount;
    }

    // Count braces
    for (const ch of line) {
      if (ch === "{") braceCount++;
      if (ch === "}") {
        braceCount--;
        if (inDynamic && braceCount <= dynamicBraceTarget) inDynamic = false;
        if (inKeyframes && braceCount <= keyframesBraceTarget)
          inKeyframes = false;
      }
    }

    if (inDynamic || inKeyframes) continue;

    // Look for selectors (lines with { that aren't @rules)
    if (
      line.includes("{") &&
      !line.trim().startsWith("@") &&
      !line.trim().startsWith("/*")
    ) {
      const selectorPart = line.split("{")[0].trim();
      if (!selectorPart) continue;

      // Extract classes
      const classMatches =
        selectorPart.match(/\.([a-zA-Z_-][a-zA-Z0-9_-]*)/g) || [];
      const idMatches =
        selectorPart.match(/#([a-zA-Z_-][a-zA-Z0-9_-]*)/g) || [];

      const selectorClasses = classMatches
        .map((c) => c.slice(1))
        .filter((c) => !shouldSkip(c));
      const selectorIds = idMatches.map((id) => id.slice(1));

      if (selectorClasses.length === 0 && selectorIds.length === 0) continue;

      const hasMatch =
        selectorClasses.some((c) => classes.has(c)) ||
        selectorIds.some((id) => ids.has(id));
      if (!hasMatch) {
        console.log(`${file}:${i + 1} => ${selectorPart}`);
        console.log(`  Classes: ${selectorClasses.join(", ")}`);
        console.log(`  IDs: ${selectorIds.join(", ")}`);
      }
    }
  }
}
