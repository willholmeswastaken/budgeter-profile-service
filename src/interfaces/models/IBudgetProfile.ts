import IAllocations from "./IAllocations";
// import { FinanceAccount } from "./FinanceAccount";

export interface IBudgetProfile {
    Id: string;
    email: string;
    monthlyIncome: number;
    allocations: IAllocations;
    
    //TODO: Bring in the below functionality
    // accounts: FinanceAccount[];
}

export default IBudgetProfile;
