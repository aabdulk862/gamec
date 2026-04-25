# Requirements Document

## Introduction

GAMEC Inc. is a 501(c)(3) non-profit organization that receives donations via Square, PayPal, and Zelle. The organization maintains a list of donors and needs a simple, practical system to generate tax-deductible donation receipts/invoices. Each receipt must include the GAMEC logo, organization details, donor information, donation details, and the IRS-required tax-deductibility statement. The system should be a lightweight, client-side HTML tool that generates printable/PDF-ready receipts from donor data — no backend required.

## Glossary

- **Receipt_Generator**: The client-side web page that accepts donor and donation data and produces a formatted, printable donation receipt
- **Receipt**: A formatted document containing donor information, donation details, the GAMEC logo, and the IRS tax-deductibility disclosure, suitable for printing or saving as PDF
- **Donor_Record**: A data entry representing a single donor, including name, address, donation amount, donation date, and payment method
- **Donor_List**: A collection of Donor_Records, provided as CSV input or entered manually through the Receipt_Generator form
- **Tax_Disclosure**: The IRS-required statement confirming that no goods or services were provided in exchange for the donation and that the contribution is tax-deductible to the extent allowed by law
- **Payment_Method**: One of the accepted donation channels: Square, PayPal, or Zelle
- **Receipt_Number**: A unique identifier assigned to each generated receipt for record-keeping purposes

## Requirements

### Requirement 1: Single Donation Receipt Entry

**User Story:** As a GAMEC administrator, I want to enter a single donor's information into a form, so that I can generate a receipt for that donor.

#### Acceptance Criteria

1. THE Receipt_Generator SHALL display a form with fields for: donor full name, donor address, donation amount, donation date, payment method, and an optional memo/purpose field
2. WHEN the administrator submits the form with valid data, THE Receipt_Generator SHALL produce a formatted Receipt
3. IF any required field is left empty, THEN THE Receipt_Generator SHALL display a descriptive validation error message next to the empty field
4. THE Receipt_Generator SHALL restrict the Payment_Method field to the values: Square, PayPal, or Zelle

### Requirement 2: CSV Bulk Import

**User Story:** As a GAMEC administrator, I want to upload a CSV file of donors, so that I can generate multiple receipts at once from the existing donor list.

#### Acceptance Criteria

1. THE Receipt_Generator SHALL accept a CSV file upload containing Donor_Records with columns: name, address, amount, date, payment method, and optional memo
2. WHEN a valid CSV file is uploaded, THE Receipt_Generator SHALL parse the file and display a preview table of all Donor_Records before generating receipts
3. IF the CSV file contains rows with missing required fields, THEN THE Receipt_Generator SHALL highlight the invalid rows and display a descriptive error for each
4. IF the CSV file format is unreadable or contains no valid rows, THEN THE Receipt_Generator SHALL display an error message describing the problem
5. WHEN the administrator confirms the previewed records, THE Receipt_Generator SHALL generate one Receipt per Donor_Record

### Requirement 3: Receipt Content and Layout

**User Story:** As a GAMEC administrator, I want each receipt to contain all required information with the GAMEC branding, so that donors receive a professional, IRS-compliant document.

#### Acceptance Criteria

1. THE Receipt SHALL display the GAMEC logo (images/logo-circle.png) at the top of the document
2. THE Receipt SHALL display the organization name "GAMEC Inc. — Global Association of Muslim Eritrean Communities"
3. THE Receipt SHALL display the organization address: 3420 13th St SE, Washington, DC 20032
4. THE Receipt SHALL display the organization phone number: +1 (202) 440-9089
5. THE Receipt SHALL display a unique Receipt_Number in the format "GAMEC-YYYY-NNNN" where YYYY is the donation year and NNNN is a sequential zero-padded number
6. THE Receipt SHALL display the donor full name, donor address, donation amount (formatted as USD currency), donation date, and payment method
7. THE Receipt SHALL display the Tax_Disclosure: "No goods or services were provided in exchange for this contribution. This donation is tax-deductible to the fullest extent allowed by law. GAMEC Inc. is a 501(c)(3) tax-exempt organization. EIN: [EIN_NUMBER]"
8. THE Receipt SHALL display a signature line with the label "Authorized Signature" and a date line
9. WHEN a memo or purpose is provided, THE Receipt SHALL display the memo in a designated "Purpose" section

### Requirement 4: Print and PDF Export

**User Story:** As a GAMEC administrator, I want to print receipts or save them as PDF files, so that I can distribute them to donors physically or electronically.

#### Acceptance Criteria

1. THE Receipt_Generator SHALL provide a "Print" button that triggers the browser print dialog for the currently displayed Receipt
2. WHILE the print dialog is active, THE Receipt_Generator SHALL apply a print-optimized stylesheet that hides the form, navigation, and non-receipt elements
3. WHEN multiple receipts are generated from a CSV import, THE Receipt_Generator SHALL insert page breaks between each Receipt so that each prints on a separate page
4. THE Receipt SHALL render at a width suitable for standard US Letter paper (8.5 x 11 inches)

### Requirement 5: Receipt Number Management

**User Story:** As a GAMEC administrator, I want receipt numbers to be tracked and sequential, so that I can maintain organized records.

#### Acceptance Criteria

1. THE Receipt_Generator SHALL store the last used receipt sequence number in the browser localStorage
2. WHEN a new Receipt is generated, THE Receipt_Generator SHALL increment the sequence number and assign the next Receipt_Number
3. THE Receipt_Generator SHALL provide a field allowing the administrator to manually set or reset the starting sequence number
4. IF the administrator sets a new starting number, THEN THE Receipt_Generator SHALL use that number for the next generated Receipt and continue sequentially from that point

### Requirement 6: Client-Side Operation

**User Story:** As a GAMEC administrator, I want the receipt system to work entirely in the browser with no server or database, so that it is simple to use and maintain.

#### Acceptance Criteria

1. THE Receipt_Generator SHALL operate entirely in the browser using HTML, CSS, and JavaScript with no server-side dependencies
2. THE Receipt_Generator SHALL function without an internet connection after the page has been loaded once (excluding external font loading)
3. THE Receipt_Generator SHALL match the existing GAMEC website design system, including the color palette, typography, and button styles defined in main.css

### Requirement 7: Internal-Only Access

**User Story:** As a GAMEC administrator, I want the receipt generator to be accessible only to authorized staff, so that donor information and receipt generation are not exposed to the public.

#### Acceptance Criteria

1. THE Receipt_Generator page SHALL NOT be linked from the site navigation, footer, sitemap, or any public-facing page
2. THE Receipt_Generator SHALL NOT be included in the sitemap.xml file
3. THE Receipt_Generator SHALL be excluded from search engine indexing via a "noindex, nofollow" meta robots tag
4. THE Receipt_Generator SHALL display a notice at the top of the page stating "Internal Use Only — GAMEC Administration"

### Requirement 8: Email to Donor via Mailto

**User Story:** As a GAMEC administrator, I want to quickly email a receipt to a donor, so that I can deliver their tax receipt without leaving the browser.

#### Acceptance Criteria

1. THE Receipt_Generator form SHALL include an optional "Donor Email" field for both single entry and CSV import (as an additional column)
2. WHEN a Receipt is generated and a donor email is provided, THE Receipt_Generator SHALL display an "Email to Donor" button next to that Receipt
3. WHEN the administrator clicks "Email to Donor", THE Receipt_Generator SHALL open the default email client via a mailto: link with the donor's email in the "To" field, a subject line of "Your GAMEC Donation Receipt — [Receipt_Number]", and a body message thanking the donor and instructing them that the receipt is attached
4. THE mailto body SHALL include a reminder for the administrator to attach the saved PDF before sending
5. WHEN multiple receipts are generated from CSV, THE Receipt_Generator SHALL display an "Email to Donor" button for each Receipt that has an associated donor email

### Requirement 9: Donation Year Filtering

**User Story:** As a GAMEC administrator, I want to filter or group receipts by year, so that I can generate end-of-year tax receipts for donors.

#### Acceptance Criteria

1. THE Receipt_Generator SHALL provide a year selector that defaults to the current calendar year
2. WHEN generating receipts from a CSV import, THE Receipt_Generator SHALL use the selected year to filter Donor_Records whose donation date falls within that year
3. THE Receipt SHALL display the text "Donation Receipt for Tax Year [YYYY]" where YYYY is the selected year
