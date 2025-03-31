const Events = require("../models/eventsModel");

const getEvents = (req, res) => {
  Events.getAllEvents((err, events) => {
    if (err) {
      console.error("Error fetching events:", err);
      return res.status(500).json({ error: "Failed to retrieve events" });
    }
    res.json(events);
  });
};

module.exports = {
  getEvents,
};
