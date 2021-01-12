import { HttpError } from "routing-controllers";
 
export class BudgetProfileCreationValidationError extends HttpError {
    constructor() {
        super(400, "Validation error creating Budget Profile!");
    }
}