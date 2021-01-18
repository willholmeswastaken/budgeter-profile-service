import { SavingsAccountType } from "./Constants";
import IFinanceAccount from "../interfaces/models/IFinanceAccount";

class SavingsAccount implements IFinanceAccount {
    name: string;
    balance: number;
    type: string = SavingsAccountType;

    constructor(name: string, balance: number) {
        this.name = name;
        this.balance = balance;
    }
}

export default SavingsAccount