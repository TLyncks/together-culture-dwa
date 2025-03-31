const db = require("../config/db");

const joinMembership = (req, res) => {
  const userId = req.user.id;
  const { membership_id } = req.body;

  if (!membership_id) {
    return res.status(400).json({ error: "membership_id is required" });
  }

  const query = "UPDATE users SET membership_id = ? WHERE id = ?";
  db.query(query, [membership_id, userId], (err) => {
    if (err) return res.status(500).json({ error: "Failed to join/upgrade membership" });
    res.json({ message: "Membership updated successfully" });
  });
};

const cancelMembership = (req, res) => {
  const userId = req.user.id;

  const query = "UPDATE users SET membership_id = NULL WHERE id = ?";
  db.query(query, [userId], (err) => {
    if (err) return res.status(500).json({ error: "Failed to cancel membership" });
    res.json({ message: "Membership canceled successfully" });
  });
};

const getMembership = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT u.id, u.name, u.email, m.id AS membership_id, m.name AS membership_name, m.description
    FROM users u
    LEFT JOIN memberships m ON u.membership_id = m.id
    WHERE u.id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err || results.length === 0)
      return res.status(404).json({ error: "User or membership not found" });

    res.json(results[0]);
  });
};

module.exports = {
  joinMembership,
  cancelMembership,
  getMembership,
};

const getAllMemberships = (req, res) => {
  const query = "SELECT id, name, description FROM memberships";

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to load memberships" });
    res.json(results);
  });
};

module.exports = {
  joinMembership,
  cancelMembership,
  getMembership,
  getAllMemberships, // ✅ add this
};
