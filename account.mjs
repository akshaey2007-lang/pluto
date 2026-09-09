import { SKILLS } from './account-options.mjs';

const role = document.body.dataset.workspace;
const main = document.querySelector('#account-main');
const sidebar = document.querySelector('.workspace-sidebar');
const menu = document.querySelector('.mobile-sidebar-toggle');
let profile;
const labels = { overview: 'Overview', profile: 'My profile', settings: 'Account settings', opportunities: 'Opportunities', proposals: 'Proposals', projects: 'Projects', messages: 'Messages', earnings: 'Earnings', matches: 'Talent matches', work: 'Active work', payments: 'Payments' };
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
async function api(path, method = 'GET', data) {
  const response = await fetch(path, { method, cache: 'no-store', headers: data ? { 'Content-Type': 'application/json' } : {}, body: data ? JSON.stringify(data) : undefined });
  if (response.status === 401) { location.replace(`${role}-login.html`); throw new Error('Please sign in again.'); }
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('Account service unavailable. Please use the hosted Pluto website.');
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Unable to save. Please try again.');
  return result;
}
function closeMenu() { sidebar.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); document.querySelector('.account-scrim')?.remove(); }
menu.addEventListener('click', () => {
  if (sidebar.classList.contains('open')) return closeMenu();
  sidebar.classList.add('open'); menu.setAttribute('aria-expanded', 'true');
  const scrim = document.createElement('button'); scrim.className = 'account-scrim'; scrim.setAttribute('aria-label', 'Close menu'); scrim.onclick = closeMenu; document.body.append(scrim);
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.addEventListener('resize', () => { if (innerWidth > 860) closeMenu(); });
document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => showView(button.dataset.view)));
document.querySelector('[data-signout]').addEventListener('click', async event => {
  event.currentTarget.disabled = true;
  try { await api('/api/auth/logout', 'POST', {}); location.replace(`${role}-login.html`); }
  catch (error) { notify(error.message); event.currentTarget.disabled = false; }
});
let toastTimer;
function notify(message) { const toast = document.querySelector('.workspace-toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 4500); }
async function refresh() {
  const result = await api('/api/me'); profile = result.profile;
  if (profile.role !== role) { location.replace(`${profile.role}-dashboard.html`); return false; }
  document.querySelector('#account-name').textContent = profile.name;
  document.querySelector('#account-avatar').textContent = profile.name.split(/\s+/).slice(0, 2).map(s => s[0]).join('').toUpperCase();
  document.querySelector('#account-role').textContent = role === 'talent' ? 'Talent account' : 'Client account';
  document.querySelector('#account-state').textContent = profile.complete ? 'Profile saved' : 'Setup needed';
  return true;
}
function heading(title, subtitle) { return `<div class="view-heading"><div><h1>${escape(title)}</h1><p>${escape(subtitle)}</p></div></div>`; }
function showView(requested) {
  if (!profile) return;
  const view = !profile.complete ? 'profile' : labels[requested] ? requested : 'overview';
  closeMenu(); history.replaceState(null, '', `#${view}`);
  document.querySelectorAll('[data-view]').forEach(b => { b.classList.toggle('active', b.dataset.view === view); if (b.dataset.view === view) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
  if (view === 'profile' || view === 'settings') return renderProfile();
  if (view === 'overview') {
    main.innerHTML = heading(`Welcome, ${profile.name.split(' ')[0]}`, 'Your Pluto account is ready. Keep your profile current for future opportunities.') + `
      <div class="metric-grid"><article class="metric-card"><div class="metric-label">Active projects</div><strong>0</strong><small>No projects yet</small></article><article class="metric-card"><div class="metric-label">Proposals</div><strong>0</strong><small>No proposals yet</small></article><article class="metric-card"><div class="metric-label">Skills</div><strong>${profile.skills.length}</strong><small>Saved to your profile</small></article><article class="metric-card"><div class="metric-label">Profile</div><strong class="phone-metric">${profile.complete ? 'Complete' : 'Incomplete'}</strong><small>${profile.complete ? 'Your details are saved' : 'Add your professional details'}</small></article></div>
      <section class="panel account-summary"><h2>${escape(profile.name)}</h2><p>${escape(profile.email)}</p><p>${escape(profile.education)}</p><div class="account-tags">${profile.skills.map(s => `<span>${escape(s)}</span>`).join('')}</div><button class="workspace-primary" id="edit-profile" type="button">Edit profile</button></section>
      <section class="panel account-empty"><h2>A fresh start</h2><p>You have no projects, messages, or earnings yet. Your account starts with your own details.</p></section>`;
    main.querySelector('#edit-profile').onclick = () => showView('profile'); return;
  }
  main.innerHTML = heading(labels[view], `Your ${labels[view].toLowerCase()} will appear here.`) + `<section class="panel account-empty"><h2>No ${escape(labels[view].toLowerCase())} yet</h2><p>${['opportunities', 'matches'].includes(view) ? 'Marketplace matching is not connected yet. Keep your profile and skills up to date.' : 'There is no activity associated with your account yet.'}</p><button class="secondary-action" type="button" id="empty-profile">View my profile</button></section>`;
  main.querySelector('#empty-profile').onclick = () => showView('profile');
}
function renderProfile() {
  const selected = new Set(profile.skills);
  main.innerHTML = heading(profile.complete ? 'Your profile' : 'Complete your profile', profile.complete ? 'Keep your details current for future opportunities.' : 'Your Google account is connected. Tell us a little more about you.') + `
  <div class="account-columns"><section class="panel account-form-panel"><form id="profile-form">
    <div class="account-field-grid">
      <label>Full name<input name="name" value="${escape(profile.name)}" readonly autocomplete="name"><small>From your Google account</small></label>
      <label>Email<input name="email" type="email" value="${escape(profile.email)}" readonly autocomplete="email"></label>
      <label>Date of birth<input name="dob" type="date" value="${escape(profile.dob)}" min="1900-01-01" max="${new Date().toISOString().slice(0, 10)}" required autocomplete="bday"></label>
      <label>Phone number<input name="phone" type="tel" value="${escape(profile.phone)}" placeholder="+91 98765 43210" required autocomplete="tel" maxlength="22"><small>Include your country code. This is saved as a private contact detail.</small></label>
      <label class="account-wide">Education<textarea name="education" rows="3" required minlength="2" maxlength="300" placeholder="Degree or qualification, institution, and graduation year">${escape(profile.education)}</textarea></label>
    </div>
    <fieldset class="account-skills"><legend>Skills <span>(choose 1–15)</span></legend><label for="skill-search">Find a skill</label><input id="skill-search" type="search" placeholder="Search design, Python, marketing…"><div id="skill-options"></div><div id="selected-skills" class="account-tags" aria-label="Selected skills"></div><p id="skill-count" aria-live="polite"></p></fieldset>
    <p class="account-private-note">Date of birth and phone number are private account details.</p>
    <p id="save-status" class="account-status" role="status" aria-live="polite"></p><button class="workspace-primary" type="submit">${profile.complete ? 'Save changes' : 'Save profile & continue'}</button>
  </form></section></div>`;
  const form = main.querySelector('#profile-form'); const skillBox = main.querySelector('#skill-options'); const chips = main.querySelector('#selected-skills'); const filter = main.querySelector('#skill-search');
  function renderSkills() {
    skillBox.innerHTML = SKILLS.filter(s => s.toLowerCase().includes(filter.value.toLowerCase())).map(s => `<label class="skill-option"><input type="checkbox" value="${escape(s)}" ${selected.has(s) ? 'checked' : ''} ${selected.size >= 15 && !selected.has(s) ? 'disabled' : ''}><span>${escape(s)}</span></label>`).join('') || '<p>No matching skill. Try a different search.</p>';
    chips.innerHTML = [...selected].map(s => `<button type="button" data-remove-skill="${escape(s)}" aria-label="Remove ${escape(s)}">${escape(s)} ×</button>`).join('');
    main.querySelector('#skill-count').textContent = `${selected.size} of 15 skills selected`;
    skillBox.querySelectorAll('input').forEach(input => input.onchange = () => { input.checked ? selected.add(input.value) : selected.delete(input.value); renderSkills(); });
    chips.querySelectorAll('button').forEach(b => b.onclick = () => { selected.delete(b.dataset.removeSkill); renderSkills(); });
  }
  filter.oninput = renderSkills; renderSkills();
  form.onsubmit = async event => {
    event.preventDefault(); const status = main.querySelector('#save-status');
    if (!selected.size) { status.textContent = 'Choose at least one skill.'; filter.focus(); return; }
    const values = new FormData(form); const button = form.querySelector('[type="submit"]'); button.disabled = true; status.textContent = 'Saving your profile…';
    try {
      await api('/api/profile', 'PUT', { dob: values.get('dob'), education: values.get('education'), phone: values.get('phone').replace(/[\s()-]/g, ''), skills: [...selected] });
      await refresh(); showView('profile'); notify('Your profile has been saved.');
    } catch (error) { status.textContent = error.message; button.disabled = false; }
  };
}
try { if (await refresh()) showView(location.hash.slice(1) || 'overview'); }
catch (error) { main.innerHTML = heading('Unable to load your account', error.message) + '<button class="workspace-primary" id="reload-account">Try again</button>'; main.querySelector('#reload-account').onclick = () => location.reload(); }
window.addEventListener('pageshow', event => { if (event.persisted) location.reload(); });
