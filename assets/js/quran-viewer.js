/**
 * Quran PDF Viewer — GAMEC Resources Page
 * Uses PDF.js to render a Quran PDF with navigation, TOC, and zoom controls.
 */
(function () {
  "use strict";

  var PDF_URL = "https://pub-859f42e20e3a4f7bb6787dd54417300a.r2.dev/quran.pdf";

  /**
   * Page offset: the number of PDF pages before the Quran's internal page 1.
   * The PDF has cover + title pages before the numbered content begins.
   * quranPage + PAGE_OFFSET = pdfPage
   */
  var PAGE_OFFSET = 3;

  /** @type {Array<[number, string, number]>} [surahNumber, surahName, pageNumber] */
  var SURAH_DATA = [
    [1, "Al-Fatihah", 1],
    [2, "Al-Baqarah", 2],
    [3, "Ali 'Imran", 50],
    [4, "An-Nisa", 77],
    [5, "Al-Ma'idah", 106],
    [6, "Al-An'am", 128],
    [7, "Al-A'raf", 151],
    [8, "Al-Anfal", 177],
    [9, "At-Tawbah", 187],
    [10, "Yunus", 208],
    [11, "Hud", 221],
    [12, "Yusuf", 235],
    [13, "Ar-Ra'd", 249],
    [14, "Ibrahim", 255],
    [15, "Al-Hijr", 262],
    [16, "An-Nahl", 267],
    [17, "Al-Isra", 282],
    [18, "Al-Kahf", 293],
    [19, "Maryam", 305],
    [20, "Taha", 312],
    [21, "Al-Anbya", 322],
    [22, "Al-Hajj", 332],
    [23, "Al-Mu'minun", 342],
    [24, "An-Nur", 350],
    [25, "Al-Furqan", 359],
    [26, "Ash-Shu'ara", 367],
    [27, "An-Naml", 377],
    [28, "Al-Qasas", 385],
    [29, "Al-'Ankabut", 396],
    [30, "Ar-Rum", 404],
    [31, "Luqman", 411],
    [32, "As-Sajdah", 415],
    [33, "Al-Ahzab", 418],
    [34, "Saba", 428],
    [35, "Fatir", 434],
    [36, "Ya-Sin", 440],
    [37, "As-Saffat", 446],
    [38, "Sad", 453],
    [39, "Az-Zumar", 458],
    [40, "Ghafir", 467],
    [41, "Fussilat", 477],
    [42, "Ash-Shuraa", 483],
    [43, "Az-Zukhruf", 489],
    [44, "Ad-Dukhan", 496],
    [45, "Al-Jathiyah", 499],
    [46, "Al-Ahqaf", 502],
    [47, "Muhammad", 507],
    [48, "Al-Fath", 511],
    [49, "Al-Hujurat", 515],
    [50, "Qaf", 518],
    [51, "Adh-Dhariyat", 520],
    [52, "At-Tur", 523],
    [53, "An-Najm", 526],
    [54, "Al-Qamar", 528],
    [55, "Ar-Rahman", 531],
    [56, "Al-Waqi'ah", 534],
    [57, "Al-Hadid", 537],
    [58, "Al-Mujadila", 542],
    [59, "Al-Hashr", 545],
    [60, "Al-Mumtahanah", 549],
    [61, "As-Saf", 551],
    [62, "Al-Jumu'ah", 553],
    [63, "Al-Munafiqun", 554],
    [64, "At-Taghabun", 556],
    [65, "At-Talaq", 558],
    [66, "At-Tahrim", 560],
    [67, "Al-Mulk", 562],
    [68, "Al-Qalam", 564],
    [69, "Al-Haqqah", 566],
    [70, "Al-Ma'arij", 568],
    [71, "Nuh", 570],
    [72, "Al-Jinn", 572],
    [73, "Al-Muzzammil", 574],
    [74, "Al-Muddaththir", 575],
    [75, "Al-Qiyamah", 577],
    [76, "Al-Insan", 578],
    [77, "Al-Mursalat", 580],
    [78, "An-Naba", 582],
    [79, "An-Nazi'at", 583],
    [80, "'Abasa", 585],
    [81, "At-Takwir", 586],
    [82, "Al-Infitar", 587],
    [83, "Al-Mutaffifin", 587],
    [84, "Al-Inshiqaq", 589],
    [85, "Al-Buruj", 590],
    [86, "At-Tariq", 591],
    [87, "Al-A'la", 591],
    [88, "Al-Ghashiyah", 592],
    [89, "Al-Fajr", 593],
    [90, "Al-Balad", 594],
    [91, "Ash-Shams", 595],
    [92, "Al-Layl", 595],
    [93, "Ad-Duhaa", 596],
    [94, "Ash-Sharh", 596],
    [95, "At-Tin", 597],
    [96, "Al-'Alaq", 597],
    [97, "Al-Qadr", 598],
    [98, "Al-Bayyinah", 598],
    [99, "Az-Zalzalah", 599],
    [100, "Al-'Adiyat", 599],
    [101, "Al-Qari'ah", 600],
    [102, "At-Takathur", 600],
    [103, "Al-'Asr", 601],
    [104, "Al-Humazah", 601],
    [105, "Al-Fil", 601],
    [106, "Quraysh", 602],
    [107, "Al-Ma'un", 602],
    [108, "Al-Kawthar", 602],
    [109, "Al-Kafirun", 603],
    [110, "An-Nasr", 603],
    [111, "Al-Masad", 603],
    [112, "Al-Ikhlas", 604],
    [113, "Al-Falaq", 604],
    [114, "An-Nas", 604],
  ];

  /** Viewer state object */
  var ViewerState = {
    pdfDoc: null,
    currentPage: 1,
    totalPages: 0,
    scale: null,
    rendering: false,
    tocOpen: false,
  };

  /* ── Pure helper functions (exported for testing) ── */

  function clampPage(page, totalPages) {
    if (totalPages <= 0) return 1;
    return Math.max(1, Math.min(page, totalPages));
  }

  function clampZoom(scale, min, max) {
    return Math.max(min, Math.min(scale, max));
  }

  function adjustZoom(currentScale, delta, min, max) {
    return clampZoom(Math.round((currentScale + delta) * 100) / 100, min, max);
  }

  function getCurrentSurah(pageNum, surahData) {
    var idx = 0;
    for (var i = 0; i < surahData.length; i++) {
      if (surahData[i][2] <= pageNum) {
        idx = i;
      } else {
        break;
      }
    }
    return idx;
  }

  /* ── DOM references (populated on init) ── */
  var canvas,
    ctx,
    canvasWrapper,
    pageIndicator,
    loadingOverlay,
    prevBtn,
    nextBtn,
    zoomInBtn,
    zoomOutBtn,
    tocPanel,
    tocToggleBtn;

  /* ── PDF.js worker URL (must match CDN version) ── */
  var PDFJS_WORKER_URL =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs";

  /**
   * Build the TOC panel entries from SURAH_DATA.
   * Each entry is a button showing "surahNumber. surahName — p. pageNumber".
   */
  function buildToc() {
    if (!tocPanel) return;
    tocPanel.innerHTML = "";
    for (var i = 0; i < SURAH_DATA.length; i++) {
      var entry = SURAH_DATA[i];
      var btn = document.createElement("button");
      btn.className = "qv-toc-entry";
      btn.setAttribute("type", "button");
      btn.textContent = entry[0] + ". " + entry[1] + " \u2014 p. " + entry[2];
      btn.setAttribute("data-page", entry[2]);
      btn.setAttribute("data-index", i);
      (function (page) {
        btn.addEventListener("click", function () {
          goToPage(page + PAGE_OFFSET);
          toggleToc();
        });
      })(entry[2]);
      tocPanel.appendChild(btn);
    }
  }

  /**
   * Toggle the TOC panel visibility.
   * Updates ViewerState.tocOpen, the panel class, and aria attributes.
   */
  function toggleToc() {
    ViewerState.tocOpen = !ViewerState.tocOpen;
    if (tocPanel) {
      tocPanel.classList.toggle("qv-toc-open", ViewerState.tocOpen);
      tocPanel.setAttribute("aria-hidden", String(!ViewerState.tocOpen));
    }
    if (tocToggleBtn) {
      tocToggleBtn.setAttribute("aria-expanded", String(ViewerState.tocOpen));
    }
  }

  /**
   * Adjust zoom by delta, clamping to [0.5, 3.0], then re-render.
   * If scale is null (fit-to-width), compute the current fit scale first.
   * @param {number} delta - zoom increment (e.g. +0.25 or -0.25)
   */
  function doZoom(delta) {
    var currentScale = ViewerState.scale;
    if (currentScale === null) {
      // Resolve fit-to-width to a numeric scale
      if (ViewerState.pdfDoc && canvasWrapper) {
        ViewerState.pdfDoc
          .getPage(ViewerState.currentPage)
          .then(function (page) {
            var uv = page.getViewport({ scale: 1 });
            currentScale = canvasWrapper.clientWidth / uv.width;
            ViewerState.scale = adjustZoom(currentScale, delta, 0.5, 3.0);
            renderPage(ViewerState.currentPage);
          });
        return;
      }
      currentScale = 1;
    }
    ViewerState.scale = adjustZoom(currentScale, delta, 0.5, 3.0);
    renderPage(ViewerState.currentPage);
  }

  /**
   * Navigate to a specific page, clamping to valid range.
   * @param {number} pageNum - desired 1-indexed page number
   */
  function goToPage(pageNum) {
    var clamped = clampPage(pageNum, ViewerState.totalPages);
    ViewerState.currentPage = clamped;
    renderPage(clamped);
  }

  /**
   * Render a single page of the PDF onto the canvas.
   * Uses a rendering lock to prevent concurrent renders.
   * @param {number} pageNum - 1-indexed page number
   */
  function renderPage(pageNum) {
    if (ViewerState.rendering || !ViewerState.pdfDoc) return;
    ViewerState.rendering = true;

    ViewerState.pdfDoc
      .getPage(pageNum)
      .then(function (page) {
        var viewport;

        // Account for high-DPI displays (Retina, etc.)
        var dpr = window.devicePixelRatio || 1;

        if (ViewerState.scale === null) {
          // Fit-to-width: use canvas wrapper width
          var wrapperWidth = canvasWrapper.clientWidth || 600;
          var unscaledViewport = page.getViewport({ scale: 1 });
          var fitScale = wrapperWidth / unscaledViewport.width;
          viewport = page.getViewport({ scale: fitScale * dpr });
        } else {
          viewport = page.getViewport({ scale: ViewerState.scale * dpr });
        }

        // Set actual canvas pixel dimensions (high-res)
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Scale down with CSS so it fits the container at the right visual size
        canvas.style.width = Math.floor(viewport.width / dpr) + "px";
        canvas.style.height = Math.floor(viewport.height / dpr) + "px";

        var renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        page
          .render(renderContext)
          .promise.then(function () {
            ViewerState.rendering = false;
            ViewerState.currentPage = pageNum;

            // Update page indicator
            pageIndicator.textContent =
              "Page " + pageNum + " of " + ViewerState.totalPages;

            // Update canvas aria-label
            canvas.setAttribute("aria-label", "Quran page " + pageNum);

            // Hide loading overlay after first render
            if (
              loadingOverlay &&
              !loadingOverlay.classList.contains("qv-hidden")
            ) {
              loadingOverlay.classList.add("qv-hidden");
            }

            // Update prev/next button disabled states
            if (prevBtn) {
              prevBtn.disabled = pageNum <= 1;
            }
            if (nextBtn) {
              nextBtn.disabled = pageNum >= ViewerState.totalPages;
            }

            // Update zoom button disabled states
            if (zoomInBtn) {
              zoomInBtn.disabled =
                ViewerState.scale !== null && ViewerState.scale >= 3.0;
            }
            if (zoomOutBtn) {
              zoomOutBtn.disabled =
                ViewerState.scale !== null && ViewerState.scale <= 0.5;
            }

            // Highlight the active surah in the TOC
            if (tocPanel) {
              var quranPage = pageNum - PAGE_OFFSET;
              var activeIdx = getCurrentSurah(quranPage, SURAH_DATA);
              var entries = tocPanel.querySelectorAll(".qv-toc-entry");
              for (var i = 0; i < entries.length; i++) {
                if (i === activeIdx) {
                  entries[i].classList.add("qv-toc-active");
                } else {
                  entries[i].classList.remove("qv-toc-active");
                }
              }
            }
          })
          .catch(function () {
            ViewerState.rendering = false;
          });
      })
      .catch(function () {
        ViewerState.rendering = false;
      });
  }

  /**
   * Show an error overlay inside the viewer with a message and retry button.
   * Reuses the loading overlay element, replacing its content.
   * @param {string} message - Error message to display
   */
  function showError(message) {
    if (!loadingOverlay) return;

    loadingOverlay.classList.remove("qv-hidden");
    loadingOverlay.innerHTML =
      '<p class="qv-error-message">' +
      (message ||
        "Unable to load the Quran. Please check your connection and try again.") +
      "</p>" +
      '<button class="qv-btn qv-retry-btn" aria-label="Retry loading">Retry</button>';

    var retryBtn = loadingOverlay.querySelector(".qv-retry-btn");
    if (retryBtn) {
      retryBtn.addEventListener("click", function () {
        // Restore spinner content and re-init
        loadingOverlay.innerHTML =
          '<div class="qv-spinner"></div><p>Loading Quran…</p>';
        initQuranViewer();
      });
    }
  }

  /**
   * Initialize the Quran viewer: load the PDF and render the first page.
   * Listens for the 'pdfjsReady' event if pdfjsLib is not yet available.
   */
  function initQuranViewer() {
    // Grab DOM references
    canvas = document.getElementById("qv-canvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    canvasWrapper = document.querySelector(".qv-canvas-wrapper");
    pageIndicator = document.querySelector(".qv-page-indicator");
    loadingOverlay = document.querySelector(".qv-loading-overlay");

    // Ensure loading overlay is visible during fetch
    if (loadingOverlay) {
      loadingOverlay.classList.remove("qv-hidden");
    }

    // Grab navigation button references and wire click handlers
    prevBtn = document.querySelector(".qv-prev");
    nextBtn = document.querySelector(".qv-next");
    tocPanel = document.querySelector(".qv-toc-panel");
    tocToggleBtn = document.querySelector(".qv-toc-toggle");

    // Build TOC entries from SURAH_DATA
    buildToc();

    // Wire TOC toggle button
    if (tocToggleBtn) {
      tocToggleBtn.addEventListener("click", function () {
        toggleToc();
      });
    }

    // Wire zoom buttons
    zoomInBtn = document.querySelector(".qv-zoom-in");
    zoomOutBtn = document.querySelector(".qv-zoom-out");
    if (zoomInBtn) {
      zoomInBtn.addEventListener("click", function () {
        doZoom(0.25);
      });
    }
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener("click", function () {
        doZoom(-0.25);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        goToPage(ViewerState.currentPage - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goToPage(ViewerState.currentPage + 1);
      });
    }

    // Keyboard navigation on the viewer container
    var viewerContainer = document.getElementById("quran-viewer");
    if (viewerContainer) {
      viewerContainer.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") {
          goToPage(ViewerState.currentPage - 1);
        } else if (e.key === "ArrowRight") {
          goToPage(ViewerState.currentPage + 1);
        }
      });

      // Swipe navigation for touch devices
      var touchStartX = 0;
      var touchStartY = 0;
      var touchStartTime = 0;

      canvasWrapper.addEventListener(
        "touchstart",
        function (e) {
          if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
          }
        },
        { passive: true },
      );

      canvasWrapper.addEventListener(
        "touchend",
        function (e) {
          if (e.changedTouches.length !== 1) return;
          var dx = e.changedTouches[0].clientX - touchStartX;
          var dy = e.changedTouches[0].clientY - touchStartY;
          var dt = Date.now() - touchStartTime;

          // Must be a quick horizontal swipe: >50px horizontal, <80px vertical, <400ms
          if (Math.abs(dx) > 50 && Math.abs(dy) < 80 && dt < 400) {
            if (dx > 0) {
              goToPage(ViewerState.currentPage - 1);
            } else {
              goToPage(ViewerState.currentPage + 1);
            }
          }
        },
        { passive: true },
      );
    }

    // Check if pdfjsLib is available
    if (typeof window.pdfjsLib === "undefined") {
      showError("PDF viewer library failed to load. Please refresh the page.");
      return;
    }

    var pdfjsLib = window.pdfjsLib;

    // Set the worker URL
    pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;

    // Load the PDF document with lazy loading (range requests).
    // disableAutoFetch prevents PDF.js from downloading the entire file in the background.
    // disableStream disables streaming to rely purely on range requests per page.
    pdfjsLib
      .getDocument({
        url: PDF_URL,
        disableAutoFetch: true,
        disableStream: true,
        rangeChunkSize: 65536,
      })
      .promise.then(function (pdfDoc) {
        ViewerState.pdfDoc = pdfDoc;
        ViewerState.totalPages = pdfDoc.numPages;
        renderPage(1);
      })
      .catch(function () {
        showError(
          "Unable to load the Quran. Please check your connection and try again.",
        );
      });
  }

  /* ── Bootstrap: wait for PDF.js to be ready ── */
  if (typeof window.pdfjsLib !== "undefined") {
    // PDF.js already loaded (script ran after module resolved)
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initQuranViewer);
    } else {
      initQuranViewer();
    }
  } else {
    // Wait for the pdfjsReady event dispatched by the ES module in resources.html
    window.addEventListener("pdfjsReady", function () {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initQuranViewer);
      } else {
        initQuranViewer();
      }
    });
  }

  /* ── Expose pure functions and data for testing ── */
  window.QuranViewer = {
    SURAH_DATA: SURAH_DATA,
    PAGE_OFFSET: PAGE_OFFSET,
    ViewerState: ViewerState,
    clampPage: clampPage,
    clampZoom: clampZoom,
    adjustZoom: adjustZoom,
    getCurrentSurah: getCurrentSurah,
    goToPage: goToPage,
    doZoom: doZoom,
    toggleToc: toggleToc,
    initQuranViewer: initQuranViewer,
    renderPage: renderPage,
  };
})();
