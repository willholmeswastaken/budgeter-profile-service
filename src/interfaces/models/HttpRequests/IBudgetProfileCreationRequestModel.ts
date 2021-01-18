import IAllocations from "../IAllocations";

interface IBudgetProfileCreationRequestModel {
    email: string;
    monthlyIncome: number;
    allocations: IAllocations;
}

export default IBudgetProfileCreationRequestModel;