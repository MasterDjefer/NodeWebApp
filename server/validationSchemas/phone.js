const Joi = require("joi");

module.exports.phone = Joi.object().keys({
    brand: Joi.string().required(),
    model: Joi.string().required(),
    price: Joi.number().required()
});
