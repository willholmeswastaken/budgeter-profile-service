import { Service } from "typedi";
import bcrypt from "bcrypt";

import IBudgetProfileService from "../interfaces/services/IBudgetProfileService";
import IBudgetProfileResponse from "../interfaces/models/IBudgetProfileResponse";
import { BudgetProfileRepository } from "../data/repositories";
import AuthenticationFailureException from "../models/Exceptions/AuthenticationFailureException";
import IBudgetProfileCreationRequestModel from "../interfaces/models/HttpRequests/IBudgetProfileCreationRequestModel";
import RepositoryFailureStatus from "../models/Enums/RepositoryFailureStatus";
import { BudgetProfileCreationError } from "../models/HttpErrors";
import RecordNotFoundException from "../models/Exceptions/RecordNotFoundException";

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
    if (error === RepositoryFailureStatus.Error) throw new BudgetProfileCreationError();
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
