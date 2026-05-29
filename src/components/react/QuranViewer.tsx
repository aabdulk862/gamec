/**
 * @file QuranViewer.tsx — React island for the PDF.js-based Quran page viewer.
 * Implements all 14 viewer functions from the original quran-viewer.js:
 * goToPage, clampPage, doZoom, resetZoom, clampZoom, adjustZoom,
 * buildToc, toggleToc, getCurrentSurah, saveState, loadState,
 * renderPage, showError, and initialization.
 *
 * Hydrated with client:visible on the resources page.
 */
import { useState, useEffect, useRef, useCallback } from "react";

interface QuranViewerProps {
  pdfUrl: string;
  workerUrl: string;
}

/** Page offset: PDF pages before the Quran's internal page 1 */
const PAGE_OFFSET = 3;

/** Zoom constraints */
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3.0;
const ZOOM_STEP = 0.15;

/** localStorage key for state persistence */
const STORAGE_KEY = "qv-state";

/** [surahNumber, surahName, pageNumber] */
type SurahEntry = [number, string, number];

const SURAH_DATA: SurahEntry[] = [
  [1, "Al-Fatihah", 1],
  [2, "Al-Baqarah", 2],
  [3, "Al Imran", 50],
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
  [17, "Al-Isra'", 282],
  [18, "Al-Kahf", 293],
  [19, "Maryam", 305],
  [20, "Taha", 312],
  [21, "Al-Anbiya'", 322],
  [22, "Al-Hajj", 332],
  [23, "Al-Mu'minun", 342],
  [24, "An-Nur", 350],
  [25, "Al-Furqan", 359],
  [26, "Ash-Shu'ara'", 367],
  [27, "An-Naml", 377],
  [28, "Al-Qasas", 385],
  [29, "Al-'Ankabut", 396],
  [30, "Ar-Rum", 404],
  [31, "Luqman", 411],
  [32, "As-Sajdah", 415],
  [33, "Al-Ahzab", 418],
  [34, "Saba'", 428],
  [35, "Fatir", 434],
  [36, "Ya-Sin", 440],
  [37, "As-Saffat", 446],
  [38, "Sad", 453],
  [39, "Az-Zumar", 458],
  [40, "Ghafir", 467],
  [41, "Fussilat", 477],
  [42, "Ash-Shura", 483],
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
  [58, "Al-Mujadilah", 542],
  [59, "Al-Hashr", 545],
  [60, "Al-Mumtahanah", 549],
  [61, "As-Saff", 551],
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
  [93, "Ad-Duha", 596],
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

/* ── Pure helper functions ── */

/**
 * Clamp a page number to the valid range [1, totalPages].
 */
export function clampPage(page: number, totalPages: number): number {
  if (totalPages <= 0) return 1;
  return Math.max(1, Math.min(page, totalPages));
}

/**
 * Clamp a zoom scale value to the range [min, max].
 */
export function clampZoom(scale: number, min: number, max: number): number {
  return Math.max(min, Math.min(scale, max));
}

/**
 * Calculate a new zoom scale by adding a delta, rounding to two decimal
 * places, and clamping within [min, max].
 */
export function adjustZoom(
  currentScale: number,
  delta: number,
  min: number,
  max: number,
): number {
  return clampZoom(Math.round((currentScale + delta) * 100) / 100, min, max);
}

/**
 * Determine the index of the current surah based on a Quran page number.
 */
export function getCurrentSurah(
  pageNum: number,
  surahData: SurahEntry[],
): number {
  let idx = 0;
  for (let i = 0; i < surahData.length; i++) {
    if (surahData[i][2] <= pageNum) {
      idx = i;
    } else {
      break;
    }
  }
  return idx;
}

/* ── State persistence via localStorage ── */

interface SavedState {
  page: number;
  scale: number | null;
}

/**
 * Persist the current viewer state to localStorage.
 */
function saveState(page: number, scale: number | null): void {
  try {
    const data: SavedState = { page, scale };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* storage full or blocked */
  }
}

/**
 * Load the previously saved viewer state from localStorage.
 */
function loadState(): SavedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as SavedState;
  } catch {
    /* corrupted or blocked */
  }
  return null;
}

/* ── PDF.js type declarations (minimal) ── */

interface PDFPageProxy {
  getViewport(params: { scale: number }): { width: number; height: number };
  render(params: {
    canvasContext: CanvasRenderingContext2D;
    viewport: { width: number; height: number };
  }): { promise: Promise<void> };
}

interface PDFDocumentProxy {
  numPages: number;
  getPage(pageNumber: number): Promise<PDFPageProxy>;
}

interface PDFJSLib {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument(params: {
    url: string;
    disableAutoFetch?: boolean;
    disableStream?: boolean;
    rangeChunkSize?: number;
  }): { promise: Promise<PDFDocumentProxy> };
}

/* ── Component ── */

export default function QuranViewer({ pdfUrl, workerUrl }: QuranViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const tocPanelRef = useRef<HTMLDivElement>(null);

  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  const renderingRef = useRef(false);
  const pdfjsRef = useRef<PDFJSLib | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState<number | null>(null);
  const [tocOpen, setTocOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track touch for swipe navigation
  const touchRef = useRef({ startX: 0, startY: 0, startTime: 0 });

  /**
   * Show an error message in the viewer.
   */
  const showError = useCallback((message?: string) => {
    setError(
      message ||
        "Unable to load the Quran. Please check your connection and try again.",
    );
    setLoading(false);
  }, []);

  /**
   * Render a single PDF page onto the canvas element.
   */
  const renderPage = useCallback(
    async (pageNum: number) => {
      if (renderingRef.current || !pdfDocRef.current) return;
      renderingRef.current = true;

      try {
        const page = await pdfDocRef.current.getPage(pageNum);
        const canvas = canvasRef.current;
        const canvasWrapper = canvasWrapperRef.current;
        if (!canvas || !canvasWrapper) {
          renderingRef.current = false;
          return;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          renderingRef.current = false;
          return;
        }

        const dpr = window.devicePixelRatio || 1;
        let viewport;

        if (scale === null) {
          // Fit-to-width mode
          const wrapperWidth = canvasWrapper.clientWidth || 600;
          const unscaledViewport = page.getViewport({ scale: 1 });
          const fitScale = wrapperWidth / unscaledViewport.width;
          viewport = page.getViewport({ scale: fitScale * dpr });
        } else {
          viewport = page.getViewport({ scale: scale * dpr });
        }

        // Set actual canvas pixel dimensions (high-res)
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Scale down with CSS so it fits the container at the right visual size
        canvas.style.width = Math.floor(viewport.width / dpr) + "px";
        canvas.style.height = Math.floor(viewport.height / dpr) + "px";

        await page.render({ canvasContext: ctx, viewport }).promise;

        renderingRef.current = false;
        setCurrentPage(pageNum);
        setLoading(false);

        // Persist state
        saveState(pageNum, scale);
      } catch {
        renderingRef.current = false;
      }
    },
    [scale],
  );

  /**
   * Navigate to a specific PDF page, clamping to valid range.
   */
  const goToPage = useCallback(
    (pageNum: number) => {
      const clamped = clampPage(pageNum, totalPages);
      setCurrentPage(clamped);
      renderPage(clamped);
    },
    [totalPages, renderPage],
  );

  /**
   * Adjust zoom by a delta value, clamping to [ZOOM_MIN, ZOOM_MAX].
   */
  const doZoom = useCallback(
    async (delta: number) => {
      let currentScale = scale;

      if (currentScale === null) {
        // Resolve fit-to-width to a numeric scale
        if (pdfDocRef.current && canvasWrapperRef.current) {
          const page = await pdfDocRef.current.getPage(currentPage);
          const uv = page.getViewport({ scale: 1 });
          currentScale = canvasWrapperRef.current.clientWidth / uv.width;
        } else {
          currentScale = 1;
        }
      }

      const newScale = adjustZoom(currentScale, delta, ZOOM_MIN, ZOOM_MAX);
      setScale(newScale);
    },
    [scale, currentPage],
  );

  /**
   * Reset zoom to fit-to-width mode.
   */
  const resetZoom = useCallback(() => {
    setScale(null);
  }, []);

  /**
   * Toggle the TOC panel visibility.
   */
  const toggleToc = useCallback(() => {
    setTocOpen((prev) => !prev);
  }, []);

  // Re-render when scale changes
  useEffect(() => {
    if (pdfDocRef.current && !loading && !error) {
      renderPage(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale]);

  // Initialize PDF.js and load the document
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        // Dynamically import PDF.js from CDN
        const cdnUrl =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.min.mjs";
        const pdfjs = await import(/* @vite-ignore */ cdnUrl);
        if (cancelled) return;

        pdfjsRef.current = pdfjs as unknown as PDFJSLib;
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

        // Load saved state
        const saved = loadState();
        const startPage = saved?.page || 1;
        if (saved?.scale !== undefined) {
          setScale(saved.scale);
        }

        // Load the PDF document with lazy loading (range requests)
        const doc = await pdfjs.getDocument({
          url: pdfUrl,
          disableAutoFetch: true,
          disableStream: true,
          rangeChunkSize: 65536,
        }).promise;

        if (cancelled) return;

        pdfDocRef.current = doc;
        setTotalPages(doc.numPages);
        setCurrentPage(startPage);

        // Render the first page
        renderingRef.current = false;
        const canvas = canvasRef.current;
        const canvasWrapper = canvasWrapperRef.current;
        if (!canvas || !canvasWrapper) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const page = await doc.getPage(startPage);
        const dpr = window.devicePixelRatio || 1;
        const wrapperWidth = canvasWrapper.clientWidth || 600;
        const unscaledViewport = page.getViewport({ scale: 1 });
        const fitScale = wrapperWidth / unscaledViewport.width;
        const effectiveScale = saved?.scale ?? null;
        const renderScale =
          effectiveScale === null ? fitScale : effectiveScale;
        const viewport = page.getViewport({ scale: renderScale * dpr });

        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.style.width = Math.floor(viewport.width / dpr) + "px";
        canvas.style.height = Math.floor(viewport.height / dpr) + "px";

        await page.render({ canvasContext: ctx, viewport }).promise;

        setLoading(false);
        saveState(startPage, effectiveScale);
      } catch {
        if (!cancelled) {
          showError(
            "Unable to load the Quran. Please check your connection and try again.",
          );
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfUrl, workerUrl]);

  // Handle resize / orientation change
  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;

    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (pdfDocRef.current && !renderingRef.current) {
          if (scale === null) {
            renderPage(currentPage);
          } else {
            const isMobile = window.innerWidth <= 736;
            if (isMobile) {
              setScale(null);
            } else {
              renderPage(currentPage);
            }
          }
        }
      }, 200);
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", () => {
      setTimeout(handleResize, 300);
    });

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [scale, currentPage, renderPage]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        goToPage(currentPage - 1);
      } else if (e.key === "ArrowRight") {
        goToPage(currentPage + 1);
      }
    }

    const viewer = document.getElementById("quran-viewer");
    if (viewer) {
      viewer.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (viewer) {
        viewer.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [currentPage, goToPage]);

  // Derived values
  const displayPage = currentPage - PAGE_OFFSET;
  const displayTotal = totalPages - PAGE_OFFSET;
  const pageIndicatorText =
    displayPage >= 1
      ? `Page ${displayPage} of ${displayTotal}`
      : `Page ${currentPage} of ${totalPages}`;

  const quranPage = currentPage - PAGE_OFFSET;
  const activeSurahIdx = getCurrentSurah(quranPage, SURAH_DATA);
  const activeSurah = SURAH_DATA[activeSurahIdx];

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;
  const zoomInDisabled = scale !== null && scale >= ZOOM_MAX;
  const zoomOutDisabled = scale !== null && scale <= ZOOM_MIN;
  const zoomResetDisabled = scale === null;

  // Touch handlers for swipe navigation
  function handleTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 1) {
      touchRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        startTime: Date.now(),
      };
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (e.changedTouches.length !== 1) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.startX;
    const dy = e.changedTouches[0].clientY - touchRef.current.startY;
    const dt = Date.now() - touchRef.current.startTime;

    // Must be a quick horizontal swipe: >50px horizontal, <80px vertical, <400ms
    if (Math.abs(dx) > 50 && Math.abs(dy) < 80 && dt < 400) {
      if (dx > 0) {
        goToPage(currentPage - 1);
      } else {
        goToPage(currentPage + 1);
      }
    }
  }

  // Retry handler for error state
  function handleRetry() {
    setError(null);
    setLoading(true);
    // Re-trigger initialization by forcing a remount isn't ideal,
    // so we reload the page as the simplest retry mechanism
    window.location.reload();
  }

  /**
   * Build TOC entries — rendered as buttons in the TOC panel.
   */
  function buildToc() {
    return SURAH_DATA.map((entry, i) => (
      <button
        key={entry[0]}
        type="button"
        className={`qv-toc-entry${i === activeSurahIdx ? " qv-toc-active" : ""}`}
        data-page={entry[2]}
        data-index={i}
        onClick={() => {
          goToPage(entry[2] + PAGE_OFFSET);
          toggleToc();
        }}
      >
        {entry[0]}. {entry[1]} &mdash; p. {entry[2]}
      </button>
    ));
  }

  return (
    <div id="quran-viewer" tabIndex={0}>
      {/* Header */}
      <div className="qv-header">
        <i className="fas fa-quran"></i> Quran Reader
      </div>

      {/* Toolbar */}
      <div className="qv-toolbar">
        {/* TOC toggle */}
        <button
          type="button"
          className="qv-btn qv-toc-toggle"
          onClick={toggleToc}
          aria-expanded={tocOpen}
          aria-label="Table of contents"
        >
          <i className="fas fa-list"></i>
          <span className="qv-btn-label">Surahs</span>
        </button>

        <span className="qv-toolbar-separator"></span>

        {/* Zoom controls */}
        <button
          type="button"
          className="qv-btn qv-zoom-out"
          onClick={() => doZoom(-ZOOM_STEP)}
          disabled={zoomOutDisabled}
          aria-label="Zoom out"
        >
          <i className="fas fa-search-minus"></i>
        </button>
        <button
          type="button"
          className="qv-btn qv-zoom-reset"
          onClick={resetZoom}
          disabled={zoomResetDisabled}
          aria-label="Reset zoom"
        >
          <i className="fas fa-expand"></i>
          <span className="qv-btn-label">Fit</span>
        </button>
        <button
          type="button"
          className="qv-btn qv-zoom-in"
          onClick={() => doZoom(ZOOM_STEP)}
          disabled={zoomInDisabled}
          aria-label="Zoom in"
        >
          <i className="fas fa-search-plus"></i>
        </button>

        <span className="qv-toolbar-separator"></span>

        {/* Page indicator */}
        <span className="qv-page-indicator">{pageIndicatorText}</span>
      </div>

      {/* TOC Panel */}
      <div
        ref={tocPanelRef}
        className={`qv-toc-panel${tocOpen ? " qv-toc-open" : ""}`}
        aria-hidden={!tocOpen}
      >
        {buildToc()}
      </div>

      {/* Reader area */}
      <div className="qv-reader-area">
        {/* Previous page side nav */}
        <button
          type="button"
          className="qv-side-nav qv-prev"
          onClick={() => goToPage(currentPage - 1)}
          disabled={prevDisabled}
          aria-label="Previous page"
        >
          <i className="fas fa-chevron-left"></i>
          <span className="qv-nav-label">Prev</span>
        </button>

        {/* Canvas wrapper */}
        <div
          ref={canvasWrapperRef}
          className="qv-canvas-wrapper"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <canvas
            ref={canvasRef}
            id="qv-canvas"
            aria-label={`Quran page ${currentPage}`}
          ></canvas>
        </div>

        {/* Next page side nav */}
        <button
          type="button"
          className="qv-side-nav qv-next"
          onClick={() => goToPage(currentPage + 1)}
          disabled={nextDisabled}
          aria-label="Next page"
        >
          <i className="fas fa-chevron-right"></i>
          <span className="qv-nav-label">Next</span>
        </button>
      </div>

      {/* Surah bar */}
      <div className="qv-surah-bar">
        {quranPage >= 1 && activeSurah
          ? `Surah ${activeSurah[0]}. ${activeSurah[1]}`
          : ""}
      </div>

      {/* Loading overlay */}
      {loading && !error && (
        <div className="qv-loading-overlay">
          <div className="qv-spinner"></div>
          <p>Loading Quran…</p>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="qv-loading-overlay">
          <p className="qv-error-message">{error}</p>
          <button
            type="button"
            className="qv-btn qv-retry-btn"
            aria-label="Retry loading"
            onClick={handleRetry}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
