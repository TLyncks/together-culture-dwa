const db = require("../config/db");

const requireAdmin = (req, res, next) => {
  const userId = req.user.id;

  db.query("SELECT role FROM users WHERE id = ?", [userId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (results[0].role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  });
};

module.exports = { requireAdmin };
