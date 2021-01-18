import { Logger } from "tslog";
import { IBudgetProfile } from "../models/IBudgetProfile";

export interface IBudgetProfileRepository {
    logger: Logger;
    getProfileByEmail(email: string): Promise<IBudgetProfile>;
}

export default IBudgetProfileRepository;