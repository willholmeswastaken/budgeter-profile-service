import {
  Body,
  Get,
  JsonController,
  Post,
  QueryParam,
} from "routing-controllers";
import Joi from "joi";

import {
  BudgetProfileNotFoundError,
  BudgetProfileCreationValidationError,
} from "../models/HttpErrors";
import IBudgetProfileCreationRequestModel from "../interfaces/models/HttpRequests/IBudgetProfileCreationRequestModel";
import IBudgetProfileResponse from "../interfaces/models/IBudgetProfileResponse";
import { InvalidRequestDataException } from "../models/HttpErrors/InvalidRequestDataException";
import BudgetProfileSchema from "../schemas/BudgetProfileCreationRequestModelSchema";
import { BudgetProfileService } from "../services";

@JsonController("/budgetProfile")
class BudgetController {
  constructor(private budgetProfileService: BudgetProfileService) {}

  @Get("/")
  public async index(
    @QueryParam("email") incomingEmail: string
  ): Promise<IBudgetProfileResponse> {
    const { error } = await Joi.string()
      .required()
      .email()
      .validateAsync(incomingEmail);

    if (error !== undefined)
      throw new InvalidRequestDataException("email", error.ValidationError);

    try {
      return await this.budgetProfileService.getProfileByEmail(incomingEmail);
    } catch (err) {
      throw new BudgetProfileNotFoundError();
    }
  }

  //todo: write endpoint to authenticate

  @Post("/")
  public async create(
    @Body() budgetProfileCreationReq: IBudgetProfileCreationRequestModel
  ): Promise<IBudgetProfileResponse> {
    const { error } = await BudgetProfileSchema.validateAsync(
      budgetProfileCreationReq
    );
    if (error !== undefined)
      throw new BudgetProfileCreationValidationError(error.ValidationError);
    return await this.budgetProfileService.createUser(budgetProfileCreationReq);
  }
}

export default BudgetController;
