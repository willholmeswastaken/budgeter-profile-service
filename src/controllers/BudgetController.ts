import Joi from "joi";
import {
  Body,
  Get,
  JsonController,
  Post,
  Put,
  Req,
  UseBefore,
  Delete
} from "routing-controllers";
import {
  BudgetProfileNotFoundError,
  JoiValidationError,
  InvalidRequestDataException,
  Context,
} from "../models";
import {
  IBudgetProfileCreationRequestModel,
  IBudgetProfileResponse,
  IBudgetProfileUpdateRequestModel,
} from "../interfaces";
import { BudgetProfileService } from "../services";
import BudgetProfileSchema from "../schemas/BudgetProfileCreationRequestModelSchema";
import { AuthMiddleware } from "../middleware";

@JsonController("/budgetProfile")
class BudgetController {
  constructor(private budgetProfileService: BudgetProfileService) {}

  @Get("/")
  @UseBefore(AuthMiddleware)
  public async index(@Req() req: any): Promise<IBudgetProfileResponse> {
    const { user } = Context.get(req);
    const { error } = Joi.string().required().email().validate(user.email);

    if (error !== undefined)
      throw new InvalidRequestDataException("email", error);

    try {
      const profile = await this.budgetProfileService.getProfileById(
        user.id
      );
      return {
        Id: profile.Id,
        email: profile.email,
        allocations: profile.allocations,
        monthlyIncome: profile.monthlyIncome,
      };
    } catch (err) {
      throw new BudgetProfileNotFoundError();
    }
  }

  @Put("/")
  @UseBefore(AuthMiddleware)
  public async update(@Req() req: any, @Body() updateRequest: IBudgetProfileUpdateRequestModel) : Promise<boolean> {
    const { user } = Context.get(req);
    updateRequest.Id = user.id;
    return await this.budgetProfileService.updateUser(updateRequest);
  }

  @Post("/")
  public async create(
    @Body() budgetProfileCreationReq: IBudgetProfileCreationRequestModel
  ): Promise<IBudgetProfileResponse> {
    const { error } = BudgetProfileSchema.validate(budgetProfileCreationReq);
    if (error !== undefined) throw new JoiValidationError(error);
    return await this.budgetProfileService.createUser(budgetProfileCreationReq);
  }

  @Delete("/")
  public async delete(@Req() req: any) {
    throw new Error('Not implemented.');
  }
}

export default BudgetController;
