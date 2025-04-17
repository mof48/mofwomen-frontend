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

    const membershipNumber = document.getElementById('membershipNumber').value.trim();
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
      let redirectURL = '/login/index.html'; // fallback

      // 🔁 Role-based and tier-based redirection
      if (role === 'admin') {
        redirectURL = '/admin/index.html';
      } else if (role === 'member') {
        switch (tier) {
          case 'gold-rose':
            redirectURL = '/dashboard/member/gold-rose.html';
            break;
          case 'platinum-lily':
            redirectURL = '/dashboard/member/platinum-lily.html';
            break;
          case 'diamond-orchid':
            redirectURL = '/dashboard/member/diamond-orchid.html';
            break;
          default:
            redirectURL = '/dashboard/member/index.html';
        }
      } else if (role === 'speaker') {
        redirectURL = '/dashboard/speaker/index.html';
      } else if (role === 'guest') {
        redirectURL = '/dashboard/guest/index.html';
      }

      logDebug(`➡️ Redirecting to: ${redirectURL}`);
      window.location.href = redirectURL;

    } catch (err) {
      logDebug(`❗ Error: ${err.message}`);
      document.getElementById('errorMessage').textContent = 'Error during login.';
    }
  });
});
