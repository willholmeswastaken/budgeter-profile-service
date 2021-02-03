import Joi from "joi";
import { Constants } from "../models";

export const BudgetProfileCreationRequestModelSchema = Joi.object({
  monthlyIncome: Joi.number().required().integer().min(0),

  allocations: Joi.object({
    bills: Joi.number().required().min(0),
    spending: Joi.number().required().min(0),
    savings: Joi.number().required().min(0),
  }).required(),

  email: Joi.string().required().email({ minDomainSegments: 2 }),

  password: Joi.string()
    .regex(new RegExp(Constants.PasswordRegEx))
    .required(),
});

export default BudgetProfileCreationRequestModelSchema;
