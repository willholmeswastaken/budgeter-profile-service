import { IBudgetProfileResponse, IBudgetProfileCreationRequestModel, IBudgetProfileUpdateRequestModel } from '../models';

export interface IBudgetProfileService {
  getProfileById(id: string): Promise<IBudgetProfileResponse>;
  createUser(user: IBudgetProfileCreationRequestModel): Promise<IBudgetProfileResponse>;
  updateUser(updateReq: IBudgetProfileUpdateRequestModel) : Promise<boolean>;
  deleteUser(id: string) : Promise<boolean>
};

export default IBudgetProfileService;