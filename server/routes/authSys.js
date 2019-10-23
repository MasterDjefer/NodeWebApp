const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcrypt");
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
                        bcrypt.compare(user.password, foundUser.password, function(err, result) {
                            if (err) {
                                result.status(500).send(`bcrypt error`);
                            } else {
                                if (result) {
                                    const token = jwt.sign({ name }, process.env.SECRET, {
                                        expiresIn: '1h'
                                    });
                                    res.json({ message: "token created", token });
                                } else {
                                    res.status(403).send(`invalid password`);
                                }
                            }
                        });
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
    Joi.validate(user, userValidationSchemaRegister, (err, validatedUser) => {
        if (err) {
            res.status(400).send("bad user");
        } else {
            UserModel.findOne({name: user.name}, (err, data) => {
                console.log
                if (err) {
                    res.status(500).send("db error");
                } else {
                    if (data) {
                        res.status(403).send("user already exist");
                    } else {
                        bcrypt.hash(user.password, 10, (err, hashedPassword) => { // 10- salt rounds
                            if (err) {
                                res.status(500).send("cant hash password");
                            }
                            new UserModel({
                                name: user.name,
                                email: user.email,
                                password: hashedPassword }).save();
                            res.send("user added");
                        });
                    }
                }
            });
        }
    });
});

route.get("/home", (req, res) => {

});

module.exports = route;
