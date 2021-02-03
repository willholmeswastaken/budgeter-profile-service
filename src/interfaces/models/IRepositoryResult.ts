import { RepositoryFailureStatus } from "../../models";

export interface IRepositoryResult<T> {
    error: RepositoryFailureStatus;
    result: T;
};

export default IRepositoryResult;