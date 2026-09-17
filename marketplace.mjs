import { SKILLS } from './account-options.mjs';

const role = document.body.dataset.workspace;
const main = document.querySelector('#account-main');
const sidebar = document.querySelector('.workspace-sidebar');
const menu = document.querySelector('.mobile-sidebar-toggle');
const state = { profile: null, admin: false, detail: null, search: '', skill: '' };
const labels = { overview: 'Overview', projects: 'Projects', opportunities: 'Opportunities', matches: 'Talent matches', proposals: 'Proposals', work: 'Active work', messages: 'Messages', payments: 'Payments', earnings: 'Earnings', profile: 'My profile', settings: 'Settings', notifications: 'Notifications', admin: 'Administration' };
const esc = value => String(value ?? '').replace(/[&<>"']/g, x => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[x]);
const money = paise => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(Number(paise || 0) / 100);
const date = value => value ? new Date(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value) ? `${value.slice(0, 10)}T00:00:00` : Number(value)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not set';
const status = value => `<span class="mp-status mp-${esc(value)}">${esc(String(value).replaceAll('_', ' '))}</span>`;
const tags = values => (values || []).map(x => `<span class="mp-tag">${esc(x)}</span>`).join('');
const initial = name => (name || 'P').split(/\s+/).slice(0, 2).map(x => x[0]).join('').toUpperCase();

async function api(path, method = 'GET', data) {
  const response = await fetch(path, { method, cache: 'no-store', headers: data ? { 'Content-Type': 'application/json' } : {}, body: data ? JSON.stringify(data) : undefined });
  if (response.status === 401) { location.replace(`${role}-login.html`); throw new Error('Please sign in again.'); }
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Unable to complete that action. Please try again.');
  return result;
}
let toastTimer;
function notify(message) { const toast = document.querySelector('.workspace-toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 4500); }
function closeMenu() { sidebar.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); document.querySelector('.account-scrim')?.remove(); }
menu.addEventListener('click', () => {
  if (sidebar.classList.contains('open')) return closeMenu();
  sidebar.classList.add('open'); menu.setAttribute('aria-expanded', 'true');
  const scrim = document.createElement('button'); scrim.className = 'account-scrim'; scrim.setAttribute('aria-label', 'Close menu'); scrim.onclick = closeMenu; document.body.append(scrim);
});
window.addEventListener('resize', () => { if (innerWidth > 860) closeMenu(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
document.querySelector('[data-signout]').addEventListener('click', async e => {
  e.currentTarget.disabled = true;
  try { await api('/api/auth/logout', 'POST', {}); location.replace(`${role}-login.html`); }
  catch (error) { notify(error.message); e.currentTarget.disabled = false; }
});
document.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => navigate(b.dataset.view)));

async function refresh() {
  const result = await api('/api/me'); state.profile = result.profile; state.admin = result.admin;
  if (state.profile.role !== role) { location.replace(`${state.profile.role}-dashboard.html`); return false; }
  document.querySelector('#account-name').textContent = state.profile.name;
  document.querySelector('#account-avatar').textContent = initial(state.profile.name);
  document.querySelector('#account-role').textContent = role === 'client' ? 'Client account' : 'Talent account';
  document.querySelector('#account-state').textContent = state.profile.complete ? 'Profile ready' : 'Setup needed';
  if (state.admin && !document.querySelector('[data-view="admin"]')) {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'workspace-nav-button'; button.dataset.view = 'admin'; button.innerHTML = '<span>Administration</span>';
    button.addEventListener('click', () => navigate('admin'));
    document.querySelector('.workspace-menu').append(button);
  }
  return true;
}
function heading(title, subtitle = '', actions = '') { return `<div class="view-heading mp-heading"><div><h1>${esc(title)}</h1>${subtitle ? `<p>${esc(subtitle)}</p>` : ''}</div>${actions ? `<div class="mp-heading-actions">${actions}</div>` : ''}</div>`; }
function empty(title, body, button = '') { return `<section class="panel mp-empty"><span class="mp-empty-mark" aria-hidden="true">✦</span><h2>${esc(title)}</h2><p>${esc(body)}</p>${button}</section>`; }
function button(label, action, id = '', cls = 'secondary-action') { return `<button class="${cls}" type="button" data-action="${esc(action)}" ${id ? `data-id="${esc(id)}"` : ''}>${esc(label)}</button>`; }
function projectCard(p, details = true) {
  return `<article class="panel mp-card"><div class="mp-card-top"><span class="mp-overline">${esc(p.category)}</span>${status(p.status)}</div>
    <h2>${esc(p.title)}</h2><p>${esc(p.description.length > 220 ? p.description.slice(0, 220) + '…' : p.description)}</p>
    <div class="mp-tags">${tags(p.skills)}</div><div class="mp-card-meta"><span><b>${money(p.budget_paise)}</b> budget</span><span>Due ${date(p.deadline)}</span><span>${p.proposal_count || 0} proposals</span></div>
    ${details ? `<div class="mp-card-actions">${button('View project', 'view-project', p.id)}</div>` : ''}</article>`;
}
function proposalCard(p, client = false) {
  return `<article class="panel mp-card"><div class="mp-card-top"><span class="mp-overline">${esc(client ? p.talent_name : p.project_title)}</span>${status(p.status)}</div>
    <h2>${money(p.quote_paise)}</h2><p>${esc(p.cover_letter)}</p><div class="mp-card-meta"><span>Delivery in ${p.delivery_days} days</span><span>Client total ${money(p.client_total_paise)}</span></div>
    <div class="mp-card-actions">${client && ['submitted', 'shortlisted'].includes(p.status) ? `${button('Accept proposal', 'accept-proposal', p.id, 'workspace-primary')}${p.status === 'submitted' ? button('Shortlist', 'shortlist', p.id) : ''}${button('Reject', 'reject', p.id)}` : ''}
    ${!client && ['submitted', 'shortlisted'].includes(p.status) ? button('Withdraw', 'withdraw', p.id) : ''}</div></article>`;
}
async function navigate(view, detail = null) {
  closeMenu(); state.detail = detail; const target = !state.profile.complete ? 'profile' : labels[view] ? view : 'overview';
  history.replaceState(null, '', `#${target}`);
  document.querySelectorAll('[data-view]').forEach(b => { b.classList.toggle('active', b.dataset.view === target); b.dataset.view === target ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current'); });
  main.innerHTML = `<div class="mp-loading" role="status">Loading ${esc(labels[target].toLowerCase())}…</div>`;
  try {
    if (target === 'profile') return renderProfile();
    if (target === 'settings') return renderSettings();
    if (target === 'overview') return renderOverview();
    if (target === 'projects') return role === 'client' ? renderClientProjects() : renderContracts('Projects');
    if (target === 'opportunities') return renderOpportunities();
    if (target === 'matches') return renderMatches();
    if (target === 'proposals') return renderProposals();
    if (['work', 'messages', 'payments', 'earnings'].includes(target)) return renderContracts(labels[target]);
    if (target === 'notifications') return renderNotifications();
    if (target === 'admin') return renderAdmin();
  } catch (error) { main.innerHTML = heading('Something went wrong', error.message) + empty('Try again', 'Your changes are safe. Reload this view to continue.', button('Reload view', 'reload')); }
}
async function renderOverview() {
  const [summary, projects, notifications] = await Promise.all([api('/api/summary'), api(`/api/projects?scope=${role === 'client' ? 'mine' : 'open'}`), api('/api/notifications')]);
  const s = summary.summary;
  main.innerHTML = `<section class="mp-welcome"><div><span class="mp-welcome-kicker">${role === 'client' ? 'Client workspace' : 'Talent workspace'}</span><h1>Good to see you, ${esc(state.profile.name.split(' ')[0])}.</h1><p>${role === 'client' ? 'Create a clear brief, review proposals, and keep every project moving.' : 'Find relevant opportunities, send a strong proposal, and track your work.'}</p>
    ${button(role === 'client' ? 'Create a project' : 'Explore opportunities', role === 'client' ? 'new-project' : 'go-opportunities', '', 'workspace-primary')}</div><span class="mp-welcome-index" aria-hidden="true">P/</span></section>
    <div class="metric-grid mp-metrics"><article class="metric-card"><div class="metric-label">${role === 'client' ? 'My projects' : 'Open opportunities'}</div><strong>${role === 'client' ? s.owned_projects : projects.projects.length}</strong><small>Live records</small></article>
    <article class="metric-card"><div class="metric-label">${role === 'client' ? 'Proposals received' : 'Proposals sent'}</div><strong>${role === 'client' ? s.received_proposals : s.sent_proposals}</strong><small>Across your projects</small></article>
    <article class="metric-card"><div class="metric-label">Workrooms</div><strong>${s.contracts}</strong><small>Accepted proposals</small></article>
    <article class="metric-card"><div class="metric-label">Unread updates</div><strong>${s.unread}</strong><small>Your notifications</small></article></div>
    <div class="mp-section-head"><h2>${role === 'client' ? 'Your recent projects' : 'Fresh opportunities'}</h2>${button('View all', role === 'client' ? 'go-projects' : 'go-opportunities')}</div>
    ${projects.projects.length ? `<div class="mp-card-grid">${projects.projects.slice(0, 3).map(projectCard).join('')}</div>` : empty(role === 'client' ? 'No projects yet' : 'No open projects yet', role === 'client' ? 'Create the first project brief to start receiving proposals.' : 'Check back soon. Client projects will appear here as soon as they are published.', role === 'client' ? button('Create project', 'new-project', '', 'workspace-primary') : '')}
    <div class="mp-section-head"><h2>Recent updates</h2>${button('All updates', 'go-notifications')}</div>
    ${notifications.notifications.length ? `<div class="panel mp-update-list">${notifications.notifications.slice(0, 3).map(n => `<div><b>${esc(n.title)}</b><span>${esc(n.body)}</span></div>`).join('')}</div>` : empty('Nothing to catch up on', 'Project activity and messages will appear here.')}`;
}

const projectFields = (p = {}) => `<div class="mp-form-grid"><label>Project title<input name="title" required minlength="6" maxlength="120" value="${esc(p.title || '')}" placeholder="e.g. Redesign our customer portal"></label>
  <label>Category<select name="category" required>${['Design', 'Development', 'Writing', 'Marketing', 'Data', 'Video', 'Business'].map(x => `<option ${p.category === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
  <label class="mp-wide">Project brief<textarea name="description" required minlength="40" maxlength="4000" rows="6" placeholder="What problem are you solving? Who is the audience? What does success look like?">${esc(p.description || '')}</textarea></label>
  <label class="mp-wide">Deliverables<textarea name="deliverables" required minlength="10" maxlength="2000" rows="3" placeholder="List the concrete files, pages, or outcomes you expect.">${esc(p.deliverables || '')}</textarea></label>
  <label>Budget in INR<input name="budget" type="number" min="100" max="1000000" step="1" required value="${p.budget_paise ? Number(p.budget_paise) / 100 : ''}" placeholder="25000"></label>
  <label>Deadline<input name="deadline" type="date" required min="${new Date(Date.now() + 86400000).toISOString().slice(0, 10)}" value="${esc(p.deadline || '')}"></label></div>
  <fieldset class="mp-skills"><legend>Required skills <span>Choose up to 10</span></legend><div class="mp-skill-grid">${SKILLS.map(x => `<label><input type="checkbox" name="skills" value="${esc(x)}" ${(p.skills || []).includes(x) ? 'checked' : ''}><span>${esc(x)}</span></label>`).join('')}</div></fieldset>`;
function formValues(form) { const data = new FormData(form); return { title: data.get('title'), category: data.get('category'), description: data.get('description'), deliverables: data.get('deliverables'), budget_paise: Math.round(Number(data.get('budget')) * 100), deadline: data.get('deadline'), skills: data.getAll('skills') }; }
async function renderClientProjects() {
  if (state.detail?.type === 'form') {
    const project = state.detail.id ? (await api(`/api/projects/${state.detail.id}`)).project : {};
    main.innerHTML = heading(project.id ? 'Edit project' : 'Create a project', 'A clear scope makes it easier for the right specialist to respond.', button('Back to projects', 'back-projects')) +
      `<form class="panel mp-form-panel" id="project-form" data-id="${esc(project.id || '')}">${projectFields(project)}<div class="mp-form-actions"><button class="secondary-action" type="submit" name="status" value="draft">Save draft</button><button class="workspace-primary" type="submit" name="status" value="open">${project.id ? 'Save & publish' : 'Publish project'}</button></div><p class="mp-form-note">Publishing makes your brief visible to talent. You can pause it later.</p><p class="account-status" role="status"></p></form>`;
    return;
  }
  if (state.detail?.type === 'project') return renderProjectDetail(state.detail.id);
  const { projects } = await api('/api/projects?scope=mine');
  main.innerHTML = heading('Your projects', 'From first brief to finished delivery, all in one place.', button('Create project', 'new-project', '', 'workspace-primary')) +
    (projects.length ? `<div class="mp-card-grid">${projects.map(projectCard).join('')}</div>` : empty('Your first project starts here', 'Describe the outcome, budget, deadline, and skills you need.', button('Create project', 'new-project', '', 'workspace-primary')));
}
async function renderProjectDetail(id) {
  const { project: p } = await api(`/api/projects/${id}`);
  const own = p.client_profile_id === state.profile.id;
  const proposals = own ? (await api(`/api/projects/${id}/proposals`)).proposals : [];
  main.innerHTML = heading(p.title, `Due ${date(p.deadline)} · ${p.category}`, button('Back to projects', 'back-projects')) + `<div class="mp-detail-grid"><section class="panel mp-detail"><div class="mp-detail-top">${status(p.status)}<strong>${money(p.budget_paise)}</strong></div>
    <h2>Project brief</h2><p>${esc(p.description)}</p><h2>Deliverables</h2><p>${esc(p.deliverables)}</p><h2>Skills</h2><div class="mp-tags">${tags(p.skills)}</div>
    ${own && !['hired', 'completed'].includes(p.status) ? `<div class="mp-card-actions">${button('Edit project', 'edit-project', p.id)}${button(p.status === 'open' ? 'Pause' : 'Publish', p.status === 'open' ? 'pause-project' : 'publish-project', p.id)}</div>` : ''}</section>
    <aside class="panel mp-side-note"><h2>Clear terms</h2><p>Talent submits a quote for the work. Pluto adds a 10% service fee to the client's total; talent receives the full quote.</p><p>Payment and work start remain locked until live funding is connected.</p></aside></div>
    ${own ? `<div class="mp-section-head"><h2>Proposals (${proposals.length})</h2></div>${proposals.length ? `<div class="mp-card-grid">${proposals.map(x => proposalCard(x, true)).join('')}</div>` : empty('No proposals yet', p.status === 'open' ? 'Specialists can now discover and respond to this brief.' : 'Publish this project to begin receiving proposals.')}` : ''}`;
}

async function renderOpportunities() {
  if (state.detail?.type === 'report') {
    const { project: p } = await api(`/api/projects/${state.detail.id}`);
    main.innerHTML = heading('Report a concern', `About ${p.title}`, button('Back to project', 'view-project', p.id)) +
      `<form class="panel mp-form-panel" id="report-form" data-project="${esc(p.id)}"><div class="mp-form-grid"><label>Reason<input name="reason" required minlength="3" maxlength="80" placeholder="e.g. Misleading project brief"></label><label class="mp-wide">What happened?<textarea name="details" required minlength="10" maxlength="1500" rows="7" placeholder="Describe the concern so Pluto can review it."></textarea></label></div><p class="mp-form-note">Your report goes to the Pluto administrator for review. It is not shared in the project workroom.</p><button class="workspace-primary" type="submit">Submit report</button><p class="account-status" role="status"></p></form>`;
    return;
  }
  if (state.detail?.type === 'project') {
    const { project: p } = await api(`/api/projects/${state.detail.id}`);
    main.innerHTML = heading(p.title, `${p.client_name} · ${p.category} · Due ${date(p.deadline)}`, button('Back to opportunities', 'back-opportunities')) +
      `<div class="mp-detail-grid"><section class="panel mp-detail"><div class="mp-detail-top">${status(p.status)}<strong>${money(p.budget_paise)} budget</strong></div><h2>Project brief</h2><p>${esc(p.description)}</p><h2>Deliverables</h2><p>${esc(p.deliverables)}</p><h2>Required skills</h2><div class="mp-tags">${tags(p.skills)}</div></section>
      <aside class="panel mp-side-note"><h2>Send a proposal</h2><p>Tell the client how you will deliver the outcome. Your quote is paid in full; Pluto's 10% fee is added to the client's total.</p>
      <form id="proposal-form" data-project="${esc(p.id)}"><label>Your approach<textarea name="cover_letter" required minlength="40" maxlength="2500" rows="6" placeholder="Explain the plan, relevant experience, and what you will deliver."></textarea></label>
      <label>Your quote in INR<input name="quote" type="number" min="100" max="1000000" required></label><label>Delivery time in days<input name="delivery_days" type="number" min="1" max="365" required></label>
      <button class="workspace-primary" type="submit">Send proposal</button><p class="account-status" role="status"></p></form>${button('Report this project', 'report-project', p.id)}</aside></div>`;
    return;
  }
  const params = new URLSearchParams({ scope: 'open' }); if (state.search) params.set('search', state.search); if (state.skill) params.set('skill', state.skill);
  const { projects } = await api(`/api/projects?${params}`);
  main.innerHTML = heading('Opportunities', 'Explore real briefs from clients and respond with a focused proposal.') +
    `<form id="opportunity-filter" class="panel mp-filter"><label>Search<input name="search" type="search" value="${esc(state.search)}" placeholder="Search briefs"></label><label>Skill<select name="skill"><option value="">All skills</option>${SKILLS.map(x => `<option value="${esc(x)}" ${state.skill === x ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select></label><button class="secondary-action" type="submit">Apply filters</button></form>` +
    (projects.length ? `<div class="mp-card-grid">${projects.map(projectCard).join('')}</div>` : empty('No matching opportunities', 'Try another skill or search term. New briefs appear here when clients publish them.'));
}
async function renderMatches() {
  const { talent } = await api('/api/talent');
  main.innerHTML = heading('Talent matches', 'Discover specialists who have completed a Pluto profile.') +
    (talent.length ? `<div class="mp-card-grid">${talent.map(p => `<article class="panel mp-card mp-person"><div class="mp-person-avatar">${esc(initial(p.name))}</div><h2>${esc(p.name)}</h2><p>${esc(p.education)}</p><div class="mp-tags">${tags(p.skills)}</div><div class="mp-card-meta"><span>${p.review_count ? `${p.rating.toFixed(1)} / 5 · ${p.review_count} reviews` : 'New to Pluto'}</span></div></article>`).join('')}</div>` : empty('Talent profiles will appear here', 'Specialists show up once they complete their profiles.'));
}
async function renderProposals() {
  if (role === 'talent') {
    const { proposals } = await api('/api/proposals');
    main.innerHTML = heading('Your proposals', 'Track what you sent and where each proposal stands.') + (proposals.length ? `<div class="mp-card-grid">${proposals.map(x => proposalCard(x)).join('')}</div>` : empty('Nothing submitted yet', 'Find a project that fits your skills and send your first proposal.', button('Browse opportunities', 'go-opportunities', '', 'workspace-primary')));
  } else {
    const { projects } = await api('/api/projects?scope=mine');
    main.innerHTML = heading('Incoming proposals', 'Review each response in the context of its project.') + (projects.length ? `<div class="mp-card-grid">${projects.map(projectCard).join('')}</div>` : empty('No projects yet', 'Publish a project first to invite proposals.', button('Create project', 'new-project', '', 'workspace-primary')));
  }
}
async function renderContracts(title = 'Active work') {
  if (state.detail?.type === 'contract') return renderWorkroom(state.detail.id);
  const { contracts } = await api('/api/contracts');
  const copy = title === 'Messages' ? 'Open a workroom to message the other participant.' : title === 'Payments' || title === 'Earnings' ? 'Funding is not active yet. These are contract amounts, not completed payments.' : 'Keep the agreement, progress, and conversation together.';
  main.innerHTML = heading(title, copy) + (contracts.length ? `<div class="mp-card-grid">${contracts.map(c => `<article class="panel mp-card"><div class="mp-card-top"><span class="mp-overline">${esc(role === 'client' ? c.talent_name : c.client_name)}</span>${status(c.status)}</div><h2>${esc(c.project_title)}</h2><div class="mp-card-meta"><span>Talent quote ${money(c.quote_paise)}</span><span>Client fee ${money(c.fee_paise)}</span><span>Client total ${money(c.total_paise)}</span></div><div class="mp-card-actions">${button('Open workroom', 'view-contract', c.id)}</div></article>`).join('')}</div>` : empty('No workrooms yet', 'A workroom is created when a client accepts a proposal. Funding must be connected before work begins.'));
}
async function renderWorkroom(id) {
  const { contract: c, milestones, messages, reviews } = await api(`/api/contracts/${id}`);
  main.innerHTML = heading(c.project_title, `${role === 'client' ? c.talent_name : c.client_name} · ${c.status.replaceAll('_', ' ')}`, button('Back to workrooms', 'back-work')) +
    `<div class="mp-work-grid"><div><section class="panel mp-work-panel"><h2>Agreement</h2><div class="mp-term-grid"><div><span>Talent quote</span><strong>${money(c.quote_paise)}</strong></div><div><span>Pluto fee · 10%</span><strong>${money(c.fee_paise)}</strong></div><div><span>Client total</span><strong>${money(c.total_paise)}</strong></div></div><p>${esc(c.deliverables)}</p></section>
    <section class="panel mp-work-panel"><h2>Milestones</h2>${milestones.map(m => `<div class="mp-milestone"><div><b>${esc(m.title)}</b><span>${status(m.status)}</span></div><strong>${money(m.amount_paise)}</strong></div>`).join('')}
    <p class="mp-form-note">Payment activation is pending. No milestone is marked funded and no payout is promised until Razorpay is connected and verified.</p></section>
    <section class="panel mp-work-panel"><h2>Reviews</h2>${reviews.length ? reviews.map(r => `<p>${'★'.repeat(r.rating)} · ${esc(r.body)}</p>`).join('') : '<p>Reviews become available after a completed, funded project.</p>'}</section></div>
    <section class="panel mp-chat"><h2>Conversation</h2><div class="mp-chat-history">${messages.length ? messages.map(m => `<div class="mp-chat-bubble ${m.sender_profile_id === state.profile.id ? 'mine' : ''}"><b>${esc(m.sender_name)}</b><p>${esc(m.body)}</p><small>${date(m.created_at)}</small></div>`).join('') : '<p class="mp-chat-empty">Start the conversation. Details agreed here remain with the project.</p>'}</div>
    <form id="message-form" data-contract="${esc(c.id)}"><label for="message-body">Message</label><textarea id="message-body" name="body" rows="3" maxlength="2000" required placeholder="Write a clear update…"></textarea><button class="workspace-primary" type="submit">Send message</button><p class="account-status" role="status"></p></form></section></div>`;
  main.querySelector('.mp-chat-history')?.scrollTo(0, 99999);
}
async function renderNotifications() {
  const { notifications } = await api('/api/notifications');
  main.innerHTML = heading('Notifications', 'Updates that matter to your projects and proposals.') + (notifications.length ? `<div class="panel mp-notifications">${notifications.map(n => `<article class="${n.read_at ? '' : 'unread'}"><div><b>${esc(n.title)}</b><p>${esc(n.body)}</p><small>${date(n.created_at)}</small></div>${!n.read_at ? button('Mark read', 'read-notification', n.id) : ''}</article>`).join('')}</div>` : empty('All caught up', 'New activity will appear here.'));
}
async function renderAdmin() {
  if (!state.admin) return navigate('overview');
  const [stats, reports] = await Promise.all([api('/api/admin/summary'), api('/api/admin/reports')]);
  main.innerHTML = heading('Administration', 'Marketplace health and reports.') + `<div class="metric-grid mp-metrics">${Object.entries(stats.summary).map(([key, value]) => `<article class="metric-card"><div class="metric-label">${esc(key.replaceAll('_', ' '))}</div><strong>${value}</strong></article>`).join('')}</div>` +
    `<div class="mp-section-head"><h2>Reports</h2></div>${reports.reports.length ? `<div class="panel mp-notifications">${reports.reports.map(r => `<article><div><b>${esc(r.reason)}</b><p>${esc(r.details)}</p><small>${esc(r.status)} · ${date(r.created_at)}</small></div><div class="mp-card-actions">${r.status === 'open' ? button('Reviewing', 'review-report', r.id) : ''}${r.status !== 'resolved' ? button('Resolve', 'resolve-report', r.id) : ''}</div></article>`).join('')}</div>` : empty('No reports', 'Safety reports will appear here.')}`;
}
function renderSettings() {
  const p = state.profile;
  main.innerHTML = heading('Account settings', 'Your sign-in and privacy at a glance.') +
    `<section class="panel mp-form-panel"><div class="mp-form-grid"><div><h2>Google sign-in</h2><p>You sign in as ${esc(p.email)}. Your name and email are supplied by Google.</p></div><div><h2>Account role</h2><p>${role === 'client' ? 'Client' : 'Talent'} workspace. Your other role, if you use one, has a separate profile.</p></div><div><h2>Private details</h2><p>Your date of birth and phone number are stored in your account profile and are not shown in talent search.</p></div><div><h2>Payment status</h2><p>No payment method or payout account is stored by Pluto yet.</p></div></div><div class="mp-form-actions">${button('Edit profile', 'go-profile', '', 'workspace-primary')}${button('Sign out', 'signout')}</div></section>`;
}
function renderProfile() {
  const p = state.profile;
  main.innerHTML = heading(p.complete ? 'Your profile' : 'Complete your profile', 'Your name and email come from Google. Keep the rest up to date.') +
    `<form class="panel mp-form-panel" id="profile-form"><div class="mp-form-grid"><label>Full name<input value="${esc(p.name)}" readonly><small>From Google</small></label><label>Email<input value="${esc(p.email)}" readonly></label>
    <label>Date of birth<input name="dob" type="date" required value="${esc(p.dob)}" max="${new Date().toISOString().slice(0, 10)}"></label><label>Phone number<input name="phone" type="tel" required value="${esc(p.phone)}" placeholder="+919876543210"><small>Private contact detail; no SMS verification.</small></label>
    <label class="mp-wide">Education<textarea name="education" rows="3" required minlength="2" maxlength="300">${esc(p.education)}</textarea></label></div>
    <fieldset class="mp-skills"><legend>Skills <span>Choose 1–15</span></legend><div class="mp-skill-grid">${SKILLS.map(x => `<label><input type="checkbox" name="skills" value="${esc(x)}" ${(p.skills || []).includes(x) ? 'checked' : ''}><span>${esc(x)}</span></label>`).join('')}</div></fieldset>
    <p class="mp-form-note">Your date of birth and phone number stay private. Only your name, skills, and education appear in client matching.</p>
    <button class="workspace-primary" type="submit">Save profile</button><p class="account-status" role="status"></p></form>`;
}

main.addEventListener('click', async event => {
  const target = event.target.closest('[data-action]'); if (!target) return;
  const action = target.dataset.action; const id = target.dataset.id;
  try {
    if (action === 'reload') return navigate(location.hash.slice(1) || 'overview');
    if (action.startsWith('go-')) return navigate(action.slice(3));
    if (action === 'new-project') return navigate('projects', { type: 'form' });
    if (action === 'edit-project') return navigate('projects', { type: 'form', id });
    if (action === 'back-projects') return navigate('projects');
    if (action === 'back-opportunities') return navigate('opportunities');
    if (action === 'back-work') return navigate('work');
    if (action === 'view-project') return navigate(role === 'client' ? 'projects' : 'opportunities', { type: 'project', id });
    if (action === 'view-contract') return navigate('work', { type: 'contract', id });
    if (action === 'report-project') return navigate('opportunities', { type: 'report', id });
    if (action === 'signout') return document.querySelector('[data-signout]').click();
    if (['review-report', 'resolve-report'].includes(action)) { await api(`/api/admin/reports/${id}`, 'PATCH', { status: action === 'review-report' ? 'reviewing' : 'resolved' }); notify('Report status updated.'); return navigate('admin'); }
    if (['pause-project', 'publish-project'].includes(action)) {
      const { project } = await api(`/api/projects/${id}`);
      await api(`/api/projects/${id}`, 'PUT', { ...project, status: action === 'pause-project' ? 'paused' : 'open' });
      notify(action === 'pause-project' ? 'Project paused.' : 'Project published.'); return navigate('projects', { type: 'project', id });
    }
    if (['shortlist', 'reject', 'withdraw'].includes(action)) { await api(`/api/proposals/${id}`, 'PATCH', { action }); notify('Proposal updated.'); return navigate(role === 'client' ? 'projects' : 'proposals'); }
    if (action === 'accept-proposal') {
      if (!confirm('Accept this proposal? A workroom will open, but work cannot begin until payment funding is connected.')) return;
      const result = await api(`/api/proposals/${id}/accept`, 'POST', {}); notify('Proposal accepted. Workroom created.'); return navigate('work', { type: 'contract', id: result.contractId });
    }
    if (action === 'read-notification') { await api(`/api/notifications/${id}/read`, 'POST', {}); return navigate('notifications'); }
  } catch (error) { notify(error.message); }
});

main.addEventListener('submit', async event => {
  const form = event.target; event.preventDefault();
  const statusLine = form.querySelector('.account-status'); const submit = event.submitter || form.querySelector('[type="submit"]');
  submit.disabled = true; if (statusLine) statusLine.textContent = 'Saving…';
  try {
    if (form.id === 'profile-form') {
      const data = new FormData(form); await api('/api/profile', 'PUT', { dob: data.get('dob'), education: data.get('education'), phone: String(data.get('phone')).replace(/[\s()-]/g, ''), skills: data.getAll('skills') });
      await refresh(); notify('Profile saved.'); return navigate('profile');
    }
    if (form.id === 'project-form') {
      const data = formValues(form); data.status = submit.value;
      const id = form.dataset.id; const result = await api(id ? `/api/projects/${id}` : '/api/projects', id ? 'PUT' : 'POST', data);
      notify(data.status === 'draft' ? 'Draft saved.' : 'Project published.'); return navigate('projects', { type: 'project', id: id || result.id });
    }
    if (form.id === 'proposal-form') {
      const data = new FormData(form); await api(`/api/projects/${form.dataset.project}/proposals`, 'POST', { cover_letter: data.get('cover_letter'), quote_paise: Math.round(Number(data.get('quote')) * 100), delivery_days: Number(data.get('delivery_days')) });
      notify('Proposal sent to the client.'); return navigate('proposals');
    }
    if (form.id === 'opportunity-filter') { const data = new FormData(form); state.search = data.get('search'); state.skill = data.get('skill'); return navigate('opportunities'); }
    if (form.id === 'message-form') { const data = new FormData(form); await api(`/api/contracts/${form.dataset.contract}/messages`, 'POST', { body: data.get('body') }); return navigate('work', { type: 'contract', id: form.dataset.contract }); }
    if (form.id === 'report-form') { const data = new FormData(form); await api('/api/reports', 'POST', { projectId: form.dataset.project, reason: data.get('reason'), details: data.get('details') }); notify('Report sent for review.'); return navigate('opportunities'); }
  } catch (error) { if (statusLine) statusLine.textContent = error.message; else notify(error.message); submit.disabled = false; }
});

try { if (await refresh()) navigate(location.hash.slice(1) || 'overview'); }
catch (error) { main.innerHTML = heading('Unable to load your account', error.message) + empty('Try again', 'Reload the page to reconnect.', button('Reload', 'reload', '', 'workspace-primary')); }
window.addEventListener('pageshow', event => { if (event.persisted) location.reload(); });
