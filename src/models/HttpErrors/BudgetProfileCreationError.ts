import { HttpError } from "routing-controllers";
 
export class BudgetProfileCreationError extends HttpError {
    constructor() {
        super(500, "Internal Server Error creating Budget Profile!");
    }
}