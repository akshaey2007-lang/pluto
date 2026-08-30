const role = document.body.dataset.workspace;
const viewLabels = role === 'client'
  ? {
      overview: ['Client overview', 'Projects, matches, funding, and delivery at a glance.'],
      projects: ['Projects', 'Create, scope, and monitor every commissioned project.'],
      matches: ['Talent matches', 'Compare relevant verified specialists and build shortlists.'],
      proposals: ['Proposals', 'Review terms, approach, timing, and pricing from shortlisted talent.'],
      work: ['Active work', 'Track funded milestones, submissions, revisions, and approvals.'],
      messages: ['Messages', 'Keep project decisions attached to the work.'],
      payments: ['Payments', 'See protected funds, releases, fees, and invoices.'],
      company: ['Company profile', 'Manage the identity and context shown to talent.'],
      settings: ['Settings', 'Control workspace preferences and notifications.'],
    }
  : {
      overview: ['Talent overview', 'Opportunities, proposals, active work, and earnings at a glance.'],
      opportunities: ['Opportunities', 'Qualified briefs selected for your verified expertise.'],
      proposals: ['Proposals', 'Track every proposal without credits or application fees.'],
      projects: ['Active projects', 'Deliver funded milestones and manage review status.'],
      messages: ['Messages', 'Keep client decisions and delivery conversations together.'],
      earnings: ['Earnings', 'Review approved milestones, pending releases, and history.'],
      profile: ['Profile & portfolio', 'Manage the evidence clients use to evaluate your work.'],
      settings: ['Settings', 'Control availability, notifications, security, and preferences.'],
    };

const sidebar = document.querySelector('.workspace-sidebar');
const viewTitle = document.querySelector('#view-title');
const viewSubtitle = document.querySelector('#view-subtitle');
const search = document.querySelector('#workspace-search');
const toast = document.querySelector('.workspace-toast');
const sidebarToggle = document.querySelector('.mobile-sidebar-toggle');
const sidebarScrim = document.createElement('button');
sidebarScrim.className = 'workspace-scrim';
sidebarScrim.type = 'button';
sidebarScrim.setAttribute('aria-label', 'Close workspace menu');
document.body.appendChild(sidebarScrim);
let toastTimer;

function setSidebarOpen(open) {
  sidebar.classList.toggle('open', open);
  sidebarScrim.classList.toggle('open', open);
  sidebarToggle?.setAttribute('aria-expanded', String(open));
  sidebarToggle?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.style.overflow = open ? 'hidden' : '';
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

function activateView(view) {
  const validView = viewLabels[view] ? view : 'overview';
  document.querySelectorAll('[data-view]').forEach((button) => button.classList.toggle('active', button.dataset.view === validView));
  document.querySelectorAll('[data-view-panel]').forEach((panel) => panel.classList.toggle('active', panel.dataset.viewPanel === validView));
  viewTitle.textContent = viewLabels[validView][0];
  viewSubtitle.textContent = viewLabels[validView][1];
  window.history.replaceState(null, '', `#${validView}`);
  setSidebarOpen(false);
  search.value = '';
  filterCurrentView('');
}

document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => activateView(button.dataset.view)));
document.querySelectorAll('[data-go-view]').forEach((button) => button.addEventListener('click', () => activateView(button.dataset.goView)));
sidebarToggle?.addEventListener('click', () => setSidebarOpen(!sidebar.classList.contains('open')));
sidebarScrim.addEventListener('click', () => setSidebarOpen(false));

window.addEventListener('resize', () => {
  if (window.innerWidth > 860 && sidebar.classList.contains('open')) setSidebarOpen(false);
});

document.querySelectorAll('.data-table').forEach((table) => {
  const labels = [...table.querySelectorAll('thead th')].map((header) => header.textContent.trim() || 'Actions');
  table.querySelectorAll('tbody tr').forEach((row) => {
    [...row.children].forEach((cell, index) => cell.dataset.label = labels[index] || 'Details');
  });
});

function filterCurrentView(query) {
  const activePanel = document.querySelector('[data-view-panel].active');
  if (!activePanel) return;
  const normalized = query.trim().toLowerCase();
  activePanel.querySelectorAll('[data-search-item]').forEach((item) => {
    item.hidden = normalized && !item.textContent.toLowerCase().includes(normalized);
  });
}
search.addEventListener('input', () => filterCurrentView(search.value));

document.querySelectorAll('[data-toast]').forEach((button) => button.addEventListener('click', () => showToast(button.dataset.toast)));
document.querySelectorAll('[data-toggle-label]').forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.classList.toggle('selected');
    button.setAttribute('aria-pressed', String(selected));
    button.textContent = selected ? button.dataset.selectedLabel : button.dataset.toggleLabel;
    showToast(selected ? button.dataset.selectedToast : button.dataset.unselectedToast);
  });
});

document.querySelectorAll('.switch').forEach((button) => button.addEventListener('click', () => {
  const enabled = button.classList.toggle('on');
  button.setAttribute('aria-pressed', String(enabled));
  showToast(`Preference ${enabled ? 'enabled' : 'disabled'}.`);
}));

const notificationDrawer = document.querySelector('.notification-drawer');
document.querySelector('[data-notifications]')?.addEventListener('click', (event) => {
  event.stopPropagation();
  notificationDrawer.classList.toggle('open');
});
document.addEventListener('click', (event) => {
  if (!notificationDrawer?.contains(event.target)) notificationDrawer?.classList.remove('open');
});

document.querySelectorAll('[data-dialog]').forEach((button) => button.addEventListener('click', () => document.querySelector(`#${button.dataset.dialog}`)?.showModal()));
document.querySelectorAll('.dialog-close,[data-dialog-close]').forEach((button) => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('.workspace-dialog').forEach((dialog) => dialog.addEventListener('click', (event) => {
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
}));

document.querySelectorAll('[data-workspace-form]').forEach((form) => form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const action = form.dataset.workspaceForm;
  showToast(action === 'proposal' ? 'Proposal created and added to your proposal tracker.' : 'Project draft created and added to Projects.');
  form.closest('dialog').close();
  form.reset();
  window.setTimeout(() => activateView(action === 'proposal' ? 'proposals' : 'projects'), 350);
}));

const conversationData = role === 'client'
  ? {
      northstar: ['Maya Chen', 'Embedded finance design system', [['client','I added the focus-state notes to the component specification.'],['me','Perfect. I will review the revised delivery today.']]],
      arc: ['Amara Okafor', 'Activation research sprint', [['client','I can begin the research plan next Monday.'],['me','That timing works. I added the stakeholder list to the brief.']]],
      parcel: ['Dev Malik', 'Risk dashboard engineering', [['client','The chart-framework question is clear now.'],['me','Great. Please reflect that approach in the proposal.']]],
    }
  : {
      northstar: ['Northstar Labs', 'Embedded finance design system', [['client','Could you include focus-state notes in the handoff?'],['me','Yes. I added them to the component specification.']]],
      arc: ['Arc Health', 'Mobile experience project', [['client','The research summary is ready for your review.'],['me','Thanks — I will respond before tomorrow morning.']]],
      parcel: ['Parcelwork', 'B2B onboarding brief', [['client','We clarified the analytics requirement in the brief.'],['me','That resolves my final scope question.']]],
    };

document.querySelectorAll('[data-conversation]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-conversation]').forEach((item) => item.classList.toggle('active', item === button));
  const data = conversationData[button.dataset.conversation];
  if (!data) return;
  document.querySelector('#chat-name').textContent = data[0];
  document.querySelector('#chat-context').textContent = data[1];
  document.querySelector('#chat-messages').innerHTML = data[2].map(([sender,text]) => `<div class="message-bubble ${sender === 'me' ? 'me' : ''}">${text}</div>`).join('');
}));

document.querySelector('.chat-compose')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = event.currentTarget.querySelector('input');
  if (!input.value.trim()) return;
  const bubble = document.createElement('div');
  bubble.className = 'message-bubble me';
  bubble.textContent = input.value.trim();
  document.querySelector('#chat-messages').appendChild(bubble);
  input.value = '';
  showToast('Message added to this prototype conversation.');
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  setSidebarOpen(false);
  notificationDrawer?.classList.remove('open');
});

activateView(window.location.hash.replace('#','') || 'overview');
