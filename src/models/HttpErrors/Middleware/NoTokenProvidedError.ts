import { HttpError } from "routing-controllers";
 
export class NoTokenProvidedError extends HttpError {
    constructor() {
        super(401, "Access denied. No token provided.");
    }
};