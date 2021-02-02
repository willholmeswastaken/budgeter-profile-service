import { Service } from "typedi";
import { v4 as guid } from "uuid";
import { Logger } from "tslog";
import bcrypt from "bcrypt";

import IBudgetProfileRepository from "../../interfaces/data/IBudgetProfileRepository";
import IRepositoryResult from "../../interfaces/models/IRepositoryResult";
import IBudgetProfileCreationRequestModel from "../../interfaces/models/HttpRequests/IBudgetProfileCreationRequestModel";
import IBudgetProfile from "../../interfaces/models/IBudgetProfile";

import { DynamoRepository } from "../DynamoRepository";
import LogEventNames from "../../models/LogEventNames";
import RepositoryFailureStatus from "../../models/Enums/RepositoryFailureStatus";
import RecordNotFoundException from "../../models/Exceptions/RecordNotFoundException";

@Service()
export class BudgetProfileRepository
  extends DynamoRepository<IBudgetProfile>
  implements IBudgetProfileRepository {
  tableName: string;
  logger: Logger;

  constructor(preventAwsConfigStartup: boolean = false) {
    super(preventAwsConfigStartup);
    this.tableName = "budgeter-user-profile";
    this.logger = new Logger();
  }

  async getById(id: string): Promise<IBudgetProfile> {
    const params = {
      TableName: this.tableName,
      IndexName: "email-index",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: { ":email": id },
    };

    try {
      const data = await (await this.dbClient.query(params).promise()).Items;
      if (data.length > 0) {
        return <IBudgetProfile>data[0];
      }
      this.logger.info(LogEventNames.RecordNotFound, id);
    } catch (err) {
      this.logger.error(LogEventNames.RecordSearchFailure, err);
    }
    throw new RecordNotFoundException(id);
  }

  async create(
    t: IBudgetProfileCreationRequestModel
  ): Promise<IRepositoryResult<IBudgetProfile>> {
    const model: IBudgetProfile = {
      Id: guid(),
      email: t.email,
      password: await bcrypt.hash(
        t.password,
        parseInt(process.env.PASSWORD_SALT_ROUNDS)
      ),
      allocations: t.allocations,
      monthlyIncome: t.monthlyIncome,
    };

    const params = {
      TableName: this.tableName,
      Item: model,
    };

    try {
      await this.dbClient.put(params).promise();
      return {
        result: model,
        error: RepositoryFailureStatus.None,
      };
    } catch (err) {
      this.logger.error(LogEventNames.RecordFailedToSave, err);
      return {
        result: null,
        error: RepositoryFailureStatus.Error,
      };
    }
  }
}
