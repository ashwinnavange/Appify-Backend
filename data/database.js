let mongoose = require("mongoose");
const DB = process.env.MONGO_URL;

module.exports = connectDB = () => {
    mongoose.connect(DB).then(() => {
        console.log("Connected to DB")
    }).catch((err) => {
        console.log(err)
    });
}