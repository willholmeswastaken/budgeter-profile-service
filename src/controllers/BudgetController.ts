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
import { AuthMiddleware } from "../middleware";
import { BudgetProfileCreationRequestModelSchema, BudgetProfileUpdateRequestModelSchema } from "../schemas";

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

  @Post("/")
  public async create(
    @Body() budgetProfileCreationReq: IBudgetProfileCreationRequestModel
  ): Promise<IBudgetProfileResponse> {
    const { error } = BudgetProfileCreationRequestModelSchema.validate(budgetProfileCreationReq);
    if (error !== undefined) throw new JoiValidationError(error);
    return await this.budgetProfileService.createUser(budgetProfileCreationReq);
  }

  @Put("/")
  @UseBefore(AuthMiddleware)
  public async update(@Req() req: any, @Body() updateRequest: IBudgetProfileUpdateRequestModel) : Promise<boolean> {
    const { error } = BudgetProfileUpdateRequestModelSchema.validate(updateRequest);
    if (error !== undefined) throw new JoiValidationError(error);
    
    const { user } = Context.get(req);
    updateRequest.Id = user.id;

    return await this.budgetProfileService.updateUser(updateRequest);
  }

  @Delete("/")
  @UseBefore(AuthMiddleware)
  public async delete(@Req() req: any) {
    const { user } = Context.get(req);
    return await this.budgetProfileService.deleteUser(user.id);
  }
}

export default BudgetController;
