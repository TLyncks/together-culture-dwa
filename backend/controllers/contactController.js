const db = require("../config/db");

const submitContactForm = (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)";
  db.query(sql, [name, email, message], (err) => {
    if (err) return res.status(500).json({ error: "Failed to send message" });
    res.status(201).json({ message: "Message sent successfully" });
  });
};

const getAllMessages = (req, res) => {
  const query = "SELECT * FROM messages ORDER BY created_at DESC";

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch messages" });
    res.json(results);
  });
};

const deleteMessage = (req, res) => {
  const messageId = req.params.id;

  const query = "DELETE FROM messages WHERE id = ?";
  db.query(query, [messageId], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to delete message" });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ message: "Message deleted successfully" });
  });
};

module.exports = {
  submitContactForm,
  getAllMessages,
  deleteMessage,
 };
