# Requirements Document

## Introduction

This feature replaces the static Quran image on the GAMEC resources page (`resources.html`) with an interactive, embedded PDF viewer. The viewer loads a Quran PDF hosted on Cloudflare and provides page navigation controls, a surah-based table of contents, and a responsive layout that integrates with the existing GAMEC site design. Mozilla's PDF.js library (loaded via CDN) is used for client-side PDF rendering, giving full control over the viewer UI without server-side dependencies.

## Glossary

- **Viewer**: The Quran PDF viewer component embedded in the resources page, responsible for rendering PDF pages and providing navigation controls
- **PDF_Renderer**: The PDF.js library module that fetches, parses, and renders individual PDF pages onto an HTML canvas element
- **Navigation_Controls**: The set of UI buttons and page indicator that allow users to move between pages of the PDF
- **TOC_Panel**: The table of contents sidebar/dropdown that lists all 114 surahs with their corresponding page numbers for direct navigation
- **Toolbar**: The horizontal control bar containing the Navigation_Controls, TOC_Panel toggle, and zoom controls
- **Canvas**: The HTML canvas element where the PDF_Renderer draws the current page
- **Surah**: A chapter of the Quran; there are 114 surahs total
- **Resources_Page**: The `resources.html` page on the GAMEC website where the Viewer is embedded

## Requirements

### Requirement 1: PDF Loading and Rendering

**User Story:** As a community member, I want the Quran PDF to load and display in the resources page, so that I can read the Quran directly on the GAMEC website without downloading a file.

#### Acceptance Criteria

1. WHEN the Resources_Page loads, THE Viewer SHALL fetch the Quran PDF from the Cloudflare-hosted URL and render the first page on the Canvas
2. WHILE the PDF_Renderer is loading the document, THE Viewer SHALL display a loading spinner or progress indicator to the user
3. IF the PDF fails to load due to a network error or invalid URL, THEN THE Viewer SHALL display a clear error message with a retry button
4. THE PDF_Renderer SHALL render each page at a resolution that matches the Canvas display size to ensure readable Arabic text

### Requirement 2: Page Navigation

**User Story:** As a community member, I want to navigate forward and backward through the Quran pages, so that I can read through the Quran at my own pace.

#### Acceptance Criteria

1. THE Toolbar SHALL display a previous-page button, a next-page button, and a current page indicator showing the format "Page X of Y"
2. WHEN the user clicks the next-page button, THE Viewer SHALL render the next page of the PDF on the Canvas
3. WHEN the user clicks the previous-page button, THE Viewer SHALL render the previous page of the PDF on the Canvas
4. WHILE the Viewer is displaying the first page, THE Navigation_Controls SHALL disable the previous-page button visually and functionally
5. WHILE the Viewer is displaying the last page, THE Navigation_Controls SHALL disable the next-page button visually and functionally
6. WHEN the user presses the left arrow key while the Viewer is focused, THE Viewer SHALL navigate to the previous page
7. WHEN the user presses the right arrow key while the Viewer is focused, THE Viewer SHALL navigate to the next page

### Requirement 3: Table of Contents (Surah Navigation)

**User Story:** As a community member, I want a table of contents listing all surahs, so that I can jump directly to any surah without scrolling through hundreds of pages.

#### Acceptance Criteria

1. THE Toolbar SHALL include a TOC toggle button that opens and closes the TOC_Panel
2. WHEN the user clicks the TOC toggle button, THE TOC_Panel SHALL open as an overlay or dropdown listing all 114 surahs with their names and page numbers
3. WHEN the user selects a surah from the TOC_Panel, THE Viewer SHALL navigate to the corresponding page and close the TOC_Panel
4. THE TOC_Panel SHALL be scrollable when the list of surahs exceeds the visible area
5. WHILE the TOC_Panel is open, THE TOC_Panel SHALL highlight the surah corresponding to the currently displayed page

### Requirement 4: Responsive Layout

**User Story:** As a community member using a phone or tablet, I want the Quran viewer to adapt to my screen size, so that I can read comfortably on any device.

#### Acceptance Criteria

1. THE Viewer SHALL have a maximum width of 800px and be horizontally centered within the Resources_Page content area
2. WHILE the viewport width is 736px or less (small breakpoint), THE Viewer SHALL scale the Canvas to fill the available container width
3. WHILE the viewport width is 736px or less, THE Toolbar buttons SHALL use a minimum touch target size of 44x44 CSS pixels
4. THE Viewer container SHALL maintain the existing GAMEC design language, using the site color variables (--color-primary, --color-accent), Roboto font, and consistent border-radius values

### Requirement 5: Zoom Controls

**User Story:** As a community member, I want to zoom in and out of the Quran pages, so that I can adjust the text size for comfortable reading.

#### Acceptance Criteria

1. THE Toolbar SHALL include a zoom-in button and a zoom-out button
2. WHEN the user clicks the zoom-in button, THE PDF_Renderer SHALL re-render the current page at a larger scale (incrementing by 0.25x)
3. WHEN the user clicks the zoom-out button, THE PDF_Renderer SHALL re-render the current page at a smaller scale (decrementing by 0.25x)
4. THE Viewer SHALL constrain the zoom level to a minimum of 0.5x and a maximum of 3.0x
5. THE Viewer SHALL default to a zoom level that fits the page width within the container (fit-to-width)

### Requirement 6: Accessibility

**User Story:** As a community member using assistive technology, I want the viewer controls to be keyboard-accessible and properly labeled, so that I can navigate the Quran viewer without a mouse.

#### Acceptance Criteria

1. THE Toolbar buttons SHALL each have an accessible label via aria-label attributes describing the button action
2. THE Viewer SHALL be focusable via keyboard tabbing and support keyboard navigation as defined in Requirement 2
3. WHEN a page finishes rendering, THE Viewer SHALL update an aria-live region to announce the current page number to screen readers
4. THE Canvas element SHALL have an alt-text role description indicating it displays a Quran page

### Requirement 7: Integration with Existing Page

**User Story:** As a site maintainer, I want the viewer to replace the existing Quran image cleanly, so that the resources page remains consistent and the rest of the content is unaffected.

#### Acceptance Criteria

1. THE Viewer SHALL replace the existing static Quran image (`<a class="image featured">...</a>` block) in the Resources_Page markup
2. THE Viewer SHALL load PDF.js via CDN (mozilla.github.io/pdf.js) without requiring any build tools or local file installations
3. THE Viewer SHALL be implemented as a self-contained JavaScript module in a single file (`assets/js/quran-viewer.js`) with corresponding CSS added to `assets/css/main.css`
4. IF JavaScript is disabled, THEN THE Viewer SHALL fall back to displaying a direct link to the Cloudflare-hosted PDF so users can still access the Quran
