import { HttpError } from "routing-controllers";
 
export class BudgetProfileCreationValidationError extends HttpError {
    constructor(error: string) {
        super(400, error);
    }
}