import { UserAuthenticationService } from "../../src/services";
import { BudgetProfileRepository } from "../../src/data";
import { AuthenticationFailureException } from "../../src/models";

jest.mock("../../src/data", () => {
  return {
    BudgetProfileRepository: jest.fn().mockImplementation(() => {
      return {
        getById: (email: string) => ({
          email: "will@willholmes.dev",
          password:
            "$2b$10$4kdTI4MSQQ2jTRSeIV1ZQexu/OyRw7k5.za00M8CDAwHG1/RT0HRO",
        }),
      };
    }),
  };
});

describe("UserAuthenticationService.ts", () => {
  const OLD_ENV = process.env;

  const buildData = (propOverrides?: any) => ({
    email: "will@willholmes.dev",
    password: "Testing123!",
    ...propOverrides,
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  describe('generateAuthToken', () => {
    it("generates a valid auth token", async () => {
      process.env = {
        ...OLD_ENV,
        JWT_PRIVATE_KEY:
          "wlkFNcCjknn615FN8VmaMp7KvUAVDSsRF5kbzBdYz8IkX2Tpku6BQEV5wmUgWYo",
        JWT_EXPIRES_IN: "1800",
      };
      const { email } = buildData();
  
      const token: string = await new UserAuthenticationService(
        null
      ).generateAuthToken(email);
      const splitToken = token.split("");
  
      expect(token).not.toEqual("");
      expect(splitToken[0]).toEqual("e");
      expect(splitToken[1]).toEqual("y");
    });
  });
  describe('authenticateUser', () => {
    it("does not authenticate an invalid user", async () => {
      const { email, password } = buildData({ password: 'bob'});
      await expect(
        new UserAuthenticationService(
          new BudgetProfileRepository()
        ).authenticateUser(email, password)
      ).rejects.toThrow(AuthenticationFailureException);
    });
  
    it("authenticates a valid user", async () => {
      process.env = { ...OLD_ENV, PASSWORD_SALT_ROUNDS: "10" };
      const { email, password } = buildData();
      const result = await new UserAuthenticationService(
        new BudgetProfileRepository()
      ).authenticateUser(email, password);
      expect(result).not.toBeNull();
    });
  })
});
