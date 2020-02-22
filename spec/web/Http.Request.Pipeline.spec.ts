import 'reflect-metadata';
import { IHttpRequestPipeline } from '../../src/web/IHttp.Request.Pipeline';
import { HttpRequestPipeline } from '../../src/web/Http.Request.Pipeline';
import { IHttpRequest } from '../../src/web/IHttp.Request';
import { HttpMethod } from '../../src/web/Http.Method';
import { IHttpResponse } from '../../src/web/IHttp.Response';
import { Container } from 'inversify';
import { IHttpRoute } from '../../src/web/IHttp.Route';
import { of, throwError } from 'rxjs';
import { Validation } from '../../src/web/validation';
import { ResultExceptions, Exception } from '@trapize/core';
import { UnauthorizedException, WebExceptions } from '../../src/web';

const authenticationService = {
    Authenticate: jest.fn(),//(request: IHttpRequest): Promise<IHttpUser>;
    Allow: jest.fn() //(user: IHttpUser, strategy: IAuthenticationStrategy): Promise<boolean>;
};

const authorizationService = {
    Authorize: jest.fn() //(user: IHttpUser, route: IHttpRoute<any>): Promise<boolean>;
};

const cacheService = {
    get: jest.fn(), //(key: string): Promise<any>;
    set: jest.fn() //(key: string, value: any): void;
};

const uniqueService = {
    uuid: jest.fn()//(): string;
};

const logger = {
    Info: jest.fn(), //(...args: any[]): void;
    Log: jest.fn(), //(...args: any[]): void;
    Debug: jest.fn(), //(...args: any[]): void;
    Warn: jest.fn(), //(...args: any[]): void;
    Error: jest.fn() //(...args: any[]): void;
};

class MockRequest implements IHttpRequest {
    public body: any = {};
    public query: any = {};
    public params: any = {};
    public uuid: string = '';

    public constructor(public method: HttpMethod) {}

    get = jest.fn();
    getHeader = jest.fn();
}

class MockResponse implements IHttpResponse {
    status = jest.fn().mockReturnThis();
    send = jest.fn().mockReturnThis();
}

const controller = {
    action: jest.fn()
}

class TestException extends Exception {
    protected _source: 'TEST';
}
beforeEach(() => {
    authenticationService.Allow.mockReset();
    authenticationService.Authenticate.mockReset();
    authorizationService.Authorize.mockReset();
    cacheService.get.mockReset();
    cacheService.set.mockReset();
    uniqueService.uuid.mockReset();
    logger.Info.mockClear();
    logger.Log.mockClear();
    logger.Debug.mockClear();
    logger.Warn.mockClear();
    logger.Error.mockClear();
    controller.action.mockReset();
});

function Pipeline(): IHttpRequestPipeline {
    return new HttpRequestPipeline(authenticationService, authorizationService, cacheService, uniqueService, logger);
}

describe('Http Request Pipeline', () => {
    it('Should return unauthorized', async () => {
        const req = new MockRequest('GET');
        const res = new MockResponse();
        const container = new Container();
        const controllerSymbol = 'Controller';
        container.bind(controllerSymbol).toConstantValue(controller);
        const route = <IHttpRoute<any>>{
            path: 'path',
            method: 'GET',
            action: 'action',
            controller: <any>controllerSymbol,
            authenticationStrategy: {AllowAnnonymous: false},
            authorizationStrategy: {RoleStrategy: 'ANY'},
            cacheStrategy: undefined,
            roles: []
        };
        uniqueService.uuid.mockReturnValue('uniqueId');
        authenticationService.Authenticate.mockImplementation(req => {
            return Promise.reject(new UnauthorizedException());
        });
        authenticationService.Allow.mockReturnValue(Promise.resolve(false));

        
        const pipeline = Pipeline();
        await pipeline.Execute(req, res, route, container);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledTimes(1);
    });

    it('Should return internal server error', async () => {
        const req = new MockRequest('GET');
        const res = new MockResponse();
        const container = new Container();
        const controllerSymbol = 'Controller';
        container.bind(controllerSymbol).toConstantValue(controller);
        const route = <IHttpRoute<any>>{
            path: 'path',
            method: 'GET',
            action: 'action',
            controller: <any>controllerSymbol,
            authenticationStrategy: {AllowAnnonymous: false},
            authorizationStrategy: {RoleStrategy: 'ANY'},
            cacheStrategy: undefined,
            roles: []
        };
        uniqueService.uuid.mockReturnValue('uniqueId');
        authenticationService.Authenticate.mockImplementation(req => {
            return Promise.reject(new WebExceptions.UnhandledException());
        });
        authenticationService.Allow.mockReturnValue(Promise.resolve(false));

        
        const pipeline = Pipeline();
        await pipeline.Execute(req, res, route, container);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledTimes(1);
    });

    it('Should return unauthorized', async () => {
        const req = new MockRequest('GET');
        const res = new MockResponse();
        const container = new Container();
        const controllerSymbol = 'Controller';
        container.bind(controllerSymbol).toConstantValue(controller);
        const route = <IHttpRoute<any>>{
            path: 'path',
            method: 'GET',
            action: 'action',
            controller: <any>controllerSymbol,
            authenticationStrategy: {AllowAnnonymous: false},
            authorizationStrategy: {RoleStrategy: 'ANY'},
            cacheStrategy: undefined,
            roles: []
        };
        uniqueService.uuid.mockReturnValue('uniqueId');
        authenticationService.Authenticate.mockImplementation(req => {
            return Promise.resolve({
                Id: 0,
                Username: 'ANNONYMOUS', 
                Roles: []
            });
        });
        authenticationService.Allow.mockReturnValue(Promise.resolve(false));

        
        const pipeline = Pipeline();
        await pipeline.Execute(req, res, route, container);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledTimes(1);
    });

    it('Should return unknown error', async () => {
        const req = new MockRequest('GET');
        const res = new MockResponse();
        const container = new Container();
        const controllerSymbol = 'Controller';
        container.bind(controllerSymbol).toConstantValue(controller);
        const route = <IHttpRoute<any>>{
            path: 'path',
            method: 'GET',
            action: 'action',
            controller: <any>controllerSymbol,
            authenticationStrategy: {AllowAnnonymous: false},
            authorizationStrategy: {RoleStrategy: 'ANY'},
            cacheStrategy: undefined,
            roles: []
        };
        uniqueService.uuid.mockReturnValue('uniqueId');
        authenticationService.Authenticate.mockImplementation(req => {
            throw new Error('Unknown');
        });

        
        const pipeline = Pipeline();
        await pipeline.Execute(req, res, route, container);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledTimes(1);
    });

    it('Should return unknown error no message', async () => {
        const req = new MockRequest('GET');
        const res = new MockResponse();
        const container = new Container();
        const controllerSymbol = 'Controller';
        container.bind(controllerSymbol).toConstantValue(controller);
        const route = <IHttpRoute<any>>{
            path: 'path',
            method: 'GET',
            action: 'action',
            controller: <any>controllerSymbol,
            authenticationStrategy: {AllowAnnonymous: false},
            authorizationStrategy: {RoleStrategy: 'ANY'},
            cacheStrategy: undefined,
            roles: []
        };
        uniqueService.uuid.mockReturnValue('uniqueId');
        authenticationService.Authenticate.mockImplementation(req => {
            throw new Error();
        });

        
        const pipeline = Pipeline();
        await pipeline.Execute(req, res, route, container);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledTimes(1);
    });

    it('Should return forbidden', async () => {
        const req = new MockRequest('GET');
        const res = new MockResponse();
        const container = new Container();
        const controllerSymbol = 'Controller';
        container.bind(controllerSymbol).toConstantValue(controller);
        const route = <IHttpRoute<any>>{
            path: 'path',
            method: 'GET',
            action: 'action',
            controller: <any>controllerSymbol,
            authenticationStrategy: {AllowAnnonymous: true},
            authorizationStrategy: {RoleStrategy: 'ANY'},
            cacheStrategy: undefined,
            roles: []
        };
        uniqueService.uuid.mockReturnValue('uniqueId');
        authenticationService.Authenticate.mockImplementation(req => {
            return Promise.resolve({
                Id: 0,
                Username: 'ANNONYMOUS', 
                Roles: []
            });
        });
        authenticationService.Allow.mockReturnValue(Promise.resolve(true));

        authorizationService.Authorize.mockImplementation((user, route) => {
            return Promise.resolve(false);
        });
        
        const pipeline = Pipeline();
        await pipeline.Execute(req, res, route, container);
        
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledTimes(1);
    });

    it('Should execute without error with observable return type', async () => {
        const req = new MockRequest('GET');
        const res = new MockResponse();
        const container = new Container();
        const controllerSymbol = 'Controller';
        container.bind(controllerSymbol).toConstantValue(controller);
        const route = <IHttpRoute<any>>{
            path: 'path',
            method: 'GET',
            action: 'action',
            controller: <any>controllerSymbol,
            authenticationStrategy: {AllowAnnonymous: false},
            authorizationStrategy: {RoleStrategy: 'ANY'},
            cacheStrategy: undefined,
            roles: []
        };

        uniqueService.uuid.mockReturnValue('uniqueId');
        authenticationService.Authenticate.mockImplementation(req => {
            return Promise.resolve({
                Id: 1,
                Username: 'Username', 
                Roles: ['SiteUser']
            });
        });
        authenticationService.Allow.mockReturnValue(Promise.resolve(true));

        authorizationService.Authorize.mockImplementation((user, route) => {
            return Promise.resolve(true);
        });

        controller.action.mockImplementation(() => {
            return of({
                code: 200
            });
        });

        const pipeline = Pipeline();
        await pipeline.Execute(req, res, route, container);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledTimes(1);
    });

    it('Should execute without error with non async return type', async () => {
        const req = new MockRequest('GET');
        const res = new MockResponse();
        const container = new Container();
        const controllerSymbol = 'Controller';
        container.bind(controllerSymbol).toConstantValue(controller);
        const route = <IHttpRoute<any>>{
            path: 'path',
            method: 'GET',
            action: 'action',
            controller: <any>controllerSymbol,
            authenticationStrategy: {AllowAnnonymous: false},
            authorizationStrategy: {RoleStrategy: 'ANY'},
            cacheStrategy: undefined,
            roles: []
        };

        uniqueService.uuid.mockReturnValue('uniqueId');
        authenticationService.Authenticate.mockImplementation(req => {
            return Promise.resolve({
                Id: 1,
                Username: 'Username', 
                Roles: ['SiteUser']
            });
        });
        authenticationService.Allow.mockReturnValue(Promise.resolve(true));

        authorizationService.Authorize.mockImplementation((user, route) => {
            return Promise.resolve(true);
        });

        controller.action.mockImplementation(() => {
            return {
                code: 200
            };
        });

        const pipeline = Pipeline();
        await pipeline.Execute(req, res, route, container);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledTimes(1);
    });

    it('Should execute without error', async () => {
        const req = new MockRequest('GET');
        const res = new MockResponse();
        const container = new Container();
        const controllerSymbol = 'Controller';
        container.bind(controllerSymbol).toConstantValue(controller);
        const route = <IHttpRoute<any>>{
            path: 'path',
            method: 'GET',
            action: 'action',
            controller: <any>controllerSymbol,
            authenticationStrategy: {AllowAnnonymous: false},
            authorizationStrategy: {RoleStrategy: 'ANY'},
            cacheStrategy: undefined,
            roles: []
        };

        uniqueService.uuid.mockReturnValue('uniqueId');
        authenticationService.Authenticate.mockImplementation(req => {
            return Promise.resolve({
                Id: 1,
                Username: 'Username', 
                Roles: ['SiteUser']
            });
        });
        authenticationService.Allow.mockReturnValue(Promise.resolve(true));

        authorizationService.Authorize.mockImplementation((user, route) => {
            return Promise.resolve(true);
        });

        controller.action.mockImplementation(() => {
            return Promise.resolve({
                code: 200
            });
        });

        const pipeline = Pipeline();
        await pipeline.Execute(req, res, route, container);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledTimes(1);
    });

    it('Should execute without error, cacheable but no key', async () => {
        const req = new MockRequest('GET');
        const res = new MockResponse();
        const container = new Container();
        const controllerSymbol = 'Controller';
        container.bind(controllerSymbol).toConstantValue(controller);
        const route = <IHttpRoute<any>>{
            path: 'path',
            method: 'GET',
            action: 'action',
            controller: <any>controllerSymbol,
            authenticationStrategy: {AllowAnnonymous: false},
            authorizationStrategy: {RoleStrategy: 'ANY'},
            cacheStrategy: {IsCacheable: true, GetKey: () => ''},
            roles: []
        };

        uniqueService.uuid.mockReturnValue('uniqueId');
        authenticationService.Authenticate.mockImplementation(req => {
            return Promise.resolve({
                Id: 1,
                Username: 'Username', 
                Roles: ['SiteUser']
            });
        });
        authenticationService.Allow.mockReturnValue(Promise.resolve(true));

        authorizationService.Authorize.mockImplementation((user, route) => {
            return Promise.resolve(true);
        });

        controller.action.mockImplementation(() => {
            return Promise.resolve({
                code: 200
            });
        });

        const pipeline = Pipeline();
        await pipeline.Execute(req, res, route, container);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledTimes(1);
    });

    
    it('Should execute without error, cacheable with key (set cache)', async () => {
        const req = new MockRequest('GET');
        const res = new MockResponse();
        const container = new Container();
        const controllerSymbol = 'Controller';
        container.bind(controllerSymbol).toConstantValue(controller);
        const route = <IHttpRoute<any>>{
            path: 'path',
            method: 'GET',
            action: 'action',
            controller: <any>controllerSymbol,
            authenticationStrategy: {AllowAnnonymous: false},
            authorizationStrategy: {RoleStrategy: 'ANY'},
            cacheStrategy: {IsCacheable: true, GetKey: () => 'key'},
            roles: []
        };

        cacheService.get.mockReturnValue(Promise.resolve(undefined));
        uniqueService.uuid.mockReturnValue('uniqueId');
        authenticationService.Authenticate.mockImplementation(req => {
            return Promise.resolve({
                Id: 1,
                Username: 'Username', 
                Roles: ['SiteUser']
            });
        });
        authenticationService.Allow.mockReturnValue(Promise.resolve(true));

        authorizationService.Authorize.mockImplementation((user, route) => {
            return Promise.resolve(true);
        });

        controller.action.mockImplementation(() => {
            return Promise.resolve({
                code: 200
            });
        });

        const pipeline = Pipeline();
        await pipeline.Execute(req, res, route, container);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(cacheService.set).toHaveBeenCalledTimes(1);
        expect(cacheService.get).toHaveBeenCalledWith('key');
    });

    it('Should execute without error, cacheable with key (get cache)', async () => {
        const req = new MockRequest('GET');
        const res = new MockResponse();
        const container = new Container();
        const controllerSymbol = 'Controller';
        container.bind(controllerSymbol).toConstantValue(controller);
        const route = <IHttpRoute<any>>{
            path: 'path',
            method: 'GET',
            action: 'action',
            controller: <any>controllerSymbol,
            authenticationStrategy: {AllowAnnonymous: false},
            authorizationStrategy: {RoleStrategy: 'ANY'},
            cacheStrategy: {IsCacheable: true, GetKey: () => 'key'},
            roles: []
        };

        cacheService.get.mockReturnValue(Promise.resolve({code: 200}));
        uniqueService.uuid.mockReturnValue('uniqueId');
        authenticationService.Authenticate.mockImplementation(req => {
            return Promise.resolve({
                Id: 1,
                Username: 'Username', 
                Roles: ['SiteUser']
            });
        });
        authenticationService.Allow.mockReturnValue(Promise.resolve(true));

        authorizationService.Authorize.mockImplementation((user, route) => {
            return Promise.resolve(true);
        });

        controller.action.mockImplementation(() => {
            return Promise.resolve({
                code: 200
            });
        });

        const pipeline = Pipeline();
        await pipeline.Execute(req, res, route, container);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(cacheService.set).toHaveBeenCalledTimes(0);
        expect(cacheService.get).toHaveBeenCalledWith('key');
        expect(controller.action).toHaveBeenCalledTimes(0);
    });

    it('Should execute without error and validate', async () => {
        const req = new MockRequest('GET');
        const res = new MockResponse();
        const container = new Container();
        const controllerSymbol = 'Controller';
        container.bind(controllerSymbol).toConstantValue(controller);
        const route = <IHttpRoute<any>>{
            path: 'path',
            method: 'GET',
            action: 'action',
            controller: <any>controllerSymbol,
            authenticationStrategy: {AllowAnnonymous: false},
            authorizationStrategy: {RoleStrategy: 'ANY'},
            cacheStrategy: undefined,
            roles: [],
            validator: {body: {}, query: {}, params: {}}
        };

        uniqueService.uuid.mockReturnValue('uniqueId');
        authenticationService.Authenticate.mockImplementation(req => {
            return Promise.resolve({
                Id: 1,
                Username: 'Username', 
                Roles: ['SiteUser']
            });
        });
        authenticationService.Allow.mockReturnValue(Promise.resolve(true));

        authorizationService.Authorize.mockImplementation((user, route) => {
            return Promise.resolve(true);
        });

        controller.action.mockImplementation(() => {
            return Promise.resolve({
                code: 200
            });
        });

        const pipeline = Pipeline();
        await pipeline.Execute(req, res, route, container);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledTimes(1);
    });

    it('Should execute and error should be 400', async () => {
        const req = new MockRequest('GET');
        const res = new MockResponse();
        const container = new Container();
        const controllerSymbol = 'Controller';
        container.bind(controllerSymbol).toConstantValue(controller);
        const route = <IHttpRoute<any>>{
            path: 'path',
            method: 'GET',
            action: 'action',
            controller: <any>controllerSymbol,
            authenticationStrategy: {AllowAnnonymous: false},
            authorizationStrategy: {RoleStrategy: 'ANY'},
            cacheStrategy: undefined,
            roles: [],
            validator: {body: {}, query: {}, params: {}}
        };

        uniqueService.uuid.mockReturnValue('uniqueId');
        authenticationService.Authenticate.mockImplementation(req => {
            return Promise.resolve({
                Id: 1,
                Username: 'Username', 
                Roles: ['SiteUser']
            });
        });
        authenticationService.Allow.mockReturnValue(Promise.resolve(true));

        authorizationService.Authorize.mockImplementation((user, route) => {
            return Promise.resolve(true);
        });

        controller.action.mockImplementation(() => {
            return throwError(new ResultExceptions.TooManyResultsException());
        });

        const pipeline = Pipeline();
        await pipeline.Execute(req, res, route, container);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledTimes(1);
    });

    it('Should execute and error should be 404', async () => {
        const req = new MockRequest('GET');
        const res = new MockResponse();
        const container = new Container();
        const controllerSymbol = 'Controller';
        container.bind(controllerSymbol).toConstantValue(controller);
        const route = <IHttpRoute<any>>{
            path: 'path',
            method: 'GET',
            action: 'action',
            controller: <any>controllerSymbol,
            authenticationStrategy: {AllowAnnonymous: false},
            authorizationStrategy: {RoleStrategy: 'ANY'},
            cacheStrategy: undefined,
            roles: [],
            validator: {body: {}, query: {}, params: {}}
        };

        uniqueService.uuid.mockReturnValue('uniqueId');
        authenticationService.Authenticate.mockImplementation(req => {
            return Promise.resolve({
                Id: 1,
                Username: 'Username', 
                Roles: ['SiteUser']
            });
        });
        authenticationService.Allow.mockReturnValue(Promise.resolve(true));

        authorizationService.Authorize.mockImplementation((user, route) => {
            return Promise.resolve(true);
        });

        controller.action.mockImplementation(() => {
            return throwError(new ResultExceptions.NoResultsException());
        });

        const pipeline = Pipeline();
        await pipeline.Execute(req, res, route, container);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledTimes(1);
    });

    it('Should execute and error should be 500', async () => {
        const req = new MockRequest('GET');
        const res = new MockResponse();
        const container = new Container();
        const controllerSymbol = 'Controller';
        container.bind(controllerSymbol).toConstantValue(controller);
        const route = <IHttpRoute<any>>{
            path: 'path',
            method: 'GET',
            action: 'action',
            controller: <any>controllerSymbol,
            authenticationStrategy: {AllowAnnonymous: false},
            authorizationStrategy: {RoleStrategy: 'ANY'},
            cacheStrategy: undefined,
            roles: [],
            validator: {body: {}, query: {}, params: {}}
        };

        uniqueService.uuid.mockReturnValue('uniqueId');
        authenticationService.Authenticate.mockImplementation(req => {
            return Promise.resolve({
                Id: 1,
                Username: 'Username', 
                Roles: ['SiteUser']
            });
        });
        authenticationService.Allow.mockReturnValue(Promise.resolve(true));

        authorizationService.Authorize.mockImplementation((user, route) => {
            return Promise.resolve(true);
        });

        controller.action.mockImplementation(() => {
            return throwError(new TestException());
        });

        const pipeline = Pipeline();
        await pipeline.Execute(req, res, route, container);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledTimes(1);
    });

    it('Should execute without error and validate', async () => {
        const req = new MockRequest('GET');
        const res = new MockResponse();
        const container = new Container();
        const controllerSymbol = 'Controller';
        container.bind(controllerSymbol).toConstantValue(controller);
        const route = <IHttpRoute<any>>{
            path: 'path',
            method: 'GET',
            action: 'action',
            controller: <any>controllerSymbol,
            authenticationStrategy: {AllowAnnonymous: false},
            authorizationStrategy: {RoleStrategy: 'ANY'},
            cacheStrategy: undefined,
            roles: [],
            validator: {body: {}, query: {}, params: {}}
        };

        uniqueService.uuid.mockReturnValue('uniqueId');
        authenticationService.Authenticate.mockImplementation(req => {
            return Promise.resolve({
                Id: 1,
                Username: 'Username', 
                Roles: ['SiteUser']
            });
        });
        authenticationService.Allow.mockReturnValue(Promise.resolve(true));

        authorizationService.Authorize.mockImplementation((user, route) => {
            return Promise.resolve(true);
        });

        controller.action.mockImplementation(() => {
            return Promise.resolve({
                code: 200
            });
        });

        const pipeline = Pipeline();
        await pipeline.Execute(req, res, route, container);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledTimes(1);
    });

    it('Should fail validation', async () => {
        const req = new MockRequest('GET');
        const res = new MockResponse();
        const container = new Container();
        const controllerSymbol = 'Controller';
        container.bind(controllerSymbol).toConstantValue(controller);
        const route = <IHttpRoute<any>>{
            path: 'path',
            method: 'GET',
            action: 'action',
            controller: <any>controllerSymbol,
            authenticationStrategy: {AllowAnnonymous: false},
            authorizationStrategy: {RoleStrategy: 'ANY'},
            cacheStrategy: undefined,
            roles: [],
            validator: {body: {required_field: Validation.String('required_field').Required()}, query: {}, params: {}}
        };

        uniqueService.uuid.mockReturnValue('uniqueId');
        authenticationService.Authenticate.mockImplementation(req => {
            return Promise.resolve({
                Id: 1,
                Username: 'Username', 
                Roles: ['SiteUser']
            });
        });
        authenticationService.Allow.mockReturnValue(Promise.resolve(true));

        authorizationService.Authorize.mockImplementation((user, route) => {
            return Promise.resolve(true);
        });

        const pipeline = Pipeline();
        await pipeline.Execute(req, res, route, container);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledTimes(1);
    });
});