// Helper: Get just the filename from a path (ignores folders and query params)
function getFileName(path) {
  // Remove domain, query strings, and hashes
  let cleanPath = path.split('?')[0].split('#')[0];
  
  // Get the part after the last slash
  let fileName = cleanPath.split('/').pop();
  
  // If the path ends in a slash (like domain.com/folder/), fileName is empty string
  // In that case, we assume it's the homepage (index.html)
  if (!fileName || fileName === '') {
    return 'index.html';
  }
  
  return fileName;
}

function setActiveNav() {
  // 1. Get the actual current filename loaded in the browser
  const currentFile = getFileName(window.location.pathname);
  const navLinks = document.querySelectorAll('#nav a');

  navLinks.forEach(link => {
    // 2. Get the filename the link points to
    const linkHref = link.getAttribute('href');
    const linkFile = getFileName(linkHref);

    // Remove old active classes
    link.parentElement.classList.remove('current');

    // 3. Compare just the filenames
    // This ignores "./" prefixes and folder paths, fixing deployment mismatches
    if (linkFile === currentFile) {
      link.parentElement.classList.add('current');
    }
  });
}

function loadHTML() {
  // 1. LOAD HEADER
  const headerWrapper = document.getElementById('header-wrapper');
  if (headerWrapper) {
    // Note: This expects header.html to be in the same folder as the HTML file running it
    fetch('header.html')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load header.html (Status: ${response.status})`);
        }
        return response.text();
      })
      .then(data => {
        headerWrapper.innerHTML = data;

        // A. Set Active Navigation
        setActiveNav();

        // B. Initialize Mobile Menu (Defined in main.js)
        if (typeof window.initNavigation === 'function') {
           window.initNavigation();
        } else {
           console.error("Error: window.initNavigation is not defined. Check if main.js is loaded.");
        }
      })
      .catch(err => console.error('HEADER ERROR:', err));
  }

  // 2. LOAD FOOTER
  const footerWrapper = document.getElementById('footer-wrapper');
  if (footerWrapper) {
    fetch('footer.html')
      .then(response => {
        if (!response.ok) throw new Error(`Failed to load footer.html (Status: ${response.status})`);
        return response.text();
      })
      .then(data => {
        footerWrapper.innerHTML = data;
      })
      .catch(err => console.error('FOOTER ERROR:', err));
  }
}

document.addEventListener('DOMContentLoaded', loadHTML);