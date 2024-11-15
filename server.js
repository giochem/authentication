const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/refreshToken", (req, res) => {
  return res.status(200).json({
    status: "success",
    elements: {
      token: "newAccessToken",
      timeExpired: Date.now() + 3 * 1000,
    },
  });
});

app.get("/api/users", (req, res) => {
  return res.status(200).json({
    status: "success",
    elements: [
      {
        name: "John",
      },
      {
        name: "Jane",
      },
    ],
  });
});

app.get("/api/login", (req, res) => {
  return res.status(200).json({
    status: "success",
    elements: {
      token: "access",
      timeExpired: Date.now() + 3 * 1000,
    },
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running @ http://localhost:${PORT}`);
});
