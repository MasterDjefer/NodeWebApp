const express = require("express");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const route = express.Router();
const PhoneModel = require("../models/phone");
const phoneValidationSchema = require("../validationSchemas/phone").phone;


route.get("/", (req, res) => {
    PhoneModel.findAll()
    .then((data) => {
        res.json(data);
    });
});

route.post("/", (req, res) => {
    const { brand, model, price } = req.body;
    const phone = { brand, model, price };
    const [ authType, token ] = req.headers.authorization.split(" ");
    if (authType !== "Bearer") {
        return res.send("auth error");
    }

    jwt.verify(token, process.env.SECRET, (err, data) => {
        if (err) {
            res.status(403).send("auth error");
        } else {
            Joi.validate(phone, phoneValidationSchema, (err, validatedPhone) => {
                if (err) {
                    res.status(403).send("phone obj error");
                } else {
                    PhoneModel.findAll({
                        where: {
                            brand,
                            model
                        }
                    })
                    .then((data) => {
                        if (data.length) {
                            res.status("403").send("such phone already exist!");
                        } else{
                            PhoneModel.create(phone)
                            .then(data => {
                                if (data) {
                                    res.send(data);
                                } else {
                                    res.status(500).send("error insert");
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

module.exports = route;
