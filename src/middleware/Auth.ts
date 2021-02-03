import jwt from "jsonwebtoken";
import {
  Context,
  IContextUser,
  InvalidTokenError,
  NoTokenProvidedError,
} from "../models";
import { ExpressMiddlewareInterface } from "routing-controllers";

export class AuthMiddleware implements ExpressMiddlewareInterface {
  use(req: any, res: any, next?: (err?: any) => any): any {
    const token = req.headers["x-access-token"] || req.headers["authorization"];
    if (!token) throw new NoTokenProvidedError();
    try {
      const ctx: Context = Context.get(req);
      const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      ctx.user = decoded as IContextUser;
      next();
    } catch (ex) {
      throw new InvalidTokenError();
    }
  }
}
