const mongoose = require("mongoose");
const error = require("../middleware/error");

const database = (module.exports = () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    try {
        mongoose.set('strictQuery', true);
        mongoose.connect(`mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.huqxi00.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
           
        )
        console.log("Connected to database ✅✅🚀");
    } catch (err) {

        console.log(error);
        console.log("Could not connect to database ❌❌❌")

    }
});

module.exports = database;