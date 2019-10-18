const express = require("express");
const Joi = require("joi");
const route = express.Router();
const UserModel = require("../models/user");
const userValidationSchema = require("../validationSchemas/user").registerUser;

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

route.post("/", (req, res) => {
    Joi.validate(req.body, userValidationSchema, (err, data) => {
        if (err) {
            res.status(400).send("bad user");
        } else {
            UserModel.find({name: data.name}, (err, dataArr) => {
                if (dataArr.length) {
                    res.status(409).send("user already exist!");
                } else {
                    new UserModel(data).save();
                    res.send("user added");
                }
            });
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
