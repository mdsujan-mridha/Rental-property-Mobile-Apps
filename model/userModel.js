
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: [true, "Please Enter ID"],
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email already Exit"],
        validate: validator.default.isEmail

    },
    phoneNumber: {
        type: String,
    },
    location: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    date: {
        type: Date,
        default: Date.now
    },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('user', userSchema);