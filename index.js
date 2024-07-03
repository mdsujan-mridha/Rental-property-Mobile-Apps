const dotenv = require("dotenv");
const app = require('./app');
const path = require('path');
const cloudinary = require("cloudinary");
const database = require("./config/dbConnect");
const http = require('http');
const socketIo = require('socket.io');
const { sendMessageViaSocket } = require("./controller/messageController");
const port = process.env.PORT || 5000

// init 
const server = http.createServer(app);
const io = socketIo(server);
// handle uncaught Exception 
process.on("uncaughtException", err => {

    console.log(`Err : ${err.message}`);

    console.log(` Shutting down the customServer due to uncaught Exception `);

    process.exit(1);
});

// config 
dotenv.config({ path: "./config.env" });

// sendFile will go here 
app.get("/", async (req, res) => {

    res.sendFile(path.join(__dirname, '/index.html'));

});
// connect to database
database();
//socket io setup

io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.on('sendMessage', async (messageData) => {
        try {
            const newMessage = await sendMessageViaSocket(messageData);
            io.to(messageData.receiverId).emit('message', newMessage);
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    socket.on('join', (userId) => {
        socket.join(userId);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// config coludinary 
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})

const customServer = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// UnHandle Promise Rejection 
process.on("unhandledRejection", err => {

    console.log(`Err : ${err.message}`);

    console.log(` Shutting down the customServer due to Unhandled Promise Rejection`);

    customServer.close(() => {
        process.exit(1);
    });

});