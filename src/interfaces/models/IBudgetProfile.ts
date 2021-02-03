import { IAllocations } from "./";
// import { FinanceAccount } from "./FinanceAccount";

export interface IBudgetProfile {
    Id: string;
    email: string;
    password: string;
    monthlyIncome: number;
    allocations: IAllocations;
    
    //TODO: Bring in the below functionality
    // accounts: FinanceAccount[];
};

export default IBudgetProfile;
