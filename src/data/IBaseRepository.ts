import { DocumentClient } from "aws-sdk/clients/dynamodb";

interface IBaseRepository {
    dbClient: DocumentClient;
}

export default IBaseRepository;