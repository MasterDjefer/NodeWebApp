const Joi = require("joi");

module.exports.loginUser = Joi.object().keys({
    name: Joi.string().min(2).required(),
    password: Joi.string().required()
});

module.exports.registerUser = Joi.object().keys({
    name: Joi.string().min(2).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().required()
});
