const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = new mongoose.model("user", new Schema({
    name: String,
    email: String,
    password: String
}, {
    versionKey: false // prevent to create __v field in collection
}));
