import { IHttpUser } from './IHttp.User';
import { IHttpRequest } from './IHttp.Request';
import { IHttpResponse } from './IHttp.Response';
import { IHttpRoute } from './IHttp.Route';

/**
 *
 *
 * @export
 * @interface IHttpContext
 */
export interface IHttpContext {
    /**
     *
     *
     * @type {IHttpUser}
     * @memberof IHttpContext
     */
    User: IHttpUser;
    /**
     *
     *
     * @type {IHttpRequest}
     * @memberof IHttpContext
     */
    Request: IHttpRequest;
    /**
     *
     *
     * @type {IHttpResponse}
     * @memberof IHttpContext
     */
    Response: IHttpResponse;
    /**
     *
     *
     * @type {IHttpRoute<any>}
     * @memberof IHttpContext
     */
    Route: IHttpRoute<any>;
}