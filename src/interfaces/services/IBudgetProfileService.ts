import IBudgetProfileCreationRequestModel from '../models/HttpRequests/IBudgetProfileCreationRequestModel';
import IBudgetProfileResponse from '../models/IBudgetProfileResponse';

interface IBudgetProfileService {
  getProfileByEmail(email: string): Promise<IBudgetProfileResponse>;
  authenticateUser(email: string, password: string): Promise<IBudgetProfileResponse>;
  createUser(user: IBudgetProfileCreationRequestModel): Promise<IBudgetProfileResponse>;
};

export default IBudgetProfileService;