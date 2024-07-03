const catchAsyncsErrors = require("../middleware/catchAsyncsErrors")
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = catchAsyncsErrors(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new ErrorHandler('Not Logged In', 401));
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData.id);

        if (!req.user) {
            return next(new ErrorHandler('User not found', 404));
        }

        next();
    } catch (error) {
        return next(new ErrorHandler('Invalid Token', 401));
    }
});

// authorizeRoles 
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resource `,
                    403
                )
            );
        }

        next();
    };
};