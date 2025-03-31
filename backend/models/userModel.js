const db = require("../config/db");

const createUser = (name, email, hashedPassword, callback) => {
  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, hashedPassword], callback);
};

const findUserByEmail = (email, callback) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], callback);
};

const findUserById = (id, callback) => {
  const sql = "SELECT id, name, email, role FROM users WHERE id = ?";
  db.query(sql, [id], callback);
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
