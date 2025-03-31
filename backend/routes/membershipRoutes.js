const express = require("express");
const router = express.Router();
const {
  joinMembership,
  cancelMembership,
  getMembership,
  getAllMemberships,
} = require("../controllers/membershipController");
const { protect } = require("../middleware/authMiddleware");

router.post("/membership/join", protect, joinMembership);
router.get("/membership/me", protect, getMembership);
router.delete("/membership/cancel", protect, cancelMembership);


module.exports = router;

const { requireMembershipTier } = require("../middleware/membershipMiddleware");

router.get(
  "/workspace",
  protect,
  requireMembershipTier(["Creative Workspace Membership"]),
  (req, res) => {
    res.json({ message: "Welcome to the creative workspace!" });
  }
);
router.get("/memberships", getAllMemberships);

