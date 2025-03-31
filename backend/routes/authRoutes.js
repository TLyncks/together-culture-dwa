const {
  register,
  login,
  getMe,
  updatePassword
} = require("../controllers/authController");

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.patch("/me/password", protect, updatePassword);


module.exports = router;
