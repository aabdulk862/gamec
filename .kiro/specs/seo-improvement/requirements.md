# Requirements Document

## Introduction

This document defines the SEO improvement requirements for the GAMEC (Global Association of Muslim Eritrean Communities) website at https://igamec.org. The site consists of 16 HTML pages plus shared header/footer components. The current SEO baseline includes basic title tags, meta descriptions, meta charset, meta viewport, favicons, a sitemap.xml, and robots.txt. This feature addresses gaps in structured data, Open Graph metadata, canonical URLs, HTML lang attributes, heading hierarchy, image alt text, sitemap accuracy, and semantic HTML to improve search engine visibility, social sharing, and crawlability.

## Glossary

- **Page**: One of the 16 HTML files served by the GAMEC website (index.html, vision.html, history.html, leadership.html, contact.html, programs.html, membership.html, donate.html, resources.html, media.html, relief.html, sisters.html, youth.html, seniors.html, professionals.html, health.html, matrimonial.html)
- **SEO_Engine**: The collection of HTML metadata, structured data, and semantic markup within each Page that search engines and social platforms consume
- **Structured_Data**: JSON-LD script blocks embedded in HTML that provide machine-readable information to search engines following Schema.org vocabulary
- **Open_Graph_Tags**: HTML meta tags using the `og:` prefix that control how Pages appear when shared on social media platforms
- **Canonical_URL**: A `<link rel="canonical">` element that declares the preferred URL for a Page to prevent duplicate content issues
- **Heading_Hierarchy**: The ordered nesting of h1 through h6 HTML elements within a Page
- **Sitemap**: The sitemap.xml file listing all Page URLs for search engine crawlers
- **Robots_File**: The robots.txt file that provides crawling directives to search engine bots
- **Alt_Text**: The `alt` attribute on `<img>` elements providing text descriptions of images
- **Shared_Component**: The header.html and footer.html files dynamically injected into every Page via includes.js

## Requirements

### Requirement 1: HTML Lang Attribute

**User Story:** As a search engine crawler, I want every page to declare its language, so that search engines can correctly index and serve the content to the appropriate audience.

#### Acceptance Criteria

1. THE SEO_Engine SHALL include a `lang="en"` attribute on the `<html>` element of every Page
   - *Current state: index.html, programs.html, donate.html, history.html, leadership.html, relief.html, youth.html, sisters.html, seniors.html, professionals.html, resources.html, and matrimonial.html are missing the `lang` attribute. Only vision.html, contact.html, membership.html, media.html, and health.html have it.*

### Requirement 2: Canonical URLs

**User Story:** As a site owner, I want each page to declare its canonical URL, so that search engines consolidate ranking signals and avoid treating URL variations as duplicate content.

#### Acceptance Criteria

1. THE SEO_Engine SHALL include a `<link rel="canonical" href="...">` element in the `<head>` of every Page
2. THE SEO_Engine SHALL set each canonical URL to the full absolute URL using the `https://igamec.org/` domain followed by the Page filename (e.g., `https://igamec.org/vision.html`)
3. THE SEO_Engine SHALL set the canonical URL for the homepage (index.html) to `https://igamec.org/`

### Requirement 3: Open Graph Meta Tags

**User Story:** As a community member sharing GAMEC pages on social media, I want rich link previews with a title, description, and image, so that shared links are visually engaging and informative.

#### Acceptance Criteria

1. THE SEO_Engine SHALL include `og:title` meta tags on every Page, matching the Page's `<title>` content
2. THE SEO_Engine SHALL include `og:description` meta tags on every Page, matching the Page's existing meta description content
3. THE SEO_Engine SHALL include `og:url` meta tags on every Page, matching the Page's canonical URL
4. THE SEO_Engine SHALL include `og:type` meta tags on every Page, set to `website`
5. THE SEO_Engine SHALL include `og:image` meta tags on every Page, referencing the GAMEC logo at an absolute URL (`https://igamec.org/images/logo-bg.png`)
6. THE SEO_Engine SHALL include `og:site_name` meta tags on every Page, set to `GAMEC`
7. THE SEO_Engine SHALL include `og:locale` meta tags on every Page, set to `en_US`

### Requirement 4: Twitter Card Meta Tags

**User Story:** As a community member sharing GAMEC pages on Twitter/X, I want optimized card previews, so that shared links display a summary with an image.

#### Acceptance Criteria

1. THE SEO_Engine SHALL include a `twitter:card` meta tag on every Page, set to `summary`
2. THE SEO_Engine SHALL include a `twitter:title` meta tag on every Page, matching the Page's `<title>` content
3. THE SEO_Engine SHALL include a `twitter:description` meta tag on every Page, matching the Page's existing meta description content
4. THE SEO_Engine SHALL include a `twitter:image` meta tag on every Page, referencing the GAMEC logo at an absolute URL (`https://igamec.org/images/logo-bg.png`)

### Requirement 5: Structured Data — Organization (Homepage)

**User Story:** As a site owner, I want the homepage to include Organization structured data, so that search engines display a rich knowledge panel with GAMEC's name, logo, contact info, and social profiles.

#### Acceptance Criteria

1. WHEN a search engine crawls the homepage (index.html), THE SEO_Engine SHALL include a JSON-LD script block with `@type` set to `NonprofitOrganization` (with `Organization` as a fallback type)
2. THE Structured_Data on the homepage SHALL include the organization name (`GAMEC - Global Association of Muslim Eritrean Communities`), URL (`https://igamec.org`), logo (`https://igamec.org/images/logo-bg.png`), and description matching the homepage meta description
3. THE Structured_Data on the homepage SHALL include contact information: telephone (`+1-202-440-9089`), email (`contact@igamec.org`), and address (3420 13th St SE, Washington, DC 20032)
4. THE Structured_Data on the homepage SHALL include the `sameAs` property listing the Facebook page URL (`https://www.facebook.com/TheOfficialGAMEC/`)

### Requirement 6: Structured Data — BreadcrumbList (All Inner Pages)

**User Story:** As a site owner, I want inner pages to include breadcrumb structured data, so that search engines display navigational breadcrumbs in search results.

#### Acceptance Criteria

1. THE SEO_Engine SHALL include a JSON-LD `BreadcrumbList` script block on every Page except the homepage
2. THE Structured_Data for each breadcrumb SHALL include a "Home" item pointing to `https://igamec.org/` as position 1
3. THE Structured_Data for each breadcrumb SHALL include the current Page name and URL as the final position item
4. WHEN a Page belongs to a logical sub-section (e.g., relief.html under Programs), THE Structured_Data SHALL include the parent section as an intermediate breadcrumb item


### Requirement 7: Structured Data — WebSite with SearchAction (Homepage)

**User Story:** As a site owner, I want the homepage to include WebSite structured data, so that search engines understand the site identity and can potentially display a sitelinks search box.

#### Acceptance Criteria

1. THE SEO_Engine SHALL include a JSON-LD `WebSite` script block on the homepage (index.html)
2. THE Structured_Data SHALL include the site name (`GAMEC`), URL (`https://igamec.org`), and a description

### Requirement 8: Heading Hierarchy Consistency

**User Story:** As a search engine crawler, I want each page to have a clear and correct heading hierarchy, so that the content structure is properly understood and indexed.

#### Acceptance Criteria

1. THE SEO_Engine SHALL ensure every Page contains exactly one `<h1>` element
2. THE SEO_Engine SHALL ensure heading levels do not skip levels (e.g., an `<h3>` does not appear without a preceding `<h2>` in the same content section)
3. THE SEO_Engine SHALL ensure the homepage (index.html) uses `<h2>` elements for section headings (Membership, Donations, Connect on Facebook, Matrimonial Services, Resources, GAMEC Media) instead of the current `<h1>` elements
   - *Current state: index.html uses multiple `<h1>` tags for section headings below the banner*

### Requirement 9: Image Alt Text Optimization

**User Story:** As a search engine crawler, I want all images to have descriptive, keyword-relevant alt text, so that images are properly indexed and the site is accessible.

#### Acceptance Criteria

1. THE SEO_Engine SHALL ensure every `<img>` element across all Pages has a non-empty `alt` attribute
2. THE SEO_Engine SHALL ensure alt text is descriptive and specific to the image content rather than generic (e.g., "Khulafa al-Rashidun Mosque in Asmara, Eritrea" instead of "Asmara Mosque")
3. THE SEO_Engine SHALL ensure the header logo image in header.html has alt text that includes the organization name (e.g., "GAMEC - Global Association of Muslim Eritrean Communities logo")
4. THE SEO_Engine SHALL ensure decorative images that convey no information use an empty `alt=""` attribute with `role="presentation"`

### Requirement 10: Sitemap Accuracy and Completeness

**User Story:** As a site owner, I want the sitemap to accurately reflect all page URLs, so that search engines can discover and crawl every page correctly.

#### Acceptance Criteria

1. THE Sitemap SHALL use consistent URL formats matching the actual file paths served by the web server
   - *Current state: sitemap.xml mixes URL formats — most pages use trailing-slash directory-style URLs (e.g., `/vision/`) while matrimonial.html uses the `.html` extension. The actual files are `.html` files.*
2. THE Sitemap SHALL include `<lastmod>` date elements for every URL entry
3. THE Sitemap SHALL include `<changefreq>` elements for every URL entry (e.g., `monthly` for content pages, `weekly` for the homepage)
4. THE Sitemap SHALL include `<priority>` elements for every URL entry (e.g., `1.0` for homepage, `0.8` for main sections, `0.6` for sub-pages)

### Requirement 11: Robots.txt Correction

**User Story:** As a site owner, I want the robots.txt to reference the correct sitemap URL, so that search engine crawlers can locate the sitemap without errors.

#### Acceptance Criteria

1. THE Robots_File SHALL reference the sitemap URL without the `www` subdomain, matching the canonical domain (`https://igamec.org/sitemap.xml`)
   - *Current state: robots.txt references `https://www.igamec.org/sitemap.xml` but the site is served from `https://igamec.org` (no www)*

### Requirement 12: Semantic HTML Enhancements

**User Story:** As a search engine crawler, I want pages to use semantic HTML5 elements, so that the content structure and purpose of each section is clearly communicated.

#### Acceptance Criteria

1. THE SEO_Engine SHALL wrap the primary content area of each Page in a `<main>` element
2. THE SEO_Engine SHALL ensure the dynamically loaded header uses a `<header>` element (already present in header.html)
3. THE SEO_Engine SHALL ensure the dynamically loaded footer uses a `<footer>` element (already present in footer.html)
4. THE SEO_Engine SHALL use `<nav>` elements for navigation blocks (already present in header.html)
5. THE SEO_Engine SHALL use `<article>` elements for self-contained content blocks on each Page (already present on most pages)

### Requirement 13: Meta Robots and Indexing Control

**User Story:** As a site owner, I want to explicitly signal to search engines that all pages should be indexed and followed, so that there is no ambiguity about crawling intent.

#### Acceptance Criteria

1. THE SEO_Engine SHALL include a `<meta name="robots" content="index, follow">` tag in the `<head>` of every Page

### Requirement 14: Internal Link Consistency

**User Story:** As a site owner, I want internal links to use a consistent URL format, so that link equity is not diluted across URL variations.

#### Acceptance Criteria

1. THE SEO_Engine SHALL ensure all internal links across Pages and Shared_Components use a consistent relative path format (e.g., `./page.html` or `page.html`, but not mixed)
   - *Current state: header.html links to `index.html` (no prefix) while other links use `./page.html` prefix*

### Requirement 15: External Link Security Attributes

**User Story:** As a site owner, I want all external links to include proper security and SEO attributes, so that the site is protected from reverse tabnapping and link equity leakage is controlled.

#### Acceptance Criteria

1. THE SEO_Engine SHALL ensure every external link (links to domains other than igamec.org) includes `rel="noopener noreferrer"` attributes
2. THE SEO_Engine SHALL ensure every external link includes `target="_blank"` to open in a new tab
   - *Current state: most external links have these attributes, but some are missing `noreferrer` or `target="_blank"` (e.g., some social media links in media.html)*

### Requirement 16: Performance Meta Tags

**User Story:** As a site owner, I want to include DNS prefetch and preconnect hints for external resources, so that page load performance improves and Core Web Vitals scores benefit SEO.

#### Acceptance Criteria

1. THE SEO_Engine SHALL include `<link rel="preconnect" href="https://fonts.googleapis.com">` in the `<head>` of every Page that loads Google Fonts
2. THE SEO_Engine SHALL include `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` in the `<head>` of every Page that loads Google Fonts
3. THE SEO_Engine SHALL include `<link rel="dns-prefetch" href="https://fonts.googleapis.com">` in the `<head>` of every Page as a fallback for browsers that do not support preconnect
