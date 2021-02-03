import Joi from "joi";
import { HttpError } from "routing-controllers";
 
export class BudgetProfileCreationValidationError extends HttpError {
    constructor(errors: Joi.ValidationError) {
        super(400, errors.message);
    }
}