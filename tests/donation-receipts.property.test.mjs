/** @vitest-environment jsdom */
/**
 * Donation Receipts Property Tests
 * Feature: donation-invoice-system
 *
 * Property-based tests for correctness properties from the design document.
 * Uses vitest + fast-check.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import * as fc from "fast-check";

// Polyfill globalThis.localStorage with a simple in-memory implementation
// before loading the module. Node.js has a built-in localStorage object that
// lacks setItem/getItem methods, which breaks the donation-receipts module.
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
  validateForm,
  parseCSV,
  generateReceipt,
  formatReceiptNumber,
  formatCurrency,
  getNextSequence,
  setSequence,
  buildMailtoLink,
  filterByYear,
} = require("../assets/js/donation-receipts.js");

const VALID_PAYMENT_METHODS = ["Square", "PayPal", "Zelle"];

/** Arbitrary that produces a non-empty trimmed string. */
const nonEmptyString = fc
  .string({ minLength: 1 })
  .filter((s) => s.trim().length > 0);

/** Arbitrary that produces a valid donor record. */
const validDonorRecord = fc.record({
  name: nonEmptyString,
  address: nonEmptyString,
  amount: fc.double({ min: 0.01, max: 1_000_000, noNaN: true }),
  date: fc
    .date({ min: new Date("2000-01-01"), max: new Date("2099-12-31") })
    .filter((d) => !isNaN(d.getTime()))
    .map((d) => d.toISOString().slice(0, 10)),
  paymentMethod: fc.constantFrom(...VALID_PAYMENT_METHODS),
});

// ─── Property 1 ──────────────────────────────────────────────────────────────
describe("Feature: donation-invoice-system, Property 1: Form validation rejects invalid donor records", () => {
  /** **Validates: Requirements 1.3, 1.4** */

  it("property: records with at least one required field missing/empty are rejected", () => {
    const REQUIRED_FIELDS = [
      "name",
      "address",
      "amount",
      "date",
      "paymentMethod",
    ];

    fc.assert(
      fc.property(
        validDonorRecord,
        fc.subarray(REQUIRED_FIELDS, { minLength: 1 }),
        fc.constantFrom("", "  ", undefined, null),
        (record, fieldsToEmpty, emptyValue) => {
          const invalid = { ...record };
          for (const field of fieldsToEmpty) {
            invalid[field] = emptyValue;
          }
          const result = validateForm(invalid);
          expect(result.valid).toBe(false);
          expect(result.errors).toBeDefined();
          expect(result.errors.length).toBeGreaterThan(0);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("property: records with invalid payment methods are rejected", () => {
    fc.assert(
      fc.property(
        validDonorRecord,
        nonEmptyString.filter((s) => !VALID_PAYMENT_METHODS.includes(s)),
        (record, badMethod) => {
          const invalid = { ...record, paymentMethod: badMethod };
          const result = validateForm(invalid);
          expect(result.valid).toBe(false);
          expect(result.errors).toBeDefined();
          expect(result.errors.length).toBeGreaterThan(0);
          expect(result.errors.some((e) => e.field === "paymentMethod")).toBe(
            true,
          );
        },
      ),
      { numRuns: 100 },
    );
  });

  it("property: records with non-positive amounts are rejected", () => {
    fc.assert(
      fc.property(
        validDonorRecord,
        fc.oneof(
          fc.constant(0),
          fc.double({ min: -1_000_000, max: -0.01, noNaN: true }),
          fc.constant(NaN),
        ),
        (record, badAmount) => {
          const invalid = { ...record, amount: badAmount };
          const result = validateForm(invalid);
          expect(result.valid).toBe(false);
          expect(result.errors).toBeDefined();
          expect(result.errors.length).toBeGreaterThan(0);
          expect(result.errors.some((e) => e.field === "amount")).toBe(true);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ─── Property 2 ──────────────────────────────────────────────────────────────
describe("Feature: donation-invoice-system, Property 2: Valid form data produces a receipt", () => {
  /** **Validates: Requirements 1.2** */

  it("property: valid donor records pass validation", () => {
    fc.assert(
      fc.property(validDonorRecord, (record) => {
        const result = validateForm(record);
        expect(result.valid).toBe(true);
        expect(result.errors).toBeDefined();
        expect(result.errors.length).toBe(0);
      }),
      { numRuns: 100 },
    );
  });
});

// ─── Property 3 ──────────────────────────────────────────────────────────────
describe("Feature: donation-invoice-system, Property 3: CSV round-trip parsing", () => {
  /** **Validates: Requirements 2.1, 2.2** */

  /** Arbitrary for CSV-safe non-empty strings (no newlines, trimmed). */
  const csvSafeString = fc
    .string({ minLength: 1 })
    .filter(
      (s) => s.trim().length > 0 && !s.includes("\n") && !s.includes("\r"),
    )
    .map((s) => s.trim());

  /** Arbitrary that produces a valid donor record with optional email and memo. */
  const validDonorRecordWithOptionals = fc.record({
    name: csvSafeString,
    address: csvSafeString,
    amount: fc.double({ min: 0.01, max: 1_000_000, noNaN: true }),
    date: fc
      .date({ min: new Date("2000-01-01"), max: new Date("2099-12-31") })
      .filter((d) => !isNaN(d.getTime()))
      .map((d) => d.toISOString().slice(0, 10)),
    paymentMethod: fc.constantFrom(...VALID_PAYMENT_METHODS),
    email: fc.oneof(fc.constant(""), fc.emailAddress()),
    memo: fc.oneof(fc.constant(""), csvSafeString),
  });

  /**
   * Escapes and quotes a CSV field value.
   * Wraps in double quotes if the value contains a comma, double quote, or newline.
   * Embedded double quotes are escaped by doubling them.
   * @param {string} value
   * @returns {string}
   */
  function csvField(value) {
    const str = String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  /**
   * Serializes an array of donor records to a CSV string with header row.
   * @param {Array<Object>} records
   * @returns {string}
   */
  function serializeToCSV(records) {
    const header = "name,address,amount,date,paymentMethod,email,memo";
    const rows = records.map((r) =>
      [
        csvField(r.name),
        csvField(r.address),
        String(r.amount),
        csvField(r.date),
        csvField(r.paymentMethod),
        csvField(r.email),
        csvField(r.memo),
      ].join(","),
    );
    return [header, ...rows].join("\n");
  }

  it("property: serializing donor records to CSV and parsing back produces equivalent records", () => {
    fc.assert(
      fc.property(
        fc.array(validDonorRecordWithOptionals, { minLength: 1, maxLength: 5 }),
        (records) => {
          const csv = serializeToCSV(records);
          const result = parseCSV(csv);

          // Parsed record count matches input count
          expect(result.records.length).toBe(records.length);

          // Each parsed record has the same field values as the original
          for (let i = 0; i < records.length; i++) {
            const original = records[i];
            const parsed = result.records[i];

            expect(parsed.name).toBe(original.name);
            expect(parsed.address).toBe(original.address);
            expect(Number(parsed.amount)).toBeCloseTo(original.amount, 2);
            expect(parsed.date).toBe(original.date);
            expect(parsed.paymentMethod).toBe(original.paymentMethod);
            expect(parsed.email).toBe(original.email);
            expect(parsed.memo).toBe(original.memo);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ─── Property 4 ──────────────────────────────────────────────────────────────
describe("Feature: donation-invoice-system, Property 4: CSV validation catches rows with missing required fields", () => {
  /** **Validates: Requirements 2.3** */

  const REQUIRED_FIELDS = [
    "name",
    "address",
    "amount",
    "date",
    "paymentMethod",
  ];

  /** Arbitrary for CSV-safe non-empty strings (no newlines, trimmed). */
  const csvSafeString = fc
    .string({ minLength: 1 })
    .filter(
      (s) => s.trim().length > 0 && !s.includes("\n") && !s.includes("\r"),
    )
    .map((s) => s.trim());

  /** Arbitrary that produces a valid donor record with optional email and memo. */
  const validDonorRecordWithOptionals = fc.record({
    name: csvSafeString,
    address: csvSafeString,
    amount: fc.double({ min: 0.01, max: 1_000_000, noNaN: true }),
    date: fc
      .date({ min: new Date("2000-01-01"), max: new Date("2099-12-31") })
      .filter((d) => !isNaN(d.getTime()))
      .map((d) => d.toISOString().slice(0, 10)),
    paymentMethod: fc.constantFrom(...VALID_PAYMENT_METHODS),
    email: fc.oneof(fc.constant(""), fc.emailAddress()),
    memo: fc.oneof(fc.constant(""), csvSafeString),
  });

  /**
   * Escapes and quotes a CSV field value.
   */
  function csvField(value) {
    const str = String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  /**
   * Serializes a single donor record to a CSV row string (no header).
   */
  function recordToCSVRow(r) {
    return [
      csvField(r.name),
      csvField(r.address),
      String(r.amount),
      csvField(r.date),
      csvField(r.paymentMethod),
      csvField(r.email),
      csvField(r.memo),
    ].join(",");
  }

  it("property: rows with blanked required fields appear in parseCSV errors with descriptive messages", () => {
    fc.assert(
      fc.property(
        validDonorRecordWithOptionals,
        fc.subarray(REQUIRED_FIELDS, { minLength: 1 }),
        (record, fieldsToClear) => {
          // Build a copy with the selected required fields blanked out
          const blanked = { ...record };
          for (const field of fieldsToClear) {
            blanked[field] = "";
          }

          // Serialize to CSV with header + one data row
          const header = "name,address,amount,date,paymentMethod,email,memo";
          const row = recordToCSVRow(blanked);
          const csv = header + "\n" + row;

          const result = parseCSV(csv);

          // The blanked row must appear in errors
          expect(result.errors.length).toBeGreaterThan(0);

          // Collect all field-level error field names from the errors array
          const errorFieldNames = result.errors.flatMap((e) =>
            (e.fields || []).map((f) => f.field),
          );

          // Each blanked required field should be mentioned in the errors
          for (const field of fieldsToClear) {
            expect(errorFieldNames).toContain(field);
          }

          // The error messages should be descriptive (non-empty strings)
          for (const err of result.errors) {
            expect(typeof err.message).toBe("string");
            expect(err.message.length).toBeGreaterThan(0);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ─── Property 5 ──────────────────────────────────────────────────────────────
describe("Feature: donation-invoice-system, Property 5: Receipt count matches donor record count", () => {
  /** **Validates: Requirements 2.5** */

  /** Arbitrary that produces a valid donor record with optional email and memo (DOM-safe). */
  const validDonorRecordFull = fc.record({
    name: nonEmptyString,
    address: nonEmptyString,
    amount: fc.double({ min: 0.01, max: 1_000_000, noNaN: true }),
    date: fc
      .date({ min: new Date("2000-01-01"), max: new Date("2099-12-31") })
      .filter((d) => !isNaN(d.getTime()))
      .map((d) => d.toISOString().slice(0, 10)),
    paymentMethod: fc.constantFrom(...VALID_PAYMENT_METHODS),
    email: fc.oneof(fc.constant(""), fc.emailAddress()),
    memo: fc.oneof(fc.constant(""), nonEmptyString),
  });

  it("property: generating receipts for N donor records produces exactly N DOM elements", () => {
    fc.assert(
      fc.property(
        fc.array(validDonorRecordFull, { minLength: 1, maxLength: 5 }),
        fc.integer({ min: 2000, max: 2099 }),
        (records, year) => {
          const receipts = records.map((record, index) =>
            generateReceipt(record, year, index + 1),
          );

          // Total count of generated receipts equals input array length
          expect(receipts.length).toBe(records.length);

          // Each call returns a non-null DOM element
          for (const receipt of receipts) {
            expect(receipt).not.toBeNull();
            expect(receipt).toBeInstanceOf(HTMLElement);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ─── Property 6 ──────────────────────────────────────────────────────────────
describe("Feature: donation-invoice-system, Property 6: Receipt contains all required static content", () => {
  /** **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.7, 3.8** */

  /** Arbitrary that produces a valid donor record with optional email and memo. */
  const validDonorRecordFull = fc.record({
    name: nonEmptyString,
    address: nonEmptyString,
    amount: fc.double({ min: 0.01, max: 1_000_000, noNaN: true }),
    date: fc
      .date({ min: new Date("2000-01-01"), max: new Date("2099-12-31") })
      .filter((d) => !isNaN(d.getTime()))
      .map((d) => d.toISOString().slice(0, 10)),
    paymentMethod: fc.constantFrom(...VALID_PAYMENT_METHODS),
    email: fc.oneof(fc.constant(""), fc.emailAddress()),
    memo: fc.oneof(fc.constant(""), nonEmptyString),
  });

  it("property: every generated receipt contains all required static content", () => {
    fc.assert(
      fc.property(
        validDonorRecordFull,
        fc.integer({ min: 2000, max: 2099 }),
        fc.integer({ min: 1, max: 9999 }),
        (record, year, sequenceNum) => {
          const receipt = generateReceipt(record, year, sequenceNum);
          const html = receipt.innerHTML;

          // (a) an <img> with src including "logo-circle.png"
          const img = receipt.querySelector("img");
          expect(img).not.toBeNull();
          expect(img.src).toContain("logo-circle.png");

          // (b) the text "GAMEC Inc."
          expect(html).toContain("GAMEC Inc.");

          // (c) "3420 13th St SE, Washington, DC 20032"
          expect(html).toContain("3420 13th St SE, Washington, DC 20032");

          // (d) "+1 (202) 440-9089"
          expect(html).toContain("+1 (202) 440-9089");

          // (e) the tax disclosure text
          expect(html).toContain(
            "No goods or services were provided in exchange for this contribution",
          );

          // (f) the text "Authorized Signature"
          expect(html).toContain("Authorized Signature");
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ─── Property 7 ──────────────────────────────────────────────────────────────
describe("Feature: donation-invoice-system, Property 7: Receipt number format", () => {
  /** **Validates: Requirements 3.5** */

  it("property: formatReceiptNumber returns GAMEC-YYYY-NNNN with correct year and zero-padded sequence", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2000, max: 2099 }),
        fc.integer({ min: 1, max: 9999 }),
        (year, seq) => {
          const result = formatReceiptNumber(year, seq);

          // Matches the overall pattern GAMEC-YYYY-NNNN
          expect(result).toMatch(/^GAMEC-\d{4}-\d{4}$/);

          // Year portion equals the input year
          const parts = result.split("-");
          expect(Number(parts[1])).toBe(year);

          // Sequence portion equals the zero-padded input sequence
          const expectedSeq = String(seq).padStart(4, "0");
          expect(parts[2]).toBe(expectedSeq);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ─── Property 8 ──────────────────────────────────────────────────────────────
describe("Feature: donation-invoice-system, Property 8: Receipt contains donor-specific content and tax year", () => {
  /** **Validates: Requirements 3.6, 3.9, 9.3** */

  /** Arbitrary that produces a valid donor record with optional email and memo. */
  const validDonorRecordFull = fc.record({
    name: nonEmptyString,
    address: nonEmptyString,
    amount: fc.double({ min: 0.01, max: 1_000_000, noNaN: true }),
    date: fc
      .date({ min: new Date("2000-01-01"), max: new Date("2099-12-31") })
      .filter((d) => !isNaN(d.getTime()))
      .map((d) => d.toISOString().slice(0, 10)),
    paymentMethod: fc.constantFrom(...VALID_PAYMENT_METHODS),
    email: fc.oneof(fc.constant(""), fc.emailAddress()),
    memo: fc.oneof(fc.constant(""), nonEmptyString),
  });

  it("property: every generated receipt contains donor-specific content and tax year heading", () => {
    fc.assert(
      fc.property(
        validDonorRecordFull,
        fc.integer({ min: 2000, max: 2099 }),
        fc.integer({ min: 1, max: 9999 }),
        (record, year, sequenceNum) => {
          const receipt = generateReceipt(record, year, sequenceNum);
          const html = receipt.innerHTML;
          const text = receipt.textContent;

          // (a) Donor's full name
          expect(text).toContain(record.name);

          // (b) Donor's address
          expect(text).toContain(record.address);

          // (c) Donation amount formatted as USD currency
          const formattedAmount = formatCurrency(record.amount);
          expect(html).toContain(formattedAmount);

          // (d) Donation date
          expect(text).toContain(record.date);

          // (e) Payment method
          expect(text).toContain(record.paymentMethod);

          // (f) Tax year heading
          expect(text).toContain(
            "Donation Receipt for Tax Year " + String(year),
          );

          // (g) If memo is non-empty, receipt contains "Purpose" and the memo text
          if (record.memo && record.memo.trim() !== "") {
            expect(text).toContain("Purpose");
            expect(text).toContain(record.memo);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ─── Property 14 ─────────────────────────────────────────────────────────────
describe("Feature: donation-invoice-system, Property 14: Currency formatting", () => {
  /** **Validates: Requirements 3.6** */

  it("property: formatCurrency returns a string starting with '$', with commas for thousands, and exactly 2 decimal places", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.01, max: 10_000_000, noNaN: true }),
        (amount) => {
          const result = formatCurrency(amount);

          // Starts with "$"
          expect(result.startsWith("$")).toBe(true);

          // Ends with exactly 2 decimal places
          expect(result).toMatch(/\.\d{2}$/);

          // For amounts >= 1000, the result should contain commas as thousands separators
          if (amount >= 1000) {
            // Strip the "$" prefix and check the numeric portion before the decimal
            const numericPart = result.slice(1); // remove "$"
            const integerPart = numericPart.split(".")[0];
            expect(integerPart).toContain(",");

            // Verify proper comma placement: groups of 3 digits separated by commas
            expect(integerPart).toMatch(/^\d{1,3}(,\d{3})*$/);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ─── Property 9 ──────────────────────────────────────────────────────────────
describe("Feature: donation-invoice-system, Property 9: Sequence number increment and persistence", () => {
  /** **Validates: Requirements 5.1, 5.2** */

  it("property: getNextSequence returns N+1 and persists N+1 in localStorage", () => {
    const key = "gamec-receipt-sequences";

    fc.assert(
      fc.property(
        fc.integer({ min: 2000, max: 2099 }),
        fc.integer({ min: 0, max: 9998 }),
        (year, startingN) => {
          // Set up localStorage with the starting sequence for this year
          const yearStr = String(year);
          const setup = {};
          setup[yearStr] = startingN;
          localStorage.setItem(key, JSON.stringify(setup));

          // Call getNextSequence
          const result = getNextSequence(year);

          // Assert the return value is N+1
          expect(result).toBe(startingN + 1);

          // Read localStorage and assert the stored value for that year is now N+1
          const stored = JSON.parse(localStorage.getItem(key));
          expect(stored[yearStr]).toBe(startingN + 1);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ─── Property 10 ─────────────────────────────────────────────────────────────
describe("Feature: donation-invoice-system, Property 10: Manual sequence override", () => {
  /** **Validates: Requirements 5.4** */

  it("property: after setSequence(year, M-1), getNextSequence returns M, then M+1", () => {
    const key = "gamec-receipt-sequences";

    fc.assert(
      fc.property(
        fc.integer({ min: 2000, max: 2099 }),
        fc.integer({ min: 1, max: 9998 }),
        (year, M) => {
          // Clear localStorage to start fresh
          localStorage.clear();

          // Set the sequence to M-1 (simulating admin override)
          setSequence(year, M - 1);

          // Next call should return M
          const first = getNextSequence(year);
          expect(first).toBe(M);

          // Subsequent call should return M+1
          const second = getNextSequence(year);
          expect(second).toBe(M + 1);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ─── Property 11 ─────────────────────────────────────────────────────────────
describe("Feature: donation-invoice-system, Property 11: Email button presence based on donor email", () => {
  /** **Validates: Requirements 8.2, 8.5** */

  /** Arbitrary that produces a valid donor record with email being either a valid email or empty. */
  const donorRecordWithOptionalEmail = fc.record({
    name: nonEmptyString,
    address: nonEmptyString,
    amount: fc.double({ min: 0.01, max: 1_000_000, noNaN: true }),
    date: fc
      .date({ min: new Date("2000-01-01"), max: new Date("2099-12-31") })
      .filter((d) => !isNaN(d.getTime()))
      .map((d) => d.toISOString().slice(0, 10)),
    paymentMethod: fc.constantFrom(...VALID_PAYMENT_METHODS),
    email: fc.oneof(fc.constant(""), fc.emailAddress()),
    memo: fc.oneof(fc.constant(""), nonEmptyString),
  });

  it("property: receipt contains 'Email to Donor' button iff donor email is non-empty", () => {
    fc.assert(
      fc.property(
        donorRecordWithOptionalEmail,
        fc.integer({ min: 2000, max: 2099 }),
        fc.integer({ min: 1, max: 9999 }),
        (record, year, sequenceNum) => {
          const receipt = generateReceipt(record, year, sequenceNum);
          const emailBtn = receipt.querySelector(".email-donor-btn");

          if (record.email && record.email.trim() !== "") {
            // Non-empty email: button must exist and contain "Email to Donor"
            expect(emailBtn).not.toBeNull();
            expect(emailBtn.textContent).toContain("Email to Donor");
          } else {
            // Empty/absent email: no such button
            expect(emailBtn).toBeNull();
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ─── Property 12 ─────────────────────────────────────────────────────────────
describe("Feature: donation-invoice-system, Property 12: Mailto link correctness", () => {
  /** **Validates: Requirements 8.3, 8.4** */

  /** Arbitrary that produces a receipt number in GAMEC-YYYY-NNNN format. */
  const receiptNumberArb = fc
    .tuple(
      fc.integer({ min: 2000, max: 2099 }),
      fc.integer({ min: 1, max: 9999 }),
    )
    .map(([year, seq]) => "GAMEC-" + year + "-" + String(seq).padStart(4, "0"));

  it("property: buildMailtoLink returns a valid mailto URL with email, subject containing receipt number, and body with thank-you and PDF reminder", () => {
    fc.assert(
      fc.property(
        fc.emailAddress(),
        receiptNumberArb,
        (email, receiptNumber) => {
          const result = buildMailtoLink(email, receiptNumber);

          // (1) Starts with "mailto:"
          expect(result.startsWith("mailto:")).toBe(true);

          // (2) Contains the email (URL-encoded) in the "to" field
          expect(result).toContain(encodeURIComponent(email));

          // (3) Contains "subject=" with the receipt number in it
          expect(result).toContain("subject=");
          // Decode the subject portion and verify it contains the receipt number
          const subjectMatch = result.match(/subject=([^&]*)/);
          expect(subjectMatch).not.toBeNull();
          const decodedSubject = decodeURIComponent(subjectMatch[1]);
          expect(decodedSubject).toContain(receiptNumber);

          // (4) Contains "body=" with thank-you text and PDF attachment reminder
          expect(result).toContain("body=");
          const bodyMatch = result.match(/body=(.*)/);
          expect(bodyMatch).not.toBeNull();
          const decodedBody = decodeURIComponent(bodyMatch[1]);

          // Body contains a thank-you message
          expect(decodedBody.toLowerCase()).toContain("thank");

          // Body contains a reminder to attach the PDF
          expect(decodedBody.toLowerCase()).toContain("attach");
          expect(decodedBody.toLowerCase()).toContain("pdf");
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ─── Property 13 ─────────────────────────────────────────────────────────────
describe("Feature: donation-invoice-system, Property 13: Year filtering", () => {
  /** **Validates: Requirements 9.2** */

  /** Years to span across generated records. */
  const YEAR_MIN = 2020;
  const YEAR_MAX = 2026;

  /** Arbitrary that produces a donor record with a date in a specific year. */
  const donorRecordInYear = (year) =>
    fc.record({
      name: nonEmptyString,
      address: nonEmptyString,
      amount: fc.double({ min: 0.01, max: 1_000_000, noNaN: true }),
      date: fc
        .date({
          min: new Date(`${year}-01-01`),
          max: new Date(`${year}-12-31`),
        })
        .filter((d) => !isNaN(d.getTime()))
        .map((d) => d.toISOString().slice(0, 10)),
      paymentMethod: fc.constantFrom(...VALID_PAYMENT_METHODS),
      email: fc.oneof(fc.constant(""), fc.emailAddress()),
      memo: fc.oneof(fc.constant(""), nonEmptyString),
    });

  /** Arbitrary that produces an array of 1-10 donor records with dates spanning multiple years (2020-2026). */
  const multiYearRecords = fc.array(
    fc
      .integer({ min: YEAR_MIN, max: YEAR_MAX })
      .chain((year) => donorRecordInYear(year)),
    { minLength: 1, maxLength: 10 },
  );

  it("property: filterByYear returns only records whose date falls within the target year, with correct count", () => {
    fc.assert(
      fc.property(
        multiYearRecords,
        fc.integer({ min: YEAR_MIN, max: YEAR_MAX }),
        (records, targetYear) => {
          const result = filterByYear(records, targetYear);
          const targetYearStr = String(targetYear);

          // Every returned record must have a date starting with the target year
          for (const record of result) {
            expect(record.date.startsWith(targetYearStr)).toBe(true);
          }

          // Count should match the number of input records with dates in that year
          const expectedCount = records.filter((r) =>
            r.date.startsWith(targetYearStr),
          ).length;
          expect(result.length).toBe(expectedCount);
        },
      ),
      { numRuns: 100 },
    );
  });
});
