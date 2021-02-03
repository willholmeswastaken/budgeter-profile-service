import { HttpError } from "routing-controllers";

export class AuthenticationRequestFailureException extends HttpError {
  constructor(innerException: Error) {
    super(400, innerException.message);
  }
}
