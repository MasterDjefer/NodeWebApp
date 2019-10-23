const express = require("express");
const route = express.Router();
const UserModel = require("../models/user");

function passCut(user) {
    const {name, email} = user;
    return { name, email };
}


route.get("/:name", (req, res) => {
    const { name } = req.params;
    UserModel.find({ name }, (err, data) => {
        if (data.length) {
            res.json(passCut(data[0]));
        } else {
            res.status(404).send(`can\'t find user ${name}!`);
        }
    });
});

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
