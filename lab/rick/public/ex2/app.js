// app.js for ex2
async function api(path, opts = {}) {
  opts.credentials = 'include';
  if (!opts.headers) opts.headers = {};
  if (opts.body && typeof opts.body === 'object') {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(opts.body);
  }
  const r = await fetch(path, opts);
  if (r.status === 401) {
    // not logged in -> redirect to login
    window.location.href = '/ex1/login.html';
    throw new Error('unauthorized');
  }
  return r.json();
}

function el(q) { return document.querySelector(q); }

async function loadProfile() {
  try {
    const p = await api('/api/profile');
    document.getElementById('userName').textContent = p.user.displayName || p.user.username;
  } catch (e) {}
}

async function loadTodos() {
  const todos = await api('/api/todos');
  const ul = el('#todoList');
  ul.innerHTML = '';
  todos.forEach(t => {
    const li = document.createElement('li');
    li.innerHTML = `<span style="display:flex;gap:12px;align-items:center">
        <input type="checkbox" ${t.done ? 'checked' : ''} data-id="${t.id}" class="chk" />
        <span style="text-decoration:${t.done ? 'line-through' : 'none'}">${escapeHtml(t.text)}</span>
      </span>
      <span class="actions">
        <button data-id="${t.id}" class="del">Delete</button>
      </span>`;
    ul.appendChild(li);
  });
  // attach listeners
  document.querySelectorAll('.del').forEach(b => {
    b.onclick = async (ev) => {
      const id = ev.target.dataset.id;
      await api(`/api/todos/${id}`, { method: 'DELETE' });
      loadTodos();
    };
  });
  document.querySelectorAll('.chk').forEach(c => {
    c.onchange = async (ev) => {
      const id = ev.target.dataset.id;
      await api(`/api/todos/${id}`, { method: 'PUT', body: { done: ev.target.checked } });
      loadTodos();
    };
  });
}

function escapeHtml(s = '') {
  return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

document.getElementById('addBtn').addEventListener('click', async () => {
  const t = document.getElementById('newTodo').value;
  if (!t.trim()) return;
  await api('/api/todos', { method: 'POST', body: { text: t } });
  document.getElementById('newTodo').value = '';
  loadTodos();
});

document.getElementById('btnLogout').addEventListener('click', async () => {
  try {
    await api('/api/logout', { method: 'POST' });
  } finally {
    window.location.href = '/ex1/login.html';
  }
});

// initial
loadProfile().then(loadTodos).catch(() => {});
