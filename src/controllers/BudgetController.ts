import { Body, Get, JsonController, OnNull, Post, QueryParam } from "routing-controllers";
import Joi from "joi";

import { BudgetProfileRepository } from '../services';

import RepositoryFailureStatus from '../models/Enums/RepositoryFailureStatus';
import { BudgetProfileNotFoundError, BudgetProfileCreationError, BudgetProfileCreationValidationError } from '../models/HttpErrors';
import IBudgetProfileCreationRequestModel from '../interfaces/models/HttpRequests/IBudgetProfileCreationRequestModel';
import IBudgetProfileResponse from '../interfaces/models/HttpResponses/IBudgetProfileResponse';
import RecordNotFoundException from '../models/Exceptions/RecordNotFoundException';
import { InvalidRequestDataException } from "../models/HttpErrors/InvalidRequestDataException";
import BudgetProfileSchema from "../schemas/BudgetProfileCreationRequestModelSchema";


@JsonController("/budgetProfile")
class BudgetController {
  constructor(private budgetProfileRepository: BudgetProfileRepository) { }

  @Get("/")
  @OnNull(BudgetProfileNotFoundError)
  public async index(@QueryParam('email') incomingEmail: string): Promise<IBudgetProfileResponse> {
    const { error } = await Joi.string().required().email().validateAsync(incomingEmail);
    if(error !== undefined) throw new InvalidRequestDataException('email', error.ValidationError);

    const returnedRecord = await this.budgetProfileRepository.getProfileByEmail(incomingEmail);
    if (returnedRecord === null) return returnedRecord;

    const { email, allocations, monthlyIncome } = returnedRecord;
    return {
      email,
      allocations,
      monthlyIncome
    };
  }

  @Post("/")
  public async create(@Body() budgetProfileCreationReq: IBudgetProfileCreationRequestModel): Promise<IBudgetProfileResponse> {
    const { error } = await BudgetProfileSchema.validateAsync(budgetProfileCreationReq);
    if (error !== undefined) throw new BudgetProfileCreationValidationError(error.ValidationError);

    try {
      const existingRecord = await this.budgetProfileRepository.getProfileByEmail(budgetProfileCreationReq.email);
      if (existingRecord !== null) {
        const { email, allocations, monthlyIncome } = existingRecord;
        return {
          email,
          allocations,
          monthlyIncome
        };
      }
    } catch (e) {
      if (!(e instanceof RecordNotFoundException)) {
        throw e;
      }
    }

    const createResponse = await this.budgetProfileRepository.create(budgetProfileCreationReq);
    if(createResponse.error === RepositoryFailureStatus.Error) throw new BudgetProfileCreationError();
    
    const { email, allocations, monthlyIncome } = createResponse.result;
    return {
      email,
      allocations,
      monthlyIncome
    };
  }
}

export default BudgetController;