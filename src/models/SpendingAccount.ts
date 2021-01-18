import { SpendingAccountType } from "./Constants";
import IFinanceAccount from "../interfaces/models/IFinanceAccount";

class SpendingAccount implements IFinanceAccount {
    name: string;
    balance: number;
    type: string = SpendingAccountType;

    constructor(name: string, balance: number) {
        this.name = name;
        this.balance = balance;
    }
}

export default SpendingAccount;