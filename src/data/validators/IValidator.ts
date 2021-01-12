interface IValidator<T> {
    isValid(source: T): boolean;
}

export default IValidator;