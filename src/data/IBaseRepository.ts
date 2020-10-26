import { DocumentClient } from "aws-sdk/clients/dynamodb";

export interface IBaseRepository {
    dbClient: DocumentClient;
}