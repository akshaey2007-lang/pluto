const page = document.body.dataset.page || 'home';

const navigationItems = [
  ['home', 'Home', 'index.html'],
  ['how', 'How it works', 'how-it-works.html'],
  ['talent', 'For talent', 'talent.html'],
  ['clients', 'For clients', 'clients.html'],
  ['protection', 'Protection', 'protection.html'],
];

const header = document.querySelector('#site-header');
const footer = document.querySelector('#site-footer');

if (header) {
  header.className = 'site-header';
  header.innerHTML = `
    <a class="brand" href="index.html" aria-label="Pluto home">
      <img src="assets/pluto-logo-transparent.png" alt="Pluto">
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation">
      <span></span><span></span><span></span><span class="sr-only">Toggle menu</span>
    </button>
    <div class="header-menu liquid" id="primary-navigation" data-liquid>
      <nav class="primary-navigation" aria-label="Primary navigation">
        ${navigationItems.map(([id, label, href]) => `<a href="${href}" ${page === id ? 'aria-current="page"' : ''}>${label}</a>`).join('')}
      </nav>
      <div class="access-navigation">
        <div class="nav-dropdown">
          <button class="nav-trigger" type="button" aria-expanded="false">Open desk <span>⌄</span></button>
          <div class="nav-popover liquid" role="menu">
            <a href="talent-dashboard.html" role="menuitem"><b>Talent Signal Desk</b><span>Opportunities, proposals, work, and earnings</span></a>
            <a href="client-dashboard.html" role="menuitem"><b>Client Signal Desk</b><span>Projects, matches, delivery, and payments</span></a>
          </div>
        </div>
        <div class="nav-dropdown">
          <button class="nav-trigger" type="button" aria-expanded="false">Log in <span>⌄</span></button>
          <div class="nav-popover liquid" role="menu">
            <a href="talent-login.html" role="menuitem"><b>Talent login</b><span>Opportunities and active work</span></a>
            <a href="client-login.html" role="menuitem"><b>Client login</b><span>Projects, matches, and payments</span></a>
          </div>
        </div>
        <div class="nav-dropdown">
          <button class="primary-button compact nav-trigger" type="button" aria-expanded="false">Sign up <span>⌄</span></button>
          <div class="nav-popover nav-popover-right liquid" role="menu">
            <a href="talent-signup.html" role="menuitem"><b>Join as talent</b><span>Get verified and receive fair opportunities</span></a>
            <a href="client-signup.html" role="menuitem"><b>Join as a client</b><span>Build a focused shortlist for your project</span></a>
          </div>
        </div>
      </div>
    </div>`;
}

if (footer) {
  footer.className = 'site-footer section-shell';
  footer.innerHTML = `
    <div class="footer-primary">
      <div class="footer-brand-block">
        <a class="footer-brand" href="index.html"><img src="assets/pluto-logo-transparent.png" alt="Pluto"></a>
        <p>Pluto connects verified independent specialists with clearly scoped projects and funded milestones.</p>
        <div class="footer-trust" aria-label="Platform commitments">
          <span>Free for talent to apply</span>
          <span>Focused client shortlists</span>
          <span>Funded before work begins</span>
        </div>
      </div>
      <div class="footer-column">
        <h2>Platform</h2>
        <nav aria-label="Platform links">
          <a href="how-it-works.html">How it works</a>
          <a href="protection.html">Protection</a>
          <a href="talent.html">Talent Atlas</a>
          <a href="clients.html">For clients</a>
        </nav>
      </div>
      <div class="footer-column">
        <h2>Talent</h2>
        <nav aria-label="Talent links">
          <a href="talent-signup.html">Join as talent</a>
          <a href="talent-login.html">Talent login</a>
          <a href="talent-dashboard.html">Talent Signal Desk</a>
        </nav>
      </div>
      <div class="footer-column">
        <h2>Clients</h2>
        <nav aria-label="Client links">
          <a href="client-signup.html">Start a project</a>
          <a href="client-login.html">Client login</a>
          <a href="client-dashboard.html">Client Signal Desk</a>
        </nav>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Pluto</span>
      <span>Professional marketplace prototype</span>
      <a href="protection.html">Clear scope · Funded milestones · Protected delivery</a>
    </div>`;
}

const menuToggle = document.querySelector('.menu-toggle');
const headerMenu = document.querySelector('.header-menu');
menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  headerMenu.classList.toggle('open', !open);
});

document.querySelectorAll('.nav-trigger').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.stopPropagation();
    const dropdown = trigger.closest('.nav-dropdown');
    if (!dropdown) return;
    const open = dropdown.classList.contains('open');
    document.querySelectorAll('.nav-dropdown').forEach((item) => {
      item.classList.remove('open');
      item.querySelector('.nav-trigger').setAttribute('aria-expanded', 'false');
    });
    dropdown.classList.toggle('open', !open);
    trigger.setAttribute('aria-expanded', String(!open));
  });
});

document.addEventListener('click', () => {
  document.querySelectorAll('.nav-dropdown').forEach((item) => {
    item.classList.remove('open');
    item.querySelector('.nav-trigger').setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  document.querySelectorAll('.nav-dropdown').forEach((item) => {
    item.classList.remove('open');
    item.querySelector('.nav-trigger').setAttribute('aria-expanded', 'false');
  });
});

const toast = document.querySelector('.toast');
let toastTimer;
function showToast(message) {
  if (!toast) return;
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

document.querySelectorAll('[data-toast]').forEach((button) => {
  button.addEventListener('click', () => showToast(button.dataset.toast));
});

document.querySelectorAll('.password-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const input = document.querySelector(`#${button.dataset.target}`);
    const showing = input.type === 'text';
    input.type = showing ? 'password' : 'text';
    button.textContent = showing ? 'Show' : 'Hide';
    button.setAttribute('aria-label', `${showing ? 'Show' : 'Hide'} password`);
  });
});

document.querySelectorAll('.auth-form').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const role = form.dataset.role;
    const mode = form.dataset.mode;
    const message = form.querySelector('.form-success');
    message.hidden = false;
    message.textContent = mode === 'signup'
      ? `Your ${role} profile is ready for the verification step.`
      : `${role === 'talent' ? 'Talent' : 'Client'} demo login successful. Redirecting…`;
    form.querySelector('button[type="submit"]').disabled = true;
    window.setTimeout(() => {
      window.location.href = role === 'talent' ? 'talent-dashboard.html' : 'client-dashboard.html';
    }, 950);
  });
});

const filterButtons = document.querySelectorAll('[data-filter]');
const talentCards = document.querySelectorAll('[data-category]');
const resultCount = document.querySelector('#result-count');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    let visible = 0;
    talentCards.forEach((card) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (resultCount) resultCount.textContent = `${visible} ${visible === 1 ? 'match' : 'matches'}`;
  });
});

const shortlist = new Set();
document.querySelectorAll('[data-shortlist]').forEach((button) => {
  button.addEventListener('click', () => {
    const name = button.dataset.shortlist;
    const selected = shortlist.has(name);
    selected ? shortlist.delete(name) : shortlist.add(name);
    button.classList.toggle('selected', !selected);
    button.setAttribute('aria-pressed', String(!selected));
    button.textContent = selected ? '+ Shortlist' : '✓ Shortlisted';
    showToast(selected ? `${name} removed from your shortlist.` : `${name} added to your shortlist.`);
  });
});

if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('[data-liquid]').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const bounds = element.getBoundingClientRect();
      element.style.setProperty('--glow-x', `${event.clientX - bounds.left}px`);
      element.style.setProperty('--glow-y', `${event.clientY - bounds.top}px`);
    });
  });
}
