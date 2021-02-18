import { HttpError } from "routing-controllers";
 
export class BudgetProfileUpdateError extends HttpError {
    constructor() {
        super(500, "Internal Server Error updating Budget Profile!");
    }
}