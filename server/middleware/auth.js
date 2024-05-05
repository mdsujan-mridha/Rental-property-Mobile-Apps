const catchAsyncsErrors = require("../middleware/catchAsyncsErrors")
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../model/userModel");

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