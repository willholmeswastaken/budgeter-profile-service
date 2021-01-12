import AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import IBaseRepository from "./IBaseRepository";
import awsConfig from '../config/awsConfig';

export class BaseRepository implements IBaseRepository {
    dbClient: DocumentClient;

    constructor() {
        AWS.config.update(awsConfig);
        this.dbClient = new DocumentClient();
    }
}

export default BaseRepository;