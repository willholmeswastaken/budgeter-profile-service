import { IBudgetProfileResponse, IBudgetProfileCreationRequestModel, IBudgetProfileUpdateRequestModel } from '../models';

export interface IBudgetProfileService {
  getProfileById(id: string): Promise<IBudgetProfileResponse>;
  createUser(user: IBudgetProfileCreationRequestModel): Promise<IBudgetProfileResponse>;
  updateUser(user: IBudgetProfileUpdateRequestModel) : Promise<IBudgetProfileResponse>;
  deleteUser(id: string) : Promise<boolean>
};

export default IBudgetProfileService;