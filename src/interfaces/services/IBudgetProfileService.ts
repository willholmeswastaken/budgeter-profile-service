import IBudgetProfile from '../models/IBudgetProfile';

interface IBudgetProfileService {
  getProfileByEmail(email: string): Promise<IBudgetProfile>;
  authenticateUser(email: string, password: string): Promise<IBudgetProfile>;
};

export default IBudgetProfileService;