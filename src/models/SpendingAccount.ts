import { SpendingAccountType } from "./Constants";
import FinanceAccount from "./FinanceAccount";

class SpendingAccount implements FinanceAccount {
    name: string;
    balance: number;
    type: string = SpendingAccountType;

    constructor(name: string, balance: number) {
        this.name = name;
        this.balance = balance;
    }
}

export default SpendingAccount;