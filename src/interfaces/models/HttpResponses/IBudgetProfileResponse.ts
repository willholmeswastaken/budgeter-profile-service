import { IAllocations } from "..";

export interface IBudgetProfileResponse {
    Id: string;
    email: string;
    monthlyIncome: number;
    allocations: IAllocations;
}

export default IBudgetProfileResponse;