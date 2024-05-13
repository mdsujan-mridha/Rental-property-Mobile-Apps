const express = require("express");
const { createUser, getAllUsers, deleteUser, getUser } = require("../controller/userController");
const { adminOnly } = require("../middleware/auth");

const router = express.Router();

// create user 
router.route("/user/new").post(createUser);
// get a single user 
router.route("/user/:id").get(getUser);
// get all users
router.route("/admin/users").get(adminOnly, getAllUsers);
// delete user 
router.route("/admin/user/:id").delete(adminOnly, deleteUser);

module.exports = router;