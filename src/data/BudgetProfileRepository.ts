import { injectable } from 'inversify';
import { v4 as guid } from 'uuid';

import RecordNotFoundException from '../models/Exceptions/RecordNotFoundException';
import LogEventNames from '../models/LogEventNames';
import { BudgetProfile } from "../models/BudgetProfile";
import { RepositoryResult } from '../models/RepositoryResult';
import { RepositoryFailureStatus } from '../models/Enums/RepositoryFailureStatus';

import { BaseRepository } from "./BaseRepository";
import { IBudgetProfileRepository } from "./IBudgetProfileRepository";

@injectable()
class BudgetProfileRepository extends BaseRepository implements IBudgetProfileRepository {
    tableName: string;

    constructor() {
        super();
        this.tableName = 'budgeter-user-profile';
    }

    async getProfileByEmail(email: string): Promise<BudgetProfile> {
        const params = {
            TableName: this.tableName,
            IndexName: 'email-index',
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: { ':email': email} 
        };

        try {
            var data = await (await this.dbClient.query(params).promise()).Items;
            if(data.length > 0) {
                return <BudgetProfile>data[0];
            } else {
                console.log(LogEventNames.RecordNotFound);
                throw new RecordNotFoundException(email);
            }
        } catch (err) {
            console.error(LogEventNames.RecordSearchFailure, err);
            return null;
        }
    }
    exists(t: BudgetProfile): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    delete(t: BudgetProfile): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getById(id: string): Promise<BudgetProfile> {
        throw new Error("Method not implemented.");
    }
    update(t: BudgetProfile): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    async create(t: BudgetProfile): Promise<RepositoryResult<BudgetProfile>> {
        t.id = guid();
        const params = {
            TableName: this.tableName,
            Item: t
        };
        try {
            var res = await this.dbClient.put(params).promise();
            console.log(JSON.stringify(res));
            return {
                result: t
            } as RepositoryResult<BudgetProfile>;
        } catch (err) {
            console.log('Failed to save', err.message);
            return {
                result: null,
                error: RepositoryFailureStatus.Error
            } as RepositoryResult<BudgetProfile>;
        }
    }
}

export default BudgetProfileRepository;