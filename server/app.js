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
app.use(cors());

// config 
dotenv.config({ path: "./config/config.env" });

// user 
const user = require("./router/userRouter");

app.use("/api/v1", user);



app.use(errorMiddleware);
module.exports = app;