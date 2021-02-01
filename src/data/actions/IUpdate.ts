import IRepositoryResult from "../../interfaces/models/IRepositoryResult";

export interface IUpdate<T> {
    update(t: any): Promise<IRepositoryResult<T>>;
}

export default IUpdate;