import { IHttpRequest } from './IHttp.Request';
import { IHttpUser } from './IHttp.User';
import { IAuthenticationStrategy } from './IAuthentication.Strategy';

/**
 *
 *
 * @export
 * @interface IAuthenticationService
 */
export interface IAuthenticationService {
    /**
     *
     *
     * @param {IHttpRequest} request
     * @returns {Promise<IHttpUser>}
     * @memberof IAuthenticationService
     */
    Authenticate(request: IHttpRequest): Promise<IHttpUser>;
    /**
     *
     *
     * @param {IHttpUser} user
     * @param {IAuthenticationStrategy} strategy
     * @returns {Promise<boolean>}
     * @memberof IAuthenticationService
     */
    Allow(user: IHttpUser, strategy: IAuthenticationStrategy): Promise<boolean>;
}