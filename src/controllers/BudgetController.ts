import Joi from "joi";
import {
  Body,
  Get,
  JsonController,
  Post,
  Req,
  UseBefore,
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
    const { error } = Joi.string().required().email().validate(user.id);

    if (error !== undefined)
      throw new InvalidRequestDataException("email", error);

    try {
      const profile = await this.budgetProfileService.getProfileByEmail(
        user.id
      );
      return {
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
    const { error } = BudgetProfileSchema.validate(budgetProfileCreationReq);
    if (error !== undefined) throw new JoiValidationError(error);
    return await this.budgetProfileService.createUser(budgetProfileCreationReq);
  }
}

export default BudgetController;
