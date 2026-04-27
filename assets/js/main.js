/**
 * @file Main site initialization script for GAMEC website.
 * Handles responsive breakpoint configuration, preload state removal,
 * scroll-reveal animations via IntersectionObserver, and navigation
 * initialization (desktop WAI-ARIA dropdowns and mobile slide-in panel).
 * Wrapped in a jQuery IIFE; exposes {@link window.initNavigation} for
 * `includes.js` to call after dynamic header injection.
 *
 * @requires jQuery
 * @requires breakpoints.min.js
 * @requires util.js
 */

/**
 * @description Self-executing IIFE that configures breakpoints, sets up
 * scroll-reveal on window load, removes the preload state, and defines
 * the global `window.initNavigation` function for navigation setup.
 * @param {jQuery} $ - jQuery instance passed in to avoid global conflicts.
 * @sideeffect Registers window load handler, removes `.is-preload` from body,
 *   creates an IntersectionObserver, and assigns `window.initNavigation`.
 */
(function ($) {
  var $window = $(window),
    $body = $("body");

  // Breakpoints.
  breakpoints({
    xlarge: ["1281px", "1680px"],
    large: ["981px", "1280px"],
    medium: ["737px", "980px"],
    small: [null, "736px"],
  });

  // Play initial animations on page load.
  $window.on("load", function () {
    /**
     * @description Removes the `.is-preload` class from `<body>` after a
     * 100 ms delay, enabling CSS transitions that are suppressed during
     * initial page load.
     * @sideeffect Removes `.is-preload` class from `<body>`.
     */
    window.setTimeout(function () {
      $body.removeClass("is-preload");
    }, 100);

    /**
     * @description Scroll-reveal setup. Creates an IntersectionObserver that
     * watches all elements with `.reveal` or `.reveal-stagger` classes and
     * adds `.is-visible` when 15% of the element enters the viewport.
     * Each element is unobserved after its first intersection (one-shot).
     * Falls back to adding `.is-visible` immediately if
     * IntersectionObserver is not supported.
     * @sideeffect Adds `.is-visible` class to `.reveal` and
     *   `.reveal-stagger` elements when they scroll into view.
     */
    var reveals = document.querySelectorAll(".reveal, .reveal-stagger");
    if ("IntersectionObserver" in window && reveals.length) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 },
      );
      reveals.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback: show everything
      reveals.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  });

  // ==================================================================
  // CUSTOM FUNCTION: Initialize Navigation (Mobile & Dropdowns)
  // We call this manually after the header HTML is loaded.
  // ==================================================================

  /**
   * @description Initializes desktop dropdown menus (WAI-ARIA disclosure
   * pattern) and the mobile slide-in navigation panel. Called by
   * `includes.js` after the header HTML is dynamically injected.
   * Cleans up any existing `#navToggle` and `#navPanel` elements before
   * creating new ones, so it is safe to call multiple times.
   * @returns {void}
   * @sideeffect Creates `#navToggle` button and `#navPanel` div on `<body>`.
   *   Adds mouseenter/mouseleave and keyboard event listeners to nav items.
   *   Toggles `.is-open` on dropdown `<ul>` elements and `aria-expanded`
   *   on parent links. Toggles `.navPanel-visible` on `<body>` and manages
   *   ARIA attributes on the mobile toggle button. Registers a
   *   MutationObserver on `<body>` to sync ARIA state.
   */
  window.initNavigation = function () {
    var $nav = $("#nav");

    // Only run if the #nav element actually exists
    if ($nav.length > 0) {
      // 1. Desktop Dropdowns — WAI-ARIA disclosure pattern (replaces Dropotron)
      var $parentItems = $nav.find("> ul > li").has("ul");

      $parentItems.each(function () {
        var $li = $(this);
        var $link = $li.children("a");
        var $dropdown = $li.children("ul");
        var closeTimer = null;

        function openDropdown() {
          clearTimeout(closeTimer);
          // Close any other open dropdowns first
          $parentItems.not($li).each(function () {
            var $other = $(this).children("ul");
            $other.removeClass("is-open");
            $(this).children("a").attr("aria-expanded", "false");
          });
          $dropdown.addClass("is-open");
          $link.attr("aria-expanded", "true");
        }

        function closeDropdown() {
          $dropdown.removeClass("is-open");
          $link.attr("aria-expanded", "false");
        }

        function closeDropdownDelayed() {
          closeTimer = setTimeout(closeDropdown, 200);
        }

        // Mouse hover
        $li.on("mouseenter", openDropdown);
        $li.on("mouseleave", closeDropdownDelayed);

        // Keyboard on parent link
        $link.on("keydown", function (e) {
          var key = e.key;
          if (key === "Enter" || key === " " || key === "ArrowDown") {
            if ($dropdown.length) {
              e.preventDefault();
              openDropdown();
              $dropdown.find("a").first().focus();
            }
          } else if (key === "Escape") {
            closeDropdown();
            $link.focus();
          }
        });

        // Keyboard within dropdown items
        $dropdown.find("a").on("keydown", function (e) {
          var key = e.key;
          var $items = $dropdown.find("a");
          var idx = $items.index(this);

          if (key === "ArrowDown") {
            e.preventDefault();
            if (idx < $items.length - 1) $items.eq(idx + 1).focus();
          } else if (key === "ArrowUp") {
            e.preventDefault();
            if (idx > 0) $items.eq(idx - 1).focus();
            else $link.focus();
          } else if (key === "Escape") {
            e.preventDefault();
            closeDropdown();
            $link.focus();
          } else if (key === "Tab") {
            closeDropdown();
          }
        });
      });

      // 2. Mobile Menu: Clean up old instances first
      $("#navToggle").remove();
      $("#navPanel").remove();
      $body.removeClass("navPanel-visible");

      // 3. Create Mobile Toggle Button (accessible <button>)
      $(
        '<button id="navToggle" type="button" aria-label="Open menu" aria-expanded="false">' +
          '<span class="toggle"></span>' +
          "</button>",
      ).appendTo($body);

      // 4. Create Mobile Panel
      $('<div id="navPanel">' + "<nav>" + $nav.navList() + "</nav>" + "</div>")
        .appendTo($body)
        .panel({
          delay: 500,
          hideOnClick: true,
          hideOnSwipe: true,
          resetScroll: true,
          resetForms: true,
          side: "left",
          target: $body,
          visibleClass: "navPanel-visible",
        });

      // 5. Toggle button ARIA state management
      var $toggle = $("#navToggle");
      $toggle.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        var isOpen = $body.hasClass("navPanel-visible");
        if (isOpen) {
          $body.removeClass("navPanel-visible");
          $toggle
            .attr("aria-expanded", "false")
            .attr("aria-label", "Open menu");
        } else {
          $body.addClass("navPanel-visible");
          $toggle
            .attr("aria-expanded", "true")
            .attr("aria-label", "Close menu");
        }
      });

      // Watch for panel close from other sources (swipe, link click, body tap)
      var observer = new MutationObserver(function () {
        if (!$body.hasClass("navPanel-visible")) {
          $toggle
            .attr("aria-expanded", "false")
            .attr("aria-label", "Open menu");
        }
      });
      observer.observe($body[0], {
        attributes: true,
        attributeFilter: ["class"],
      });

      console.log("Navigation initialized successfully.");
    }
  };
})(jQuery);
