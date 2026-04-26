/** @vitest-environment jsdom */
/**
 * Donation Receipts Unit Tests
 * Feature: donation-invoice-system
 *
 * Unit tests for UI structure, integration concerns, and edge cases.
 * Uses vitest + jsdom + fs for HTML/XML inspection.
 */
import { describe, it, expect, beforeEach } from "vitest";
import fs from "fs";
import path from "path";

// ── localStorage polyfill (must precede module import) ──────────────────────
const _store = {};
globalThis.localStorage = {
  getItem(key) {
    return _store[key] !== undefined ? _store[key] : null;
  },
  setItem(key, value) {
    _store[key] = String(value);
  },
  removeItem(key) {
    delete _store[key];
  },
  clear() {
    for (const k in _store) delete _store[k];
  },
  get length() {
    return Object.keys(_store).length;
  },
  key(i) {
    return Object.keys(_store)[i] || null;
  },
};

const {
  parseCSV,
  getNextSequence,
} = require("../assets/js/donation-receipts.js");

// ── Load HTML once for DOM-based tests ──────────────────────────────────────
const htmlPath = path.resolve(__dirname, "..", "donation-receipts.html");
const htmlContent = fs.readFileSync(htmlPath, "utf-8");

// Parse the HTML into a jsdom document for querying
const { JSDOM } = await import("jsdom");
const dom = new JSDOM(htmlContent);
const doc = dom.window.document;

// ── Load sitemap.xml once ───────────────────────────────────────────────────
const sitemapPath = path.resolve(__dirname, "..", "sitemap.xml");
const sitemapContent = fs.readFileSync(sitemapPath, "utf-8");

// ─────────────────────────────────────────────────────────────────────────────

describe("UI Structure and Integration", () => {
  /**
   * Validates: Requirement 1.1
   * Form renders with all required fields.
   */
  it("form contains all required donor fields", () => {
    expect(doc.getElementById("donor-name")).not.toBeNull();
    expect(doc.getElementById("donor-address")).not.toBeNull();
    expect(doc.getElementById("donor-amount")).not.toBeNull();
    expect(doc.getElementById("donor-date")).not.toBeNull();
    expect(doc.getElementById("donor-payment-method")).not.toBeNull();
    expect(doc.getElementById("donor-memo")).not.toBeNull();
  });

  /**
   * Validates: Requirement 4.1
   * Print button exists.
   */
  it("print button exists", () => {
    const btn = doc.getElementById("btn-print");
    expect(btn).not.toBeNull();
    expect(btn.textContent.trim()).toMatch(/print/i);
  });

  /**
   * Validates: Requirement 5.3
   * Sequence number override field exists.
   */
  it("sequence number override field exists", () => {
    const field = doc.getElementById("sequence-override");
    expect(field).not.toBeNull();
    expect(field.getAttribute("type")).toBe("number");
  });

  /**
   * Validates: Requirement 9.1
   * Year selector defaults to current year.
   * The <select> is present; JS populates it at runtime, so we verify the element exists.
   */
  it("year selector element exists", () => {
    const select = doc.getElementById("year-select");
    expect(select).not.toBeNull();
    expect(select.tagName.toLowerCase()).toBe("select");
  });

  /**
   * Validates: Requirement 7.4
   * Internal-use notice banner present.
   */
  it("internal-use notice banner is present", () => {
    const banner = doc.getElementById("internal-banner");
    expect(banner).not.toBeNull();
    expect(banner.textContent).toContain("Internal Use Only");
    expect(banner.textContent).toContain("GAMEC Administration");
  });

  /**
   * Validates: Requirement 7.3
   * Meta robots tag is "noindex, nofollow".
   */
  it('meta robots tag is "noindex, nofollow"', () => {
    const meta = doc.querySelector('meta[name="robots"]');
    expect(meta).not.toBeNull();
    expect(meta.getAttribute("content")).toBe("noindex, nofollow");
  });

  /**
   * Validates: Requirement 7.2
   * Receipt page not in sitemap.xml.
   */
  it("donation-receipts page is not listed in sitemap.xml", () => {
    expect(sitemapContent).not.toContain("donation-receipts");
  });

  /**
   * Validates: Requirement 8.1
   * Donor email field exists in form.
   */
  it("donor email field exists in form", () => {
    const emailField = doc.getElementById("donor-email");
    expect(emailField).not.toBeNull();
    expect(emailField.getAttribute("type")).toBe("email");
  });
});

describe("CSV Edge Cases", () => {
  /**
   * Validates: Requirement 2.4
   * Empty CSV input returns error.
   */
  it("empty string CSV returns error", () => {
    const result = parseCSV("");
    expect(result.records.length).toBe(0);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  /**
   * Validates: Requirement 2.4
   * Garbage/invalid CSV returns error.
   */
  it("garbage CSV input returns error", () => {
    const result = parseCSV("not,a,valid\ncsv,file,at,all");
    expect(result.records.length).toBe(0);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe("localStorage Unavailable Fallback", () => {
  /**
   * Edge case: when localStorage throws, getNextSequence still returns 1.
   */
  it("getNextSequence returns 1 when localStorage throws", () => {
    // Save original methods
    const origGetItem = globalThis.localStorage.getItem;
    const origSetItem = globalThis.localStorage.setItem;

    // Make localStorage throw on every access
    globalThis.localStorage.getItem = () => {
      throw new Error("localStorage unavailable");
    };
    globalThis.localStorage.setItem = () => {
      throw new Error("localStorage unavailable");
    };

    const seq = getNextSequence(9999);
    expect(seq).toBe(1);

    // Restore
    globalThis.localStorage.getItem = origGetItem;
    globalThis.localStorage.setItem = origSetItem;
  });
});
