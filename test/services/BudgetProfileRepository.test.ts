import { BudgetProfileRepository } from '../../src/services/BudgetProfileRepository';
import IBudgetProfile from '../../src/interfaces/models/IBudgetProfile';

describe('BudgetProfileRepository tests', () => {
    let repo: BudgetProfileRepository;

    beforeEach(() => {
        repo = new BudgetProfileRepository();
    });

    it('returns tableName', () => {
        expect(repo.tableName).toBe('budgeter-user-profile');
    });

    it('gets profile by email address', () => {
        
    });

    it('throws on exists', () => {
        try {
            repo.exists({} as IBudgetProfile);
        } catch(err) {
            expect(err.message).toBe('Method not implemented.');
        }
    });
    
    it('throws on delete', () => {
        try {
            repo.delete({} as IBudgetProfile);
        } catch(err) {
            expect(err.message).toBe('Method not implemented.');
        }
    });
    
    it('throws on getById', () => {
        try {
            repo.getById('test');
        } catch(err) {
            expect(err.message).toBe('Method not implemented.');
        }
    });
    
    it('throws on update', () => {
        try {
            repo.update({} as IBudgetProfile);
        } catch(err) {
            expect(err.message).toBe('Method not implemented.');
        }
    });
});