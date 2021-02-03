import { IBudgetProfileResponse, IBudgetProfileCreationRequestModel } from '../models';

export interface IBudgetProfileService {
  getProfileByEmail(email: string): Promise<IBudgetProfileResponse>;
  createUser(user: IBudgetProfileCreationRequestModel): Promise<IBudgetProfileResponse>;
};

export default IBudgetProfileService;