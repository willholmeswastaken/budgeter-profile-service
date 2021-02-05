import IAllocations from "../IAllocations";

export interface IBudgetProfileUpdateRequestModel {
    monthlyIncome: number;
    allocations: IAllocations;
};