const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const db = require("../config/db")

const register = (req, res) => {
  const { name, email, password, admin_code } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const role = admin_code === process.env.ADMIN_CODE ? "admin" : "member";

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: "Error hashing password" });

    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, hash, role], (err) => {
      if (err) return res.status(500).json({ error: "Registration failed" });

      res.status(201).json({
        message: `User registered successfully${role === "admin" ? " as admin" : ""}`,
      });
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

      res.json({
        token,
        role: user.role, // ✅ Add this
      });
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

const updatePassword = (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Both fields required" });
  }

  User.findUserById(userId, (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: "User not found" });

    const user = results[0];
    bcrypt.compare(currentPassword, user.password, (err, isMatch) => {
      if (!isMatch) return res.status(401).json({ error: "Current password incorrect" });

      bcrypt.hash(newPassword, 10, (err, hash) => {
        if (err) return res.status(500).json({ error: "Error hashing password" });

        User.updateUserPassword(userId, hash, (err) => {
          if (err) return res.status(500).json({ error: "Failed to update password" });
          res.json({ message: "Password updated successfully" });
        });
      });
    });
  });
};


module.exports = {
  register, 
  login, 
  getMe,
  updatePassword, 
};
