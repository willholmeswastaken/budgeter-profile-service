import { HttpError } from "routing-controllers";
 
export class BudgetProfileNotFoundError extends HttpError {
    constructor() {
        super(404, "Budget profile not found!");
    }
}