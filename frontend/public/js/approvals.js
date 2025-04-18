document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      return window.location.href = '/login/index.html';
    }
  
    const tableBody = document.getElementById('pendingMembersTable');
  
    try {
      const res = await fetch('/api/admin/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const users = await res.json();
      tableBody.innerHTML = '';
  
      if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">No pending members.</td></tr>';
        return;
      }
  
      users.forEach(user => {
        const row = document.createElement('tr');
  
        row.innerHTML = `
          <td>${user.name || 'N/A'}</td>
          <td>${user.email || 'N/A'}</td>
          <td>${user.tier || 'N/A'}</td>
          <td>
            <button class="btn-approve" onclick="updateStatus('${user._id}', 'approved')">Approve</button>
            <button class="btn-reject" onclick="updateStatus('${user._id}', 'rejected')">Reject</button>
          </td>
        `;
  
        tableBody.appendChild(row);
      });
    } catch (err) {
      console.error('❌ Error loading pending members:', err);
      tableBody.innerHTML = '<tr><td colspan="4">Error loading data.</td></tr>';
    }
  });
  
  async function updateStatus(id, status) {
    const token = localStorage.getItem('token');
  
    try {
      const res = await fetch(`/api/admin/approve/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
  
      const data = await res.json();
      alert(data.message);
      location.reload();
    } catch (err) {
      console.error('❌ Error updating status:', err);
      alert('Failed to update user status.');
    }
  }
  