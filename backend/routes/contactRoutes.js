const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const { submitContactForm, getAllMessages, deleteMessage } = require("../controllers/contactController");

const { protect } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");

const contactLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 1,
  message: {
    error: "Please wait a bit before sending another message.",
  },
});

router.post("/contact", contactLimiter, submitContactForm);
router.get("/contact/messages", protect, requireAdmin, getAllMessages);
router.delete("/contact/messages/:id", protect, requireAdmin, deleteMessage);



module.exports = router;
