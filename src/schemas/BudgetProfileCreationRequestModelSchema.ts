import Joi from 'joi';

const schema = Joi.object({
    monthlyIncome: Joi.number()
        .required()
        .integer()
        .min(0),

    allocations: Joi.object({
        bills: Joi.number().required().min(0),
        spending: Joi.number().required().min(0),
        savings: Joi.number().required().min(0)
    }).required(),

    email: Joi.string()
        .required()
        .email({ minDomainSegments: 2 })
});

export default schema;