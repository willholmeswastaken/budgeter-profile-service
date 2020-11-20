import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, request, response, interfaces, httpPost } from 'inversify-express-utils';

import BudgetProfile from '../models/BudgetProfile';
import SavingsAccount from '../models/SavingsAccount';
import SpendingAccount from '../models/SpendingAccount';
import RepositoryFailureStatus from '../models/Enums/RepositoryFailureStatus';

import TYPES from '../iocTypes';
import BudgetProfileRepository from '../data/BudgetProfileRepository';
import IBudgetProfileRepository from '../data/IBudgetProfileRepository';
import IValidator from '../data/validators/IValidator';


@controller("/budgetprofile")
class BudgetController implements interfaces.Controller {
  private readonly _budgetProfileRepository: IBudgetProfileRepository;
  private readonly _budgetProfileValidator: IValidator<BudgetProfile>;

  constructor(@inject(TYPES.BudgetProfileRepository) private budgetProfileRepository: BudgetProfileRepository,
   @inject(TYPES.BudgetProfileValidator) private budgetProfileValidator: IValidator<BudgetProfile>) {
    this._budgetProfileRepository = budgetProfileRepository;
    this._budgetProfileValidator = budgetProfileValidator;
  }

  @httpGet("/")
  public async index(@request() req: Request, @response() res: Response) {
    var profile = await this._budgetProfileRepository.getProfileByEmail(req.query.email.toString());
    if(profile) {
      return res.status(200).json(profile);
    } else {
      return res.status(404).send('Budget profile not found!');
    }
  }

  @httpPost("/")
  public async create(@request() req: Request, @response() res: Response) {
    var budgetProfile = req.body as BudgetProfile;
    if(!this._budgetProfileValidator.isValid(budgetProfile)) return res.status(400).send('Invalid request body');
    
    var createResponse = await this._budgetProfileRepository.create(req.body);
    switch(createResponse.error) {
      case RepositoryFailureStatus.Error:
        return res.status(500).send(createResponse.error);
      case RepositoryFailureStatus.Validation:
        return res.status(400).send(createResponse.error);
      default:
        return res.status(200).send(createResponse.result);
    }
  }
}

export default BudgetController;