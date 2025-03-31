const express = require("express");
const cors = require("cors");
const helmet = require("require");
require("dotenv").config();
const db = require("../config/db");

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => res.send("API is live"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port ${PORT}'));