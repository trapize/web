import 'reflect-metadata';
import { IAuthorizationStrategy } from '../../src/web/IAuthorization.Strategy';
import { IHttpRoute } from '../../src/web/IHttp.Route';
import { RoleAuthorizationService } from '../../src/web/Role.Authorization.Service';

const anyRole = <IAuthorizationStrategy>{
    RoleStrategy: 'ANY'
};

const allRoles = <IAuthorizationStrategy> {
    RoleStrategy: 'ALL'
};

const noRoles = <IHttpRoute<'GET'>>{
    path: '/noRoles',
    method: 'GET',
    action: 'getNoRoles',
    controller: jest.fn(),
    authenticationStrategy: <any>{},
    authorizationStrategy: anyRole,
    cacheStrategy: <any>{},
    roles: []
};

const rolesAnyRoles = <IHttpRoute<'GET'>>{
    path: '/noRoles',
    method: 'GET',
    action: 'getNoRoles',
    controller: jest.fn(),
    authenticationStrategy: <any>{},
    authorizationStrategy: anyRole,
    cacheStrategy: <any>{},
    roles: ['SiteUser', 'Admin']
};


const rolesAllRoles = <IHttpRoute<'GET'>>{
    path: '/noRoles',
    method: 'GET',
    action: 'getNoRoles',
    controller: jest.fn(),
    authenticationStrategy: <any>{},
    authorizationStrategy: allRoles,
    cacheStrategy: <any>{},
    roles: ['SiteUser', 'Admin']
};

const annonymous = {
    Id: 0,
    Username: 'ANNONYMOUS',
    Roles: []
};

const user = {
    Id: 15,
    Username: 'Thia',
    Roles: ['SiteUser']
};

const admin = {
    Id: 155,
    Username: 'Admin',
    Roles: ['SiteUser', 'Admin']
};

describe('Role Authorization Service', () => {
    it('Should Allow all users to access', async () => {
        const auth = new RoleAuthorizationService();
        const annon = await auth.Authorize(annonymous, noRoles);
        const u = await auth.Authorize(user, noRoles);
        const a = await auth.Authorize(admin, noRoles);
        expect(annon).toBe(true);
        expect(u).toBe(true);
        expect(a).toBe(true);
    });

    it('Should allow anyone with at least one role', async () => {
        const auth = new RoleAuthorizationService();
        const annon = await auth.Authorize(annonymous, rolesAnyRoles);
        const u = await auth.Authorize(user, rolesAnyRoles);
        const a = await auth.Authorize(admin, rolesAnyRoles);
        expect(annon).toBe(false);
        expect(u).toBe(true);
        expect(a).toBe(true);
    });
    
    it('Should allow anyone with all roles', async () => {
        const auth = new RoleAuthorizationService();
        const annon = await auth.Authorize(annonymous, rolesAllRoles);
        const u = await auth.Authorize(user, rolesAllRoles);
        const a = await auth.Authorize(admin, rolesAllRoles);
        expect(annon).toBe(false);
        expect(u).toBe(false);
        expect(a).toBe(true);
    });
});