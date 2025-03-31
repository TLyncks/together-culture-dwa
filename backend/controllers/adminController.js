const db = require("../config/db");

const getAllUsers = (req, res) => {
  const query = `
    SELECT 
      u.id, 
      u.name, 
      u.email, 
      u.role, 
      m.name AS membership_name
    FROM users u
    LEFT JOIN memberships m ON u.membership_id = m.id
    ORDER BY u.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch users" });
    res.json(results);
  });
};


const updateUser = (req, res) => {
  const userId = req.params.id;
  const { name, email, role, membership_id } = req.body;

  const query = `
    UPDATE users
    SET name = ?, email = ?, role = ?, membership_id = ?
    WHERE id = ?
  `;

  db.query(query, [name, email, role, membership_id, userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to update user" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User updated successfully" });
  });
};

const deleteUser = (req, res) => {
  const userId = req.params.id;

  db.query("DELETE FROM users WHERE id = ?", [userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to delete user" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  });
};

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
};
