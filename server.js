const express = require("express");
const sessions = require("express-session");

const app = express();

app.use(
  sessions({
    secret: "session secret",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
    resave: true,
    saveUninitialized: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  if (!req.session.userid) {
    return res.redirect("/login");
  }
  res.setHeader("Content-Type", "text/html");
  res.write(`
      <h1>Welcome back ${req.session.userid}</h1>
      <a href="/logout">Logout</a>
    `);

  res.end();
});

app.get("/login", (req, res) => {
  if (req.session.userid) {
    return res.redirect("/");
  }

  res.setHeader("Content-Type", "text/html");
  res.write(`
      <h1>Login</h1>
      <form method="post" action="/process-login">
        <input type="text" name="username" placeholder="Username" /> <br>
        <input type="password" name="password" placeholder="Password" /> <br>
        <button type="submit">Login</button>
      </form>
    `);

  res.end();
});

app.post("/process-login", (req, res) => {
  if (req.body.username !== "admin" || req.body.password !== "admin") {
    return res.send("Invalid username or password");
  }

  req.session.userid = req.body.username;

  res.redirect("/");
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running @ http://localhost:${PORT}`);
});
