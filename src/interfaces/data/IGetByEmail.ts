export interface IGetByEmail<T> {
    getByEmail(email: string): Promise<T>;
}

export default IGetByEmail;