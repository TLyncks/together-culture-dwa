const db = require("../config/db");

const getAllEvents = (callback) => {
  const sql = "SELECT * FROM events ORDER BY date ASC";
  db.query(sql, (err, results) => {
    callback(err, results);
  });
};

module.exports = {
  getAllEvents,
};
