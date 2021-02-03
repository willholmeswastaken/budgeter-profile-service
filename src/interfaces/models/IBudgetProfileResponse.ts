import { IAllocations } from "./";

export interface IBudgetProfileResponse {
    email: string;
    monthlyIncome: number;
    allocations: IAllocations;
}

export default IBudgetProfileResponse;