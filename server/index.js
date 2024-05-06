const dotenv = require("dotenv");
const app = require('./app');
const path = require('path');
const cloudinary = require("cloudinary");
const port = process.env.PORT || 5000

// handle uncaught Exception 
process.on("uncaughtException", err => {

    console.log(`Err : ${err.message}`);

    console.log(` Shutting down the server due to uncaught Exception `);

    process.exit(1);
});

// config 
dotenv.config({ path: "./config.env" });

// sendFile will go here 
app.get("/", async (req, res) => {

    res.sendFile(path.join(__dirname, '/index.html'));

});

// config coludinary 
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})

const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// UnHandle Promise Rejection 
process.on("unhandledRejection", err => {

    console.log(`Err : ${err.message}`);

    console.log(` Shutting down the server due to Unhandled Promise Rejection`);

    server.close(() => {
        process.exit(1);
    });

});