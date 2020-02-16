import { injectable } from 'inversify';
import { IHttpUser } from './IHttp.User';
import { IHttpRoute } from './IHttp.Route';
import { IAuthorizationService } from './IAuthorization.Service';

/**
 *
 *
 * @export
 * @class RoleAuthorizationService
 * @implements {IAuthorizationService}
 */
@injectable()
export class RoleAuthorizationService implements IAuthorizationService {

    /**
     *
     *
     * @param {IHttpUser} user
     * @param {IHttpRoute<any>} route
     * @returns {Promise<boolean>}
     * @memberof RoleAuthorizationService
     */
    public async Authorize(user: IHttpUser, route: IHttpRoute<any>): Promise<boolean> {
        return route.roles.reduce((prev: boolean, role: string, index: number) => {
            const hasRole = user.Roles.indexOf(role) > -1
            return route.authorizationStrategy.RoleStrategy === 'ALL' ? (prev && hasRole) : (index === 0 ? hasRole : (prev || hasRole));
        }, true);
    }
    
}