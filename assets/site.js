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

  var releaseVersion = document.querySelector('[data-neweye-version]');
  var releaseLinks = document.querySelectorAll('[data-neweye-asset]');
  if (releaseVersion || releaseLinks.length) {
    fetch('https://api.github.com/repos/offleg/neweye-releases/releases/latest')
      .then(function (response) {
        if (!response.ok) throw new Error('Release request failed');
        return response.json();
      })
      .then(function (release) {
        if (releaseVersion && release.tag_name) releaseVersion.textContent = release.tag_name.replace(/^v/, '');
        for (var j = 0; j < releaseLinks.length; j++) {
          var ending = releaseLinks[j].getAttribute('data-neweye-asset');
          var asset = release.assets.find(function (item) { return item.name.endsWith(ending); });
          if (asset && asset.browser_download_url.indexOf('https://github.com/offleg/neweye-releases/releases/download/') === 0) {
            releaseLinks[j].href = asset.browser_download_url;
          }
        }
      })
      .catch(function () {
        // The buttons still open the latest release page if GitHub's API is unavailable.
      });
  }

  syncLogos();
})();
