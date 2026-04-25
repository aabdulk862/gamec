# Implementation Plan: Donation Invoice System

## Overview

Build a client-side donation receipt generator page for GAMEC administrators. The implementation creates `donation-receipts.html`, `assets/js/donation-receipts.js`, and test files. Each task builds incrementally — core utilities first, then form/CSV handling, receipt rendering, print/email features, and finally integration wiring.

## Tasks

- [ ] 1. Create the HTML page and JS module skeleton
  - [ ] 1.1 Create `donation-receipts.html` with the page structure
    - Follow the existing GAMEC page pattern (see `donate.html`)
    - Include `<meta name="robots" content="noindex, nofollow">`
    - No canonical URL, no OG tags, no sitemap entry (internal page)
    - Add shared header/footer wrappers (`#header-wrapper`, `#footer-wrapper`)
    - Add "Internal Use Only — GAMEC Administration" banner
    - Add year selector (dropdown, defaults to current year)
    - Add receipt number management section (display next number, override field)
    - Add tab-style toggle: "Single Entry" | "CSV Import"
    - Add single entry form (name, address, amount, date, payment method, email, memo)
    - Add CSV upload area (file input + preview table container)
    - Add action buttons (Generate, Print All, Clear)
    - Add `#receipt-output` container
    - Add embedded `@media print` stylesheet that hides form/nav/footer and shows only receipts with `page-break-after: always` and US Letter sizing
    - Include script tags for jQuery, browser, breakpoints, util, main, includes, and `assets/js/donation-receipts.js`
    - _Requirements: 1.1, 4.1, 4.2, 4.3, 4.4, 5.3, 6.1, 6.3, 7.3, 7.4, 8.1, 9.1_

  - [ ] 1.2 Create `assets/js/donation-receipts.js` with exported utility functions
    - Implement `formatCurrency(amount)` — formats number as USD string with `$`, commas, 2 decimal places
    - Implement `formatReceiptNumber(year, seq)` — returns `GAMEC-YYYY-NNNN` zero-padded
    - Implement `getNextSequence(year)` — reads localStorage key `gamec-receipt-sequences`, returns next number, writes it back
    - Implement `setSequence(year, num)` — writes sequence number to localStorage
    - Implement `buildMailtoLink(email, receiptNumber)` — returns `mailto:` URL with pre-filled subject/body
    - Implement `filterByYear(records, year)` — filters donor records by donation date year
    - Export all functions for testability (attach to `window` or use ES module pattern consistent with existing site)
    - _Requirements: 3.5, 3.6, 5.1, 5.2, 5.4, 8.3, 8.4, 9.2_

- [ ] 2. Implement form validation and CSV parsing
  - [ ] 2.1 Implement `validateForm(formData)` in `donation-receipts.js`
    - Validate required fields: name, address, amount, date, paymentMethod
    - Validate amount is a positive number
    - Validate paymentMethod is one of "Square", "PayPal", "Zelle"
    - Return `{ valid: true/false, errors: [...] }` with per-field error messages
    - _Requirements: 1.3, 1.4_

  - [ ]\* 2.2 Write property test: validation rejects invalid records
    - **Property 1: Form validation rejects invalid donor records**
    - **Validates: Requirements 1.3, 1.4**

  - [ ]\* 2.3 Write property test: valid data produces receipt
    - **Property 2: Valid form data produces a receipt**
    - **Validates: Requirements 1.2**

  - [ ] 2.4 Implement `parseCSV(text)` in `donation-receipts.js`
    - Parse CSV string with header row (name, address, amount, date, paymentMethod, email, memo)
    - Handle quoted fields containing commas
    - Validate each row using `validateForm`
    - Return `{ records: [...], errors: [...] }` with row-level error details
    - Handle edge cases: empty input, unreadable format, no valid rows
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ]\* 2.5 Write property test: CSV round-trip parsing
    - **Property 3: CSV round-trip parsing**
    - **Validates: Requirements 2.1, 2.2**

  - [ ]\* 2.6 Write property test: CSV validation catches missing fields
    - **Property 4: CSV validation catches rows with missing required fields**
    - **Validates: Requirements 2.3**

- [ ] 3. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Implement receipt rendering
  - [ ] 4.1 Implement `generateReceipt(donorRecord, year, sequenceNum)` in `donation-receipts.js`
    - Create a `<section class="receipt">` DOM element containing:
      - GAMEC logo (`images/logo-circle.png`)
      - Organization name "GAMEC Inc.", address "3420 13th St SE, Washington, DC 20032", phone "+1 (202) 440-9089"
      - Receipt number via `formatReceiptNumber`
      - "Donation Receipt for Tax Year YYYY"
      - Donor name, address, amount (via `formatCurrency`), date, payment method
      - If memo provided, a "Purpose" section with the memo text
      - Tax disclosure text: "No goods or services were provided in exchange for this contribution. This donation is tax-deductible to the fullest extent allowed by law. GAMEC Inc. is a 501(c)(3) tax-exempt organization. EIN: [EIN_NUMBER]"
      - "Authorized Signature" line with date line
      - If donor email provided, an "Email to Donor" button using `buildMailtoLink`
    - Return the DOM element
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 8.2, 8.5_

  - [ ] 4.2 Implement `renderPreviewTable(records, errors)` in `donation-receipts.js`
    - Render a table showing parsed CSV records in the preview container
    - Highlight invalid rows in red with per-field error messages
    - _Requirements: 2.2, 2.3_

  - [ ]\* 4.3 Write property test: receipt count matches donor count
    - **Property 5: Receipt count matches donor record count**
    - **Validates: Requirements 2.5**

  - [ ]\* 4.4 Write property test: receipt contains required static content
    - **Property 6: Receipt contains all required static content**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.7, 3.8**

  - [ ]\* 4.5 Write property test: receipt number format
    - **Property 7: Receipt number format**
    - **Validates: Requirements 3.5**

  - [ ]\* 4.6 Write property test: receipt contains donor-specific content
    - **Property 8: Receipt contains donor-specific content and tax year**
    - **Validates: Requirements 3.6, 3.9, 9.3**

  - [ ]\* 4.7 Write property test: currency formatting
    - **Property 14: Currency formatting**
    - **Validates: Requirements 3.6**

- [ ] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement sequence management and year filtering
  - [ ]\* 6.1 Write property test: sequence increment and persistence
    - **Property 9: Sequence number increment and persistence**
    - **Validates: Requirements 5.1, 5.2**

  - [ ]\* 6.2 Write property test: manual sequence override
    - **Property 10: Manual sequence override**
    - **Validates: Requirements 5.4**

  - [ ]\* 6.3 Write property test: email button presence
    - **Property 11: Email button presence based on donor email**
    - **Validates: Requirements 8.2, 8.5**

  - [ ]\* 6.4 Write property test: mailto link correctness
    - **Property 12: Mailto link correctness**
    - **Validates: Requirements 8.3, 8.4**

  - [ ]\* 6.5 Write property test: year filtering
    - **Property 13: Year filtering**
    - **Validates: Requirements 9.2**

- [ ] 7. Wire everything together with event listeners
  - [ ] 7.1 Implement `initReceiptGenerator()` and bind all UI event listeners
    - Tab toggle between Single Entry and CSV Import views
    - Single entry form submit: validate → generate receipt → append to `#receipt-output` → increment sequence
    - CSV file input change: read file → parse → render preview table
    - Generate button (CSV mode): generate receipts for all valid records → append to `#receipt-output` → increment sequence per receipt
    - Print All button: call `window.print()` (show alert if no receipts)
    - Clear button: clear `#receipt-output`
    - Year selector change: update displayed next receipt number
    - Sequence override field: call `setSequence` on change
    - Call `initReceiptGenerator()` on DOMContentLoaded
    - Handle localStorage unavailable gracefully (fallback to sequence 1, show warning)
    - _Requirements: 1.2, 2.5, 4.1, 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 9.1, 9.2_

  - [ ]\* 7.2 Write unit tests for UI and integration concerns
    - Form renders with all required fields (Req 1.1)
    - Print button exists (Req 4.1)
    - Sequence number override field exists (Req 5.3)
    - Year selector defaults to current year (Req 9.1)
    - Internal-use notice banner present (Req 7.4)
    - Meta robots tag is "noindex, nofollow" (Req 7.3)
    - Receipt page not in sitemap.xml (Req 7.2)
    - Donor email field exists in form (Req 8.1)
    - Empty/invalid CSV returns error (Req 2.4)
    - localStorage unavailable fallback (edge case)
    - _Requirements: 1.1, 2.4, 4.1, 5.3, 7.2, 7.3, 7.4, 8.1, 9.1_

- [ ] 8. Verify internal-only access constraints
  - [ ] 8.1 Confirm `donation-receipts.html` is not linked from navigation, footer, or any public page
    - Check `header.html` and `footer.html` do not reference `donation-receipts.html`
    - Check `sitemap.xml` does not include the page
    - _Requirements: 7.1, 7.2_

- [ ] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The JS module attaches functions to `window` for testability (no bundler in this project)
- All receipts render as DOM elements for print/PDF via browser's native print dialog
