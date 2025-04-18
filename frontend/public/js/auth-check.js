// public/js/auth-check.js

document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!user || !token) {
    window.location.href = '/login/index.html'; // redirect if unauthenticated
  } else {
    const userName = user.name || user.email || 'Member';
    const nameSpan = document.getElementById('userName');
    if (nameSpan) nameSpan.textContent = userName;
  }
});
