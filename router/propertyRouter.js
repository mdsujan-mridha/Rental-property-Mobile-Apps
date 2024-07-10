
const express = require("express");
const {
    newProperty,
    getAllProperty,
    updateProperty,
    deleteProperty,
    getPropertyDetails,
    getAllProperties
} = require("../controller/propertyController");
const { singleUpload } = require("../middleware/multer");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

// create new property 
router.route("/property/new").post(isAuthenticated,singleUpload, newProperty);
// get all property
router.route("/properties").get(getAllProperty);

// get single property details 
router.route("/property/:id").get(getPropertyDetails)
// update property --admin
router.route("/property/:id")
    .put(updateProperty)
    .delete(deleteProperty)
// get property by admin 

router.route("/properties/admin").get(getAllProperties);

module.exports = router
