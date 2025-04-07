const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { handleChatbotRequest } = require("../controllers/chatbotController");

const router = express.Router();

router.post("/chatbot", authMiddleware, handleChatbotRequest);

module.exports = router;
