# Requirements Document

## Introduction

This feature adds a "Holy Cities Live Stream" section to the GAMEC community website, providing direct access to live video streams from Makkah and Madinah via YouTube. The section appears on both the homepage (compact format for visibility) and the media page (detailed format alongside existing video content). Each city is represented by an existing image from the site's images folder with a call-to-action button linking to the corresponding YouTube live stream.

## Glossary

- **Homepage_Section**: The compact "Live from the Holy Cities" section rendered on index.html, displaying Makkah and Madinah livestream cards side by side
- **Media_Section**: The detailed "Live from the Holy Cities" section rendered on media.html, providing livestream cards with additional descriptive context alongside existing video content
- **Livestream_Card**: A UI component consisting of a city image, city name heading, optional description text, and a CTA button linking to a YouTube live stream
- **CTA_Button**: A call-to-action button styled consistently with the existing GAMEC design system that opens the YouTube live stream in a new browser tab
- **Makkah_Stream_URL**: https://www.youtube.com/live/JRRtm-adKvc?si=TmUeIlhqXGG3rRYI
- **Madinah_Stream_URL**: https://www.youtube.com/live/dFMegZR036Y?si=99vM0eFVKZefJaM0

## Requirements

### Requirement 1: Homepage Livestream Section

**User Story:** As a site visitor, I want to see a compact "Live from the Holy Cities" section on the homepage, so that I can quickly access live streams from Makkah and Madinah without navigating away from the main page.

#### Acceptance Criteria

1. THE Homepage_Section SHALL display a section heading of "Live from the Holy Cities" using the existing site heading style
2. THE Homepage_Section SHALL render exactly two Livestream_Cards arranged side by side in a two-column layout on desktop viewports
3. WHEN the viewport width is 736px or less, THE Homepage_Section SHALL stack the two Livestream_Cards vertically in a single column
4. THE Homepage_Section SHALL be placed within the main content area of index.html between existing content sections
5. THE Homepage_Section SHALL use the same container width, spacing, and visual rhythm as surrounding homepage sections

### Requirement 2: Media Page Livestream Section

**User Story:** As a site visitor browsing the media page, I want to see a detailed "Live from the Holy Cities" section, so that I can access live streams alongside other GAMEC media content.

#### Acceptance Criteria

1. THE Media_Section SHALL display a section heading of "Live from the Holy Cities" using the existing media page heading style
2. THE Media_Section SHALL render exactly two Livestream_Cards arranged side by side in a two-column layout on desktop viewports
3. WHEN the viewport width is 736px or less, THE Media_Section SHALL stack the two Livestream_Cards vertically in a single column
4. THE Media_Section SHALL include a brief introductory paragraph describing the live stream content
5. THE Media_Section SHALL be placed within the media.html content area between the Photo Gallery section and the Video Production section
6. EACH Livestream_Card in the Media_Section SHALL include a short description text beneath the city name heading

### Requirement 3: Makkah Livestream Card

**User Story:** As a site visitor, I want to view a Makkah livestream card with an image and a watch button, so that I can access the Makkah live stream on YouTube.

#### Acceptance Criteria

1. THE Makkah Livestream_Card SHALL display the image file `images/kaaba2.jpg` with descriptive alt text "Live stream from Makkah - The Holy Kaaba"
2. THE Makkah Livestream_Card SHALL display the heading "Makkah"
3. THE Makkah CTA_Button SHALL link to the Makkah_Stream_URL
4. THE Makkah CTA_Button SHALL display the label "Watch Live" with a Font Awesome video icon
5. WHEN a visitor activates the Makkah CTA_Button, THE CTA_Button SHALL open the Makkah_Stream_URL in a new browser tab
6. THE Makkah CTA_Button SHALL include `rel="noopener noreferrer"` on the anchor element

### Requirement 4: Madinah Livestream Card

**User Story:** As a site visitor, I want to view a Madinah livestream card with an image and a watch button, so that I can access the Madinah live stream on YouTube.

#### Acceptance Criteria

1. THE Madinah Livestream_Card SHALL display the image file `images/madinah.jpeg` with descriptive alt text "Live stream from Madinah - The Prophet's Mosque"
2. THE Madinah Livestream_Card SHALL display the heading "Madinah"
3. THE Madinah CTA_Button SHALL link to the Madinah_Stream_URL
4. THE Madinah CTA_Button SHALL display the label "Watch Live" with a Font Awesome video icon
5. WHEN a visitor activates the Madinah CTA_Button, THE CTA_Button SHALL open the Madinah_Stream_URL in a new browser tab
6. THE Madinah CTA_Button SHALL include `rel="noopener noreferrer"` on the anchor element

### Requirement 5: Livestream Card Visual Design

**User Story:** As a site visitor, I want the livestream cards to look consistent with the rest of the GAMEC website, so that the experience feels cohesive and professional.

#### Acceptance Criteria

1. EACH Livestream_Card SHALL have rounded corners matching the site's card border-radius variable (`--radius-card`)
2. EACH Livestream_Card SHALL display a box shadow matching the site's card shadow variable (`--shadow-card`)
3. WHEN a visitor hovers over a Livestream_Card, THE Livestream_Card SHALL display an elevated box shadow matching `--shadow-card-hover` with a smooth transition
4. EACH Livestream_Card image SHALL fill the full width of the card with a consistent aspect ratio and `object-fit: cover`
5. THE CTA_Button on each Livestream_Card SHALL use the primary button style defined in the GAMEC design system
6. EACH Livestream_Card SHALL use a white background color consistent with existing card components on the site

### Requirement 6: Responsive Image Handling

**User Story:** As a mobile visitor, I want the livestream images to load efficiently and display correctly on all screen sizes, so that the page performs well on slower connections.

#### Acceptance Criteria

1. EACH Livestream_Card image SHALL include the `loading="lazy"` attribute for deferred loading
2. EACH Livestream_Card image SHALL scale proportionally within the card container without distortion at all supported breakpoints
3. WHILE the viewport is at the medium breakpoint (737px to 980px), THE Livestream_Cards SHALL maintain the two-column layout with reduced spacing

### Requirement 7: Accessibility

**User Story:** As a visitor using assistive technology, I want the livestream section to be fully accessible, so that I can navigate and activate the live stream links using a keyboard or screen reader.

#### Acceptance Criteria

1. EACH CTA_Button SHALL be keyboard-focusable and activatable using the Enter key
2. EACH Livestream_Card image SHALL have meaningful alt text that describes the image content and its purpose
3. EACH CTA_Button anchor element SHALL communicate that the link opens in a new tab, using either visible text or an accessible label
4. THE Homepage_Section and Media_Section headings SHALL use proper heading hierarchy consistent with surrounding page content
