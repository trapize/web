import { IHttpRequest } from './IHttp.Request';
import { IHttpRoute } from './IHttp.Route';
import { IHttpResponse } from './IHttp.Response';
import { Container } from 'inversify';

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
}