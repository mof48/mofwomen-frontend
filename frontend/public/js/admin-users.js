document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('userCardContainer');
    const token = localStorage.getItem('token');
  
    if (!token) {
      window.location.href = '/login/index.html';
      return;
    }
  
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const users = await res.json();
  
      if (!Array.isArray(users)) {
        container.innerHTML = `<p style="color: red;">Error fetching users.</p>`;
        return;
      }
  
      container.innerHTML = ''; // Clear loading text
  
      users.forEach(user => {
        const card = document.createElement('div');
        card.className = 'user-card';
  
        userCard.innerHTML = `
        <h3>${user.name}</h3>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Membership #:</strong> ${user.membershipNumber}</p>
        <p><strong>Role:</strong> ${user.role}</p>
        <p><strong>Tier:</strong> ${user.tier}</p>
        <p><strong>Status:</strong> <span class="user-status ${user.status}">${user.status}</span></p>
        <div class="admin-actions">
          ${user.status === 'pending' ? `
            <button class="approve-btn" onclick="updateUserStatus('${user._id}', 'approved')">Approve</button>
            <button class="reject-btn" onclick="updateUserStatus('${user._id}', 'rejected')">Reject</button>
          ` : ''}
        </div>
      `;
      async function updateUserStatus(userId, status) {
        const token = localStorage.getItem('token');
      
        try {
          const res = await fetch(`/api/admin/approve/${userId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({ status }),
          });
      
          const result = await res.json();
          if (res.ok) {
            alert(`User has been ${status}.`);
            loadUsers(); // Reload the cards
          } else {
            alert(result.message || 'Something went wrong');
          }
        } catch (err) {
          console.error(err);
          alert('Server error');
        }
      }
      
  
        container.appendChild(card);
      });
    } catch (err) {
      console.error('❌ Fetch error:', err);
      container.innerHTML = `<p style="color: red;">Server error. Please try again later.</p>`;
    }
  });
  