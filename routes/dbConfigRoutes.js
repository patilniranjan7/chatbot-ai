const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const { addDbConfig } = require("../controllers/dbConfigController");

const router = express.Router();

router.post("/add-db-config", authMiddleware, addDbConfig);

module.exports = router;