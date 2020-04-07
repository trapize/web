import { IHttpRequest } from './IHttp.Request';
import { IHttpRoute } from './IHttp.Route';
import { IHttpResponse } from './IHttp.Response';
import { Container } from 'inversify';
import { IHttpUser } from './IHttp.User';

/**
 *
 *
 * @export
 * @interface IHttpRequestPipeline
 */
export interface IHttpRequestPipeline {
    /**
     *
     *
     * @param {IHttpRequest} request
     * @param {IHttpResponse} response
     * @param {IHttpRoute<any>} route
     * @param {Container} container
     * @returns {Promise<void>}
     * @memberof IHttpRequestPipeline
     */
    Execute(request: IHttpRequest, response: IHttpResponse, route: IHttpRoute<any>, container: Container): Promise<void>;
    /**
     *
     *
     * @param {'BeginRequest'} event
     * @param {(req: IHttpRequest, route: IHttpRoute<any>) => void} listener
     * @memberof IHttpRequestPipeline
     */
    on(event: 'BeginRequest', listener:(req: IHttpRequest, route: IHttpRoute<any>) => void): void;
    /**
     *
     *
     * @param {'PreAuthenticate'} event
     * @param {(reqId: string, route: IHttpRoute<any>) => void} listener
     * @memberof IHttpRequestPipeline
     */
    on(event: 'PreAuthenticate', listener:(reqId: string, route: IHttpRoute<any>) => void): void;
    /**
     *
     *
     * @param {'PostAuthenticate'} event
     * @param {(reqId: string, route: IHttpRoute<any>, user: IHttpUser) => void} listener
     * @memberof IHttpRequestPipeline
     */
    on(event: 'PostAuthenticate', listener:(reqId: string, route: IHttpRoute<any>, user: IHttpUser) => void): void;
    /**
     *
     *
     * @param {'PreAuthorize'} event
     * @param {(reqId: string, route: IHttpRoute<any>, user: IHttpUser) => void} listener
     * @memberof IHttpRequestPipeline
     */
    on(event: 'PreAuthorize', listener:(reqId: string, route: IHttpRoute<any>, user: IHttpUser) => void): void;
    /**
     *
     *
     * @param {'PostAuthorize'} event
     * @param {(reqId: string, route: IHttpRoute<any>, user: IHttpUser) => void} listener
     * @memberof IHttpRequestPipeline
     */
    on(event: 'PostAuthorize', listener:(reqId: string, route: IHttpRoute<any>, user: IHttpUser) => void): void;
    /**
     *
     *
     * @param {'PreValidate'} event
     * @param {(reqId: string, route: IHttpRoute<any>) => void} listener
     * @memberof IHttpRequestPipeline
     */
    on(event: 'PreValidate', listener:(reqId: string, route: IHttpRoute<any>) => void): void;
    /**
     *
     *
     * @param {'PostValidate'} event
     * @param {(reqId: string, route: IHttpRoute<any>) => void} listener
     * @memberof IHttpRequestPipeline
     */
    on(event: 'PostValidate', listener:(reqId: string, route: IHttpRoute<any>) => void): void;
    /**
     *
     *
     * @param {'PreCacheCheck'} event
     * @param {(reqId: string, route: IHttpRoute<any>) => void} listener
     * @memberof IHttpRequestPipeline
     */
    on(event: 'PreCacheCheck', listener:(reqId: string, route: IHttpRoute<any>) => void): void;
    /**
     *
     *
     * @param {'PostCacheCheck'} event
     * @param {(reqId: string, route: IHttpRoute<any>, result?: any) => void} listener
     * @memberof IHttpRequestPipeline
     */
    on(event: 'PostCacheCheck', listener:(reqId: string, route: IHttpRoute<any>, result?: any) => void): void;
    /**
     *
     *
     * @param {'PreRouteAction'} event
     * @param {(reqId: string, route: IHttpRoute<any>) => void} listener
     * @memberof IHttpRequestPipeline
     */
    on(event: 'PreRouteAction', listener:(reqId: string, route: IHttpRoute<any>) => void): void;
    /**
     *
     *
     * @param {'PostRouteAction'} event
     * @param {(reqId: string, route: IHttpRoute<any>, result?: any) => void} listener
     * @memberof IHttpRequestPipeline
     */
    on(event: 'PostRouteAction', listener:(reqId: string, route: IHttpRoute<any>, result?: any) => void): void;
    /**
     *
     *
     * @param {'PreCacheSet'} event
     * @param {(reqId: string, route: IHttpRoute<any>, result?: any) => void} listener
     * @memberof IHttpRequestPipeline
     */
    on(event: 'PreCacheSet', listener:(reqId: string, route: IHttpRoute<any>, result?: any) => void): void;
    /**
     *
     *
     * @param {'PostCacheSet'} event
     * @param {(reqId: string, route: IHttpRoute<any>, result?: any) => void} listener
     * @memberof IHttpRequestPipeline
     */
    on(event: 'PostCacheSet', listener:(reqId: string, route: IHttpRoute<any>, result?: any) => void): void;
    /**
     *
     *
     * @param {'EndRequest'} event
     * @param {(reqId: string, route: IHttpRoute<any>, result?: any) => void} listener
     * @memberof IHttpRequestPipeline
     */
    on(event: 'EndRequest', listener:(reqId: string, route: IHttpRoute<any>, result?: any) => void): void;
    /**
     *
     *
     * @param {'Error'} event
     * @param {(reqId: string, route: IHttpRoute<any>, error?: any) => void} listener
     * @memberof IHttpRequestPipeline
     */
    on(event: 'Error', listener:(reqId: string, route: IHttpRoute<any>, error?: any) => void): void;
}