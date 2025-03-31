const db = require("../config/db");

const joinMembership = (req, res) => {
  const userId = req.user.id;
  const { membership_id } = req.body;

  if (!membership_id) {
    return res.status(400).json({ error: "membership_id is required" });
  }

  const query = "UPDATE users SET membership_id = ? WHERE id = ?";
  db.query(query, [membership_id, userId], (err) => {
    if (err) return res.status(500).json({ error: "Failed to join membership" });
    res.json({ message: "Membership updated successfully" });
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
  getMembership,
};
