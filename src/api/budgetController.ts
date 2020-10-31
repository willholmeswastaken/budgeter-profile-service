import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, request, response, interfaces, httpPost } from 'inversify-express-utils';

import { BudgetProfile } from '../models/BudgetProfile';
import { SavingsAccount } from '../models/SavingsAccount';
import { SpendingAccount } from '../models/SpendingAccount';
import { RepositoryFailureStatus } from '../models/Enums/RepositoryFailureStatus';

import TYPES from '../iocTypes';
import BudgetProfileRepository from '../data/BudgetProfileRepository';
import { IBudgetProfileRepository } from '../data/IBudgetProfileRepository';


@controller("/budgetprofile")
class BudgetController implements interfaces.Controller {
  private readonly _budgetProfileRepository: IBudgetProfileRepository;

  constructor(@inject(TYPES.BudgetProfileRepository) private budgetProfileRepository: BudgetProfileRepository) {
    this._budgetProfileRepository = budgetProfileRepository;
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
    var createResponse = await this._budgetProfileRepository.create(req.body);
    switch(createResponse.error) {
      case RepositoryFailureStatus.Error:
        return res.status(500);
      case RepositoryFailureStatus.Validation:
        return res.status(400);
      default:
        return res.status(200);
    }
  }
}

export default BudgetController;