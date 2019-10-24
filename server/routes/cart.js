const express = require("express");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const route = express.Router();
const PhoneModel = require("../models/phone");
const CartModel = require("../models/cart");
const phoneValidationSchema = require("../validationSchemas/phone").addPhone;


route.post("/", (req, res) => {
    const { brand, model } = req.body;
    const phone = { brand, model };

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
                if (!data.length) {
                    res.status("404").send("such phone doesnt exist!");
                } else {
                    new CartModel(req.session.cart).add(phone);
                    res.send("added");
                }
            });
        }
    });
});

route.get("/", (req, res) => {
    res.send(new CartModel(req.session.cart).formatCart());
});

module.exports = route;
