import validator from 'validator';
import { Service } from "typedi";
import IValidator from '../data/validators/IValidator';
import BudgetProfileCreationRequestModel from '../models/HttpRequests/BudgetProfileCreationRequestModel';

@Service()
class BudgetProfileValidator implements IValidator<BudgetProfileCreationRequestModel> {
    public isValid(source: BudgetProfileCreationRequestModel) : boolean {
        return (source.email && source.email.length > 0 && validator.isEmail(source.email)) &&
        source.monthlyIncome > 0;
    }
}

export default BudgetProfileValidator;