import { HttpError } from "routing-controllers";
 
export class InvalidTokenError extends HttpError {
    constructor() {
        super(400, "Invalid token");
    }
};