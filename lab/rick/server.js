// server.js
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// simple hard-coded credential for lab
const VALID_USER = { username: 'student', password: 'password123', displayName: 'Student User' };

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (dev only — use a store like Redis in production)
app.use(session({
  secret: 'lab-session-secret-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24*60*60*1000 } // 1 day
}));

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, 'public')));

// helper middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

/* ---------------------------
   Authentication endpoints
   --------------------------- */

// POST /api/login  { username, password } -> sets req.session.user
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === VALID_USER.username && password === VALID_USER.password) {
    // create session record
    req.session.user = { username: VALID_USER.username, displayName: VALID_USER.displayName };
    // initialize todos if not present
    if (!req.session.todos) req.session.todos = [];
    return res.json({ ok: true, user: req.session.user });
  }
  res.status(401).json({ ok: false, error: 'Invalid credentials' });
});

// POST /api/logout -> destroys session
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ ok: true });
  });
});

// GET /api/profile -> returns logged-in user or 401
app.get('/api/profile', (req, res) => {
  if (req.session && req.session.user) return res.json({ user: req.session.user });
  res.status(401).json({ error: 'Not logged in' });
});

/* ---------------------------
   To-Do API (session-based)
   All routes protected by requireAuth
   --------------------------- */

app.get('/api/todos', requireAuth, (req, res) => {
  req.session.todos = req.session.todos || [];
  res.json(req.session.todos);
});

app.post('/api/todos', requireAuth, (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'Text required' });
  const todos = req.session.todos || [];
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2,6);
  const todo = { id, text: text.trim(), done: false };
  todos.push(todo);
  req.session.todos = todos;
  res.json(todo);
});

app.put('/api/todos/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const { text, done } = req.body;
  const todos = req.session.todos || [];
  const t = todos.find(x => x.id === id);
  if (!t) return res.status(404).json({ error: 'Not found' });
  if (typeof text === 'string') t.text = text.trim();
  if (typeof done === 'boolean') t.done = done;
  req.session.todos = todos;
  res.json(t);
});

app.delete('/api/todos/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  let todos = req.session.todos || [];
  const before = todos.length;
  todos = todos.filter(x => x.id !== id);
  req.session.todos = todos;
  res.json({ deleted: before - todos.length });
});

/* ---------------------------
   Start server
   --------------------------- */
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
