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

  // Automatically pull from embedded <script> if needed
  const backendURL = typeof window.backendURL !== 'undefined'
    ? window.backendURL
    : 'https://api.mofwomen.com';

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

      if (!res.ok || !data.user) {
        document.getElementById('errorMessage').textContent = data.message || 'Login failed.';
        logDebug(`❌ Login failed: ${data.message}`);
        return;
      }

      // Store token and user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Determine redirect path
      const role = data.user.role?.toLowerCase();
      const tier = data.user.tier?.toLowerCase();
      let redirectURL = '/index.html'; // fallback

      if (role === 'admin') {
        redirectURL = '/admin/index.html';
      } else if (role === 'member') {
        switch (tier) {
          case 'gold-rose':
            redirectURL = '/dashboard/gold-rose.html';
            break;
          case 'platinum-lily':
            redirectURL = '/dashboard/platinum-lily.html';
            break;
          case 'diamond-orchid':
            redirectURL = '/dashboard/diamond-orchid.html';
            break;
          default:
            redirectURL = '/dashboard/index.html';
        }
      } else if (role === 'speaker') {
        redirectURL = '/speaker/speaker.html';
      } else if (role === 'guest') {
        redirectURL = '/guest/index.html';
      }

      logDebug(`➡️ Redirecting to: ${redirectURL}`);
      window.location.href = redirectURL;

    } catch (err) {
      console.error('Login Error:', err);
      logDebug(`❗ Error: ${err.message}`);
      document.getElementById('errorMessage').textContent = 'Something went wrong. Please try again.';
    }
  });
});
