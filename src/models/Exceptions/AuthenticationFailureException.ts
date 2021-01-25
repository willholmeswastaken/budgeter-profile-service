class AuthenticationFailureException extends Error {
    public email: string;
    public reason: string;

    constructor(email: string, reason: string) {
        super(`Failed to authenticate user: ${email}`);
        this.name = 'FailedToAuthenticateUserException';
        this.reason = reason;
    }
}

export default AuthenticationFailureException;