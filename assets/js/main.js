(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };

  // Footer year
  $('year').textContent = new Date().getFullYear();

  // Mobile nav
  var toggle = document.querySelector('.nav-toggle');
  var menu = $('menu');
  toggle.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
  });

  // Deployment status panel
  function setStatus(id, text, ok) {
    var el = $(id);
    el.textContent = text;
    if (ok === true) el.className = 'ok';
    if (ok === false) el.className = 'bad';
  }
  var isHttps = location.protocol === 'https:';
  var isLocal = ['localhost', '127.0.0.1'].indexOf(location.hostname) !== -1;
  setStatus('st-protocol', location.protocol.replace(':', '').toUpperCase(), isHttps || isLocal);
  setStatus('st-secure', window.isSecureContext ? 'Yes ✓' : 'No ✗', window.isSecureContext);
  setStatus('st-host', location.host || 'local file');

  // document.lastModified reflects the server's Last-Modified header (set on each deploy)
  var lm = new Date(document.lastModified);
  setStatus('st-deploy', isNaN(lm) ? 'Unknown' : lm.toLocaleString());

  // Verify images loaded (detects broken asset paths)
  window.addEventListener('load', function () {
    var imgs = Array.prototype.slice.call(document.images);
    var broken = imgs.filter(function (i) { return !i.complete || i.naturalWidth === 0; });
    setStatus('st-assets', broken.length ? broken.length + ' broken ✗' : 'All ' + imgs.length + ' images OK ✓', broken.length === 0);
  });

  // Contact form (client-side only; wire to Formspree/Netlify Forms if desired)
  $('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, msg = $('form-msg');
    if (!f.checkValidity()) { msg.textContent = 'Please complete all fields with a valid email.'; msg.className = 'bad'; return; }
    msg.textContent = 'Thanks, ' + f.name.value.trim() + '! (Demo form – no data was sent.)';
    msg.className = 'ok';
    f.reset();
  });
})();
