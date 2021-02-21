import * as AWSMock from "aws-sdk-mock";
import * as AWS from "aws-sdk";
import { DeleteItemInput, GetItemInput, PutItemInput, UpdateItemInput } from "aws-sdk/clients/dynamodb";
import bcrypt from "bcrypt";

import { BudgetProfileRepository } from "../../src/data";
import { IBudgetProfile } from "../../src/interfaces";
import {
  RecordNotFoundException,
  RepositoryFailureStatus,
} from "../../src/models";

const mockInfo = jest.fn();
const mockError = jest.fn();

jest.mock("tslog", () => {
  return {
    Logger: jest.fn().mockImplementation(() => {
      return {
        info: mockInfo,
        error: mockError,
      };
    }),
  };
});

describe("BudgetProfileRepository tests", () => {
  const saltRounds = 10;
  let repo: BudgetProfileRepository;
  const sampleProfile: IBudgetProfile = {
    Id: "test",
    email: "will@willholmes.dev",
    password: "",
    monthlyIncome: 5000,
    allocations: {
      bills: 0,
      savings: 0,
      spending: 0,
    },
  };
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, PASSWORD_SALT_ROUNDS: saltRounds.toString() };

    mockInfo.mockReset();
    mockError.mockReset();

    repo = new BudgetProfileRepository(true);
  });

  afterEach(() => {
    AWSMock.restore("DynamoDB.DocumentClient");
  });

  it("returns tableName", () => {
    expect(repo.tableName).toBe("budgeter-user-profile");
  });

  describe("getById", () => {
    it("succeeds on valid query", async () => {
      AWSMock.setSDKInstance(AWS);
      AWSMock.mock(
        "DynamoDB.DocumentClient",
        "query",
        (params: GetItemInput, callback: Function) =>
          callback(null, { Items: [sampleProfile] })
      );
      repo = new BudgetProfileRepository(true);

      const res = await repo.getById(sampleProfile.Id);

      expect(res).not.toBeNull();
      expect(res).toEqual(sampleProfile);
    });

    it("logs when query does not match a record", async () => {
      AWSMock.setSDKInstance(AWS);
      AWSMock.mock(
        "DynamoDB.DocumentClient",
        "query",
        (params: GetItemInput, callback: Function) =>
          callback(null, { Items: [] })
      );
      repo = new BudgetProfileRepository(true);

      await expect(repo.getById(sampleProfile.Id)).rejects.toThrow(
        RecordNotFoundException
      );
      expect(mockError).toHaveBeenCalledTimes(1);
      expect(mockError).toHaveBeenCalledWith(
        "Record_Not_Found",
        sampleProfile.Id
      );
    });

    it("logs when dynamodb interaction fails", async () => {
      AWSMock.setSDKInstance(AWS);
      AWSMock.mock(
        "DynamoDB.DocumentClient",
        "query",
        (params: GetItemInput, callback: Function) => {
          throw new Error("Dynamo Failed");
        }
      );
      repo = new BudgetProfileRepository(true);

      await expect(repo.getById(sampleProfile.Id)).rejects.toThrow(
        RecordNotFoundException
      );
      expect(mockError).toHaveBeenCalledTimes(1);
      expect(mockError).toHaveBeenCalledWith(
        "Record_Search_Failure",
        new Error("Dynamo Failed")
      );
    });
  });

  describe("getByEmail", () => {
    it("succeeds on valid query", async () => {
      AWSMock.setSDKInstance(AWS);
      AWSMock.mock(
        "DynamoDB.DocumentClient",
        "query",
        (params: GetItemInput, callback: Function) =>
          callback(null, { Items: [sampleProfile] })
      );
      repo = new BudgetProfileRepository(true);

      const res = await repo.getByEmail(sampleProfile.email);

      expect(res).not.toBeNull();
      expect(res).toEqual(sampleProfile);
    });

    it("logs when query does not match a record", async () => {
      AWSMock.setSDKInstance(AWS);
      AWSMock.mock(
        "DynamoDB.DocumentClient",
        "query",
        (params: GetItemInput, callback: Function) =>
          callback(null, { Items: [] })
      );
      repo = new BudgetProfileRepository(true);

      await expect(repo.getByEmail(sampleProfile.email)).rejects.toThrow(
        RecordNotFoundException
      );
      expect(mockError).toHaveBeenCalledTimes(1);
      expect(mockError).toHaveBeenCalledWith(
        "Record_Not_Found",
        sampleProfile.email
      );
    });

    it("logs when dynamodb interaction fails", async () => {
      AWSMock.setSDKInstance(AWS);
      AWSMock.mock(
        "DynamoDB.DocumentClient",
        "query",
        (params: GetItemInput, callback: Function) => {
          throw new Error("Dynamo Failed");
        }
      );
      repo = new BudgetProfileRepository(true);

      await expect(repo.getByEmail(sampleProfile.email)).rejects.toThrow(
        RecordNotFoundException
      );
      expect(mockError).toHaveBeenCalledTimes(1);
      expect(mockError).toHaveBeenCalledWith(
        "Record_Search_Failure",
        new Error("Dynamo Failed")
      );
    });
  });

  describe("create", () => {
    let encryptedPassword: string;
    const password: string = "testing";

    beforeAll(async () => {
      encryptedPassword = await bcrypt.hash(password, saltRounds);
    });

    it("creates a profile on valid input", async () => {
      AWSMock.setSDKInstance(AWS);
      AWSMock.mock(
        "DynamoDB.DocumentClient",
        "put",
        (params: PutItemInput, callback: Function) => callback(null, {})
      );
      repo = new BudgetProfileRepository(true);

      const res = await repo.create(sampleProfile);

      expect(res).not.toBeNull();
      expect(res).toEqual({
        result: {
          ...sampleProfile,
          Id: res.result.Id,
          password: res.result.password,
        },
        error: RepositoryFailureStatus.None,
      });
    });

    it("logs and outputs failure when dynamodb interaction fails", async () => {
      AWSMock.setSDKInstance(AWS);
      AWSMock.mock(
        "DynamoDB.DocumentClient",
        "put",
        (params: PutItemInput, callback: Function) => {
          throw new Error("Dynamo Failed");
        }
      );
      repo = new BudgetProfileRepository(true);

      const res = await repo.create(sampleProfile);

      expect(res).not.toBeNull();
      expect(res).toEqual({
        result: null,
        error: RepositoryFailureStatus.Error,
      });
    });
  });

  describe("update", () => {
    it("updates a profile on valid input", async () => {
      AWSMock.setSDKInstance(AWS);
      AWSMock.mock(
        "DynamoDB.DocumentClient",
        "update",
        (params: UpdateItemInput, callback: Function) => callback(null, {})
      );
      repo = new BudgetProfileRepository(true);

      const res = await repo.update({ Id: sampleProfile.Id, allocations: sampleProfile.allocations, monthlyIncome: sampleProfile.monthlyIncome });

      expect(res).not.toBeNull();
      expect(res).toEqual({
        result: true,
        error: RepositoryFailureStatus.None,
      });
    });

    it("logs and outputs failure when dynamodb interaction fails", async () => {
      AWSMock.setSDKInstance(AWS);
      AWSMock.mock(
        "DynamoDB.DocumentClient",
        "update",
        (params: UpdateItemInput, callback: Function) => {
          throw new Error("Dynamo Failed");
        }
      );
      repo = new BudgetProfileRepository(true);

      const res = await repo.update({ Id: sampleProfile.Id, allocations: sampleProfile.allocations, monthlyIncome: sampleProfile.monthlyIncome });

      expect(res).not.toBeNull();
      expect(res).toEqual({
        result: false,
        error: RepositoryFailureStatus.Error,
      });
    });
  });

  describe("delete", () => {
    it("deletes a profile on valid input", async () => {
      AWSMock.setSDKInstance(AWS);
      AWSMock.mock(
        "DynamoDB.DocumentClient",
        "delete",
        (params: DeleteItemInput, callback: Function) => callback(null, {})
      );
      repo = new BudgetProfileRepository(true);

      const res = await repo.delete(sampleProfile.Id);

      expect(res).not.toBeNull();
      expect(res).toEqual({
        result: true,
        error: RepositoryFailureStatus.None,
      });
    });

    it("logs and outputs failure when dynamodb interaction fails", async () => {
      AWSMock.setSDKInstance(AWS);
      AWSMock.mock(
        "DynamoDB.DocumentClient",
        "delete",
        (params: DeleteItemInput, callback: Function) => {
          throw new Error("Dynamo Failed");
        }
      );
      repo = new BudgetProfileRepository(true);

      const res = await repo.delete(sampleProfile.Id);

      expect(res).not.toBeNull();
      expect(res).toEqual({
        result: false,
        error: RepositoryFailureStatus.Error,
      });
    });
  });
});
