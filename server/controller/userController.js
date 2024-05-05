const catchAsyncsErrors = require("../middleware/catchAsyncsErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../model/userModel");
// new user 
exports.createUser = catchAsyncsErrors(async (req, res, next) => {

    const { name, email, _id, phoneNumber, location, photoUrl } = req.body;

    let user = User.findById(_id);
    if (user) {
        return res.status(200).json({
            success: true,
            message: `Welcome ,${user.name}`,
        })
    }

    if (!_id || !name || !email || !photoUrl || !phoneNumber || !location) {
        return next(new ErrorHandler("Please fill all the fields", 400));
    }
    user = await User.create({
        name,
        email,
        _id,
        phoneNumber,
        location,
        photoUrl
    });
    res.status(201).json({
        success: true,
        message: `Welcome ,${user.name}`
    })

});

// get all user 

exports.getAllUsers = catchAsyncsErrors(async (req, res, next) => {

    const users = await User.find({});
    res.status(200).json({
        success: true,
        users
    })

});
// get a single user 
exports.getUser = catchAsyncsErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    res.status(200).json({
        success: true,
        user,
    });

});

// delete user from database 
exports.deleteUser = catchAsyncsErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    await user.deleteOne();
    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    })
})