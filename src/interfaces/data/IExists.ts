export interface IExists<T> {
    exists(t: T): Promise<boolean>;
}

export default IExists;