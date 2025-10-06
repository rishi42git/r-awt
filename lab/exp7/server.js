// server.js
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// parse JSON bodies
app.use(express.json());

// session middleware (development/demo use only)
// In production, use a persistent session store (redis, database, etc.)
app.use(session({
  secret: 'change_this_secret', // change in real apps
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Return / initialize session state
app.get('/api/state', (req, res) => {
  if (!req.session.state) {
    req.session.state = {
      counter: 0,
      theme: 'dark',
      lastUpdated: new Date().toISOString()
    };
  }
  res.json(req.session.state);
});

// Update session state (expects JSON { counter, theme })
app.post('/api/state', (req, res) => {
  const { counter, theme } = req.body;
  if (!req.session.state) req.session.state = {};
  if (typeof counter !== 'undefined') req.session.state.counter = Number(counter);
  if (typeof theme !== 'undefined') req.session.state.theme = theme;
  req.session.state.lastUpdated = new Date().toISOString();
  res.json(req.session.state);
});

// Reset session state
app.post('/api/reset', (req, res) => {
  req.session.state = {
    counter: 0,
    theme: 'dark',
    lastUpdated: new Date().toISOString()
  };
  res.json(req.session.state);
});

// start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
