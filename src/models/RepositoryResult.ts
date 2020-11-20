import { RepositoryFailureStatus } from "./Enums/RepositoryFailureStatus";

interface RepositoryResult<T> {
    error: RepositoryFailureStatus;
    result: T;
};

export default RepositoryResult;