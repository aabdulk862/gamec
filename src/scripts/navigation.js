/**
 * @file Navigation initialization script for GAMEC website (vanilla JS).
 * Replaces jQuery-based `.panel()` and `.navList()` plugin calls.
 * Handles desktop WAI-ARIA dropdown menus and mobile slide-in panel.
 *
 * @description Self-contained module that initializes when DOM is ready.
 * No jQuery dependency — pure vanilla JavaScript.
 */

(function () {
  'use strict';

  /**
   * Generate a flat list of links from the nav element.
   * Replaces jQuery's `.navList()` plugin.
   * @param {HTMLElement} nav - The nav element containing the menu.
   * @returns {string} HTML string of flattened nav links with depth classes.
   */
  function navList(nav) {
    var links = nav.querySelectorAll('a');
    var html = [];

    links.forEach(function (a) {
      // Calculate depth by counting parent <li> elements
      var depth = 0;
      var parent = a.parentElement;
      while (parent && parent !== nav) {
        if (parent.tagName === 'LI') {
          depth++;
        }
        parent = parent.parentElement;
      }
      // Depth is 0-based (top-level links are depth-0)
      var indent = Math.max(0, depth - 1);

      var href = a.getAttribute('href') || '';
      var target = a.getAttribute('target') || '';
      var text = a.textContent.replace(/⏷/g, '').trim();

      html.push(
        '<a class="link depth-' + indent + '"' +
        (target ? ' target="' + target + '"' : '') +
        (href ? ' href="' + href + '"' : '') +
        '>' +
        '<span class="indent-' + indent + '"></span>' +
        text +
        '</a>'
      );
    });

    return html.join('');
  }

  /**
   * Initialize desktop dropdown menus using WAI-ARIA disclosure pattern.
   * @param {HTMLElement} nav - The #nav element.
   */
  function initDesktopDropdowns(nav) {
    var topLevelItems = nav.querySelectorAll(':scope > ul > li');

    topLevelItems.forEach(function (li) {
      var dropdown = li.querySelector('ul');
      if (!dropdown) return;

      var link = li.querySelector(':scope > a');
      var openTimer = null;
      var closeTimer = null;

      function openDropdown() {
        clearTimeout(closeTimer);
        clearTimeout(openTimer);
        // Close any other open dropdowns first
        topLevelItems.forEach(function (otherLi) {
          if (otherLi === li) return;
          var otherDropdown = otherLi.querySelector('ul');
          if (otherDropdown) {
            otherDropdown.classList.remove('is-open');
            var otherLink = otherLi.querySelector(':scope > a');
            if (otherLink) {
              otherLink.setAttribute('aria-expanded', 'false');
            }
          }
        });
        dropdown.classList.add('is-open');
        link.setAttribute('aria-expanded', 'true');
      }

      function closeDropdown() {
        clearTimeout(openTimer);
        clearTimeout(closeTimer);
        dropdown.classList.remove('is-open');
        link.setAttribute('aria-expanded', 'false');
      }

      // Mouse hover: open with 200ms delay, close with 200ms delay
      li.addEventListener('mouseenter', function () {
        clearTimeout(closeTimer);
        openTimer = setTimeout(openDropdown, 200);
      });

      li.addEventListener('mouseleave', function () {
        clearTimeout(openTimer);
        closeTimer = setTimeout(closeDropdown, 200);
      });

      // Keyboard on parent link
      link.addEventListener('keydown', function (e) {
        var key = e.key;
        if (key === 'Enter' || key === ' ' || key === 'ArrowDown') {
          if (dropdown) {
            e.preventDefault();
            openDropdown();
            var firstLink = dropdown.querySelector('a');
            if (firstLink) firstLink.focus();
          }
        } else if (key === 'Escape') {
          closeDropdown();
          link.focus();
        }
      });

      // Keyboard within dropdown items
      var dropdownLinks = dropdown.querySelectorAll('a');
      dropdownLinks.forEach(function (dropdownLink, idx) {
        dropdownLink.addEventListener('keydown', function (e) {
          var key = e.key;

          if (key === 'ArrowDown') {
            e.preventDefault();
            if (idx < dropdownLinks.length - 1) {
              dropdownLinks[idx + 1].focus();
            }
          } else if (key === 'ArrowUp') {
            e.preventDefault();
            if (idx > 0) {
              dropdownLinks[idx - 1].focus();
            } else {
              link.focus();
            }
          } else if (key === 'Escape') {
            e.preventDefault();
            closeDropdown();
            link.focus();
          } else if (key === 'Tab') {
            closeDropdown();
          }
        });
      });
    });
  }

  /**
   * Initialize mobile slide-in panel.
   * Replaces jQuery's `.panel()` plugin and toggle button creation.
   * @param {HTMLElement} nav - The #nav element.
   */
  function initMobilePanel(nav) {
    var body = document.body;

    // Clean up any existing instances
    var existingToggle = document.getElementById('navToggle');
    var existingPanel = document.getElementById('navPanel');
    if (existingToggle) existingToggle.remove();
    if (existingPanel) existingPanel.remove();
    body.classList.remove('navPanel-visible');

    // Create mobile toggle button
    var toggle = document.createElement('button');
    toggle.id = 'navToggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Open menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span class="toggle"></span>';
    body.appendChild(toggle);

    // Create mobile panel with flattened nav links
    var panel = document.createElement('div');
    panel.id = 'navPanel';
    var panelNav = document.createElement('nav');
    panelNav.innerHTML = navList(nav);
    panel.appendChild(panelNav);
    body.appendChild(panel);

    // Track touch state for swipe-to-close
    var touchStartX = null;
    var touchStartY = null;

    /**
     * Open the mobile panel.
     */
    function openPanel() {
      body.classList.add('navPanel-visible');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
    }

    /**
     * Close the mobile panel.
     */
    function closePanel() {
      body.classList.remove('navPanel-visible');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      // Reset scroll position
      panel.scrollTop = 0;
    }

    // Toggle button click
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (body.classList.contains('navPanel-visible')) {
        closePanel();
      } else {
        openPanel();
      }
    });

    // Prevent panel clicks from bubbling to body close handler
    // and handle link clicks within panel
    panel.addEventListener('click', function (e) {
      e.stopPropagation();

      var target = e.target.closest('a');
      if (!target) return;

      var href = target.getAttribute('href');
      if (!href || href === '#' || href === '') return;

      e.preventDefault();
      closePanel();

      // Navigate after panel close animation
      var linkTarget = target.getAttribute('target');
      setTimeout(function () {
        if (linkTarget === '_blank') {
          window.open(href);
        } else {
          window.location.href = href;
        }
      }, 350);
    });

    // Hide on body click/tap (outside panel)
    body.addEventListener('click', function (e) {
      if (!body.classList.contains('navPanel-visible')) return;
      if (toggle.contains(e.target)) return;
      closePanel();
    });

    // Swipe to close (left swipe on panel)
    panel.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].pageX;
      touchStartY = e.touches[0].pageY;
    });

    panel.addEventListener('touchmove', function (e) {
      if (touchStartX === null || touchStartY === null) return;

      var diffX = touchStartX - e.touches[0].pageX;
      var diffY = touchStartY - e.touches[0].pageY;

      // Swipe left to close (panel is on the left side)
      if (Math.abs(diffY) < 20 && diffX > 50) {
        touchStartX = null;
        touchStartY = null;
        closePanel();
      }
    });

    panel.addEventListener('touchend', function () {
      touchStartX = null;
      touchStartY = null;
    });

    // Watch for external panel close (e.g., via class removal by other scripts)
    var observer = new MutationObserver(function () {
      if (!body.classList.contains('navPanel-visible')) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      }
    });
    observer.observe(body, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  /**
   * Main navigation initialization function.
   * Sets up desktop dropdowns and mobile slide-in panel.
   */
  function initNavigation() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    initDesktopDropdowns(nav);
    initMobilePanel(nav);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }

  // Expose globally for potential external use
  window.initNavigation = initNavigation;
})();
