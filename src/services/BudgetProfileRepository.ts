import { Service } from "typedi";
import { v4 as guid } from 'uuid';
import { Logger } from "tslog";

import IBudgetProfileRepository from "../interfaces/services/IBudgetProfileRepository";
import IRepositoryResult from '../interfaces/models/IRepositoryResult';
import IBudgetProfileCreationRequestModel from "../interfaces/models/HttpRequests/IBudgetProfileCreationRequestModel";
import IBudgetProfile from "../interfaces/models/IBudgetProfile";

import { DynamoRepository } from "../data/DynamoRepository";
import LogEventNames from '../models/LogEventNames';
import RepositoryFailureStatus from '../models/Enums/RepositoryFailureStatus';

@Service()
export class BudgetProfileRepository extends DynamoRepository<IBudgetProfile> implements IBudgetProfileRepository {
    tableName: string;
    logger: Logger;

    constructor(preventAwsConfigStartup: boolean = false) {
        super(preventAwsConfigStartup);
        this.tableName = 'budgeter-user-profile';
        this.logger = new Logger();
    }

    async getProfileByEmail(email: string): Promise<IBudgetProfile> {
        const params = {
            TableName: this.tableName,
            IndexName: 'email-index',
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: { ':email': email }
        };

        try {
            const data = await (await this.dbClient.query(params).promise()).Items;
            if (data.length > 0) {
                return <IBudgetProfile>data[0];
            }
            this.logger.info(LogEventNames.RecordNotFound, email);
        } catch (err) {
            this.logger.error(LogEventNames.RecordSearchFailure, err)
        }
        return null;
    }
    exists(t: IBudgetProfile): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    delete(t: IBudgetProfile): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getById(id: string): Promise<IBudgetProfile> {
        throw new Error("Method not implemented.");
    }
    update(t: IBudgetProfile): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    async create(t: IBudgetProfileCreationRequestModel): Promise<IRepositoryResult<IBudgetProfile>> {
        const model: IBudgetProfile = {
            Id: guid(),
            email: t.email,
            allocations: t.allocations,
            monthlyIncome: t.monthlyIncome
        };
        
        const params = {
            TableName: this.tableName,
            Item: model
        };

        try {
            await this.dbClient.put(params).promise();
            return {
                result: model,
                error: RepositoryFailureStatus.None
            };
        } catch (err) {
            this.logger.error(LogEventNames.RecordFailedToSave, err);
            return {
                result: null,
                error: RepositoryFailureStatus.Error
            };
        }
    }
}