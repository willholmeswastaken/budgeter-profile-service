import { Constants } from ".";
import { IFinanceAccount } from "../interfaces";

export class SavingsAccount implements IFinanceAccount {
    name: string;
    balance: number;
    type: string = Constants.SavingsAccountType;

    constructor(name: string, balance: number) {
        this.name = name;
        this.balance = balance;
    }
};