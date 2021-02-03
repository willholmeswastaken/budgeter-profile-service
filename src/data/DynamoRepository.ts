import AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import AWSConfig from '../config/AWSConfig';

export abstract class DynamoRepository {
    dbClient: DocumentClient;

    constructor(preventAwsConfigStartup: boolean) {
        if(!preventAwsConfigStartup) AWS.config.update(AWSConfig);
        this.dbClient = new DocumentClient();
    }

    abstract tableName: string;
}

export default DynamoRepository;