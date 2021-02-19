import { HttpError } from "routing-controllers";
 
export class BudgetProfileDeletionError extends HttpError {
    constructor() {
        super(500, "Internal Server Error updating Budget Profile!");
    }
}