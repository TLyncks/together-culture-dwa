const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");

router.get("/admin/users", protect, requireAdmin, getAllUsers);
router.patch("/admin/users/:id", protect, requireAdmin, updateUser);
router.delete("/admin/users/:id", protect, requireAdmin, deleteUser);

module.exports = router;
