/**
 * Winterberg Unternehmens-Verzeichnis - Embeddable Review Widget
 * https://www.winterberg-verzeichnis.de
 * 
 * Usage:
 * <div class="winterberg-widget" data-business="IHR-UNTERNEHMEN" data-layout="badge" data-theme="light"></div>
 * <script src="https://www.winterberg-verzeichnis.de/widget.js" async></script>
 */
(function () {
  'use strict';

  // Determine current origin / base url of script
  var scriptTag = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var scriptSrc = scriptTag ? scriptTag.src : '';
  var defaultBaseUrl = 'https://www.winterberg-verzeichnis.de';
  var baseUrl = defaultBaseUrl;

  try {
    if (scriptSrc && scriptSrc.indexOf('http') === 0) {
      var urlObj = new URL(scriptSrc);
      baseUrl = urlObj.origin;
    }
  } catch (e) {}

  function getDefaultHeight(layout) {
    switch (layout) {
      case 'simple_badge':
        return 75;
      case 'badge':
        return 135;
      case 'card':
        return 230;
      case 'carousel':
        return 270;
      default:
        return 140;
    }
  }

  function getMaxWidth(layout) {
    switch (layout) {
      case 'simple_badge':
        return '320px';
      case 'badge':
        return '380px';
      case 'card':
        return '420px';
      case 'carousel':
        return '460px';
      default:
        return '400px';
    }
  }

  function initWidgets() {
    var selectors = ['.winterberg-widget', '.winterberg-badge', '.wv-reviews-widget'];
    var elements = document.querySelectorAll(selectors.join(','));

    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      if (el.getAttribute('data-wv-initialized')) continue;

      var businessId = el.getAttribute('data-business') || el.getAttribute('data-business-id') || el.getAttribute('data-id');
      if (!businessId) {
        console.warn('[Winterberg Widget] Missing data-business attribute on element:', el);
        continue;
      }

      var layout = el.getAttribute('data-layout') || 'badge';
      var theme = el.getAttribute('data-theme') || 'light';
      var whitelabel = el.getAttribute('data-whitelabel') === 'true' ? '1' : '0';
      var lang = el.getAttribute('data-lang') || 'de';

      var iframeSrc = baseUrl + '/embed/reviews/' + encodeURIComponent(businessId) + 
                      '?layout=' + encodeURIComponent(layout) + 
                      '&theme=' + encodeURIComponent(theme) + 
                      '&whitelabel=' + encodeURIComponent(whitelabel) + 
                      '&lang=' + encodeURIComponent(lang);

      var iframe = document.createElement('iframe');
      iframe.src = iframeSrc;
      iframe.title = 'Winterberg Verzeichnis - Bewertungen & Siegel';
      iframe.style.width = '100%';
      iframe.style.maxWidth = getMaxWidth(layout);
      iframe.style.height = getDefaultHeight(layout) + 'px';
      iframe.style.border = 'none';
      iframe.style.overflow = 'hidden';
      iframe.style.display = 'block';
      iframe.style.transition = 'height 0.2s ease';
      iframe.setAttribute('scrolling', 'no');
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('data-wv-frame-id', businessId);

      el.innerHTML = '';
      el.appendChild(iframe);
      el.setAttribute('data-wv-initialized', 'true');
    }
  }

  // Handle postMessage for dynamic auto-resizing
  window.addEventListener('message', function (event) {
    if (!event.data || event.data.type !== 'wv-resize') return;
    var businessId = event.data.businessId;
    var newHeight = event.data.height;

    if (!newHeight || isNaN(newHeight)) return;

    var iframes = document.querySelectorAll('iframe[data-wv-frame-id="' + businessId + '"]');
    for (var j = 0; j < iframes.length; j++) {
      iframes[j].style.height = (newHeight + 5) + 'px';
    }
  });

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidgets);
  } else {
    initWidgets();
  }

  // Export global API
  window.WinterbergWidget = {
    init: initWidgets
  };
})();
