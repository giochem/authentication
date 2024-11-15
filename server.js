require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

const signAccessToken = async () => {
  const payload = {
    userId: 1,
    username: "admin",
  };

  const token = await jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15s",
  });

  return token;
};
const signRefreshToken = async () => {
  const payload = {
    userId: 1,
    username: "admin",
  };

  const token = await jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "10m",
  });

  return token;
};
const verifyToken = async (req, res, next) => {
  try {
    if (req.headers["x-token"]) {
      const token = req.headers["x-token"];
      const payload = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = payload;
      return next();
    }

    return res.status(200).json({
      code: 401,
      msg: "Invalid token",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(200).json({
        code: 401,
        msg: error.message,
      });
    }
    return res.status(200).json({
      code: 500,
      msg: error,
    });
  }
};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/refreshToken", async (req, res) => {
  return res.status(200).json({
    status: "success",
    elements: {
      accessToken: await signAccessToken(),
    },
  });
});

app.get("/api/users", verifyToken, (req, res) => {
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

app.get("/api/login", async (req, res) => {
  return res.status(200).json({
    status: "success",
    elements: {
      accessToken: await signAccessToken(),
    },
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running @ http://localhost:${PORT}`);
});
