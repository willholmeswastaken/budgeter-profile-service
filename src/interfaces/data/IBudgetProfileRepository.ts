import { Logger } from "tslog";
import { IBudgetProfile } from "../models/IBudgetProfile";
import { ICreate, IGetById, IGetByEmail, IUpdate, IDelete } from ".";

export interface IBudgetProfileRepository
  extends ICreate<IBudgetProfile>,
    IGetById<IBudgetProfile>,
    IGetByEmail<IBudgetProfile>,
    IUpdate<boolean>,
    IDelete<boolean> {
  logger: Logger;
}

export default IBudgetProfileRepository;
