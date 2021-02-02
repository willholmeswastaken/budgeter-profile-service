import { Logger } from "tslog";
import { IBudgetProfile } from "../models/IBudgetProfile";
import { ICreate, IGetById } from '.';

export interface IBudgetProfileRepository extends ICreate<IBudgetProfile>, IGetById<IBudgetProfile> {
  logger: Logger;
}

export default IBudgetProfileRepository;
