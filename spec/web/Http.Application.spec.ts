import 'reflect-metadata';
import { HttpApplication } from '../../src/web/Http.Application';
import { Container } from 'inversify';

class TestApp extends HttpApplication {
    constructor() {
        super(<any>{}, <any>{}, () => ([]));
    }

    RegisterMiddleware = jest.fn().mockImplementation(() => {
        expect(this.container).toBeDefined();
        return Promise.resolve();
    });
    RegisterRoutes = jest.fn().mockImplementation(() => {
        expect(this.container).toBeDefined();
        return Promise.resolve();
    });
    RegisterErrorHandling = jest.fn().mockImplementation(() => {
        expect(this.container).toBeDefined();
        return Promise.resolve();
    });
    Listen = jest.fn().mockImplementation(() => {
        expect(this.container).toBeDefined();
        return Promise.resolve();
    });
} 

describe('HttpApplication', () => {
    it('Should run', async () => {
        const app = new TestApp();
        await app.Run(new Container());
    });
})