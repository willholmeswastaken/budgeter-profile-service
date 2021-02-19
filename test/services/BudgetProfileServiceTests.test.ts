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
  let updateSpy;
  let deleteSpy;
  const repo = new BudgetProfileRepository();

  beforeEach(() => {
    getByEmailSpy = jest
      .spyOn(repo, "getById")
      .mockImplementation(() => buildData());
    createSpy = jest.spyOn(repo, "create").mockImplementation(async () => ({
      error: RepositoryFailureStatus.None,
      result: buildData(),
    }));
    updateSpy = jest.spyOn(repo, "update").mockImplementation(async () => ({
      error: RepositoryFailureStatus.None,
      result: true,
    }));
    deleteSpy = jest.spyOn(repo, "delete").mockImplementation(async () => ({
      error: RepositoryFailureStatus.None,
      result: true,
    }));
  });

  const buildData = (propOverrides?: any) => ({
    Id: "iamaguid",
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
      getByEmailSpy = jest
        .spyOn(repo, "getById")
        .mockImplementation(() => null);
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

  describe("updateUser", () => {
    it("throws BudgetProfileUpdateError if the repository fails to update the user", async () => {
      updateSpy = jest.spyOn(repo, "update").mockImplementation(async () => ({
        error: RepositoryFailureStatus.Error,
        result: null,
      }));

      const req = buildData();

      await expect(
        new BudgetProfileService(repo).updateUser(req)
      ).rejects.toThrow(HttpError);
    });

    it("returns true if updated successfully", async () => {
      updateSpy = jest.spyOn(repo, "update").mockImplementation(async () => ({
        error: RepositoryFailureStatus.None,
        result: true,
      }));

      const req = buildData();

      const res: boolean = await new BudgetProfileService(repo).updateUser(req);

      expect(res).toBeTruthy();
    });

    it("returns false if updated unsuccessfully", async () => {
      updateSpy = jest.spyOn(repo, "update").mockImplementation(async () => ({
        error: RepositoryFailureStatus.None,
        result: false,
      }));

      const req = buildData();

      const res: boolean = await new BudgetProfileService(repo).updateUser(req);

      expect(res).toBeFalsy();
    });
  });

  describe("deleteUser", () => {
    it("throws BudgetProfileDeletionError if the repository fails to delete the user", async () => {
      deleteSpy = jest.spyOn(repo, "delete").mockImplementation(async () => ({
        error: RepositoryFailureStatus.Error,
        result: null,
      }));

      const req = buildData();

      await expect(
        new BudgetProfileService(repo).deleteUser(req)
      ).rejects.toThrow(HttpError);
    });

    it("returns true if deleted successfully", async () => {
      deleteSpy = jest.spyOn(repo, "delete").mockImplementation(async () => ({
        error: RepositoryFailureStatus.None,
        result: true,
      }));

      const req = buildData();

      const res: boolean = await new BudgetProfileService(repo).deleteUser(req);

      expect(res).toBeTruthy();
    });

    it("returns false if deleted unsuccessfully", async () => {
      deleteSpy = jest.spyOn(repo, "delete").mockImplementation(async () => ({
        error: RepositoryFailureStatus.None,
        result: false,
      }));

      const req = buildData();

      const res: boolean = await new BudgetProfileService(repo).deleteUser(req);

      expect(res).toBeFalsy();
    });
  });
});
