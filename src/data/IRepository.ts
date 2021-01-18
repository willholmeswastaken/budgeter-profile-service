import IRepositoryResult from "../interfaces/models/IRepositoryResult";

interface IRepository<T> {
    tableName: string;
    exists(t: T): Promise<boolean>;
    delete(t: T): Promise<any>;
    getById(id: string): Promise<T>;
    create(t: any): Promise<IRepositoryResult<T>>;
    update(t: T): Promise<boolean>;
}

export default IRepository;