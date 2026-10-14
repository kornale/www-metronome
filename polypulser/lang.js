/* Language choice. Each page lists its translations as <link rel="alternate" hreflang>.
   The language picked in the header menu is remembered; until then, the English pages switch to
   the browser's preferred language when there is a translation. Runs in <head>, so the switch
   happens before the page is shown. */
(function () {
  var KEY = "polypulser.lang";
  var LANGUAGES = ["en", "de", "es", "fr", "it"];
  var current = document.documentElement.lang;

  function alternate(lang) {
    var link = document.querySelector('link[rel="alternate"][hreflang="' + lang + '"]');
    return link ? link.href : null;
  }

  function go(lang) {
    var href = alternate(lang);
    if (href) location.replace(href + location.hash);
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest && event.target.closest("a[data-lang]");
    if (link) {
      try { localStorage.setItem(KEY, link.getAttribute("data-lang")); } catch (e) {}
      return;
    }
    // A click outside the open language menu closes it.
    var menu = document.querySelector(".lang-menu[open]");
    if (menu && !menu.contains(event.target)) menu.open = false;
  });

  document.addEventListener("keydown", function (event) {
    var menu = document.querySelector(".lang-menu[open]");
    if (event.key === "Escape" && menu) {
      menu.open = false;
      menu.querySelector("summary").focus();
    }
  });

  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}
  if (LANGUAGES.indexOf(stored) >= 0) {
    if (stored !== current) go(stored);
    return;
  }

  // No choice yet: follow the browser, but only away from English, the default.
  if (current !== "en") return;
  var preferred = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
  for (var i = 0; i < preferred.length; i++) {
    var lang = String(preferred[i]).toLowerCase().split("-")[0];
    if (LANGUAGES.indexOf(lang) >= 0) {
      if (lang !== current) go(lang);
      return;
    }
  }
})();
