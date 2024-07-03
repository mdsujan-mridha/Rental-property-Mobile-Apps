
const express = require("express");
const { getAllMessage, sendMessage } = require("../controller/messageController");
const router = express.Router();

router.route("/message/:userId").get(getAllMessage);
router.route("/message").post(sendMessage);



module.exports = router;