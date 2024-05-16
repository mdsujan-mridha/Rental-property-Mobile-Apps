
const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    rentPrice: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    bedRoom: {
        type: Number,
        required: true
    },
    washRoom: {
        type: Number,
        required: true
    },
    barandha: {
        type: Number,
        required: true
    },
    // florNo: {
    //     type: Number,
    //     required: true
    // },
    category: {
        type: String,
        required: true
    },
    // flatSize: {
    //     type: Number,
    //     required: true
    // },
    date: {
        type: Date,
        default: Date.now
    },
    phoneNumber: {
        type: String,
        required: true
    },
    // others: {
    //     type: Array,
    // },
    // gasBill: {
    //     type: String,
    //     required: true,
    // },
    // waterBill: {
    //     type: String,
    //     required: true
    // },
    // electricityBill: {
    //     type: String,
    //     required: true
    // },
    // serviceCharge: {
    //     type: String,
    //     required: true
    // },
    // looking: {
    //     type: String,
    //     default: 'Family'
    // },
    user: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Property", propertySchema);