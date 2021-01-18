import IAllocations from "../IAllocations";

interface IBudgetProfileResponse {
    email: string;
    monthlyIncome: number;
    allocations: IAllocations;
}

export default IBudgetProfileResponse;