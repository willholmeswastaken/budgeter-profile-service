import { Allocations } from "../Allocations";

interface BudgetProfileCreationRequestModel {
    email: string;
    monthlyIncome: number;
    allocations: Allocations;
}

export default BudgetProfileCreationRequestModel;