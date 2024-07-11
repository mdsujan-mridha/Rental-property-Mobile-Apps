
const express = require("express");

const {
    getAllMessage,
    sendMessage } = require("../controller/messageController");
const { isAuthenticated } = require("../middleware/auth");
const router = express.Router();

router.route("/message/:userId").get(isAuthenticated, getAllMessage);
router.route("/message").post(isAuthenticated, sendMessage);



module.exports = router;