const express = require("express");
const Joi = require("joi");
const bodyParser = require("body-parser");
const route = express.Router();
const UserModel = require("../models/user");
const userValidationSchemaLogin = require("../validationSchemas/user").loginUser;
const userValidationSchemaRegister = require("../validationSchemas/user").registerUser;


route.post("/login", (req, res) => {
    const user = req.body;
    Joi.validate(user, userValidationSchemaLogin, (err, validatedUser) => {
        if (err) {
            res.status(400).send("user data error");
        } else {
            UserModel.findOne({ name: user.name }, (err, foundUser) => {
                if (err) {
                    res.status(500).send(`server error`);
                } else {
                    if (foundUser) {
                        res.send("session created ");
                    } else {
                        res.status(404).send(`can\'t find user ${user.name}!`);
                    }
                }
            });
        }
    });
});

route.get("/logout", (req, res) => {
    res.send("session destroyed");
});

route.post("/register", (req, res) => {
    const user = req.body;
    Joi.validate(user, userValidationSchemaRegister, (err, data) => {
        if (err) {
            res.status(400).send("bad user");
        } else {
            UserModel.findOne({name: data.name}, (err, userData) => {
                if (err) {
                    res.status(500).send("server error");
                } else {
                    if (userData) {
                        res.status(409).send("user already exist!");
                    } else {
                        new UserModel(user).save();
                        res.send("user added");
                    }
                }
            });
        }
    });
});

route.get("/home", (req, res) => {

});

module.exports = route;
