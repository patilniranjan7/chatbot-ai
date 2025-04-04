require("./config/dotenv");
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const dbConfigRoutes = require("./routes/dbConfigRoutes");
const cors = require("cors");

connectDB(); // Connect to MongoDB

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);
app.use("/config", dbConfigRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
