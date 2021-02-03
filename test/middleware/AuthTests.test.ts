import jwt from 'jsonwebtoken';
import { AuthMiddleware } from '../../src/middleware';

describe('AuthMiddleware', () => {
    const buildData = (propOverrides?: any) => ({
        req: {
            headers: {
                'x-access-token': 'test'
            }
        },
        res: {},
        next: jest.fn(),
        ...propOverrides
    });

    

    it('throws an exception when no token found', () => {
        const {req, res, next} = buildData({ req: { headers: {} }});
        
        const authMiddleware = new AuthMiddleware();

        expect(() => authMiddleware.use(req, res, next)).toThrow('Access denied. No token provided.');
    })

    it('throws an exception when no token found', () => {
        const {req, res, next} = buildData();
        
        const authMiddleware = new AuthMiddleware();

        expect(() => authMiddleware.use(req, res, next)).toThrow('Invalid token');
    })

    it('throws an exception when no token found', () => {
        const jwtSpy = jest.spyOn(jwt, 'verify').mockImplementation(() => { id: 'test'});

        const {req, res, next} = buildData();
        
        const authMiddleware = new AuthMiddleware();
        authMiddleware.use(req,res,next);
        
        expect(next).toHaveBeenCalled();
    })
})