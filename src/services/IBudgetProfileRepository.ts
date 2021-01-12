import { BudgetProfile } from "../models/BudgetProfile";
import IRepository from "../data/IRepository";

export interface IBudgetProfileRepository extends IRepository<BudgetProfile> {
    getProfileByEmail(email: string): Promise<BudgetProfile>;
}

export default IBudgetProfileRepository;