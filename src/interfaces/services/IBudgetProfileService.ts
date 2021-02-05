import { IBudgetProfileResponse, IBudgetProfileCreationRequestModel } from '../models';

export interface IBudgetProfileService {
  getProfileById(id: string): Promise<IBudgetProfileResponse>;
  createUser(user: IBudgetProfileCreationRequestModel): Promise<IBudgetProfileResponse>;
};

export default IBudgetProfileService;