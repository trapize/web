import 'reflect-metadata';
import { ExpressApplication } from '../../src/web/Express.Application';
import { IAuthenticationStrategy } from '../../src/web/IAuthentication.Strategy';
import { IAuthorizationStrategy } from '../../src/web/IAuthorization.Strategy';
import { ICacheStrategy } from '../../src/web/ICache.Strategy';
import { ILogger } from '@trapize/core';

const application = {
    use: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    head: jest.fn(),
    options: jest.fn(),
    listen: jest.fn()
};

const appConfig = {
    port: 3001
};

const GetRoutes = jest.fn();

const pipeline = {
    Execute: jest.fn()
}

const logger: ILogger = {
    Info: jest.fn(),
    Debug: jest.fn(),
    Warn: jest.fn(),
    Error: jest.fn(),
    Log: jest.fn()
};

beforeEach(() => {
    application.use.mockReset();
    application.get.mockReset();
    application.put.mockReset();
    application.post.mockReset();
    application.patch.mockReset();
    application.delete.mockReset();
    application.head.mockReset();
    application.options.mockReset();
    application.listen.mockReset();
    pipeline.Execute.mockReset();
    GetRoutes.mockClear();
    (<any>logger.Info).mockReset();
    (<any>logger.Debug).mockReset();
    (<any>logger.Warn).mockReset();
    (<any>logger.Error).mockReset();
    (<any>logger.Log).mockReset();
});

const authStrategy = {
    AllowAnnonymous: true
};

const authorizationStrategy = <IAuthorizationStrategy>{
    RoleStrategy: 'ANY'
};

const cacheStrategy = {
    IsCacheable: false,
    GetKey: (req: any) => {
        return '';
    }
};


class TestApp extends ExpressApplication {
    protected readonly DefaultAuthentication: IAuthenticationStrategy = authStrategy;
    protected readonly DefaultAuthorization: IAuthorizationStrategy = authorizationStrategy;
    protected readonly DefaultCache: ICacheStrategy = cacheStrategy;

    RegisterMiddleware = jest.fn();
}

describe('Express Application', () => {


    it('Should construct without an application provided', () => {
        const testApp = new TestApp(<any>appConfig, pipeline, logger, GetRoutes);
        expect(testApp).toBeDefined();
    });
    
    it('Should listen with appConfig port', async () => {
        application.listen.mockImplementation((port, callback) => {
            expect(port).toBe(appConfig.port);
            expect(typeof callback).toBe('function');
            callback();
        });

        const app = new TestApp(<any>appConfig, pipeline, logger, GetRoutes, <any>application);

        await app.Listen();
    });

    it('Should listen with default port', async () => {
        application.listen.mockImplementation((port, callback) => {
            expect(port).toBe(3000);
            expect(typeof callback).toBe('function');
            callback();
        });

        const app = new TestApp(<any>{}, pipeline, logger, GetRoutes, <any>application);

        await app.Listen();
    });

    
    it('Should listen with Errors', (done) => {
        application.listen.mockImplementation((port, callback) => {
            expect(port).toBe(3000);
            expect(typeof callback).toBe('function');
            callback(new Error());
        });

        const app = new TestApp(<any>{}, pipeline, logger, GetRoutes, <any>application);

        app.Listen()
            .then(() => done('It should have thrown an error'))
            .catch(() => done());
    });

    it('Should Register the errorHandler', (done) => {
        console.error = jest.fn();
        const eRes = {
            status: jest.fn(),
            send: jest.fn().mockImplementation(data => {
                expect(data).toBeDefined();
                expect(data.code).toBe(500);
                expect(data.error).toBeDefined();
                expect(data.error.code).toBe(500);
                expect(data.error.name).toBe('INTERNAL_SERVER_ERROR');
                expect(data.error.message).toBe('UNKNOWN');
                expect(console.error).toHaveBeenCalled();
                done();
            })
        };


        eRes.status.mockImplementation(code => {
            expect(code).toBe(500);
            return eRes;
        });

        application.use.mockImplementation((...args: any[]) => {
            expect(args).toHaveLength(1);
            expect(typeof args[0]).toBe('function');
            const fn = args[0];
            fn(new Error(), {}, eRes, () => {});
        });

        const app = new TestApp(<any>appConfig, pipeline, logger, GetRoutes, <any>application);
        app.RegisterErrorHandling();
    });

    it('Should Register the routes', async () => {
        GetRoutes.mockImplementation(options => {
            return [
                {
                    path: '/get',
                    method: 'GET',
                    action: 'action',
                    controller: jest.fn(),
                    authenticationStrategy: authStrategy,
                    authorizationStrategy: authorizationStrategy,
                    cacheStrategy: cacheStrategy,
                    roles: []
                },
                {
                    path: '/put',
                    method: 'PUT',
                    action: 'putAction',
                    controller: jest.fn(),
                    authenticationStrategy: authStrategy,
                    authorizationStrategy: authorizationStrategy,
                    cacheStrategy: cacheStrategy,
                    roles: []
                },
                {
                    path: '/post',
                    method: 'POST',
                    action: 'postAction',
                    controller: jest.fn(),
                    authenticationStrategy: authStrategy,
                    authorizationStrategy: authorizationStrategy,
                    cacheStrategy: cacheStrategy,
                    roles: []
                },
                {
                    path: '/patch',
                    method: 'PATCH',
                    action: 'patchAction',
                    controller: jest.fn(),
                    authenticationStrategy: authStrategy,
                    authorizationStrategy: authorizationStrategy,
                    cacheStrategy: cacheStrategy,
                    roles: []
                },
                {
                    path: '/delete',
                    method: 'DELETE',
                    action: 'deleteAction',
                    controller: jest.fn(),
                    authenticationStrategy: authStrategy,
                    authorizationStrategy: authorizationStrategy,
                    cacheStrategy: cacheStrategy,
                    roles: []
                },
                {
                    path: '/head',
                    method: 'HEAD',
                    action: 'headAction',
                    controller: jest.fn(),
                    authenticationStrategy: authStrategy,
                    authorizationStrategy: authorizationStrategy,
                    cacheStrategy: cacheStrategy,
                    roles: []
                },
                {
                    path: '/options',
                    method: 'OPTIONS',
                    action: 'optionsAction',
                    controller: jest.fn(),
                    authenticationStrategy: authStrategy,
                    authorizationStrategy: authorizationStrategy,
                    cacheStrategy: cacheStrategy,
                    roles: []
                }
            ]
        });

        application.get.mockImplementation((route, handler) => {
            expect(route).toBe('/get');
            expect(typeof handler).toBe('function');
            handler({}, {}, () => {});
        });
        
        application.put.mockImplementation((route, handler) => {
            expect(route).toBe('/put');
            expect(typeof handler).toBe('function');
            handler({}, {}, () => {});
        });
        
        application.post.mockImplementation((route, handler) => {
            expect(route).toBe('/post');
            expect(typeof handler).toBe('function');
            handler({}, {}, () => {});
        });
        
        application.patch.mockImplementation((route, handler) => {
            expect(route).toBe('/patch');
            expect(typeof handler).toBe('function');
            handler({}, {}, () => {});
        });
        
        application.delete.mockImplementation((route, handler) => {
            expect(route).toBe('/delete');
            expect(typeof handler).toBe('function');
            handler({}, {}, () => {});
        });
        
        application.head.mockImplementation((route, handler) => {
            expect(route).toBe('/head');
            expect(typeof handler).toBe('function');
            handler({}, {}, () => {});
        });
        
        application.options.mockImplementation((route, handler) => {
            expect(route).toBe('/options');
            expect(typeof handler).toBe('function');
            handler({}, {}, () => {});
        });

        const app = new TestApp(<any>appConfig, pipeline, logger, GetRoutes, <any>application);

        await app.RegisterRoutes();
    });
})