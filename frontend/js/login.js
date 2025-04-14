// public/js/login.js

function logDebug(message) {
  const panel = document.getElementById('debugPanel');
  const log = document.getElementById('debugLog');
  if (panel && log) {
    panel.style.display = 'block';
    log.textContent += `${message}\n`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  // ✅ Only declare once — this is your secure backend
  const backendURL = 'https://api.mofwomen.com';

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const membershipNumber = document.getElementById('membershipNumber').value;
    const password = document.getElementById('password').value;

    logDebug("🔑 Submitting login...");

    try {
      const res = await fetch(`${backendURL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipNumber, password }),
      });

      const data = await res.json();
      logDebug(`📥 Response: ${JSON.stringify(data)}`);

      if (!res.ok) {
        document.getElementById('errorMessage').textContent = data.message || 'Login failed.';
        logDebug(`❌ Login failed: ${data.message}`);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      const role = data.user.role?.toLowerCase();
      const tier = data.user.tier?.toLowerCase();
      let redirectURL = '/login/index.html';

      if (role === 'member') {
        redirectURL = `/dashboard/member/${tier || 'index'}.html`;
      } else {
        redirectURL = `/admin/index.html`;
      }

      logDebug(`➡️ Redirecting to: ${redirectURL}`);
      window.location.href = redirectURL;

    } catch (err) {
      logDebug(`❗ Error: ${err.message}`);
      document.getElementById('errorMessage').textContent = 'Error during login.';
    }
  });
});
