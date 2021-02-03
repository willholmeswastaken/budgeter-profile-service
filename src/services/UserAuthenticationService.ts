import jwt from "jsonwebtoken";
import { Service } from "typedi";
import bcrypt from "bcrypt";
import { AuthenticationFailureException } from "../models";
import {
  IBudgetProfileResponse,
  IUserAuthenticationService,
} from "../interfaces";
import { BudgetProfileRepository } from "../data";

@Service()
export class UserAuthenticationService implements IUserAuthenticationService {
  constructor(private repository: BudgetProfileRepository) {}

  generateAuthToken(id: string): string {
    return jwt.sign({ id }, process.env.JWT_PRIVATE_KEY, {
        expiresIn: `${process.env.JWT_EXPIRES_IN}s`
    });
  }

  async authenticateUser(
    email: string,
    password: string
  ): Promise<IBudgetProfileResponse> {
    const user = await this.repository.getById(email);
    if (await bcrypt.compare(password, user.password)) return user;
    throw new AuthenticationFailureException(email, "Invalid password!");
  }
}
