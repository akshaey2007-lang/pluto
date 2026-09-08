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
          <button class="nav-trigger" type="button" aria-expanded="false">Open desk</button>
          <div class="nav-popover liquid" role="menu">
            <a href="talent-dashboard.html" role="menuitem"><b>Talent Signal Desk</b><span>Opportunities, proposals, work, and earnings</span></a>
            <a href="client-dashboard.html" role="menuitem"><b>Client Signal Desk</b><span>Projects, matches, delivery, and payments</span></a>
          </div>
        </div>
        <div class="nav-dropdown">
          <button class="nav-trigger" type="button" aria-expanded="false">Log in</button>
          <div class="nav-popover liquid" role="menu">
            <a href="talent-login.html" role="menuitem"><b>Talent login</b><span>Opportunities and active work</span></a>
            <a href="client-login.html" role="menuitem"><b>Client login</b><span>Projects, matches, and payments</span></a>
          </div>
        </div>
        <div class="nav-dropdown">
          <button class="primary-button compact nav-trigger" type="button" aria-expanded="false">Sign up</button>
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

function setHeaderMenuOpen(open) {
  menuToggle?.setAttribute('aria-expanded', String(open));
  headerMenu?.classList.toggle('open', open);
}

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  setHeaderMenuOpen(!open);
});

headerMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setHeaderMenuOpen(false)));
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) setHeaderMenuOpen(false);
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
  setHeaderMenuOpen(false);
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

const authDashboard = (role) => role === 'talent' ? 'talent-dashboard.html' : 'client-dashboard.html';

document.querySelectorAll('.auth-form').forEach((emailForm) => {
  const role = emailForm.dataset.role;
  const mode = emailForm.dataset.mode;
  const roleLabel = role === 'talent' ? 'Talent' : 'Client';
  const actionLabel = mode === 'signup' ? 'Sign up' : 'Continue';
  const phoneId = `${role}-${mode}-phone`;
  const codeId = `${role}-${mode}-code`;
  const methods = document.createElement('section');
  methods.className = 'auth-methods';
  methods.setAttribute('aria-label', `${roleLabel} access options`);
  methods.innerHTML = `
    <button class="auth-provider-button google-auth-button" type="button" data-google-auth>
      <span class="provider-mark google-mark" aria-hidden="true">G</span>
      <span>${actionLabel} with Google</span>
      <span aria-hidden="true"></span>
    </button>
    <button class="auth-provider-button phone-toggle-button" type="button" data-phone-toggle aria-expanded="false" aria-controls="${phoneId}">
      <span class="provider-mark phone-mark" aria-hidden="true">Phone</span>
      <span>${actionLabel} with phone number</span>
      <span aria-hidden="true"></span>
    </button>
    <div class="phone-auth-panel" id="${phoneId}" hidden>
      <form class="phone-auth-form" data-step="number">
        <div class="phone-step" data-phone-step="number">
          <label for="${phoneId}-number">Mobile number</label>
          <input id="${phoneId}-number" type="tel" inputmode="tel" autocomplete="tel" minlength="8" maxlength="18" placeholder="+91 98765 43210" required>
          <button class="primary-button" type="submit">Send verification code</button>
        </div>
        <div class="phone-step" data-phone-step="code" hidden>
          <label for="${codeId}">Six-digit verification code</label>
          <input class="phone-code-input" id="${codeId}" type="text" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" placeholder="000000" disabled required>
          <span class="phone-help">Use any six-digit code in this prototype.</span>
          <div class="phone-code-actions">
            <button class="secondary-button" type="button" data-change-phone>Change number</button>
            <button class="primary-button" type="submit">Verify and continue</button>
          </div>
        </div>
      </form>
    </div>
    <p class="auth-provider-status" role="status" aria-live="polite" hidden></p>
    <div class="auth-divider"><span>or use email</span></div>`;

  emailForm.before(methods);

  const authDescription = emailForm.parentElement.querySelector('.auth-panel-header p');
  if (authDescription) {
    authDescription.textContent = mode === 'signup'
      ? 'Choose a quick access method or continue with your professional details.'
      : 'Choose Google, phone number, or the email attached to your profile.';
  }

  const status = methods.querySelector('.auth-provider-status');
  const googleButton = methods.querySelector('[data-google-auth]');
  const phoneToggle = methods.querySelector('[data-phone-toggle]');
  const phonePanel = methods.querySelector('.phone-auth-panel');
  const phoneForm = methods.querySelector('.phone-auth-form');
  const numberStep = methods.querySelector('[data-phone-step="number"]');
  const codeStep = methods.querySelector('[data-phone-step="code"]');
  const phoneInput = methods.querySelector('input[type="tel"]');
  const codeInput = methods.querySelector('.phone-code-input');

  googleButton.addEventListener('click', () => {
    googleButton.disabled = true;
    status.hidden = false;
    status.textContent = `Google ${mode === 'signup' ? 'account connected' : 'login successful'} for this demo. Opening your ${roleLabel.toLowerCase()} workspace.`;
    window.setTimeout(() => window.location.href = authDashboard(role), 900);
  });

  phoneToggle.addEventListener('click', () => {
    const open = phoneToggle.getAttribute('aria-expanded') === 'true';
    phoneToggle.setAttribute('aria-expanded', String(!open));
    phonePanel.hidden = open;
    if (!open) window.setTimeout(() => phoneInput.focus(), 0);
  });

  phoneForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (phoneForm.dataset.step === 'number') {
      if (!phoneInput.reportValidity()) return;
      phoneForm.dataset.step = 'code';
      phoneInput.disabled = true;
      numberStep.hidden = true;
      codeStep.hidden = false;
      codeInput.disabled = false;
      status.hidden = false;
      status.textContent = 'Verification code prepared for this demo.';
      codeInput.focus();
      return;
    }

    if (!codeInput.reportValidity()) return;
    codeInput.disabled = true;
    status.hidden = false;
    status.textContent = `Phone verification successful. Opening your ${roleLabel.toLowerCase()} workspace.`;
    window.setTimeout(() => window.location.href = authDashboard(role), 900);
  });

  methods.querySelector('[data-change-phone]').addEventListener('click', () => {
    phoneForm.dataset.step = 'number';
    codeInput.value = '';
    codeInput.disabled = true;
    phoneInput.disabled = false;
    codeStep.hidden = true;
    numberStep.hidden = false;
    status.hidden = true;
    phoneInput.focus();
  });

  const demoNote = emailForm.parentElement.querySelector('.demo-note');
  if (demoNote) demoNote.textContent = 'Prototype notice: email, Google, and phone demonstrate the access flow. No entered data is stored or sent, and production identity verification and SMS delivery are not connected yet.';
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
      window.location.href = authDashboard(role);
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
