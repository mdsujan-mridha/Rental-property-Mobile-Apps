
const express = require("express");
const { newProperty, getAllProperty, updateProperty, deleteProperty, getPropertyDetails, getAllProperties } = require("../controller/propertyController");
const { adminOnly } = require("../middleware/auth");
const { singleUpload } = require("../middleware/multer");

const router = express.Router();

// create new property 
router.route("/property/new").post(singleUpload,newProperty);
// get all property
router.route("/properties").get(getAllProperty);

// get single property details 
router.route("/property/:id").get(getPropertyDetails)
// update property --admin
router.route("property/:id")
    .put(adminOnly, updateProperty)
    .delete(adminOnly, deleteProperty)
// get property by admin 
router.route("/property/admin").get(adminOnly, getAllProperties)


module.exports = router
