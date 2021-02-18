import { IRepositoryResult } from "../models";

export interface IDelete<T> {
    delete(t: any): Promise<IRepositoryResult<T>>;
}

export default IDelete;