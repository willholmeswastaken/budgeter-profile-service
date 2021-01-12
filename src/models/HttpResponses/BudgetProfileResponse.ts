import Allocations from "../Allocations";

interface BudgetProfileResponse {
    email: string;
    monthlyIncome: number;
    allocations: Allocations;
}

export default BudgetProfileResponse;