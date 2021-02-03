import { IAllocations } from "../";

export interface IBudgetProfileCreationRequestModel {
    email: string;
    password: string;
    monthlyIncome: number;
    allocations: IAllocations;
};

export default IBudgetProfileCreationRequestModel;