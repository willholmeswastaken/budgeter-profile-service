import { Constants } from ".";
import { IFinanceAccount } from "../interfaces";

export class SpendingAccount implements IFinanceAccount {
    name: string;
    balance: number;
    type: string = Constants.SpendingAccountType;

    constructor(name: string, balance: number) {
        this.name = name;
        this.balance = balance;
    }
};