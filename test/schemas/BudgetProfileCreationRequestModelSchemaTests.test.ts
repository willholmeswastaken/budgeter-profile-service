import { expect } from 'chai';
import IBudgetProfileCreationRequestModel from '../../src/interfaces/models/HttpRequests/IBudgetProfileCreationRequestModel';

import schema from '../../src/schemas/BudgetProfileCreationRequestModelSchema';

describe('BudgetProfileCreationRequestModelSchema tests', () => {
    const setupTestData = (propOverrides: any): IBudgetProfileCreationRequestModel => ({
        monthlyIncome: 1000,
        allocations: {
            bills: 0,
            spending: 0,
            savings: 0
        },
        email: 'will@willholmes.dev',
        ...propOverrides
    });

    it('returns an error on a null monthlyIncome', () => {
        const data = setupTestData({ monthlyIncome: null });
        const { error } = schema.validate(data);
        expect(error.details[0].message).to.equal('"monthlyIncome" must be a number');
    });
    
    it('returns an error on an invalid monthlyIncome type', () => {
        const data = setupTestData({ monthlyIncome: 'hi' });
        const { error } = schema.validate(data);
        expect(error.details[0].message).to.equal('"monthlyIncome" must be a number');
    });

    it('returns an error on an invalid monthlyIncome numerical value', () => {
        const data = setupTestData({ monthlyIncome: -1 });
        const { error } = schema.validate(data);
        expect(error.details[0].message).to.equal('"monthlyIncome" must be greater than or equal to 0');
    });
});