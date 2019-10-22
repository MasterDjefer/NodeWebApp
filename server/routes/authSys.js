const express = require("express");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const route = express.Router();
const UserModel = require("../models/user");
const userValidationSchemaLogin = require("../validationSchemas/user").loginUser;
const userValidationSchemaRegister = require("../validationSchemas/user").registerUser;


route.post("/test", (req, res) => {
    const { token } = req.body;
    jwt.verify(token, process.env.SECRET, (err, data) => {
        if (err) {
            res.status(403).send("auth error");
        } else {
            UserModel.findOne({ name: data.name }, (err, user) => {
                if (err) {
                    res.status(404).send("user not found!");
                } else {
                    res.json(user);
                }
            });
        }
    });
});

route.post("/login", (req, res) => {
    const user = req.body;
    Joi.validate(user, userValidationSchemaLogin, (err, validatedUser) => {
        if (err) {
            res.status(400).send("user data error");
        } else {
            const { name } = user;
            UserModel.findOne({ name }, (err, foundUser) => {
                if (err) {
                    res.status(500).send(`server error`);
                } else {
                    if (foundUser) {
                        const token = jwt.sign({ name }, process.env.SECRET, {
                            expiresIn: '1h'
                        });
                        res.json({ message: "token created", token });
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
