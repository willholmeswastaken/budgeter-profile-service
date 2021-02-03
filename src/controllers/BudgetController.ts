import Joi from "joi";
import {
  Body,
  Get,
  JsonController,
  Post,
  QueryParam,
} from "routing-controllers";
import {
  BudgetProfileNotFoundError,
  BudgetProfileCreationValidationError,
  InvalidRequestDataException,
} from "../models";
import { IBudgetProfileCreationRequestModel, IBudgetProfileResponse } from "../interfaces";
import { BudgetProfileService } from "../services";
import BudgetProfileSchema from "../schemas/BudgetProfileCreationRequestModelSchema";

@JsonController("/budgetProfile")
class BudgetController {
  constructor(private budgetProfileService: BudgetProfileService) {}

  @Get("/")
  public async index(
    @QueryParam("email") incomingEmail: string
  ): Promise<IBudgetProfileResponse> {
    const { error } = Joi.string()
      .required()
      .email()
      .validate(incomingEmail);

    if (error !== undefined)
      throw new InvalidRequestDataException("email", error);

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
    const { error } = BudgetProfileSchema.validate(
      budgetProfileCreationReq
    );
    if (error !== undefined)
      throw new BudgetProfileCreationValidationError(error);
    return await this.budgetProfileService.createUser(budgetProfileCreationReq);
  }
}

export default BudgetController;
