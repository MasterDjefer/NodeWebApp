const express = require("express");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const route = express.Router();
const PhoneModel = require("../models/phone");
const phoneValidationSchema = require("../validationSchemas/phone").addPhone;

route.use((req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }

    next();
});

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
                    const { cart } = req.session;
                    const cartItem = cart.find(((element) => {
                        return element.phone.brand === brand && element.phone.model === model;
                    }));

                    if (cartItem) {
                        cartItem.count++;
                    } else {
                        cart.push({ phone: validatedPhone , count: 1} );
                    }
                    res.send("added");
                }
            });
        }
    });
});

route.get("/", (req, res) => {
    res.json(req.session);
});

module.exports = route;
