import 'reflect-metadata';
import { ExpressResponse } from '../../src/web/Express.Response';

describe('Express Response', () => {
    it('Should call the Express functions', () => {
        const eRes = {
            status: jest.fn(),
            send: jest.fn()
        };

        const res = new ExpressResponse(<any>eRes);
        res.status(200);
        res.send('data');

        expect(eRes.status).toHaveBeenCalledWith(200);
        expect(eRes.send).toHaveBeenCalledWith('data');
    });
});