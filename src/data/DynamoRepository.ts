import AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import AWSConfig from '../config/AWSConfig';
import IRepository from "./IRepository";
import IRepositoryResult from "../interfaces/models/IRepositoryResult";

export abstract class DynamoRepository<T> implements IRepository<T> {
    dbClient: DocumentClient;

    constructor(preventAwsConfigStartup: boolean) {
        if(!preventAwsConfigStartup) AWS.config.update(AWSConfig);
        this.dbClient = new DocumentClient();
    }

    abstract tableName: string;
}

export default DynamoRepository;