import { Container } from 'inversify';
import 'reflect-metadata';
import TYPES from './iocTypes';
import IValidator from './data/validators/IValidator';
import BudgetProfileValidator from './data/validators/BudgetProfileValidator';
import BudgetProfile from './models/BudgetProfile';
import IBudgetProfileRepository from './data/IBudgetProfileRepository';
import BudgetProfileRepository from './data/BudgetProfileRepository';

const container = new Container();
container.bind<IBudgetProfileRepository>(TYPES.BudgetProfileRepository).to(BudgetProfileRepository);
container.bind<IValidator<BudgetProfile>>(TYPES.BudgetProfileValidator).to(BudgetProfileValidator);
export default container;