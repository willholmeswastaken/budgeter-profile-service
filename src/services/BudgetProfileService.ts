import { Service } from "typedi";
import bcrypt from "bcrypt";

import { IBudgetProfileService, IBudgetProfileResponse, IBudgetProfileCreationRequestModel } from "../interfaces";
import { BudgetProfileRepository } from "../data";
import {
  RepositoryFailureStatus,
  RecordNotFoundException,
  AuthenticationFailureException,
  BudgetProfileCreationError
} from "../models";

@Service()
export class BudgetProfileService implements IBudgetProfileService {
  constructor(private repository: BudgetProfileRepository) {}

  async createUser(
    user: IBudgetProfileCreationRequestModel
  ): Promise<IBudgetProfileResponse> {
    try {
      const {
        email,
        allocations,
        monthlyIncome,
      } = await this.repository.getById(user.email);
      return { email, allocations, monthlyIncome };
    } catch (err) {
      if (!(err instanceof RecordNotFoundException)) {
        throw err;
      }
    }

    const { error, result } = await this.repository.create(user);
    if (error === RepositoryFailureStatus.Error)
      throw new BudgetProfileCreationError();
    return {
      email: result.email,
      allocations: result.allocations,
      monthlyIncome: result.monthlyIncome,
    };
  }

  async getProfileByEmail(email: string): Promise<IBudgetProfileResponse> {
    return await this.repository.getById(email);
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
