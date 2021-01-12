import { Body, Get, JsonController, OnNull, Post, QueryParam} from "routing-controllers";
import RepositoryFailureStatus from '../models/Enums/RepositoryFailureStatus';
import { BudgetProfileRepository } from '../services';
import { BudgetProfileNotFoundError, BudgetProfileCreationError, BudgetProfileCreationValidationError } from '../models/HttpErrors';
import BudgetProfileCreationRequestModel from '../models/HttpRequests/BudgetProfileCreationRequestModel';
import BudgetProfileResponse from '../models/HttpResponses/BudgetProfileResponse';
import RecordNotFoundException from '../models/Exceptions/RecordNotFoundException';
import BudgetProfileValidator from "../services/BudgetProfileValidator";


@JsonController()
class BudgetController {
  constructor(private budgetProfileRepository: BudgetProfileRepository, private budgetProfileValidator: BudgetProfileValidator) {}

  @Get("/budgetProfile")
  @OnNull(BudgetProfileNotFoundError)
  public async index(@QueryParam('email') email: string) {
    return await this.budgetProfileRepository.getProfileByEmail(email);
  }

  @Post("/budgetProfile")
  public async create(@Body() budgetProfileCreationReq: BudgetProfileCreationRequestModel) {
    if(!this.budgetProfileValidator.isValid(budgetProfileCreationReq)) throw new BudgetProfileCreationValidationError();
    try {
      const existingRecord = await this.budgetProfileRepository.getProfileByEmail(budgetProfileCreationReq.email);
      if (existingRecord !== null) {
        return {
          email: existingRecord.email,
          allocations: existingRecord.allocations,
          monthlyIncome: existingRecord.monthlyIncome
        } as BudgetProfileResponse;
      }
    } catch (e) {
      if (!(e instanceof RecordNotFoundException)) {
        throw e;
      }
    }
    const createResponse = await this.budgetProfileRepository.create(budgetProfileCreationReq);
    switch (createResponse.error) {
      case RepositoryFailureStatus.Validation:
        throw new BudgetProfileCreationValidationError();
      case RepositoryFailureStatus.Error:
        throw new BudgetProfileCreationError();
      default:
        break;
    }
    return {
      email: createResponse.result.email,
      allocations: createResponse.result.allocations,
      monthlyIncome: createResponse.result.monthlyIncome
    } as BudgetProfileResponse;
  }
}

export default BudgetController;