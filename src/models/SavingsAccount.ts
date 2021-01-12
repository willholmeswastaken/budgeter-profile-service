import { SavingsAccountType } from "./Constants";
import FinanceAccount from "./FinanceAccount";

class SavingsAccount implements FinanceAccount {
    name: string;
    balance: number;
    type: string = SavingsAccountType;

    constructor(name: string, balance: number) {
        this.name = name;
        this.balance = balance;
    }
}

export default SavingsAccount