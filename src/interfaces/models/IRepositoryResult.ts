import RepositoryFailureStatus from "../../models/Enums/RepositoryFailureStatus";

interface IRepositoryResult<T> {
    error: RepositoryFailureStatus;
    result: T;
};

export default IRepositoryResult;