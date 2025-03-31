const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const register = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: "Error hashing password" });

    User.createUser(name, email, hash, (err, result) => {
      if (err) return res.status(500).json({ error: "Registration failed" });
      res.status(201).json({ message: "User registered successfully" });
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByEmail(email, (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ token });
    });
  });
};

const getMe = (req, res) => {
  const userId = req.user.id;
  User.findUserById(userId, (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(results[0]);
  });
};

module.exports = { register, login, getMe };
