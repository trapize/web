import 'reflect-metadata';
import { ExpressRequest } from '../../src/web/Express.Request';

const user = {
    get user_id(): string {
        return ''
    }
}
const eReq = {
    get body(): any {
        return  {};
    },
    get query(): any {
        return  {};
    },
    get params(): any {
        return  {};
    },
    get method(): any {
        return  'get';
    },
    get user(): any {
        return user
    },
    get: jest.fn()
};

describe('Express Request', () => {
    it('Should access the request properties', () => {
        const bodySpy = jest.spyOn(eReq, 'body', 'get');
        const querySpy = jest.spyOn(eReq, 'query', 'get');
        const paramsSpy = jest.spyOn(eReq, 'params', 'get');
        const methodSpy = jest.spyOn(eReq, 'method', 'get');
        const userSpy = jest.spyOn(eReq, 'user', 'get');
        const user_idSpy = jest.spyOn(user, 'user_id', 'get');
        eReq.get.mockReturnValue('text/plain');
        const req = new ExpressRequest(<any>eReq);
        const body = req.body;
        const query = req.query;
        const params = req.params;
        const metadata = req.method;
        const userId = req.get('user', 'user_id');
        const userUnknownProp = req.get('user', 'unknown', 'furtherUnknown');
        const uuid = req.uuid;
        expect(req.getHeader('content-type')).toBe('text/plain');
        expect(eReq.get).toHaveBeenCalledWith('content-type');

        expect(body).toBeDefined();
        expect(query).toBeDefined();
        expect(params).toBeDefined();
        expect(metadata).toBeDefined();
        expect(userId).toBeDefined();
        expect(uuid).toBeDefined();
        expect(userUnknownProp).toBeUndefined();

        expect(bodySpy).toHaveBeenCalledTimes(1);
        expect(querySpy).toHaveBeenCalledTimes(1);
        expect(paramsSpy).toHaveBeenCalledTimes(1);
        expect(methodSpy).toHaveBeenCalledTimes(1);
        expect(userSpy).toHaveBeenCalledTimes(2);
        expect(user_idSpy).toHaveBeenCalledTimes(1);

    })
})