const authRoutes = require("./routes/authRoutes");
const membershipRoutes = require("./routes/membershipRoutes");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
dotenv.config();
const db = require("./config/db");

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", membershipRoutes);

app.get("/", (req, res) => res.send("API is live"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));