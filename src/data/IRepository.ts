import RepositoryResult from "../models/RepositoryResult";

interface IRepository<T> {
    tableName: string;
    exists(t: T): Promise<boolean>;
    delete(t: T): Promise<any>;
    getById(id: string): Promise<T>;
    create(t: T): Promise<RepositoryResult<T>>;
    update(t: T): Promise<boolean>;
}

export default IRepository;