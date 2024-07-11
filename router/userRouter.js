const express = require("express");
const {
    createUser,
    getAllUsers,
    deleteUser,
    getAllUser,
    getUserDetails,
    loginUser,
    forgotPassword,
    logout,
    resetPassword,
    updatePassword,
    updateProfile,
    updateUserRole
} = require("../controller/userController");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");

const { singleUpload } = require("../middleware/multer");
const router = express.Router();

// create user 
router.route("/user/new").post(singleUpload, createUser);
// login 
router.route("/user/login").post(loginUser);
// password forgot 
router.route("/password/forgot").post(forgotPassword);
// logout 
router.route("/user/logout").get(logout);
// reset password 
router.route("/password/reset/:token").put(resetPassword);
// get user details 
router.route("/user/me").get(isAuthenticated, getUserDetails);
// update password 
router.route("/password/update").put(isAuthenticated, updatePassword);
// update profile 
router.route("/me/updateProfile").put(isAuthenticated, updateProfile);
// get all users-admin
router.route("/admin/users").get( getAllUsers);
// get user details for load landlord 
router.route("/user/:id").get(isAuthenticated, getAllUser);
// delete user 
router.route("/admin/user/:id")
    .get(isAuthenticated, authorizeRoles("admin"), getAllUser)
    .put(isAuthenticated, authorizeRoles("admin"), updateUserRole)
    .delete(isAuthenticated, authorizeRoles("admin"), deleteUser);

module.exports = router;