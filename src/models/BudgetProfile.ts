import Allocations from "./Allocations";
// import { FinanceAccount } from "./FinanceAccount";

export interface BudgetProfile {
    Id: string;
    email: string;
    monthlyIncome: number;
    allocations: Allocations;
    
    //TODO: Bring in the below functionality
    // accounts: FinanceAccount[];
}

export default BudgetProfile;
