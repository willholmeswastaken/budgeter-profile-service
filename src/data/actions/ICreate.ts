import IRepositoryResult from "../../interfaces/models/IRepositoryResult";

export interface ICreate<T> {
    create(t: any): Promise<IRepositoryResult<T>>;
}

export default ICreate;