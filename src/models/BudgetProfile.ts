import Allocations from "./Allocations";
import FinanceAccount from "./FinanceAccount";

interface BudgetProfile {
    Id: string;
    email: string;
    monthlyIncome: number;
    allocations: Allocations;
    accounts: FinanceAccount[];
}

export default BudgetProfile;