import { HttpError } from "routing-controllers";
 
export class InvalidRequestDataException extends HttpError {
    constructor(propName: string, error: string) {
        super(400, `Property ${propName} Failed Validation - ${error}`);
    }
}