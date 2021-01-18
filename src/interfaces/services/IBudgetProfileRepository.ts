import { IBudgetProfile } from "../models/IBudgetProfile";

export interface IBudgetProfileRepository {
    getProfileByEmail(email: string): Promise<IBudgetProfile>;
}

export default IBudgetProfileRepository;