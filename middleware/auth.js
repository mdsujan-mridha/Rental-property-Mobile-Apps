const catchAsyncsErrors = require("../middleware/catchAsyncsErrors")
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = catchAsyncsErrors(async (req, res, next) => {

    const { token } = req.cookies;
    if (!token) return next(new ErrorHandler("Not Logged In", 401));
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData._id);
    next();

})

exports.adminOnly = catchAsyncsErrors(async (req, res, next) => {
    const { id } = req.query;
    if (!id) return next(new ErrorHandler("Login required to access this resource ", 401));
    const user = await User.findById(id);
    if (!user) return next(new ErrorHandler("Invalid Id", 401))
    if (req.user.role !== 'admin') {
        return next(new ErrorHandler("Admin only", 403))
    }
    next();
})