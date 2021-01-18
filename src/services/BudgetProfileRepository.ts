import { Service } from "typedi";
import { v4 as guid } from 'uuid';
import IBudgetProfileRepository from "../interfaces/services/IBudgetProfileRepository";

import { DynamoRepository } from "../data/DynamoRepository";

import RecordNotFoundException from '../models/Exceptions/RecordNotFoundException';
import LogEventNames from '../models/LogEventNames';
import IBudgetProfile from "../interfaces/models/IBudgetProfile";
import IRepositoryResult from '../interfaces/models/IRepositoryResult';
import RepositoryFailureStatus from '../models/Enums/RepositoryFailureStatus';
import IBudgetProfileCreationRequestModel from "../interfaces/models/HttpRequests/IBudgetProfileCreationRequestModel";

@Service()
export class BudgetProfileRepository extends DynamoRepository<IBudgetProfile> implements IBudgetProfileRepository {
    tableName: string;

    constructor() {
        super();
        this.tableName = 'budgeter-user-profile';
    }

    async getProfileByEmail(email: string): Promise<IBudgetProfile> {
        const params = {
            TableName: this.tableName,
            IndexName: 'email-index',
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: { ':email': email} 
        };

        try {
            const data = await (await this.dbClient.query(params).promise()).Items;
            if(data.length > 0) {
                return <IBudgetProfile>data[0];
            } else {
                console.log(LogEventNames.RecordNotFound);
                throw new RecordNotFoundException(email);
            }
        } catch (err) {
            console.error(LogEventNames.RecordSearchFailure, err);
            return null;
        }
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
            return {
                result: null,
                error: RepositoryFailureStatus.Error
            };
        }
    }
}