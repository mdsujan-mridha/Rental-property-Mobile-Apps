const catchAsyncsErrors = require("../middleware/catchAsyncsErrors");
const Property = require("../model/propertyModel");
const { getDataUri } = require("../utils/DataUri");
const ErrorHandler = require("../utils/ErrorHandler");
const cloudinary = require("cloudinary");
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

    })

})