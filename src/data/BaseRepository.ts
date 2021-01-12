import AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { IBaseRepository } from "./IBaseRepository";
import awsConfig from '../config/aws-config.json';

export class BaseRepository implements IBaseRepository {
    dbClient: DocumentClient;

    constructor() {
        AWS.config.update(awsConfig);
        this.dbClient = new DocumentClient();
    }
}