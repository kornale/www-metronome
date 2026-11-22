/* Platform switch for the promo code guide. Loaded in <head>: it marks the page as scripted right
   away (so only one guide is ever shown) and wires the switch once the page has loaded.
   Order of preference: #ios / #android in the URL, the last choice, then the phone itself. */
(function () {
  var KEY = "promocode.platform";
  var PLATFORMS = ["ios", "android"];
  document.documentElement.classList.add("js");

  function fromHash() {
    var h = location.hash.replace("#", "").toLowerCase();
    return PLATFORMS.indexOf(h) >= 0 ? h : null;
  }

  function fromDevice() {
    var ua = navigator.userAgent || "";
    if (/android/i.test(ua)) return "android";
    if (/iphone|ipad|ipod/i.test(ua)) return "ios";
    // iPadOS reports itself as a Mac but has a touch screen.
    if (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return "ios";
    return null;
  }

  function stored() {
    try {
      var v = localStorage.getItem(KEY);
      return PLATFORMS.indexOf(v) >= 0 ? v : null;
    } catch (e) { return null; }
  }

  function show(platform, remember) {
    var buttons = document.querySelectorAll(".platform-switch button");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute("aria-pressed", String(buttons[i].getAttribute("data-platform") === platform));
    }
    var guides = document.querySelectorAll(".guide");
    for (var j = 0; j < guides.length; j++) {
      guides[j].hidden = guides[j].getAttribute("data-platform") !== platform;
    }
    if (remember) {
      try { localStorage.setItem(KEY, platform); } catch (e) {}
      if (history.replaceState) history.replaceState(null, "", "#" + platform);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var bar = document.querySelector(".platform-switch");
    if (!bar) return;
    bar.hidden = false;
    bar.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-platform]");
      if (button) show(button.getAttribute("data-platform"), true);
    });
    show(fromHash() || stored() || fromDevice() || "ios", false);
  });

  window.addEventListener("hashchange", function () {
    var h = fromHash();
    if (h) show(h, true);
  });
})();
