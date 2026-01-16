// Function to highlight the current page in the menu
function setActiveNav() {
  // 1. Get the current page filename (e.g., "membership.html")
  const path = window.location.pathname;
  // If the path ends in /, it's index.html
  const currentPage = path.split('/').pop() || 'index.html';

  // 2. Select all links in the nav
  const navLinks = document.querySelectorAll('#nav a');

  navLinks.forEach(link => {
    // Get the raw href value (e.g., "./membership.html")
    const href = link.getAttribute('href');
    
    // Remove "current" class from the parent <li> just in case
    link.parentElement.classList.remove('current');
    
    // 3. Compare logic
    // Case A: Exact match (e.g. href="contact.html" === "contact.html")
    if (href === currentPage) {
      link.parentElement.classList.add('current');
    }
    // Case B: Relative match (e.g. href="./contact.html" === "./" + "contact.html")
    else if (href === './' + currentPage) {
      link.parentElement.classList.add('current');
    }
    // Case C: Homepage special cases
    else if (currentPage === 'index.html' && (href === './' || href === '.')) {
      link.parentElement.classList.add('current');
    }
  });
}

// Function to load external HTML files
function loadHTML() {
  
  // 1. LOAD HEADER
  const headerWrapper = document.getElementById('header-wrapper');
  if (headerWrapper) {
    fetch('header.html')
      .then(response => {
        if (!response.ok) throw new Error("Header file not found");
        return response.text();
      })
      .then(data => {
        headerWrapper.innerHTML = data;

        // A. Highlight the active link (CALLING THE FIXED FUNCTION)
        setActiveNav();

        // B. Initialize the Mobile Menu & Dropdowns
        if (typeof window.initNavigation === 'function') {
           window.initNavigation();
        }
      })
      .catch(err => console.error('Error loading header:', err));
  }

  // 2. LOAD FOOTER
  const footerWrapper = document.getElementById('footer-wrapper');
  if (footerWrapper) {
    fetch('footer.html')
      .then(response => response.text())
      .then(data => {
        footerWrapper.innerHTML = data;
      })
      .catch(err => console.error('Error loading footer:', err));
  }
}

// Run immediately when DOM is ready
document.addEventListener('DOMContentLoaded', loadHTML);