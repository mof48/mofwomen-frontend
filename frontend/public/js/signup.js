// public/js/signup.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  if (!form) return;

  const emailInput = form.querySelector('input[name="email"]');
  const passwordInput = form.querySelector('input[name="password"]');

  emailInput?.addEventListener('input', () => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    emailInput.setCustomValidity(
      emailRegex.test(emailInput.value) ? '' : 'Enter a valid email'
    );
  });

  passwordInput?.addEventListener('input', () => {
    passwordInput.setCustomValidity(
      passwordInput.value.length >= 6 ? '' : 'Password must be at least 6 characters'
    );
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        showToast('🎉 Registered! Redirecting to login...', 'success');
        setTimeout(() => {
          window.location.href = '/login/index.html';
        }, 2000);
      } else {
        showToast('⚠️ ' + result.message, 'error');
      }

    } catch (err) {
      console.error(err);
      showToast('❌ Something went wrong. Try again later.', 'error');
    }
  });
});

// Toast message display
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: type === 'error' ? '#e74c3c' : (type === 'success' ? '#2ecc71' : '#333'),
    color: 'white',
    padding: '12px 20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
    zIndex: 9999,
    opacity: 0,
    transition: 'opacity 0.5s'
  });

  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.style.opacity = 1);

  setTimeout(() => {
    toast.style.opacity = 0;
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}
