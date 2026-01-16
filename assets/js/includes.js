// Set active navigation item based on current page
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('#nav a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // Remove any existing active classes
    link.parentElement.classList.remove('current');
    
    // Check if this link matches current page
    if (href === currentPage || href === './' + currentPage) {
      link.parentElement.classList.add('current');
    }
    
    // Special case for index/home
    if (currentPage === 'index.html' && (href === 'index.html' || href === './index.html')) {
      link.parentElement.classList.add('current');
    }
  });
}

// Load HTML includes (header, footer, etc.)
function loadHTML() {
  // Load header
  const headerElement = document.getElementById('header-wrapper');
  if (headerElement) {
    fetch('header.html')
      .then(response => response.text())
      .then(data => {
        headerElement.innerHTML = data;
        
        // Set active navigation
        setActiveNav();
        
        // Re-initialize dropotron after header is loaded
        if (typeof jQuery !== 'undefined' && jQuery.fn.dropotron) {
          jQuery('#nav > ul').dropotron({
            mode: 'fade',
            noOpenerFade: true,
            alignment: 'center'
          });
        }
      })
      .catch(err => console.error('Error loading header:', err));
  }

  // Load footer
  const footerElement = document.getElementById('footer-wrapper');
  if (footerElement) {
    fetch('footer.html')
      .then(response => response.text())
      .then(data => {
        footerElement.innerHTML = data;
      })
      .catch(err => console.error('Error loading footer:', err));
  }
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', loadHTML);