import { IBudgetProfileResponse } from "../models";

export interface IUserAuthenticationService {
    generateAuthToken(id: string) : string;
    authenticateUser(email: string, password: string): Promise<IBudgetProfileResponse>;
};