import { IAuthRequest } from '../../src/interfaces';
import { AuthRequestSchema } from '../../src/schemas';

describe('AuthRequestSchema tests', () => {
    const setupTestData = (propOverrides: any = {}): IAuthRequest => ({
        email: 'will@willholmes.dev',
        password: 'Password123!',
        ...propOverrides
    });

    it('returns no errors on valid object', () => {
        const data = setupTestData();
        const { error } = AuthRequestSchema.validate(data);
        expect(error).toBeUndefined();
    });

    describe('email', () => {
        describe.each([
            [null, 'must be a string'],
            ['', 'is not allowed to be empty'],
            ['willholmes', 'must be a valid email']
        ])('when email is = %s', (val, validationErr) => {
            it('returns an error', () => {
                const data = setupTestData({ email: val });
                const { error } = AuthRequestSchema.validate(data);
                expect(error.details[0].message).toEqual(`"email" ${validationErr}`);
            });
        });
    });

    describe('password', () => {
        describe.each([
            [null, 'must be a string'],
            ['', 'is not allowed to be empty'],
            ['willholmes', 'with value \"willholmes\" fails to match the required pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/']
        ])('when email is = %s', (val, validationErr) => {
            it('returns an error', () => {
                const data = setupTestData({ password: val });
                const { error } = AuthRequestSchema.validate(data); 
                expect(error.details[0].message).toEqual(`"password" ${validationErr}`);
            });
        });
    });
});