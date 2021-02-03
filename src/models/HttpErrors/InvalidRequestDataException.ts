import Joi from "joi";
import { HttpError } from "routing-controllers";
 
export class InvalidRequestDataException extends HttpError {
    constructor(propName: string, errors: Joi.ValidationError) {
        super(400, `Property ${propName} Failed Validation - ${errors.message}`);
    }
}