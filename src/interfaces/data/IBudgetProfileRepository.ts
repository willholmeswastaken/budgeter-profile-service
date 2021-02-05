import { Logger } from "tslog";
import { IBudgetProfile } from "../models/IBudgetProfile";
import { ICreate, IGetById, IGetByEmail } from '.';

export interface IBudgetProfileRepository extends ICreate<IBudgetProfile>, IGetById<IBudgetProfile>, IGetByEmail<IBudgetProfile> {
  logger: Logger;
}

export default IBudgetProfileRepository;
