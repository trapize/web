import { injectable, inject, Container } from 'inversify';
import { IHttpRequestPipeline } from './IHttp.Request.Pipeline';
import { IHttpRequest } from './IHttp.Request';
import { IHttpResponse } from './IHttp.Response';
import { IHttpRoute } from './IHttp.Route';
import { WebSymbols } from './Web.Symbols';
import { IAuthenticationService } from './IAuthentication.Service';
import { IAuthorizationService } from './IAuthorization.Service';
import { ICacheService } from './ICache.Service';
import { ILogger, IUniqueService, IsObjectable, Exception, Core } from '@trapize/core';
import { IHttpContext } from './IHttp.Context';
import { IHttpController } from './IHttp.Controller';
import { IHttpActionResult } from './IHttp.Action.Result';
import { Observable } from 'rxjs';
import { Validation } from './validation';
import { HttpActionResult } from './action-results';
import { WebExceptions } from './Web.Exception';

/**
 *
 *
 * @export
 * @class HttpRequestPipeline
 * @implements {IHttpRequestPipeline}
 */
@injectable()
export class HttpRequestPipeline implements IHttpRequestPipeline {
    
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
        @inject(Core.IUniqueService) private unique: IUniqueService,
        @inject(Core.Monitor.ILogger) private logger: ILogger
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
                this.logger.Error(`Unhandled Exception Request - ${request.uuid}`, exception.ToInternalJSON());
            }
            
            val = HttpActionResult.Create(exception.Code, exception.ToJSON());
            
        } finally {
            response.status(val.code).send(IsObjectable(val) ? val.ToJSON() : val);
            this.logger.Log(`End Request - ${request.uuid} [${val.code}]${val.error ? ': ' + JSON.stringify(val.error) : ''}`);
        }
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
        this.logger.Log(`Begin Request - ${request.uuid} - ${route.method} ${route.path}`, request.body, request.params, request.query);
        const user = await this.authentication.Authenticate(request);
        const allow = await this.authentication.Allow(user, route.authenticationStrategy);

        if(!allow) {
            return HttpActionResult.ClientError.Unauthorized();
        }

        const authorize = await this.authorization.Authorize(user, route)
        this.logger.Log(`Post Authentication - ${request.uuid}: ${user.Id}`);

        if(!authorize) {
            return HttpActionResult.ClientError.Forbidden();
        }
        const ctx = {
            User: user,
            Request: request,
            Response: response,
            Route: route
        };

        if(route.validator) {
            const validationResult = await Validation.ValidateRequest(route.validator, request);
            if(validationResult.errors) {
                return HttpActionResult.ClientError.BadRequest({code: 400, message: 'BAD_REQUEST', internalError: validationResult.errors});
            }
        }
        
        if(route.method === 'GET' && route.cacheStrategy?.IsCacheable) {
            const key = route.cacheStrategy.GetKey(ctx);
            if(key) {
                const cacheVal = await this.cache.get(key);
                if(cacheVal) {
                    this.logger.Info(`Request - ${request.uuid}: Return Cached Value`);
                    return cacheVal;
                }
            }
        }

        const controllerContainer = new Container();
        controllerContainer.parent = container;
        controllerContainer.bind<IHttpContext>(WebSymbols.IHttpContext).toConstantValue(ctx);

        const controller = controllerContainer.get<IHttpController>(route.controller);
        const retVal = controller[route.action]();
        let val;
        
        if(retVal instanceof Promise) {
            val = await retVal;
        } else if(retVal instanceof Observable) {
            val = await retVal.toPromise();
        } else {
            val = retVal;
        }

        if(val && route.method === 'GET' && route.cacheStrategy?.IsCacheable) {
            const key = route.cacheStrategy.GetKey(ctx);
            if(key) {
                this.logger.Info(`Request - ${request.uuid}: Setting Cache`);
                this.cache.set(key, val);
            }
        }

        return val;
    }
}