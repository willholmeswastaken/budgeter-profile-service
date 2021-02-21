import { Service } from "typedi";
import { v4 as guid } from "uuid";
import { Logger } from "tslog";
import bcrypt from "bcrypt";
import { DynamoRepository } from "../DynamoRepository";
import {
  IBudgetProfileRepository,
  IRepositoryResult,
  IBudgetProfileCreationRequestModel,
  IBudgetProfile,
  IBudgetProfileUpdateRequestModel,
} from "../../interfaces";
import {
  RepositoryFailureStatus,
  RecordNotFoundException,
  LogEventNames,
} from "../../models";

@Service()
export class BudgetProfileRepository
  extends DynamoRepository
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
      IndexName: "Id-index",
      KeyConditionExpression: "Id = :id",
      ExpressionAttributeValues: { ":id": id },
    };

    try {
      this.logger.info(LogEventNames.RepositoryActions.Reading);
      const data = await (await this.dbClient.query(params).promise()).Items;
      if (data.length > 0) {
        return <IBudgetProfile>data[0];
      }
      this.logger.error(LogEventNames.RecordNotFound, id);
    } catch (err) {
      this.logger.error(LogEventNames.RecordSearchFailure, err);
    }
    throw new RecordNotFoundException(id);
  }

  async getByEmail(email: string): Promise<IBudgetProfile> {
    const params = {
      TableName: this.tableName,
      IndexName: "email-index",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: { ":email": email },
    };

    try {
      this.logger.info(LogEventNames.RepositoryActions.Reading);
      const data = await (await this.dbClient.query(params).promise()).Items;
      if (data.length > 0) {
        return <IBudgetProfile>data[0];
      }
      this.logger.error(LogEventNames.RecordNotFound, email);
    } catch (err) {
      this.logger.error(LogEventNames.RecordSearchFailure, err);
    }
    throw new RecordNotFoundException(email);
  }

  async update(t: IBudgetProfileUpdateRequestModel): Promise<IRepositoryResult<boolean>> {
    const params = {
      TableName: this.tableName,
      Key: {
        "Id": t.Id
      },
      UpdateExpression: 'set monthlyIncome = :m, allocations = :a',
      ExpressionAttributeValues: {
        ":m": t.monthlyIncome,
        ":a": t.allocations
      },
      ReturnValues: "UPDATED_NEW"
    };
    try {
      this.logger.info(LogEventNames.RepositoryActions.Updating);
      await this.dbClient.update(params).promise();
      return {
        error: RepositoryFailureStatus.None,
        result: true
      };
    } catch (err) {
      this.logger.error(LogEventNames.RecordFailedToUpdate, err);
      return {
        error: RepositoryFailureStatus.Error,
        result: false
      };
    }
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
      this.logger.info(LogEventNames.RepositoryActions.Creating);
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

  async delete(t: string): Promise<IRepositoryResult<boolean>>
   {
    this.logger.info(t);
    const params = {
      TableName: this.tableName,
      Key: {
        "Id": t
      },
    };
    try {
      this.logger.info(LogEventNames.RepositoryActions.Deleting);
      await this.dbClient.delete(params).promise();
      return {
        error: RepositoryFailureStatus.None,
        result: true
      };
    } catch (err) {
      this.logger.error(LogEventNames.RecordFailedToDelete, err);
      return {
        error: RepositoryFailureStatus.Error,
        result: false
      };
    }
  }
}
