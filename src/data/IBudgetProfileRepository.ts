import BudgetProfile from "../models/BudgetProfile";
import IRepository from "./IRepository";

interface IBudgetProfileRepository extends IRepository<BudgetProfile> {
    getProfileByEmail(email: string): Promise<BudgetProfile>;
}

export default IBudgetProfileRepository;