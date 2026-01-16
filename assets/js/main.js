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
    window.setTimeout(function () {
      $body.removeClass("is-preload");
    }, 100);
  });

  // ==================================================================
  // CUSTOM FUNCTION: Initialize Navigation (Mobile & Dropdowns)
  // We call this manually after the header HTML is loaded.
  // ==================================================================
  window.initNavigation = function() {
    var $nav = $("#nav");

    // Only run if the #nav element actually exists
    if ($nav.length > 0) {
      
      // 1. Initialize Dropdowns (Desktop)
      if ($nav.find("ul").length > 0) {
        $nav.find("ul").dropotron({
          mode: "fade",
          noOpenerFade: true,
          speed: 300,
        });
      }

      // 2. Mobile Menu: Clean up old instances first
      $('#navToggle').remove();
      $('#navPanel').remove();
      $body.removeClass('navPanel-visible');

      // 3. Create Mobile Toggle Button
      $(
        '<div id="navToggle">' +
          '<a href="#navPanel" class="toggle"></a>' +
          "</div>"
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
        
      console.log("Navigation initialized successfully.");
    }
  };

})(jQuery);