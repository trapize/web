import { injectable, inject, Container } from 'inversify';
import { IHttpRequestPipeline } from './IHttp.Request.Pipeline';
import { IHttpRequest } from './IHttp.Request';
import { IHttpResponse } from './IHttp.Response';
import { IHttpRoute } from './IHttp.Route';
import { WebSymbols } from './Web.Symbols';
import { IAuthenticationService } from './IAuthentication.Service';
import { IAuthorizationService } from './IAuthorization.Service';
import { ICacheService } from './ICache.Service';
import { IUniqueService, IsObjectable, Exception, Core } from '@trapize/core';
import { IHttpContext } from './IHttp.Context';
import { IHttpController } from './IHttp.Controller';
import { IHttpActionResult } from './IHttp.Action.Result';
import { Observable } from 'rxjs';
import { Validation } from './validation';
import { HttpActionResult } from './action-results';
import { WebExceptions, UnauthorizedException } from './Web.Exception';
import { IHttpUser } from './IHttp.User';
import { EventEmitter } from 'events';

type InitialListener = (req: IHttpRequest, route: IHttpRoute<any>) => void;
type SubsequentListener = (reqId: string, route: IHttpRoute<any>, errorResultUser?: any) => void;
type Listener = InitialListener | SubsequentListener;

/**
 *
 *
 * @export
 * @class HttpRequestPipeline
 * @implements {IHttpRequestPipeline}
 */
@injectable()
export class HttpRequestPipeline implements IHttpRequestPipeline {

    private emitter: EventEmitter = new EventEmitter();
    
    /**
     *Creates an instance of HttpRequestPipeline.
     * @param {IAuthenticationService} authentication
     * @param {IAuthorizationService} authorization
     * @param {ICacheService} cache
     * @param {IUniqueService} unique
     * @param {ILogger} logger
     * @memberof HttpRequestPipeline
     */
    public constructor(
        @inject(WebSymbols.IAuthenticationService) private authentication: IAuthenticationService,
        @inject(WebSymbols.IAuthorizationService) private authorization: IAuthorizationService,
        @inject(WebSymbols.ICacheService) private cache: ICacheService,
        @inject(Core.IUniqueService) private unique: IUniqueService
    ) {}

    /**
     *
     *
     * @param {IHttpRequest} request
     * @param {IHttpResponse} response
     * @param {IHttpRoute<any>} route
     * @param {Container} container
     * @returns {Promise<void>}
     * @memberof HttpRequestPipeline
     */
    public async Execute(request: IHttpRequest, response: IHttpResponse, route: IHttpRoute<any>, container: Container): Promise<void> {
        let val: IHttpActionResult = HttpActionResult.ServerError.InternalServerError({message: 'UNKNOWN'})//{code: 500, error: new InternalServerError('UNKNOWN')};

        try {
            val = await this.GetActionResult(request, response, route, container);
        } catch(e) {
            let exception: Exception = e;
            /* istanbul ignore else */
            if(!(e instanceof Exception)) {
                exception = new WebExceptions.UnhandledException(e.message ? e.message : 'UNKNOWN', e);
                this.emitter.emit('Error', request, route, exception.ToInternalJSON());
            }
            
            val = HttpActionResult.Create(exception.Code, exception.ToJSON());
            
        } finally {
            this.emitter.emit('EndRequest', request.uuid, route, val);
            response.status(val.code).send(IsObjectable(val) ? val.ToJSON() : val);
        }
    }

    /**
     *
     *
     * @param {'BeginRequest'} event
     * @param {InitialListener} listener
     * @memberof HttpRequestPipeline
     */
    public on(event: 'BeginRequest', listener: InitialListener): void;
    /**
     *
     *
     * @param {'PreAuthenticate'} event
     * @param {SubsequentListener} listener
     * @memberof HttpRequestPipeline
     */
    public on(event: 'PreAuthenticate', listener: SubsequentListener): void;
    /**
     *
     *
     * @param {'PostAuthenticate'} event
     * @param {SubsequentListener} listener
     * @memberof HttpRequestPipeline
     */
    public on(event: 'PostAuthenticate', listener: SubsequentListener): void;
    /**
     *
     *
     * @param {'PreAuthorize'} event
     * @param {SubsequentListener} listener
     * @memberof HttpRequestPipeline
     */
    public on(event: 'PreAuthorize', listener: SubsequentListener): void;
    /**
     *
     *
     * @param {'PostAuthorize'} event
     * @param {SubsequentListener} listener
     * @memberof HttpRequestPipeline
     */
    public on(event: 'PostAuthorize', listener: SubsequentListener): void;
    /**
     *
     *
     * @param {'PreValidate'} event
     * @param {SubsequentListener} listener
     * @memberof HttpRequestPipeline
     */
    public on(event: 'PreValidate', listener: SubsequentListener): void;
    /**
     *
     *
     * @param {'PostValidate'} event
     * @param {SubsequentListener} listener
     * @memberof HttpRequestPipeline
     */
    public on(event: 'PostValidate', listener: SubsequentListener): void;
    /**
     *
     *
     * @param {'PreCacheCheck'} event
     * @param {SubsequentListener} listener
     * @memberof HttpRequestPipeline
     */
    public on(event: 'PreCacheCheck', listener: SubsequentListener): void;
    /**
     *
     *
     * @param {'PostCacheCheck'} event
     * @param {SubsequentListener} listener
     * @memberof HttpRequestPipeline
     */
    public on(event: 'PostCacheCheck', listener: SubsequentListener): void;
    /**
     *
     *
     * @param {'PreRouteAction'} event
     * @param {SubsequentListener} listener
     * @memberof HttpRequestPipeline
     */
    public on(event: 'PreRouteAction', listener: SubsequentListener): void;
    /**
     *
     *
     * @param {'PostRouteAction'} event
     * @param {SubsequentListener} listener
     * @memberof HttpRequestPipeline
     */
    public on(event: 'PostRouteAction', listener: SubsequentListener): void;
    /**
     *
     *
     * @param {'PreCacheSet'} event
     * @param {SubsequentListener} listener
     * @memberof HttpRequestPipeline
     */
    public on(event: 'PreCacheSet', listener: SubsequentListener): void;
    /**
     *
     *
     * @param {'PostCacheSet'} event
     * @param {SubsequentListener} listener
     * @memberof HttpRequestPipeline
     */
    public on(event: 'PostCacheSet', listener: SubsequentListener): void;
    /**
     *
     *
     * @param {'EndRequest'} event
     * @param {SubsequentListener} listener
     * @memberof HttpRequestPipeline
     */
    public on(event: 'EndRequest', listener: SubsequentListener): void;
    /**
     *
     *
     * @param {'Error'} event
     * @param {SubsequentListener} listener
     * @memberof HttpRequestPipeline
     */
    public on(event: 'Error', listener: SubsequentListener): void;
    /**
     *
     *
     * @param {string} event
     * @param {Listener} listener
     * @memberof HttpRequestPipeline
     */
    public on(event: string, listener: Listener): void {
        this.emitter.on(event, listener);
    }

    /**
     *
     *
     * @private
     * @param {IHttpRequest} request
     * @param {IHttpResponse} response
     * @param {IHttpRoute<any>} route
     * @param {Container} container
     * @returns {Promise<IHttpActionResult>}
     * @memberof HttpRequestPipeline
     */
    private async GetActionResult(request: IHttpRequest, response: IHttpResponse, route: IHttpRoute<any>, container: Container): Promise<IHttpActionResult> {
        request.uuid = this.unique.uuid();
        this.emitter.emit('BeginRequest', request, route);
        let user: IHttpUser | undefined;
        this.emitter.emit('PreAuthenticate', request.uuid, route);
        try {
            user = await this.authentication.Authenticate(request);
        } catch(e) {
            this.emitter.emit('PostAuthenticate', request.uuid, route, null);
            if(e instanceof UnauthorizedException) {
                return HttpActionResult.ClientError.Unauthorized();
            } else {
                return HttpActionResult.ServerError.InternalServerError(e);
            }
        }
        const allow = await this.authentication.Allow(user, route.authenticationStrategy);

        this.emitter.emit('PostAuthenticate', request.uuid, route, user);
        if(!allow) {
            return HttpActionResult.ClientError.Unauthorized();
        }
        this.emitter.emit('PreAuthorize', request.uuid, route, user);

        const authorize = await this.authorization.Authorize(user, route)
        this.emitter.emit('PostAuthorize', request.uuid, route, user);

        if(!authorize) {
            return HttpActionResult.ClientError.Forbidden();
        }
        const ctx = {
            User: user,
            Request: request,
            Response: response,
            Route: route
        };

        this.emitter.emit('PreValidate', request.uuid, route);
        if(route.validator) {
            const validationResult = await Validation.ValidateRequest(route.validator, request);
            if(validationResult.errors) {
                return HttpActionResult.ClientError.BadRequest({code: 400, message: 'BAD_REQUEST', internalError: validationResult.errors});
            }
        }
        this.emitter.emit('PostValidate', request.uuid, route);
        
        if(route.method === 'GET' && route.cacheStrategy?.IsCacheable) {
            this.emitter.emit('PreCacheCheck', request.uuid, route);
            const key = route.cacheStrategy.GetKey(ctx);
            if(key) {
                const cacheVal = await this.cache.get(key);
                if(cacheVal) {
                    this.emitter.emit('PostCacheCheck', request.uuid, route, cacheVal);
                    return cacheVal;
                }
            }
        }

        const controllerContainer = new Container();
        controllerContainer.parent = container;
        controllerContainer.bind<IHttpContext>(WebSymbols.IHttpContext).toConstantValue(ctx);

        const controller = controllerContainer.get<IHttpController>(route.controller);
        this.emitter.emit('PreRouteAction', request.uuid, route);
        const retVal = controller[route.action]();
        let val;
        
        if(retVal instanceof Promise) {
            val = await retVal;
        } else if(retVal instanceof Observable) {
            val = await retVal.toPromise();
        } else {
            val = retVal;
        }
        this.emitter.emit('PostRouteAction', request.uuid, route, val);

        if(val && route.method === 'GET' && route.cacheStrategy?.IsCacheable) {
            this.emitter.emit('PreCacheSet', request.uuid, route, val);
            const key = route.cacheStrategy.GetKey(ctx);
            if(key) {
                this.cache.set(key, val);
                this.emitter.emit('PostCacheSet', request.uuid, route, val);
            }
        }

        return val;
    }
}
