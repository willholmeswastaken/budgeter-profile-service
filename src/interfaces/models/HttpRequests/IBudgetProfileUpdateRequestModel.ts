import IAllocations from "../IAllocations";

export interface IBudgetProfileUpdateRequestModel {
    Id: string;
    monthlyIncome: number;
    allocations: IAllocations;
};