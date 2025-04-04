const express = require("express");
const { addDbConfig } = require("../controllers/dbConfigController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add-db-config", authMiddleware, addDbConfig);

module.exports = router;