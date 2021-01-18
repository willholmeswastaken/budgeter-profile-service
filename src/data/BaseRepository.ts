import AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import awsConfig from '../config/awsConfig';
import IRepository from "./IRepository";
import IRepositoryResult from "../interfaces/models/IRepositoryResult";

export abstract class BaseRepository<T> implements IRepository<T> {
    dbClient: DocumentClient;

    constructor() {
        AWS.config.update(awsConfig);
        this.dbClient = new DocumentClient();
    }

    abstract tableName: string;
    abstract exists(t: T): Promise<boolean>;
    abstract delete(t: T): Promise<any>;
    abstract getById(id: string): Promise<T>;
    abstract create(t: any): Promise<IRepositoryResult<T>>;
    abstract update(t: T): Promise<boolean>;
}

export default BaseRepository;