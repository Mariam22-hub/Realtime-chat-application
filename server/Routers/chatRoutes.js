const express = require('express');
const router = express.Router();
const chatController = require("../Controllers/chatController");

router.get("/find/:firstId/:secondId", chatController.findChat)
router.get("/:userId", chatController.findUserChats)
router.post("/", chatController.createChat)

module.exports = router