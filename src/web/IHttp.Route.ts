import { HttpMethod } from './Http.Method';
import { IAuthenticationStrategy } from './IAuthentication.Strategy';
import { IAuthorizationStrategy } from './IAuthorization.Strategy';
import { ICacheStrategy } from './ICache.Strategy';
import { IRequestValidatable } from './validation/IRequest.Validatable';

/**
 *
 *
 * @export
 * @interface IHttpRoute
 * @template T
 */
export interface IHttpRoute<T extends HttpMethod> {
    /**
     *
     *
     * @type {string}
     * @memberof IHttpRoute
     */
    path: string;
    /**
     *
     *
     * @type {T}
     * @memberof IHttpRoute
     */
    method: T;
    /**
     *
     *
     * @type {string}
     * @memberof IHttpRoute
     */
    action: string;
    /**
     *
     *
     * @type {Function}
     * @memberof IHttpRoute
     */
    controller: Function;
    /**
     *
     *
     * @type {IAuthenticationStrategy}
     * @memberof IHttpRoute
     */
    authenticationStrategy: IAuthenticationStrategy;
    /**
     *
     *
     * @type {IAuthorizationStrategy}
     * @memberof IHttpRoute
     */
    authorizationStrategy: IAuthorizationStrategy;
    /**
     *
     *
     * @type {T extends 'GET' ? ICacheStrategy : undefined}
     * @memberof IHttpRoute
     */
    cacheStrategy: T extends 'GET' ? ICacheStrategy : undefined;
    /**
     *
     *
     * @type {string[]}
     * @memberof IHttpRoute
     */
    roles: string[];
    /**
     *
     *
     * @type {IRequestValidatable}
     * @memberof IHttpRoute
     */
    validator?: IRequestValidatable;
}