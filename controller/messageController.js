
const catchAsyncsErrors = require("../middleware/catchAsyncsErrors");
const Message = require("../model/messageModel");
const User = require("../model/userModel");
const sendEmail = require("../utils/sendEmail");
const Property = require("../model/propertyModel");

// gel all message 
exports.getAllMessage = catchAsyncsErrors(async (req, res, next) => {
    try {
        const message = await Message.find({
            $or: [{ senderId: req.params.userId }, { receiverId: req.params.userId }]
        }).populate('senderId receiverId propertyId');
        res.json(message)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
// send message 
exports.sendMessage = catchAsyncsErrors(async (req, res, next) => {

    const message = new Message({
        senderId: req.body.senderId,
        receiverId: req.body.receiverId,
        propertyId: req.body.propertyId,
        message: req.body.message,
    });
    try {
        const newMessage = await message.save();
        const landlord = await User.findById(req.body.receiverId);
        const property = await Property.findById(req.body.propertyId);
        if (landlord) {
            await sendEmail({
                email: landlord.email,
                subject: "New Message Regarding Your Property",
                text: `${req.body.message} \n\n Your Property: \n\n:  ${property}`
            })
        }
        res.status(201).json(newMessage)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Function to handle sending messages via WebSocket
exports.sendMessageViaSocket = async (messageData) => {
    const message = new Message({
        senderId: messageData.senderId,
        receiverId: messageData.receiverId,
        propertyId: messageData.propertyId,
        message: messageData.message,
    });
    const newMessage = await message.save();

    const landlord = await User.findById(messageData.receiverId);
    if (landlord) {
        await sendEmail({
            email: landlord.email,
            subject: "New Message Regarding Your Property",
            message: `You have a new message from ${messageData.message} regarding your property`
        });
    }

    return newMessage;
};