const db = require("../config/db");

const requireMembershipTier = (tierNames = []) => {
  return (req, res, next) => {
    const userId = req.user.id;

    const query = `
      SELECT m.name FROM users u
      JOIN memberships m ON u.membership_id = m.id
      WHERE u.id = ?
    `;

    db.query(query, [userId], (err, results) => {
      if (err || results.length === 0)
        return res.status(403).json({ error: "Membership required" });

      const userTier = results[0].name;

      if (!tierNames.includes(userTier)) {
        return res.status(403).json({ error: `Access denied: requires ${tierNames.join(" or ")}` });
      }

      next();
    });
  };
};

module.exports = { requireMembershipTier };
