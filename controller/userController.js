const catchAsyncsErrors = require("../middleware/catchAsyncsErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../model/userModel");
const sendToken = require("../utils/jwtToken");
const cloudinary = require("cloudinary");
const { getDataUri } = require("../utils/DataUri");
// new user 

exports.createUser = catchAsyncsErrors(async (req, res, next) => {
    const { name, email, password, phoneNumber, location } = req.body;
    // console.log(req.file);
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: 'User already exists with this email',
        });
    }
    // Upload profile image to Cloudinary
    try {
        let avatar = undefined;
        if (req.file) {
            const file = getDataUri(req.file)
            const result = await cloudinary.v2.uploader.upload(file.content,
                {
                    folder: "avater",
                    width: 150,
                    crop: "scale",
                }
            )
            avatar = {
                public_id: result.public_id,
                url: result.secure_url
            }

        }
        // Create user in MongoDB
        const user = await User.create({
            name,
            email,
            password,
            phoneNumber,
            location,
            avatar,
        });
        sendToken(user, 201, res)

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error.message,
        });
    }
});

// login user
exports.loginUser = catchAsyncsErrors(async (req, res, next) => {
    const { email, password } = req.body;
    // Check if email and password exist
    if (!email || !password) {
        return next(new ErrorHandler("Please provide an email and password", 400));
    }
    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    // Check if password is correct
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    sendToken(user, 200, res);
});
//logout
exports.logout = catchAsyncsErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
});
//forgot password 
exports.forgotPassword = catchAsyncsErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    //  deploy korar time ai ta use kora lagbe tai akhon comment kore dilm
    // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    // demo url 
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: `Easy Search property password recovery`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});
// Reset Password
exports.resetPassword = catchAsyncsErrors(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(
            new ErrorHandler(
                "Reset Password Token is invalid or has been expired",
                400
            )
        );
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not password", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});
// /get user details 
exports.getUserDetails = catchAsyncsErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    })

});
// update password 
exports.updatePassword = catchAsyncsErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("password does not match", 400));

    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);
});
//update profile
exports.updateProfile = catchAsyncsErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    // Add Cloudinary image upload if a new image is provided
    if (req.file) {
        const user = await User.findById(req.user.id);

        // Delete the previous image from Cloudinary
        if (user.avatar && user.avatar.public_id) {
            const imageId = user.avatar.public_id;
            await cloudinary.v2.uploader.destroy(imageId);
        }

        // Upload the new image to Cloudinary
        const file = getDataUri(req.file);
        const result = await cloudinary.v2.uploader.upload(file.content, {
            folder: 'avatar',
            width: 150,
            crop: 'scale',
        });

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url,
        };
    }
    // Update user information in MongoDB
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        user,
    });
})
// get all user 
exports.getAllUsers = catchAsyncsErrors(async (req, res, next) => {
    const users = await User.find({});
    res.status(200).json({
        success: true,
        users
    })
});
//  get single user by admin 

exports.getAllUser = catchAsyncsErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`user does not exist id :${req.params.id}`));
    }

    res.status(200).json({
        success: true,
        user,
    })
});

// update user role 
exports.updateUserRole = catchAsyncsErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
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
});