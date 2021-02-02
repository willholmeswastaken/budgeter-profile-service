export interface IGetById<T> {
    getById(id: string): Promise<T>;
}

export default IGetById;