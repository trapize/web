import { injectable, inject, optional } from 'inversify';
import { HttpApplication } from './Http.Application';
import express from 'express';
import { GetRoutesFunction } from './Route.Functions';
import { IAuthenticationStrategy } from './IAuthentication.Strategy';
import { IAuthorizationStrategy } from './IAuthorization.Strategy';
import { ICacheStrategy } from './ICache.Strategy';
import { ExpressRequest } from './Express.Request';
import { ExpressResponse } from './Express.Response';
import { IHttpRequestPipeline } from './IHttp.Request.Pipeline';
import { HttpActionResult } from './action-results';
import { Core, IAppConfig, ILogger } from '@trapize/core';
import { WebSymbols } from './Web.Symbols';

/**
 *
 *
 * @export
 * @abstract
 * @class ExpressApplication
 * @extends {HttpApplication}
 */
@injectable()
export abstract class ExpressApplication extends HttpApplication {
    /**
     *
     *
     * @protected
     * @type {express.Application}
     * @memberof ExpressApplication
     */
    protected application: express.Application;
    /**
     *
     *
     * @protected
     * @abstract
     * @type {IAuthenticationStrategy}
     * @memberof ExpressApplication
     */
    protected abstract readonly DefaultAuthentication: IAuthenticationStrategy;
    /**
     *
     *
     * @protected
     * @abstract
     * @type {IAuthorizationStrategy}
     * @memberof ExpressApplication
     */
    protected abstract readonly DefaultAuthorization: IAuthorizationStrategy;
    /**
     *
     *
     * @protected
     * @abstract
     * @type {ICacheStrategy}
     * @memberof ExpressApplication
     */
    protected abstract readonly DefaultCache: ICacheStrategy;

    /**
     *Creates an instance of ExpressApplication.
     * @param {IAppConfig} appConfig
     * @param {IHttpRequestPipeline} pipeline
     * @param {ILogger} logger
     * @param {GetRoutesFunction} [getRoutes]
     * @param {express.Application} [app]
     * @memberof ExpressApplication
     */
    public constructor(
        @inject(Core.Configuration.IAppConfig) appConfig: IAppConfig,
        @inject(WebSymbols.IHttpRequestPipeline) pipeline: IHttpRequestPipeline,
        @inject(Core.Monitor.ILogger) private logger: ILogger,
        @inject(WebSymbols.GetRoutes) @optional() getRoutes?: GetRoutesFunction,
        @inject(WebSymbols.Express.Application) @optional() app?: express.Application,
    ) {
        super(appConfig, pipeline, getRoutes);
        this.application = app || express();
    }

    /**
     *
     *
     * @abstract
     * @returns {Promise<void>}
     * @memberof ExpressApplication
     */
    public abstract RegisterMiddleware(): Promise<void>;
    
    /**
     *
     *
     * @returns {Promise<void>}
     * @memberof ExpressApplication
     */
    public async RegisterErrorHandling(): Promise<void> {
        this.application.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            //console.error(err);
            this.logger.Error(err);
            res.status(500).send(HttpActionResult.ServerError.InternalServerError({code: 500, name: 'INTERNAL_SERVER_ERROR', message: 'UNKNOWN'}));
        });
    }

    
    /**
     *
     *
     * @returns {Promise<void>}
     * @memberof ExpressApplication
     */
    public async RegisterRoutes(): Promise<void> {
        const routes = this.GetRoutes({
            authentication: this.DefaultAuthentication,
            authorization: this.DefaultAuthorization,
            cache: this.DefaultCache
        });
        routes.forEach(route => {
            const handler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
                this.logger.Debug('RequestPreExecute', route, req.originalUrl, req.param, req.query, req.body);
                this.pipeline.Execute(new ExpressRequest(req), new ExpressResponse(res), route, this.container);
            }

            if(route.method === 'GET') {
                this.application.get(route.path, handler);
            } else if(route.method === 'POST') {
                this.application.post(route.path, handler);
            } else if(route.method === 'PUT') {
                this.application.put(route.path, handler);
            } else if(route.method === 'PATCH') {
                this.application.patch(route.path, handler);
            } else if(route.method === 'DELETE') {
                this.application.delete(route.path, handler);
            } else if(route.method === 'HEAD') {
                this.application.head(route.path, handler);
            } else if(route.method === 'OPTIONS') {
                this.application.options(route.path, handler);
            }
            this.logger.Info('Route Registered: ', route);
        });

    }
    
    /**
     *
     *
     * @returns {Promise<void>}
     * @memberof ExpressApplication
     */
    public Listen(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.application.listen(this.appConfig.port || 3000, (err) => {
                if(err) {
                    reject();
                } else {
                    resolve();
                }
            })
        });
    }
}