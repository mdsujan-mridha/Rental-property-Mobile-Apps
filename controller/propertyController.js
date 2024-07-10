const catchAsyncsErrors = require("../middleware/catchAsyncsErrors");
const Property = require("../model/propertyModel");
const { getDataUri } = require("../utils/DataUri");
const ErrorHandler = require("../utils/ErrorHandler");
const cloudinary = require("cloudinary");
const ApiFeatures = require("../utils/apiFeatures");

// create new property 
exports.newProperty = catchAsyncsErrors(async (req, res, next) => {

    const {
        title,
        rentPrice,
        location,
        bedRoom,
        washRoom,
        barandha,
        category,
        phoneNumber,
        flatSize,
        date,
        looking,
        gasBill,
        electricityBill,
        waterBill,
        serviceCharge,
        others,
        florNo,
        user,

    } = req.body

    // Upload profile image to Cloudinary
    let images = [];
    if (req.file) {
        const file = getDataUri(req.file).content;
        const uploadResult = await cloudinary.uploader.upload(file, {
            folder: 'properties',
        });
        images.push({ public_id: uploadResult.public_id, url: uploadResult.secure_url });
    }

    await Property.create({
        title,
        rentPrice,
        location,
        bedRoom,
        washRoom,
        barandha,
        category,
        phoneNumber,
        user,
        flatSize,
        date,
        looking,
        gasBill,
        electricityBill,
        waterBill,
        serviceCharge,
        others,
        florNo,
        images,

    });
    res.status(201).json({
        success: true,
        message: "Property created successfully"
        
    });
    // console.log(req.body)
});

// get all property 
exports.getAllProperty = catchAsyncsErrors(async (req, res, next) => {

    const propertyCount = await Property.countDocuments();
    const apiFeature = new ApiFeatures(Property.find(), req.query)
        .search()
        .filter()
    let properties = await apiFeature.query;
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
        properties,
    })

})