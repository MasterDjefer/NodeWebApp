const express = require("express");
// const Joi = require("joi");
const route = express.Router();
const Phone = require("../models/phone");


route.get("/", (req, res) => {
    Phone.findAll()
    .then((data) => {
        res.json(data);
    });
});

module.exports = route;
