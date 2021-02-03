import Joi from "joi";
import { Constants } from "../models";

export const AuthRequestSchema = Joi.object({
  email: Joi.string().required().email({ minDomainSegments: 2 }),

  password: Joi.string()
    .regex(new RegExp(Constants.PasswordRegEx))
    .required(),
});

export default AuthRequestSchema;
