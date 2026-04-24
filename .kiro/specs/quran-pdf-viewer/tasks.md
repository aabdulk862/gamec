# Tasks: Quran PDF Viewer

- [x] 1. Set up PDF.js integration and viewer scaffold
  - [x] 1.1 Add PDF.js CDN script tag to resources.html (before quran-viewer.js)
  - [x] 1.2 Create `assets/js/quran-viewer.js` with the SURAH_DATA array (all 114 surahs with page numbers) and the ViewerState object
  - [x] 1.3 Build the viewer DOM structure: replace the existing Quran image block in resources.html with a `#quran-viewer` container containing toolbar, canvas wrapper, TOC panel placeholder, loading overlay, and noscript fallback link
  - [x] 1.4 Add the `<script src="assets/js/quran-viewer.js"></script>` tag to resources.html after the PDF.js CDN script
  - [x] 1.5 Add base CSS for the viewer container to `assets/css/main.css`: max-width 800px, centered, border-radius, background, font-family Roboto, using site CSS variables

- [x] 2. Implement PDF loading and page rendering
  - [x] 2.1 Implement `initQuranViewer()`: call `pdfjsLib.getDocument(pdfUrl)`, store the PDFDocumentProxy in ViewerState, set totalPages, and call `renderPage(1)`
  - [x] 2.2 Implement `renderPage(pageNum)`: get page from pdfDoc, calculate viewport (fit-to-width when scale is null, or use current scale), set canvas dimensions, call `page.render()`, update page indicator text
  - [x] 2.3 Implement loading spinner overlay shown during PDF fetch, hidden once the first page renders
  - [x] 2.4 Implement error overlay with message and retry button shown when `getDocument()` rejects; retry button re-calls init

- [x] 3. Implement page navigation
  - [x] 3.1 Implement `goToPage(pageNum)` with clamping via `clampPage()` to [1, totalPages], update ViewerState.currentPage, call renderPage()
  - [x] 3.2 Wire prev/next toolbar buttons to call `goToPage(currentPage - 1)` and `goToPage(currentPage + 1)`
  - [x] 3.3 Disable prev button (disabled attribute + CSS opacity) when on page 1; disable next button when on last page — update in renderPage()
  - [x] 3.4 Add keydown listener on the viewer container for ArrowLeft (previous) and ArrowRight (next) navigation; set tabindex="0" on the viewer container

- [x] 4. Implement Table of Contents panel
  - [x] 4.1 Build TOC panel DOM from SURAH_DATA: a scrollable list of buttons, each showing surah number, name, and page number
  - [x] 4.2 Implement `toggleToc()`: toggle TOC panel visibility and update aria-expanded on the TOC toggle button
  - [x] 4.3 Wire each TOC entry button to call `goToPage(surahPage)` and `toggleToc()` to close the panel
  - [x] 4.4 Implement `getCurrentSurah(pageNum, surahData)` and use it in renderPage() to highlight the active surah in the TOC with a CSS class
  - [x] 4.5 Add CSS for TOC panel: positioned overlay, max-height with overflow-y auto, scrollable, highlight style for active surah

- [x] 5. Implement zoom controls
  - [x] 5.1 Implement `adjustZoom(delta)` using `clampZoom()` to constrain scale to [0.5, 3.0], then call renderPage()
  - [x] 5.2 Wire zoom-in and zoom-out toolbar buttons to call `adjustZoom(+0.25)` and `adjustZoom(-0.25)`
  - [x] 5.3 Disable zoom-in button at scale 3.0 and zoom-out button at scale 0.5; update in renderPage()
  - [x] 5.4 Add CSS for canvas wrapper overflow: allow scrolling when zoomed beyond container width

- [x] 6. Implement accessibility features
  - [x] 6.1 Add aria-label attributes to all toolbar buttons (Previous page, Next page, Table of contents, Zoom in, Zoom out)
  - [x] 6.2 Add an aria-live="polite" region that announces "Page X of Y" after each renderPage() call
  - [x] 6.3 Set role="img" and aria-label="Quran page [currentPage]" on the canvas element, updated in renderPage()
  - [x] 6.4 Ensure the viewer container has tabindex="0" for keyboard focus and a visible focus outline style

- [x] 7. Add responsive styles
  - [x] 7.1 Add CSS media query for small breakpoint (max-width: 736px): canvas fills container width, toolbar buttons get min 44x44px touch targets
  - [x] 7.2 Add CSS media query for medium breakpoint: adjust toolbar layout if needed for tablet widths
  - [x] 7.3 Ensure TOC panel adapts to small screens (full-width overlay on mobile)

- [x] 8. Export testable pure functions and write tests
  - [x] 8.1 Export `clampPage`, `clampZoom`, `adjustZoom`, `getCurrentSurah`, and `SURAH_DATA` from quran-viewer.js (via window namespace or module pattern for test access)
  - [x] 8.2 Write property test: Feature: quran-pdf-viewer, Property 1 — navigation changes page by ±1 (fast-check, 100+ runs)
  - [x] 8.3 Write property test: Feature: quran-pdf-viewer, Property 2 — page number invariant within [1, totalPages] (fast-check, 100+ runs)
  - [x] 8.4 Write property test: Feature: quran-pdf-viewer, Property 3 — zoom clamping to [0.5, 3.0] (fast-check, 100+ runs)
  - [x] 8.5 Write property test: Feature: quran-pdf-viewer, Property 4 — TOC contains all 114 surahs (fast-check, 100+ runs)
  - [x] 8.6 Write property test: Feature: quran-pdf-viewer, Property 5 — TOC selection navigates to correct page (fast-check, 100+ runs)
  - [x] 8.7 Write property test: Feature: quran-pdf-viewer, Property 6 — TOC highlights correct surah for any page (fast-check, 100+ runs)
  - [x] 8.8 Write property test: Feature: quran-pdf-viewer, Property 7 — all toolbar buttons have aria-label (fast-check, 100+ runs)
  - [x] 8.9 Write unit tests for edge cases: first/last page boundary disabling, error overlay on failed load, noscript fallback link, fit-to-width default scale, TOC scrollability CSS
