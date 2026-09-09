const form = document.querySelector('.auth-form');
const role = form.dataset.role === 'client' ? 'client' : 'talent';
const mode = form.dataset.mode;
const panel = document.querySelector('.auth-panel');
form.remove();
panel.querySelector('.demo-note')?.remove();
panel.querySelector('.auth-panel-header p').textContent = 'Use your Google account, then complete your Pluto profile.';
const section = document.createElement('section');
section.className = 'auth-methods';
section.innerHTML = `<div class="google-signin-shell"><div id="google-button"></div></div><p id="login-status" role="status" aria-live="polite">Preparing secure sign-in…</p><button class="secondary-button" id="retry-login" type="button" hidden>Try again</button><p class="phone-help">Your name and email come from Google. Add your date of birth, education, phone number, and skills after sign-in.</p>`;
panel.querySelector('.auth-panel-header').after(section);
const status = section.querySelector('#login-status');
const retry = section.querySelector('#retry-login');
const button = section.querySelector('#google-button');
let loaded;
function loadGoogle() {
  if (window.google?.accounts?.id) return Promise.resolve(window.google.accounts.id);
  if (loaded) return loaded;
  loaded = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const timer = setTimeout(() => { script.remove(); loaded = null; reject(new Error('Google is taking too long to respond. Please try again.')); }, 15000);
    script.src = 'https://accounts.google.com/gsi/client'; script.async = true;
    script.onload = () => { clearTimeout(timer); resolve(window.google.accounts.id); };
    script.onerror = () => { clearTimeout(timer); script.remove(); loaded = null; reject(new Error('Unable to reach Google. Check your connection.')); };
    document.head.append(script);
  });
  return loaded;
}
async function responseData(response) {
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('Secure sign-in is available on the hosted Pluto website.');
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Sign-in failed. Try again.');
  return data;
}
async function start() {
  retry.hidden = true; button.replaceChildren(); status.textContent = 'Preparing secure sign-in…';
  try {
    const config = await fetch('/api/auth/config', { cache: 'no-store' }).then(responseData);
    const google = await loadGoogle();
    google.initialize({ client_id: config.clientId, nonce: config.nonce, auto_select: false, context: mode === 'signup' ? 'signup' : 'signin', callback: async ({ credential }) => {
      button.style.pointerEvents = 'none'; status.textContent = 'Verifying your Google account…';
      try {
        if (!credential) throw new Error('Google did not return an account. Please try again.');
        const data = await fetch('/api/auth/google', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ credential, role }) }).then(responseData);
        window.location.replace(data.destination);
      } catch (error) { status.textContent = error.message; retry.hidden = false; button.style.pointerEvents = ''; }
    } });
    google.renderButton(button, { theme: 'outline', size: 'large', shape: 'rectangular', text: mode === 'signup' ? 'signup_with' : 'continue_with', width: Math.min(400, Math.floor(section.clientWidth)) });
    status.textContent = 'Choose your Google account to continue.';
  } catch (error) { status.textContent = error.message; retry.hidden = false; }
}
retry.addEventListener('click', start);
start();
