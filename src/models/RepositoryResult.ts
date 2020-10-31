import { RepositoryFailureStatus } from "./Enums/RepositoryFailureStatus";

export interface RepositoryResult<T> {
    error: RepositoryFailureStatus;
    result: T;
};