import { Allocations } from "./Allocations";
import { FinanceAccount } from "./FinanceAccount";

export interface BudgetProfile {
    id: string;
    email: string;
    monthlyIncome: number;
    allocations: Allocations;
    accounts: FinanceAccount[];
}