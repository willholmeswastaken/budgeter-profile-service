import validator from 'validator';
import { injectable } from 'inversify';
import IValidator from './IValidator';
import BudgetProfile from '../../models/BudgetProfile';

@injectable()
class BudgetProfileValidator implements IValidator<BudgetProfile> {
    public isValid(source: BudgetProfile) : boolean {
        return (source.email && source.email.length > 0 && validator.isEmail(source.email)) &&
        source.monthlyIncome > 0;
    }
}

export default BudgetProfileValidator;