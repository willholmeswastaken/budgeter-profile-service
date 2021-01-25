import IAllocations from "../IAllocations";

interface IBudgetProfileCreationRequestModel {
    email: string;
    password: string;
    monthlyIncome: number;
    allocations: IAllocations;
}

export default IBudgetProfileCreationRequestModel;