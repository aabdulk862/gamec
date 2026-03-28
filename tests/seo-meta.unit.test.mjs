/**
 * SEO Meta Unit Tests
 * Feature: seo-improvement
 *
 * Unit tests covering specific examples and edge cases for homepage JSON-LD,
 * header logo alt text, robots.txt content, and semantic HTML verification.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

/** Read a file and return its content as a string. */
function readPage(file) {
  return readFileSync(resolve(file), "utf-8");
}

/** Extract all JSON-LD blocks from HTML content. */
function extractJsonLd(html) {
  const blocks = [
    ...html.matchAll(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];
  return blocks.map((m) => JSON.parse(m[1]));
}

// ─── 1. Homepage canonical URL ───────────────────────────────────────────────
describe("Homepage canonical URL", () => {
  it("is exactly https://igamec.org/", () => {
    const html = readPage("index.html");
    const match = html.match(
      /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i,
    );
    expect(match).not.toBeNull();
    expect(match[1]).toBe("https://igamec.org/");
  });
});

// ─── 2. Homepage Organization JSON-LD ────────────────────────────────────────
describe("Homepage Organization JSON-LD", () => {
  const html = readPage("index.html");
  const jsonLdBlocks = extractJsonLd(html);
  const org = jsonLdBlocks.find(
    (b) =>
      (Array.isArray(b["@type"]) && b["@type"].includes("Organization")) ||
      b["@type"] === "Organization",
  );

  it("exists", () => {
    expect(org).toBeDefined();
  });

  it('@type includes "NonprofitOrganization" and "Organization"', () => {
    const types = Array.isArray(org["@type"]) ? org["@type"] : [org["@type"]];
    expect(types).toContain("NonprofitOrganization");
    expect(types).toContain("Organization");
  });

  it('name is "GAMEC - Global Association of Muslim Eritrean Communities"', () => {
    expect(org.name).toBe(
      "GAMEC - Global Association of Muslim Eritrean Communities",
    );
  });

  it('url is "https://igamec.org"', () => {
    expect(org.url).toBe("https://igamec.org");
  });

  it('logo is "https://igamec.org/images/logo-bg.png"', () => {
    expect(org.logo).toBe("https://igamec.org/images/logo-bg.png");
  });

  it("description matches homepage meta description", () => {
    const descMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i,
    );
    expect(descMatch).not.toBeNull();
    expect(org.description).toBe(descMatch[1]);
  });

  it('telephone is "+1-202-440-9089"', () => {
    expect(org.telephone).toBe("+1-202-440-9089");
  });

  it('email is "contact@igamec.org"', () => {
    expect(org.email).toBe("contact@igamec.org");
  });

  it("address has correct street, city, state, zip, country", () => {
    expect(org.address).toBeDefined();
    expect(org.address["@type"]).toBe("PostalAddress");
    expect(org.address.streetAddress).toBe("3420 13th St SE");
    expect(org.address.addressLocality).toBe("Washington");
    expect(org.address.addressRegion).toBe("DC");
    expect(org.address.postalCode).toBe("20032");
    expect(org.address.addressCountry).toBe("US");
  });

  it("sameAs includes Facebook URL", () => {
    expect(org.sameAs).toContain(
      "https://www.facebook.com/TheOfficialGAMEC/",
    );
  });
});

// ─── 3. Homepage WebSite JSON-LD ─────────────────────────────────────────────
describe("Homepage WebSite JSON-LD", () => {
  const html = readPage("index.html");
  const jsonLdBlocks = extractJsonLd(html);
  const website = jsonLdBlocks.find((b) => b["@type"] === "WebSite");

  it("exists", () => {
    expect(website).toBeDefined();
  });

  it('@type is "WebSite"', () => {
    expect(website["@type"]).toBe("WebSite");
  });

  it('name is "GAMEC"', () => {
    expect(website.name).toBe("GAMEC");
  });

  it('url is "https://igamec.org"', () => {
    expect(website.url).toBe("https://igamec.org");
  });
});

// ─── 4. Header logo alt text ─────────────────────────────────────────────────
describe("Header logo alt text", () => {
  it('includes "GAMEC"', () => {
    const html = readPage("header.html");
    const logoImg = html.match(/<img[^>]*class=["'][^"']*logo-img[^"']*["'][^>]*>/i);
    expect(logoImg, "Logo img not found in header.html").not.toBeNull();
    const altMatch = logoImg[0].match(/alt=["']([^"']+)["']/i);
    expect(altMatch, "Logo img missing alt attribute").not.toBeNull();
    expect(altMatch[1]).toContain("GAMEC");
  });
});

// ─── 5. robots.txt sitemap URL ───────────────────────────────────────────────
describe("robots.txt", () => {
  it("contains https://igamec.org/sitemap.xml without www", () => {
    const content = readPage("robots.txt");
    expect(content).toContain("https://igamec.org/sitemap.xml");
    expect(content).not.toContain("www.igamec.org");
  });
});

// ─── 6. header.html uses <header> element ────────────────────────────────────
describe("Semantic HTML - header.html", () => {
  it("uses <header> element", () => {
    const html = readPage("header.html");
    expect(html).toMatch(/<header[\s>]/i);
  });
});

// ─── 7. footer.html uses <footer> element ────────────────────────────────────
describe("Semantic HTML - footer.html", () => {
  it("uses <footer> element", () => {
    const html = readPage("footer.html");
    expect(html).toMatch(/<footer[\s>]/i);
  });
});

// ─── 8. header.html has <nav> element ────────────────────────────────────────
describe("Semantic HTML - header.html navigation", () => {
  it("has <nav> element", () => {
    const html = readPage("header.html");
    expect(html).toMatch(/<nav[\s>]/i);
  });
});

// ─── 9. Pages with articles use <article> elements ───────────────────────────
describe("Semantic HTML - article elements", () => {
  const representativePages = [
    "vision.html",
    "history.html",
    "programs.html",
    "relief.html",
    "media.html",
  ];

  representativePages.forEach((page) => {
    it(`${page} uses <article> element`, () => {
      const html = readPage(page);
      expect(html).toMatch(/<article[\s>]/i);
    });
  });
});
