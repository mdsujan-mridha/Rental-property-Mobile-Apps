const express = require('express');
const app = express();

const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(
    {
        "origin": "*",
        "preflightContinue": false,
        "optionsSuccessStatus": 200
    }
))
app.options('*', cors()) // include before other routes
// config 
dotenv.config({ path: "./config/config.env" });
// user 
const user = require("./router/userRouter");
// property 
const property = require("./router/propertyRouter");
const message = require("./router/messageRouter");

app.use("/api/v1", user);
app.use("/api/v1", property);
app.use("/api/v1", message);



app.use(errorMiddleware);
module.exports = app;