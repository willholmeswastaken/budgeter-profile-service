import IBudgetProfileCreationRequestModel from '../../src/interfaces/models/HttpRequests/IBudgetProfileCreationRequestModel';

import schema from '../../src/schemas/BudgetProfileCreationRequestModelSchema';

describe('BudgetProfileCreationRequestModelSchema tests', () => {
    const setupTestData = (propOverrides: any = {}): IBudgetProfileCreationRequestModel => ({
        monthlyIncome: 1000,
        allocations: {
            bills: 1000,
            spending: 1000,
            savings: 1000
        },
        email: 'will@willholmes.dev',
        ...propOverrides
    });

    it('returns no errors on valid object', () => {
        const data = setupTestData();
        const { error } = schema.validate(data);
        expect(error).toBeUndefined();
    });

    describe('monthlyIncome', () => {
        describe.each([
            [-1, 'must be greater than or equal to 0'],
            [null, 'must be a number'],
            ['', 'must be a number']
        ])('when monthlyIncome is = %s', (val, validationErr) => {
            it('returns an error', () => {
                const data = setupTestData({ monthlyIncome: val });
                const { error } = schema.validate(data);
                expect(error.details[0].message).toEqual(`"monthlyIncome" ${validationErr}`);
            });
        });
    });

    describe('allocations', () => {
        describe.each([
            [null, '"allocations" must be of type object'],
            [{}, '"allocations.bills" is required']
        ])('when spending is = %s', (val, validationErr) => {
            it('returns an error', () => {
                const data = setupTestData({ allocations: val});
                const { error } = schema.validate(data);
                expect(error.details[0].message).toEqual(validationErr);
            });
        });

        describe.each([
            [-1, 'must be greater than or equal to 0'],
            [null, 'must be a number'],
            ['', 'must be a number']
        ])('when spending is = %s', (val, validationErr) => {
            it('returns an error', () => {
                const data = setupTestData({ allocations: { ...setupTestData().allocations, spending: val }});
                const { error } = schema.validate(data);
                expect(error.details[0].message).toEqual(`"allocations.spending" ${validationErr}`);
            });
        });

        describe.each([
            [-1, 'must be greater than or equal to 0'],
            [null, 'must be a number'],
            ['', 'must be a number']
        ])('when bills is = %s', (val, validationErr) => {
            it('returns an error', () => {
                const data = setupTestData({ allocations: { ...setupTestData().allocations, bills: val }});
                const { error } = schema.validate(data);
                expect(error.details[0].message).toEqual(`"allocations.bills" ${validationErr}`);
            });
        });
        
        describe.each([
            [-1, 'must be greater than or equal to 0'],
            [null, 'must be a number'],
            ['', 'must be a number']
        ])('when savings is = %s', (val, validationErr) => {
            it('returns an error', () => {
                const data = setupTestData({ allocations: { ...setupTestData().allocations, savings: val } });
                const { error } = schema.validate(data);
                expect(error.details[0].message).toEqual(`"allocations.savings" ${validationErr}`);
            });
        });
    });

    describe('email', () => {
        describe.each([
            [null, 'must be a string'],
            ['', 'is not allowed to be empty'],
            ['willholmes', 'must be a valid email']
        ])('when email is = %s', (val, validationErr) => {
            it('returns an error', () => {
                const data = setupTestData({ email: val });
                const { error } = schema.validate(data);
                expect(error.details[0].message).toEqual(`"email" ${validationErr}`);
            });
        });
    });
});