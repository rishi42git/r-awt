// login.js
document.getElementById('btnLogin').addEventListener('click', async () => {
  const u = document.getElementById('username').value;
  const p = document.getElementById('password').value;
  const msg = document.getElementById('msg');

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password: p }),
      credentials: 'include'
    });
    if (!res.ok) {
      const err = await res.json();
      msg.textContent = err.error || 'Login failed';
      return;
    }
    msg.style.color = '#7fffd4';
    msg.textContent = 'Login successful — redirecting...';
    setTimeout(() => window.location.href = '/ex2/index.html', 700);
  } catch (e) {
    msg.textContent = 'Network error';
  }
});
