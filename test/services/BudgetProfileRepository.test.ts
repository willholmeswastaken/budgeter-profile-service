import * as AWSMock from "aws-sdk-mock";
import * as AWS from "aws-sdk";
import { GetItemInput, PutItemInput } from "aws-sdk/clients/dynamodb";

import { BudgetProfileRepository } from '../../src/services/BudgetProfileRepository';
import IBudgetProfile from '../../src/interfaces/models/IBudgetProfile';
import RepositoryFailureStatus from "../../src/models/Enums/RepositoryFailureStatus";

const mockInfo = jest.fn();
const mockError = jest.fn();

jest.mock('tslog', () => {
    return {
      Logger: jest.fn().mockImplementation(() => {
        return {
          info: mockInfo,
          error: mockError
        };
      })
    };
  });

describe('BudgetProfileRepository tests', () => {
    let repo: BudgetProfileRepository;
    const sampleProfile: IBudgetProfile = {
        Id: 'test',
        email: 'will@willholmes.dev',
        monthlyIncome: 5000,
        allocations: {
            bills: 0,
            savings: 0,
            spending: 0
        }
    };

    beforeEach(() => {
        mockInfo.mockReset();
        mockError.mockReset();
        repo = new BudgetProfileRepository(true);
    });

    afterEach(() => {
        AWSMock.restore('DynamoDB.DocumentClient');
    })

    it('returns tableName', () => {
        expect(repo.tableName).toBe('budgeter-user-profile');
    });

    describe('getProfileByEmail', () => {
        it('gets profile by email address on valid query', async () => {
            AWSMock.setSDKInstance(AWS);
            AWSMock.mock('DynamoDB.DocumentClient', 'query', (params: GetItemInput, callback: Function) => callback(null, { Items: [sampleProfile] }));
            repo = new BudgetProfileRepository(true);

            const res = await repo.getProfileByEmail(sampleProfile.email);

            expect(res).not.toBeNull();
            expect(res).toEqual(sampleProfile);
        });

        it('logs when query does not match a record', async () => {
            AWSMock.setSDKInstance(AWS);
            AWSMock.mock('DynamoDB.DocumentClient', 'query', (params: GetItemInput, callback: Function) => callback(null, { Items: [] }));
            repo = new BudgetProfileRepository(true);

            expect(await repo.getProfileByEmail(sampleProfile.email)).toBeNull();
            expect(mockInfo).toHaveBeenCalledTimes(1);
            expect(mockInfo).toHaveBeenCalledWith('Record_Not_Found', sampleProfile.email);
        });

        it('logs when dynamodb interaction fails', async () => {
            AWSMock.setSDKInstance(AWS);
            AWSMock.mock('DynamoDB.DocumentClient', 'query', (params: GetItemInput, callback: Function) => { throw new Error('Dynamo Failed'); });
            repo = new BudgetProfileRepository(true);

            expect(await repo.getProfileByEmail(sampleProfile.email)).toBeNull();
            expect(mockError).toHaveBeenCalledTimes(1);
            expect(mockError).toHaveBeenCalledWith('Record_Search_Failure', new Error('Dynamo Failed'));
        });
    });

    describe('create', () => {
        it('creates a profile on valid input', async () => {
            AWSMock.setSDKInstance(AWS);
            AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: PutItemInput, callback: Function) => callback(null, { }));
            repo = new BudgetProfileRepository(true);

            const res = await repo.create(sampleProfile);

            expect(res).not.toBeNull();
            expect(res).toEqual({
                result: { ...sampleProfile, Id: res.result.Id },
                error: RepositoryFailureStatus.None
            });
        });

        it('logs and outputs failure when dynamodb interaction fails', async () => {
            AWSMock.setSDKInstance(AWS);
            AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: PutItemInput, callback: Function) => { throw new Error('Dynamo Failed')});
            repo = new BudgetProfileRepository(true);

            const res = await repo.create(sampleProfile);

            expect(res).not.toBeNull();
            expect(res).toEqual({
                result: null,
                error: RepositoryFailureStatus.Error
            });
        });
    });


    it('throws on exists', () => {
        try {
            repo.exists({} as IBudgetProfile);
        } catch (err) {
            expect(err.message).toBe('Method not implemented.');
        }
    });

    it('throws on delete', () => {
        try {
            repo.delete({} as IBudgetProfile);
        } catch (err) {
            expect(err.message).toBe('Method not implemented.');
        }
    });

    it('throws on getById', () => {
        try {
            repo.getById('test');
        } catch (err) {
            expect(err.message).toBe('Method not implemented.');
        }
    });

    it('throws on update', () => {
        try {
            repo.update({} as IBudgetProfile);
        } catch (err) {
            expect(err.message).toBe('Method not implemented.');
        }
    });
});