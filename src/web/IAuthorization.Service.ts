import { IHttpUser } from './IHttp.User';
import { IHttpRoute } from './IHttp.Route';

/**
 *
 *
 * @export
 * @interface IAuthorizationService
 */
export interface IAuthorizationService {
    /**
     *
     *
     * @param {IHttpUser} user
     * @param {IHttpRoute<any>} route
     * @returns {Promise<boolean>}
     * @memberof IAuthorizationService
     */
    Authorize(user: IHttpUser, route: IHttpRoute<any>): Promise<boolean>;
}