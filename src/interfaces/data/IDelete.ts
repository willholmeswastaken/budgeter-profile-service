export interface IDelete<T> {
    delete(t: any): Promise<any>;
}

export default IDelete;