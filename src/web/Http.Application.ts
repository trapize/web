import { injectable, inject, Container, optional } from 'inversify';
import { WebSymbols } from './Web.Symbols';
import { IHttpRequestPipeline } from './IHttp.Request.Pipeline';
import { GetRoutesFunction, GetRoutes } from './Route.Functions';
import { Core, IAppConfig, IApplication } from '@trapize/core';

/**
 *
 *
 * @export
 * @abstract
 * @class HttpApplication
 * @implements {IApplication}
 */
@injectable()
export abstract class HttpApplication implements IApplication {
    /**
     *
     *
     * @protected
     * @type {Container}
     * @memberof HttpApplication
     */
    protected container: Container = new Container();
    /**
     *
     *
     * @protected
     * @type {GetRoutesFunction}
     * @memberof HttpApplication
     */
    protected GetRoutes: GetRoutesFunction;

    /**
     *Creates an instance of HttpApplication.
     * @param {IAppConfig} appConfig
     * @param {IHttpRequestPipeline} pipeline
     * @param {GetRoutesFunction} [getRoutes]
     * @memberof HttpApplication
     */
    public constructor(
        @inject(Core.Configuration.IAppConfig) protected appConfig: IAppConfig,
        @inject(WebSymbols.IHttpRequestPipeline) protected pipeline: IHttpRequestPipeline,
        @inject(WebSymbols.GetRoutes) @optional() getRoutes?: GetRoutesFunction
    ) {
        this.GetRoutes = getRoutes || GetRoutes;
    }

    /**
     *
     *
     * @param {Container} container
     * @returns {Promise<void>}
     * @memberof HttpApplication
     */
    public async Run(container: Container): Promise<void> {
        this.container = container;
        await this.RegisterMiddleware();
        await this.RegisterRoutes();
        await this.RegisterErrorHandling();
        return this.Listen();
    }

    /**
     *
     *
     * @abstract
     * @returns {Promise<void>}
     * @memberof HttpApplication
     */
    public abstract RegisterMiddleware(): Promise<void>;
    /**
     *
     *
     * @abstract
     * @returns {Promise<void>}
     * @memberof HttpApplication
     */
    public abstract RegisterRoutes(): Promise<void>;
    /**
     *
     *
     * @abstract
     * @returns {Promise<void>}
     * @memberof HttpApplication
     */
    public abstract RegisterErrorHandling(): Promise<void>;
    /**
     *
     *
     * @abstract
     * @returns {Promise<void>}
     * @memberof HttpApplication
     */
    public abstract Listen(): Promise<void>;
}