import { Service } from "typedi";

import { IBudgetProfileService, IBudgetProfileResponse, IBudgetProfileCreationRequestModel, IBudgetProfileUpdateRequestModel } from "../interfaces";
import { BudgetProfileRepository } from "../data";
import {
  RepositoryFailureStatus,
  RecordNotFoundException,
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
        Id,
        email,
        allocations,
        monthlyIncome,
      } = await this.repository.getByEmail(user.email);
      return { Id, email, allocations, monthlyIncome };
    } catch (err) {
      if (!(err instanceof RecordNotFoundException)) {
        throw err;
      }
    }

    const { error, result } = await this.repository.create(user);
    if (error === RepositoryFailureStatus.Error)
      throw new BudgetProfileCreationError();
    return {
      Id: result.Id,
      email: result.email,
      allocations: result.allocations,
      monthlyIncome: result.monthlyIncome,
    };
  }

  async getProfileById(id: string): Promise<IBudgetProfileResponse> {
    return await this.repository.getById(id);
  }

  updateUser(user: IBudgetProfileUpdateRequestModel): Promise<IBudgetProfileResponse> {
    throw new Error("Method not implemented.");
  }
  
  deleteUser(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
};
