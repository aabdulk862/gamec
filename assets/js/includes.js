/**
 * @file Dynamic header/footer loading and active navigation detection.
 *
 * On DOMContentLoaded, fetches `header.html` and `footer.html` via the Fetch API
 * and injects them into `#header-wrapper` and `#footer-wrapper`. After the header
 * loads, highlights the current page in the nav bar and calls
 * `window.initNavigation()` (defined in main.js) to set up desktop dropdowns and
 * the mobile menu panel.
 *
 * Must be loaded **after** main.js so that `window.initNavigation` is available.
 */

/**
 * @description Extracts the bare filename from a URL path by stripping query
 * strings, hashes, and directory segments. Returns `'index.html'` when the
 * path is empty or ends with a trailing slash.
 * @param {string} path - A URL path or href value (e.g. `'./programs.html?v=2'`).
 * @returns {string} The filename portion of the path (e.g. `'programs.html'`).
 */
function getFileName(path) {
  // Remove domain, query strings, and hashes
  let cleanPath = path.split("?")[0].split("#")[0];

  // Get the part after the last slash
  let fileName = cleanPath.split("/").pop();

  // If the path ends in a slash (like domain.com/folder/), fileName is empty string
  // In that case, we assume it's the homepage (index.html)
  if (!fileName || fileName === "") {
    return "index.html";
  }

  return fileName;
}

/**
 * @description Highlights the current page's link in the site navigation.
 * Iterates over all anchor elements inside `#nav`, compares each link's
 * filename (via {@link getFileName}) against the current page's filename,
 * and toggles the `.current` class on the parent `<li>`.
 * @returns {void}
 * @sideeffect Removes `.current` class from all nav `<li>` elements, then
 * adds it to the `<li>` whose link matches the current page filename.
 */
function setActiveNav() {
  // 1. Get the actual current filename loaded in the browser
  const currentFile = getFileName(window.location.pathname);
  const navLinks = document.querySelectorAll("#nav a");

  navLinks.forEach((link) => {
    // 2. Get the filename the link points to
    const linkHref = link.getAttribute("href");
    const linkFile = getFileName(linkHref);

    // Remove old active classes
    link.parentElement.classList.remove("current");

    // 3. Compare just the filenames
    // This ignores "./" prefixes and folder paths, fixing deployment mismatches
    if (linkFile === currentFile) {
      link.parentElement.classList.add("current");
    }
  });
}

/**
 * @description Fetches `header.html` and `footer.html` and injects them into
 * `#header-wrapper` and `#footer-wrapper` respectively. After the header is
 * injected, calls {@link setActiveNav} to highlight the current page and
 * `window.initNavigation()` (from main.js) to initialise desktop dropdowns
 * and the mobile navigation panel.
 * @returns {void}
 * @sideeffect Replaces the innerHTML of `#header-wrapper` and
 * `#footer-wrapper`. Adds `.current` class to the active nav item.
 * Initialises navigation event listeners via `window.initNavigation()`.
 */
function loadHTML() {
  // 1. LOAD HEADER
  const headerWrapper = document.getElementById("header-wrapper");
  if (headerWrapper) {
    // Note: This expects header.html to be in the same folder as the HTML file running it
    fetch("header.html")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to load header.html (Status: ${response.status})`,
          );
        }
        return response.text();
      })
      .then((data) => {
        headerWrapper.innerHTML = data;

        // A. Set Active Navigation
        setActiveNav();

        // B. Initialize Mobile Menu (Defined in main.js)
        if (typeof window.initNavigation === "function") {
          window.initNavigation();
        } else {
          console.error(
            "Error: window.initNavigation is not defined. Check if main.js is loaded.",
          );
        }
      })
      .catch((err) => console.error("HEADER ERROR:", err));
  }

  // 2. LOAD FOOTER
  const footerWrapper = document.getElementById("footer-wrapper");
  if (footerWrapper) {
    fetch("footer.html")
      .then((response) => {
        if (!response.ok)
          throw new Error(
            `Failed to load footer.html (Status: ${response.status})`,
          );
        return response.text();
      })
      .then((data) => {
        footerWrapper.innerHTML = data;
      })
      .catch((err) => console.error("FOOTER ERROR:", err));
  }
}

document.addEventListener("DOMContentLoaded", loadHTML);
