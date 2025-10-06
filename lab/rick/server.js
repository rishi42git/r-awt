// server.js
const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ====== Middleware ======
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "lab-session-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// ====== Static files ======
app.use(express.static(path.join(__dirname, "public")));

// ====== Root redirect ======
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/ex1/login.html"));
});

// ====== Sample check route ======
app.get("/ping", (req, res) => {
  res.send("pong");
});

// ====== Start server ======
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`🧭 Root will serve: ${path.join(__dirname, "public/ex1/login.html")}`);
});
