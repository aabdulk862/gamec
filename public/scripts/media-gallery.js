/**
 * media-gallery.js — Lightweight lightbox for MediaGallery component.
 * Handles: modal open/close, next/prev navigation, keyboard controls, focus trapping.
 * No dependencies. ~3KB unminified.
 */
(function () {
  'use strict';

  var modal = document.getElementById('image-modal');
  if (!modal) return;

  var img = modal.querySelector('.image-modal__img');
  var caption = modal.querySelector('.image-modal__caption');
  var counter = modal.querySelector('.image-modal__counter');
  var prevBtn = modal.querySelector('[data-modal-prev]');
  var nextBtn = modal.querySelector('[data-modal-next]');
  var closeBtns = modal.querySelectorAll('[data-modal-close]');

  var images = [];
  var currentIndex = 0;
  var previousFocus = null;

  // Collect all gallery images from all MediaGallery instances on the page
  function collectImages() {
    var triggers = document.querySelectorAll('.media-gallery__trigger');
    images = [];
    triggers.forEach(function (trigger) {
      var imgEl = trigger.querySelector('img');
      var figure = trigger.closest('.media-gallery__item');
      var captionEl = figure ? figure.querySelector('.media-gallery__caption') : null;
      if (imgEl) {
        images.push({
          // Use the full-size src (Astro Image generates srcset, fallback to src)
          src: imgEl.getAttribute('src'),
          alt: imgEl.getAttribute('alt') || '',
          caption: captionEl ? captionEl.textContent : ''
        });
      }
    });
  }

  function openModal(index) {
    collectImages();
    if (images.length === 0) return;

    currentIndex = index;
    previousFocus = document.activeElement;
    showImage();
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('image-modal--open');
    document.body.style.overflow = 'hidden';

    // Focus the close button for accessibility
    var closeBtn = modal.querySelector('.image-modal__close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('image-modal--open');
    document.body.style.overflow = '';

    // Restore focus
    if (previousFocus && previousFocus.focus) {
      previousFocus.focus();
    }
  }

  function showImage() {
    if (!images[currentIndex]) return;

    var data = images[currentIndex];
    img.setAttribute('src', data.src);
    img.setAttribute('alt', data.alt);
    caption.textContent = data.caption;
    caption.style.display = data.caption ? '' : 'none';
    counter.textContent = (currentIndex + 1) + ' / ' + images.length;

    // Update nav button visibility
    prevBtn.style.display = images.length > 1 ? '' : 'none';
    nextBtn.style.display = images.length > 1 ? '' : 'none';
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage();
  }

  // Event: click gallery triggers
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('.media-gallery__trigger');
    if (trigger) {
      e.preventDefault();
      var index = parseInt(trigger.getAttribute('data-index'), 10);
      // Calculate global index across all galleries
      var allTriggers = document.querySelectorAll('.media-gallery__trigger');
      var globalIndex = Array.prototype.indexOf.call(allTriggers, trigger);
      openModal(globalIndex >= 0 ? globalIndex : index);
    }
  });

  // Event: close buttons and overlay
  closeBtns.forEach(function (btn) {
    btn.addEventListener('click', closeModal);
  });

  // Event: nav buttons
  prevBtn.addEventListener('click', prevImage);
  nextBtn.addEventListener('click', nextImage);

  // Event: keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (modal.getAttribute('aria-hidden') === 'true') return;

    switch (e.key) {
      case 'Escape':
        closeModal();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case 'Tab':
        trapFocus(e);
        break;
    }
  });

  // Focus trapping within modal
  function trapFocus(e) {
    var focusable = modal.querySelectorAll(
      'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // Swipe gesture support (mobile)
  var touchStartX = 0;
  var touchEndX = 0;

  modal.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  modal.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    var diff = touchStartX - touchEndX;
    var threshold = 50;
    if (Math.abs(diff) < threshold) return;

    if (diff > 0) {
      nextImage(); // swipe left = next
    } else {
      prevImage(); // swipe right = prev
    }
  }
})();
