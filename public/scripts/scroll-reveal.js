/**
 * @file Scroll reveal animations and preload state removal.
 * Vanilla JS replacement for the scroll-reveal and preload logic
 * previously in main.js (jQuery IIFE).
 *
 * - IntersectionObserver watches `.reveal` and `.reveal-stagger` elements
 *   and adds `.is-visible` when 15% of the element enters the viewport.
 * - Each element is unobserved after first intersection (one-shot).
 * - Falls back to adding `.is-visible` immediately if IntersectionObserver
 *   is not supported.
 * - Removes `.is-preload` from `<body>` 100ms after window load to enable
 *   CSS transitions that are suppressed during initial page load.
 */

(function () {
  /**
   * Initializes scroll reveal and preload removal once the DOM is ready.
   */
  function init() {
    // Preload removal: remove .is-preload from body 100ms after load
    if (document.body.classList.contains('is-preload')) {
      setTimeout(function () {
        document.body.classList.remove('is-preload');
      }, 100);
    }

    // Scroll reveal: observe .reveal and .reveal-stagger elements
    var reveals = document.querySelectorAll('.reveal:not(.is-visible), .reveal-stagger:not(.is-visible)');

    if (!reveals.length) {
      return;
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      reveals.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback: add .is-visible immediately if IntersectionObserver unsupported
      reveals.forEach(function (el) {
        el.classList.add('is-visible');
      });
    }
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-initialize after Astro View Transitions swap the page
  document.addEventListener('astro:page-load', init);
})();
