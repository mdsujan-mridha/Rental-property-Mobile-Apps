const catchAsyncsErrors = require("../middleware/catchAsyncsErrors");
const Property = require("../model/propertyModel");
const { getDataUri } = require("../utils/DataUri");
const ErrorHandler = require("../utils/ErrorHandler");
const cloudinary = require("cloudinary");
const ApiFeatures = require("../utils/apiFeatures");

// create new property 
exports.newProperty = catchAsyncsErrors(async (req, res, next) => {

    const { title, rentPrice, location, bedRoom, washRoom, barandha, florNo, category, flatSize, date, phoneNumber } = req.body

    if (!req.file) return next(new ErrorHandler("Please add a image", 400));

    const file = getDataUri(req.file);

    const myCloud = await cloudinary.v2.uploader.upload(file.content);

    const image = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
    }
    req.body.user = req.user.id;
    await Property.create({
        title,
        rentPrice,
        location,
        bedRoom,
        washRoom,
        barandha,
        florNo,
        category,
        flatSize,
        date,
        phoneNumber,
        photoUrl: [image]

    });
    res.status(201).json({
        success: true,
        message: "Property created successfully"
    });
});

// get all property 
exports.getAllProperty = catchAsyncsErrors(async (req, res, next) => {

    const propertyCount = await Property.countDocuments();
    const apiFeature = new ApiFeatures(Property.find(), req.query)
        .search()
        .filter()
    const properties = await apiFeature.query;
    let filteredProperty = properties.length;

    properties = await apiFeature.query.clone();

    res.status(200).json({
        success: true,
        properties,
        propertyCount,
        filteredProperty
    });
});

// get property details 
exports.getPropertyDetails = catchAsyncsErrors(async (req, res, next) => {

    const property = await Property.findById(req.params.id);
    if (!property) {
        return next(new ErrorHandler("Property not found", 404));
    }
    res.status(200).json({
        success: true,
        property
    });

});
// update property
exports.updateProperty = catchAsyncsErrors(async (req, res, next) => {

    let property = await Property.findById(req.params.id);
    if (!property) {
        return next(new ErrorHandler("Property not found", 404));
    }
    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        property
    });

});

// delete property 
exports.deleteProperty = catchAsyncsErrors(async (req, res, next) => {

    const property = await Property.findById(req.params.id);
    if (!property) {
        return next(new ErrorHandler("Property not found", 404));
    }

    await property.deleteOne();
    res.status(200).json({
        success: true,
        message: "Property deleted successfully"
    });


});

// get all properties --admin
exports.getAllProperties = catchAsyncsErrors(async (req, res, next) => {

    const properties = await Property.find();
    res.status(200).json({
        success: true,
        properties
    });

})