import { IBudgetProfileResponse } from "../models";

export interface IUserAuthenticationService {
    generateAuthToken(id: string, email: string) : string;
    authenticateUser(email: string, password: string): Promise<IBudgetProfileResponse>;
};