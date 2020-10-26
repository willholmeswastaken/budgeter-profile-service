import { Container } from 'inversify';
import 'reflect-metadata';
import TYPES from './iocTypes';
import { IBudgetProfileRepository } from './data/IBudgetProfileRepository';
import BudgetProfileRepository from './data/BudgetProfileRepository';

const container = new Container();
container.bind<IBudgetProfileRepository>(TYPES.BudgetProfileRepository).to(BudgetProfileRepository);
export default container;