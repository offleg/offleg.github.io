// OffLeg — shared page behaviour: theme toggle, theme-aware logo, footer year.
// The saved/system theme is applied by a small inline script in each page's <head>
// so the page never flashes the wrong colours on load.
(function () {
  var root = document.documentElement;

  function syncLogos() {
    var dark = root.getAttribute('data-theme') === 'dark';
    var logos = document.querySelectorAll('[data-logo]');
    for (var i = 0; i < logos.length; i++) {
      var base = logos[i].getAttribute('data-logo');
      logos[i].src = base + (dark ? 'offleg_light.png' : 'offleg.png');
    }
    var toggle = document.querySelector('.theme-toggle');
    if (toggle) toggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncLogos();
    });
  }

  var years = document.querySelectorAll('[data-year]');
  for (var i = 0; i < years.length; i++) years[i].textContent = new Date().getFullYear();

  syncLogos();
})();
