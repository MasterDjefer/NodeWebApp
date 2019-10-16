const express = require("express");
const Joi = require("joi");
const bodyParser = require("body-parser");
const route = express.Router();
const UserModel = require("../models/user");

route.use(bodyParser.json());

function passCut(user) {
    const {name, email} = user;
    return { name, email };
}

const userValidationSchema = Joi.object().keys({
    name: Joi.string().min(2).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().required()
});


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

module.exports = route;
