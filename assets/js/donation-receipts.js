(function () {
  /**
   * Formats a number as a USD currency string with $, commas, and 2 decimal places.
   * @param {number} amount
   * @returns {string} e.g. "$1,250.00"
   */
  function formatCurrency(amount) {
    var num = Number(amount);
    if (isNaN(num)) {
      return "$0.00";
    }
    return "$" + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  /**
   * Returns a formatted receipt number string: GAMEC-YYYY-NNNN (zero-padded).
   * @param {number} year
   * @param {number} seq
   * @returns {string} e.g. "GAMEC-2025-0001"
   */
  function formatReceiptNumber(year, seq) {
    var paddedSeq = String(seq).padStart(4, "0");
    return "GAMEC-" + String(year) + "-" + paddedSeq;
  }

  /**
   * Reads localStorage key `gamec-receipt-sequences`, increments the value for
   * the given year, writes it back, and returns the new number.
   * If no entry exists for that year, starts at 1.
   * @param {number|string} year
   * @returns {number}
   */
  function getNextSequence(year) {
    var key = "gamec-receipt-sequences";
    var sequences = {};
    try {
      var stored = localStorage.getItem(key);
      if (stored) {
        sequences = JSON.parse(stored);
      }
    } catch (e) {
      sequences = {};
    }
    var yearKey = String(year);
    var current = sequences[yearKey] || 0;
    var next = current + 1;
    sequences[yearKey] = next;
    try {
      localStorage.setItem(key, JSON.stringify(sequences));
    } catch (e) {
      // localStorage unavailable — sequence still returned but won't persist
    }
    return next;
  }

  /**
   * Writes a sequence number to localStorage for the given year.
   * @param {number|string} year
   * @param {number} num
   */
  function setSequence(year, num) {
    var key = "gamec-receipt-sequences";
    var sequences = {};
    try {
      var stored = localStorage.getItem(key);
      if (stored) {
        sequences = JSON.parse(stored);
      }
    } catch (e) {
      sequences = {};
    }
    sequences[String(year)] = num;
    try {
      localStorage.setItem(key, JSON.stringify(sequences));
    } catch (e) {
      // localStorage unavailable
    }
  }

  /**
   * Returns a mailto: URL with pre-filled subject and body.
   * Subject: "Your GAMEC Donation Receipt — [Receipt_Number]"
   * Body: Thank-you message with reminder to attach PDF.
   * @param {string} email
   * @param {string} receiptNumber
   * @returns {string}
   */
  function buildMailtoLink(email, receiptNumber) {
    var subject = "Your GAMEC Donation Receipt \u2014 " + receiptNumber;
    var body =
      "Dear Donor,\n\n" +
      "Thank you for your generous contribution to GAMEC Inc. " +
      "Please find your donation receipt (" +
      receiptNumber +
      ") attached to this email.\n\n" +
      "Reminder: Please attach the saved PDF receipt before sending this email.\n\n" +
      "May Allah bless you for your generosity.\n\n" +
      "GAMEC Inc.\n" +
      "3420 13th St SE, Washington, DC 20032\n" +
      "+1 (202) 440-9089";
    return (
      "mailto:" +
      encodeURIComponent(email) +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body)
    );
  }

  /**
   * Validates a single donor record.
   * Required fields: name, address, amount, date, paymentMethod.
   * Amount must be a positive number.
   * paymentMethod must be one of "Square", "PayPal", "Zelle".
   * @param {Object} formData
   * @returns {{ valid: boolean, errors: Array<{ field: string, message: string }> }}
   */
  function validateForm(formData) {
    var errors = [];
    var allowedMethods = ["Square", "PayPal", "Zelle"];

    if (!formData || typeof formData !== "object") {
      return {
        valid: false,
        errors: [
          { field: "name", message: "Donor name is required" },
          { field: "address", message: "Donor address is required" },
          { field: "amount", message: "Donation amount is required" },
          { field: "date", message: "Donation date is required" },
          { field: "paymentMethod", message: "Payment method is required" },
        ],
      };
    }

    // Name
    if (!formData.name || String(formData.name).trim() === "") {
      errors.push({ field: "name", message: "Donor name is required" });
    }

    // Address
    if (!formData.address || String(formData.address).trim() === "") {
      errors.push({ field: "address", message: "Donor address is required" });
    }

    // Amount
    if (
      formData.amount === undefined ||
      formData.amount === null ||
      formData.amount === ""
    ) {
      errors.push({ field: "amount", message: "Donation amount is required" });
    } else {
      var num = Number(formData.amount);
      if (isNaN(num) || num <= 0) {
        errors.push({
          field: "amount",
          message: "Please enter a valid donation amount",
        });
      }
    }

    // Date
    if (!formData.date || String(formData.date).trim() === "") {
      errors.push({ field: "date", message: "Donation date is required" });
    }

    // Payment method
    if (
      !formData.paymentMethod ||
      String(formData.paymentMethod).trim() === ""
    ) {
      errors.push({
        field: "paymentMethod",
        message: "Payment method is required",
      });
    } else if (allowedMethods.indexOf(formData.paymentMethod) === -1) {
      errors.push({
        field: "paymentMethod",
        message: "Payment method must be one of: " + allowedMethods.join(", "),
      });
    }

    return {
      valid: errors.length === 0,
      errors: errors,
    };
  }

  /**
   * Parses a single CSV line, handling quoted fields that may contain commas.
   * @param {string} line
   * @returns {string[]}
   */
  function parseCSVLine(line) {
    var fields = [];
    var current = "";
    var inQuotes = false;
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      if (inQuotes) {
        if (ch === '"') {
          if (i + 1 < line.length && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ",") {
          fields.push(current.trim());
          current = "";
        } else {
          current += ch;
        }
      }
    }
    fields.push(current.trim());
    return fields;
  }

  /**
   * Parses a CSV string with a header row into donor records.
   * Expected columns: name, address, amount, date, paymentMethod, email, memo
   * Validates each row using validateForm.
   * @param {string} text
   * @returns {{ records: Array<Object>, errors: Array<{ row: number, fields: Array, message: string }> }}
   */
  function parseCSV(text) {
    if (!text || typeof text !== "string" || text.trim() === "") {
      return {
        records: [],
        errors: [{ row: 0, message: "CSV input is empty or invalid" }],
      };
    }

    var lines = text.split(/\r?\n/).filter(function (line) {
      return line.trim() !== "";
    });

    if (lines.length < 2) {
      return {
        records: [],
        errors: [
          {
            row: 0,
            message: "CSV must contain a header row and at least one data row",
          },
        ],
      };
    }

    var headerFields = parseCSVLine(lines[0]);
    var expectedColumns = [
      "name",
      "address",
      "amount",
      "date",
      "paymentMethod",
      "email",
      "memo",
    ];

    // Map header names to indices
    var columnMap = {};
    for (var h = 0; h < headerFields.length; h++) {
      var normalized = headerFields[h].toLowerCase().replace(/[\s_-]/g, "");
      for (var e = 0; e < expectedColumns.length; e++) {
        if (normalized === expectedColumns[e].toLowerCase()) {
          columnMap[expectedColumns[e]] = h;
          break;
        }
      }
    }

    var records = [];
    var errors = [];

    for (var i = 1; i < lines.length; i++) {
      var fields = parseCSVLine(lines[i]);
      var rowNum = i; // 1-based row number (header is row 0)

      var record = {
        name: columnMap.name !== undefined ? fields[columnMap.name] || "" : "",
        address:
          columnMap.address !== undefined
            ? fields[columnMap.address] || ""
            : "",
        amount:
          columnMap.amount !== undefined ? fields[columnMap.amount] || "" : "",
        date: columnMap.date !== undefined ? fields[columnMap.date] || "" : "",
        paymentMethod:
          columnMap.paymentMethod !== undefined
            ? fields[columnMap.paymentMethod] || ""
            : "",
        email:
          columnMap.email !== undefined ? fields[columnMap.email] || "" : "",
        memo: columnMap.memo !== undefined ? fields[columnMap.memo] || "" : "",
      };

      // Convert amount to number
      var amountNum = Number(record.amount);
      if (!isNaN(amountNum)) {
        record.amount = amountNum;
      }

      var validation = validateForm(record);
      if (validation.valid) {
        records.push(record);
      } else {
        errors.push({
          row: rowNum,
          fields: validation.errors,
          message:
            "Row " +
            rowNum +
            ": " +
            validation.errors
              .map(function (err) {
                return err.message;
              })
              .join("; "),
        });
      }
    }

    if (records.length === 0 && errors.length === 0) {
      errors.push({
        row: 0,
        message: "No valid donor records found in the CSV",
      });
    } else if (records.length === 0) {
      errors.push({
        row: 0,
        message: "No valid donor records found in the uploaded file",
      });
    }

    return { records: records, errors: errors };
  }

  /**
   * Generates a receipt DOM element for a single donor record.
   * @param {Object} donorRecord - Donor data (name, address, amount, date, paymentMethod, email, memo)
   * @param {number|string} year - Tax year for the receipt
   * @param {number} sequenceNum - Sequence number for receipt numbering
   * @returns {HTMLElement} A <section class="receipt"> DOM element
   */
  function generateReceipt(donorRecord, year, sequenceNum) {
    var receiptNumber = formatReceiptNumber(year, sequenceNum);
    var section = document.createElement("section");
    section.className = "receipt";

    // Logo
    var logo = document.createElement("img");
    logo.src = "images/logo-circle.png";
    logo.alt = "GAMEC Logo";
    logo.className = "receipt-logo";
    section.appendChild(logo);

    // Organization name
    var orgName = document.createElement("h2");
    orgName.textContent = "GAMEC Inc.";
    section.appendChild(orgName);

    // Organization address
    var orgAddress = document.createElement("p");
    orgAddress.className = "org-address";
    orgAddress.textContent = "3420 13th St SE, Washington, DC 20032";
    section.appendChild(orgAddress);

    // Organization phone
    var orgPhone = document.createElement("p");
    orgPhone.className = "org-phone";
    orgPhone.textContent = "+1 (202) 440-9089";
    section.appendChild(orgPhone);

    // Receipt number
    var receiptNumEl = document.createElement("p");
    receiptNumEl.className = "receipt-number";
    receiptNumEl.textContent = "Receipt #: " + receiptNumber;
    section.appendChild(receiptNumEl);

    // Tax year heading
    var heading = document.createElement("h3");
    heading.textContent = "Donation Receipt for Tax Year " + String(year);
    section.appendChild(heading);

    // Donor details
    var detailsDiv = document.createElement("div");
    detailsDiv.className = "donor-details";

    var nameP = document.createElement("p");
    nameP.innerHTML =
      "<strong>Donor Name:</strong> " + escapeHTML(donorRecord.name);
    detailsDiv.appendChild(nameP);

    var addrP = document.createElement("p");
    addrP.innerHTML =
      "<strong>Donor Address:</strong> " + escapeHTML(donorRecord.address);
    detailsDiv.appendChild(addrP);

    var amountP = document.createElement("p");
    amountP.innerHTML =
      "<strong>Donation Amount:</strong> " + formatCurrency(donorRecord.amount);
    detailsDiv.appendChild(amountP);

    var dateP = document.createElement("p");
    dateP.innerHTML =
      "<strong>Donation Date:</strong> " + escapeHTML(donorRecord.date);
    detailsDiv.appendChild(dateP);

    var methodP = document.createElement("p");
    methodP.innerHTML =
      "<strong>Payment Method:</strong> " +
      escapeHTML(donorRecord.paymentMethod);
    detailsDiv.appendChild(methodP);

    section.appendChild(detailsDiv);

    // Purpose/memo section (conditional)
    if (donorRecord.memo && String(donorRecord.memo).trim() !== "") {
      var purposeDiv = document.createElement("div");
      purposeDiv.className = "receipt-purpose";
      var purposeHeading = document.createElement("h4");
      purposeHeading.textContent = "Purpose";
      purposeDiv.appendChild(purposeHeading);
      var memoP = document.createElement("p");
      memoP.textContent = donorRecord.memo;
      purposeDiv.appendChild(memoP);
      section.appendChild(purposeDiv);
    }

    // Tax disclosure
    var disclosure = document.createElement("p");
    disclosure.className = "tax-disclosure";
    disclosure.textContent =
      "No goods or services were provided in exchange for this contribution. " +
      "This donation is tax-deductible to the fullest extent allowed by law. " +
      "GAMEC Inc. is a 501(c)(3) tax-exempt organization. EIN: [EIN_NUMBER]";
    section.appendChild(disclosure);

    // Signature section
    var sigDiv = document.createElement("div");
    sigDiv.className = "signature-section";

    var sigLine = document.createElement("div");
    sigLine.className = "signature-line";

    var sigRule = document.createElement("hr");
    sigLine.appendChild(sigRule);
    var sigLabel = document.createElement("p");
    sigLabel.textContent = "Authorized Signature";
    sigLine.appendChild(sigLabel);
    sigDiv.appendChild(sigLine);

    var dateLine = document.createElement("div");
    dateLine.className = "date-line";
    var dateRule = document.createElement("hr");
    dateLine.appendChild(dateRule);
    var dateLabel = document.createElement("p");
    dateLabel.textContent = "Date";
    dateLine.appendChild(dateLabel);
    sigDiv.appendChild(dateLine);

    section.appendChild(sigDiv);

    // Email to Donor button (conditional)
    if (donorRecord.email && String(donorRecord.email).trim() !== "") {
      var emailLink = document.createElement("a");
      emailLink.className = "email-donor-btn";
      emailLink.href = buildMailtoLink(donorRecord.email, receiptNumber);
      emailLink.textContent = "Email to Donor";
      section.appendChild(emailLink);
    }

    return section;
  }

  /**
   * Escapes HTML special characters in a string.
   * @param {string} str
   * @returns {string}
   */
  function escapeHTML(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
  }

  /**
   * Renders a preview table showing parsed CSV records with error highlighting.
   * @param {Array<Object>} records - Array of valid donor record objects
   * @param {Array<Object>} errors - Array of error objects with { row, fields, message }
   * @returns {HTMLTableElement} A <table> DOM element
   */
  function renderPreviewTable(records, errors) {
    var table = document.createElement("table");
    table.className = "csv-preview-table";

    // Header row
    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    var columns = [
      "#",
      "Name",
      "Address",
      "Amount",
      "Date",
      "Payment Method",
      "Email",
      "Status",
    ];
    for (var c = 0; c < columns.length; c++) {
      var th = document.createElement("th");
      th.textContent = columns[c];
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Body
    var tbody = document.createElement("tbody");
    var rowNum = 1;

    // Valid records
    for (var i = 0; i < records.length; i++) {
      var rec = records[i];
      var tr = document.createElement("tr");
      var cells = [
        String(rowNum),
        rec.name || "",
        rec.address || "",
        rec.amount !== undefined && rec.amount !== "" ? String(rec.amount) : "",
        rec.date || "",
        rec.paymentMethod || "",
        rec.email || "",
        "Valid",
      ];
      for (var j = 0; j < cells.length; j++) {
        var td = document.createElement("td");
        td.textContent = cells[j];
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
      rowNum++;
    }

    // Error rows
    for (var e = 0; e < errors.length; e++) {
      var err = errors[e];
      // Skip structural errors (row 0) that aren't actual data rows
      if (err.row === 0) {
        continue;
      }
      var errTr = document.createElement("tr");
      errTr.className = "error-row";
      errTr.style.backgroundColor = "#ffcccc";

      // Build a map of error fields for quick lookup
      var errorFieldMap = {};
      if (err.fields && err.fields.length) {
        for (var f = 0; f < err.fields.length; f++) {
          errorFieldMap[err.fields[f].field] = err.fields[f].message;
        }
      }

      var errCells = [
        String(rowNum),
        errorFieldMap.name !== undefined ? "" : "",
        errorFieldMap.address !== undefined ? "" : "",
        errorFieldMap.amount !== undefined ? "" : "",
        errorFieldMap.date !== undefined ? "" : "",
        errorFieldMap.paymentMethod !== undefined ? "" : "",
        "",
        err.message || "Invalid",
      ];
      for (var k = 0; k < errCells.length; k++) {
        var errTd = document.createElement("td");
        errTd.textContent = errCells[k];
        errTr.appendChild(errTd);
      }
      tbody.appendChild(errTr);
      rowNum++;
    }

    table.appendChild(tbody);
    return table;
  }

  /**
   * Filters donor records by donation date year.
   * Records must have a `date` field in YYYY-MM-DD format.
   * @param {Array} records
   * @param {number|string} year
   * @returns {Array}
   */
  function filterByYear(records, year) {
    var targetYear = String(year);
    return records.filter(function (record) {
      if (!record.date || typeof record.date !== "string") {
        return false;
      }
      return record.date.substring(0, 4) === targetYear;
    });
  }

  // Module-level state for CSV mode and active tab tracking
  var parsedCSVRecords = [];
  var activeTab = "single";

  /**
   * Checks whether localStorage is available and functional.
   * @returns {boolean}
   */
  function isLocalStorageAvailable() {
    try {
      var testKey = "__gamec_ls_test__";
      localStorage.setItem(testKey, "1");
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Updates the displayed next receipt number for the selected year.
   * Reads the current sequence from localStorage without incrementing.
   */
  function updateNextReceiptDisplay() {
    var yearSelect = document.getElementById("year-select");
    var display = document.getElementById("next-receipt-number");
    if (!yearSelect || !display) return;
    var year = yearSelect.value;
    var key = "gamec-receipt-sequences";
    var current = 0;
    try {
      var stored = localStorage.getItem(key);
      if (stored) {
        var sequences = JSON.parse(stored);
        current = sequences[String(year)] || 0;
      }
    } catch (e) {
      // localStorage unavailable
    }
    display.textContent = formatReceiptNumber(year, current + 1);
  }

  /**
   * Clears all inline validation errors from the single entry form.
   */
  function clearFormErrors() {
    var form = document.getElementById("single-entry-form");
    if (!form) return;
    var errorEls = form.querySelectorAll(".field-error");
    for (var i = 0; i < errorEls.length; i++) {
      errorEls[i].parentNode.removeChild(errorEls[i]);
    }
    var inputs = form.querySelectorAll(".input-error");
    for (var j = 0; j < inputs.length; j++) {
      inputs[j].classList.remove("input-error");
    }
  }

  /**
   * Displays inline validation errors on the single entry form.
   * @param {Array<{field: string, message: string}>} errors
   */
  function showFormErrors(errors) {
    var fieldMap = {
      name: "donor-name",
      address: "donor-address",
      amount: "donor-amount",
      date: "donor-date",
      paymentMethod: "donor-payment-method",
    };
    for (var i = 0; i < errors.length; i++) {
      var err = errors[i];
      var inputId = fieldMap[err.field];
      if (!inputId) continue;
      var input = document.getElementById(inputId);
      if (!input) continue;
      input.classList.add("input-error");
      var errEl = document.createElement("span");
      errEl.className = "field-error";
      errEl.style.color = "#c0392b";
      errEl.style.fontSize = "0.9em";
      errEl.style.display = "block";
      errEl.textContent = err.message;
      input.parentNode.appendChild(errEl);
    }
  }

  /**
   * Entry point. Populates year selector, binds all UI event listeners.
   * Called on DOMContentLoaded.
   */
  function initReceiptGenerator() {
    // --- Check localStorage availability ---
    var localStorageOk = isLocalStorageAvailable();
    if (!localStorageOk) {
      var banner = document.getElementById("internal-banner");
      if (banner) {
        var warning = document.createElement("div");
        warning.className = "localStorage-warning";
        warning.style.background = "#f39c12";
        warning.style.color = "#fff";
        warning.style.textAlign = "center";
        warning.style.padding = "0.75em 1em";
        warning.style.fontWeight = "700";
        warning.style.fontSize = "1em";
        warning.style.marginBottom = "1em";
        warning.style.borderRadius = "6px";
        warning.textContent =
          "Warning: Browser storage is unavailable. Receipt numbers will start at 1 and will not persist between sessions.";
        banner.parentNode.insertBefore(warning, banner.nextSibling);
      }
    }

    // --- Populate year selector ---
    var yearSelect = document.getElementById("year-select");
    if (yearSelect) {
      var currentYear = new Date().getFullYear();
      for (var y = currentYear; y >= currentYear - 5; y--) {
        var opt = document.createElement("option");
        opt.value = String(y);
        opt.textContent = String(y);
        yearSelect.appendChild(opt);
      }
      yearSelect.value = String(currentYear);
    }

    // --- Display next receipt number ---
    updateNextReceiptDisplay();

    // --- Tab toggle ---
    var tabSingle = document.getElementById("tab-single");
    var tabCSV = document.getElementById("tab-csv");
    var panelSingle = document.getElementById("panel-single");
    var panelCSV = document.getElementById("panel-csv");

    if (tabSingle) {
      tabSingle.addEventListener("click", function () {
        activeTab = "single";
        tabSingle.classList.add("active");
        tabSingle.setAttribute("aria-selected", "true");
        if (tabCSV) {
          tabCSV.classList.remove("active");
          tabCSV.setAttribute("aria-selected", "false");
        }
        if (panelSingle) panelSingle.classList.add("active");
        if (panelCSV) panelCSV.classList.remove("active");
      });
    }

    if (tabCSV) {
      tabCSV.addEventListener("click", function () {
        activeTab = "csv";
        tabCSV.classList.add("active");
        tabCSV.setAttribute("aria-selected", "true");
        if (tabSingle) {
          tabSingle.classList.remove("active");
          tabSingle.setAttribute("aria-selected", "false");
        }
        if (panelCSV) panelCSV.classList.add("active");
        if (panelSingle) panelSingle.classList.remove("active");
      });
    }

    // --- Generate button ---
    var btnGenerate = document.getElementById("btn-generate");
    var receiptOutput = document.getElementById("receipt-output");

    if (btnGenerate) {
      btnGenerate.addEventListener("click", function () {
        var selectedYear = yearSelect
          ? yearSelect.value
          : String(new Date().getFullYear());

        if (activeTab === "single") {
          // Single entry mode
          clearFormErrors();
          var form = document.getElementById("single-entry-form");
          if (!form) return;

          var formData = {
            name: (document.getElementById("donor-name") || {}).value || "",
            address:
              (document.getElementById("donor-address") || {}).value || "",
            amount: (document.getElementById("donor-amount") || {}).value || "",
            date: (document.getElementById("donor-date") || {}).value || "",
            paymentMethod:
              (document.getElementById("donor-payment-method") || {}).value ||
              "",
            email: (document.getElementById("donor-email") || {}).value || "",
            memo: (document.getElementById("donor-memo") || {}).value || "",
          };

          // Convert amount to number for validation
          if (formData.amount !== "") {
            formData.amount = Number(formData.amount);
          }

          var validation = validateForm(formData);
          if (!validation.valid) {
            showFormErrors(validation.errors);
            return;
          }

          var seq = getNextSequence(selectedYear);
          var receipt = generateReceipt(formData, selectedYear, seq);
          if (receiptOutput) {
            receiptOutput.appendChild(receipt);
          }
          updateNextReceiptDisplay();

          // Reset form
          form.reset();
        } else {
          // CSV mode
          if (!parsedCSVRecords || parsedCSVRecords.length === 0) {
            alert(
              "No valid CSV records to generate receipts from. Please upload a CSV file first.",
            );
            return;
          }

          var selectedYearNum = Number(selectedYear);
          var filtered = filterByYear(parsedCSVRecords, selectedYearNum);

          if (filtered.length === 0) {
            alert(
              "No donor records found for the selected year (" +
                selectedYear +
                ").",
            );
            return;
          }

          for (var i = 0; i < filtered.length; i++) {
            var seq = getNextSequence(selectedYear);
            var receipt = generateReceipt(filtered[i], selectedYear, seq);
            if (receiptOutput) {
              receiptOutput.appendChild(receipt);
            }
          }
          updateNextReceiptDisplay();
        }
      });
    }

    // --- Print All button ---
    var btnPrint = document.getElementById("btn-print");
    if (btnPrint) {
      btnPrint.addEventListener("click", function () {
        if (!receiptOutput || receiptOutput.children.length === 0) {
          alert("No receipts to print. Please generate receipts first.");
          return;
        }
        window.print();
      });
    }

    // --- Clear button ---
    var btnClear = document.getElementById("btn-clear");
    if (btnClear) {
      btnClear.addEventListener("click", function () {
        if (receiptOutput) {
          receiptOutput.innerHTML = "";
        }
      });
    }

    // --- Year selector change ---
    if (yearSelect) {
      yearSelect.addEventListener("change", function () {
        updateNextReceiptDisplay();
      });
    }

    // --- Sequence override field ---
    var seqOverride = document.getElementById("sequence-override");
    if (seqOverride) {
      seqOverride.addEventListener("change", function () {
        var val = parseInt(seqOverride.value, 10);
        if (!isNaN(val) && val >= 1 && yearSelect) {
          setSequence(yearSelect.value, val - 1);
          updateNextReceiptDisplay();
        }
      });
    }

    // --- CSV file input ---
    var csvFileInput = document.getElementById("csv-file-input");
    if (csvFileInput) {
      csvFileInput.addEventListener("change", function (e) {
        var file = e.target.files && e.target.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function (evt) {
          var text = evt.target.result;
          var result = parseCSV(text);
          parsedCSVRecords = result.records;

          var previewContainer = document.getElementById("csv-preview");
          if (previewContainer) {
            previewContainer.innerHTML = "";

            if (result.records.length === 0 && result.errors.length > 0) {
              var errorBanner = document.createElement("div");
              errorBanner.style.color = "#c0392b";
              errorBanner.style.fontWeight = "700";
              errorBanner.style.marginBottom = "1em";
              // Show the first structural error message
              var msg =
                "Unable to read the CSV file. Please ensure it is a valid CSV with the expected columns.";
              for (var i = 0; i < result.errors.length; i++) {
                if (result.errors[i].message) {
                  msg = result.errors[i].message;
                  break;
                }
              }
              errorBanner.textContent = msg;
              previewContainer.appendChild(errorBanner);
            }

            if (
              result.records.length > 0 ||
              result.errors.some(function (e) {
                return e.row > 0;
              })
            ) {
              var table = renderPreviewTable(result.records, result.errors);
              previewContainer.appendChild(table);
            }
          }
        };
        reader.onerror = function () {
          parsedCSVRecords = [];
          var previewContainer = document.getElementById("csv-preview");
          if (previewContainer) {
            previewContainer.innerHTML = "";
            var errorBanner = document.createElement("div");
            errorBanner.style.color = "#c0392b";
            errorBanner.style.fontWeight = "700";
            errorBanner.textContent =
              "Unable to read the CSV file. Please ensure it is a valid CSV with the expected columns.";
            previewContainer.appendChild(errorBanner);
          }
        };
        reader.readAsText(file);
      });
    }
  }

  // --- DOMContentLoaded listener ---
  if (typeof document !== "undefined" && document.addEventListener) {
    document.addEventListener("DOMContentLoaded", initReceiptGenerator);
  }

  // Export for browser
  if (typeof window !== "undefined") {
    window.DonationReceipts = {
      formatCurrency: formatCurrency,
      formatReceiptNumber: formatReceiptNumber,
      getNextSequence: getNextSequence,
      setSequence: setSequence,
      buildMailtoLink: buildMailtoLink,
      filterByYear: filterByYear,
      validateForm: validateForm,
      parseCSV: parseCSV,
      generateReceipt: generateReceipt,
      renderPreviewTable: renderPreviewTable,
      initReceiptGenerator: initReceiptGenerator,
    };
  }

  // Export for Node/test
  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      formatCurrency: formatCurrency,
      formatReceiptNumber: formatReceiptNumber,
      getNextSequence: getNextSequence,
      setSequence: setSequence,
      buildMailtoLink: buildMailtoLink,
      filterByYear: filterByYear,
      validateForm: validateForm,
      parseCSV: parseCSV,
      generateReceipt: generateReceipt,
      renderPreviewTable: renderPreviewTable,
      initReceiptGenerator: initReceiptGenerator,
    };
  }
})();
