const express = require("express");
const router = express.Router();
const { joinMembership, getMembership } = require("../controllers/membershipController");
const { protect } = require("../middleware/authMiddleware");

router.post("/membership/join", protect, joinMembership);
router.get("/membership/me", protect, getMembership);

module.exports = router;
