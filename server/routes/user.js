const express = require("express");
const Joi = require("joi");
const bodyParser = require("body-parser");
const route = express.Router();
const UserModel = require("../models/user");

route.use(bodyParser.json());

const userValidationSchema = Joi.object().keys({
    name: Joi.string().min(2).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().required()
});


route.get("/", (req, res) => {
    res.send("test /user");
});

route.post("/", (req, res) => {
    Joi.validate(req.body, userValidationSchema, (err, data) => {
        if (err) {
            res.status(400).send("bad user");
        } else {
            new UserModel(data).save();
        }
    });

    res.send("posst");
});

module.exports = route;
