import Joi from "joi";

export const BudgetProfileUpdateRequestModelSchema = Joi.object({
  monthlyIncome: Joi.number().required().integer().min(0),

  allocations: Joi.object({
    bills: Joi.number().required().min(0),
    spending: Joi.number().required().min(0),
    savings: Joi.number().required().min(0),
  }).required()
});

export default BudgetProfileUpdateRequestModelSchema;
