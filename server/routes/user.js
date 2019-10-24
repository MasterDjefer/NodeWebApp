const express = require("express");
const route = express.Router();
const UserModel = require("../models/user");


route.get("/", (req, res) => {
    UserModel.find({}, (err, data) => {
        if (err) {
            res.status(500).send("cant find users");
        } else {
            res.json(data);
        }
    });
});

module.exports = route;
