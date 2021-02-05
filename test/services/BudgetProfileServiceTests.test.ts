import { BudgetProfileService } from "../../src/services";
import { BudgetProfileRepository } from "../../src/data";
import { IBudgetProfileResponse } from "../../src/interfaces";
import {
  RecordNotFoundException,
  RepositoryFailureStatus,
} from "../../src/models";
import { HttpError } from "routing-controllers";

describe("BudgetProfileService", () => {
  let getByEmailSpy;
  let createSpy;
  const repo = new BudgetProfileRepository();

  beforeEach(() => {
    getByEmailSpy = jest
      .spyOn(repo, "getById")
      .mockImplementation(() => buildData());
    createSpy = jest
      .spyOn(repo, "create")
      .mockImplementation(async () => ({
        error: RepositoryFailureStatus.None,
        result: buildData(),
      }));
  });

  const buildData = (propOverrides?: any) => ({
    Id: 'iamaguid',
    email: "will@willholmes.dev",
    allocations: [],
    monthlyIncome: 5000,
    password: "bob",
    ...propOverrides,
  });

  describe("getProfileById", () => {
    it("gets user by email", async () => {
      const { Id } = buildData();

      const profile: IBudgetProfileResponse = await new BudgetProfileService(
        repo
      ).getProfileById(Id);

      expect(profile).not.toBeNull();
    });

    it("fails to get user by email", async () => {
      getByEmailSpy = jest.spyOn(repo, "getById").mockImplementation(() => null);
      const { Id } = buildData();

      const profile: IBudgetProfileResponse = await new BudgetProfileService(
        repo
      ).getProfileById(Id);

      expect(profile).toBeNull();
    });
  });

  describe("createUser", () => {
    it("returns a record when the user already exists", async () => {
      const req = buildData();

      const profile: IBudgetProfileResponse = await new BudgetProfileService(
        repo
      ).createUser(req);

      expect(profile).not.toBeNull();
    });

    it("throws if the underlying existing user check is not throwing a recordnotfound exception", async () => {
      getByEmailSpy = jest.spyOn(repo, "getByEmail").mockImplementation(() => {
        throw new Error("test failing");
      });

      const req = buildData();

      await expect(
        new BudgetProfileService(repo).createUser(req)
      ).rejects.toThrowError("test failing");
    });

    it("throws BudgetProfileCreationError if the repository fails to create the user", async () => {
      getByEmailSpy = jest.spyOn(repo, "getByEmail").mockImplementation(() => {
        throw new RecordNotFoundException("email");
      });

      createSpy = jest.spyOn(repo, "create").mockImplementation(async () => ({
        error: RepositoryFailureStatus.Error,
        result: null,
      }));

      const req = buildData();

      await expect(
        new BudgetProfileService(repo).createUser(req)
      ).rejects.toThrow(HttpError);
    });

    it("returns a record if created successfully", async () => {
      getByEmailSpy = jest.spyOn(repo, "getByEmail").mockImplementation(() => {
        throw new RecordNotFoundException("email");
      });
      const req = buildData();

      const profile: IBudgetProfileResponse = await new BudgetProfileService(
        repo
      ).createUser(req);

      expect(profile).not.toBeNull();
    });
  });
});
