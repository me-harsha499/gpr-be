const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // You might want to validate req.body here

  if (username !== ADMIN_USERNAME) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const match = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!match) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const payload = { username: ADMIN_USERNAME, role: "admin" };
  const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

  res.json({ accessToken, refreshToken });
});

module.exports = router;
