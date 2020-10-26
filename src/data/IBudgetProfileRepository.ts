import { BudgetProfile } from "../models/BudgetProfile";
import { IRepository } from "./IRepository";

export interface IBudgetProfileRepository extends IRepository<BudgetProfile> {
    getProfileByEmail(email: string): Promise<BudgetProfile>;
}