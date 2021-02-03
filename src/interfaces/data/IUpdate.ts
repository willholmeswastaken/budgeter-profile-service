import IRepositoryResult from "../models/IRepositoryResult";

export interface IUpdate<T> {
    update(t: any): Promise<IRepositoryResult<T>>;
}

export default IUpdate;