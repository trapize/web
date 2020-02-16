import { IAuthenticationStrategy } from './IAuthentication.Strategy';
import { IAuthorizationStrategy } from './IAuthorization.Strategy';
import { ICacheStrategy } from './ICache.Strategy';
import { HttpMethod } from './Http.Method';
import { IHttpRoute } from './IHttp.Route';
import { IRequestValidatable } from './validation/IRequest.Validatable';
import { WebExceptions } from './Web.Exception';

/**
 *
 *
 * @interface IRouteController
 */
interface IRouteController {
    /**
     *
     *
     * @type {string}
     * @memberof IRouteController
     */
    prefix?: string;
    /**
     *
     *
     * @type {IAuthenticationStrategy}
     * @memberof IRouteController
     */
    authenticationStrategy?: IAuthenticationStrategy;
    /**
     *
     *
     * @type {IAuthorizationStrategy}
     * @memberof IRouteController
     */
    authorizationStrategy?: IAuthorizationStrategy;
    /**
     *
     *
     * @type {string[]}
     * @memberof IRouteController
     */
    roles?: string[];
    /**
     *
     *
     * @type {ICacheStrategy}
     * @memberof IRouteController
     */
    cacheStrategy?: ICacheStrategy;
    /**
     *
     *
     * @type {Map<string, IRoute>}
     * @memberof IRouteController
     */
    routes: Map<string, IRoute>;
    /**
     *
     *
     * @type {Function}
     * @memberof IRouteController
     */
    controller: Function;
}

/**
 *
 *
 * @interface IRoute
 */
interface IRoute {
    /**
     *
     *
     * @type {string}
     * @memberof IRoute
     */
    path: string;
    /**
     *
     *
     * @type {HttpMethod}
     * @memberof IRoute
     */
    method: HttpMethod;
    /**
     *
     *
     * @type {string}
     * @memberof IRoute
     */
    action: string;
    /**
     *
     *
     * @type {IAuthenticationStrategy}
     * @memberof IRoute
     */
    authenticationStrategy?: IAuthenticationStrategy;
    /**
     *
     *
     * @type {IAuthorizationStrategy}
     * @memberof IRoute
     */
    authorizationStrategy?: IAuthorizationStrategy;
    /**
     *
     *
     * @type {string[]}
     * @memberof IRoute
     */
    roles?: string[];
    /**
     *
     *
     * @type {ICacheStrategy}
     * @memberof IRoute
     */
    cacheStrategy?: ICacheStrategy;
    /**
     *
     *
     * @type {IRequestValidatable}
     * @memberof IRoute
     */
    validator?: IRequestValidatable;
}

const routeControllers: Map<Function, IRouteController> = new Map<Function, IRouteController>();

/**
 *
 *
 * @export
 * @param {{
 *     authentication: IAuthenticationStrategy;
 *     authorization: IAuthorizationStrategy;
 *     cache: ICacheStrategy
 * }} defaults
 * @returns {IHttpRoute<any>[]}
 */
export function GetRoutes(defaults: {
    authentication: IAuthenticationStrategy;
    authorization: IAuthorizationStrategy;
    cache: ICacheStrategy
}): IHttpRoute<any>[] {
    const routes: IHttpRoute<any>[] = [];
    Array.from(routeControllers.values()).forEach(routeController => {
        routeController.routes.forEach(route => {
            routes.push({
                path: GetPath(routeController.prefix, route.path),
                method: route.method,
                action: route.action,
                authenticationStrategy: route.authenticationStrategy || routeController.authenticationStrategy || defaults.authentication,
                authorizationStrategy: route.authorizationStrategy || routeController.authorizationStrategy || defaults.authorization,
                cacheStrategy: route.method === 'GET' ? route.cacheStrategy || routeController.cacheStrategy || defaults.cache : undefined,
                controller: routeController.controller,
                roles: route.roles || routeController.roles || [],
                validator: route.validator
            });
        });
    });
    return routes;
}

export type GetRoutesFunction = (defaults: {authentication: IAuthenticationStrategy, authorization: IAuthorizationStrategy, cache: ICacheStrategy}) => IHttpRoute<any>[];

/**
 *
 *
 * @param {(string | undefined)} prefix
 * @param {string} path
 * @returns {string}
 */
function GetPath(prefix: string | undefined, path: string): string {
    if(!prefix) {
        return `${path.startsWith('/') ? path : '/' + path}`.replace(/\/{2,}/g, '/');
    }
    return `${prefix.startsWith('/') ? prefix : '/' + prefix}${path.startsWith('/') ? path : '/' + path}`.replace(/\/{2,}/g, '/');
}

/**
 *
 *
 * @export
 * @param {{
 *     prefix?: string;
 *     authenticationStrategy?: IAuthenticationStrategy;
 *     authorizationStrategy?: IAuthorizationStrategy;
 *     roles?: string[];
 *     cacheStrategy?: ICacheStrategy;
 * }} [controllerOptions]
 * @returns {ClassDecorator}
 */
export function HttpController(controllerOptions?: {
    prefix?: string;
    authenticationStrategy?: IAuthenticationStrategy;
    authorizationStrategy?: IAuthorizationStrategy;
    roles?: string[];
    cacheStrategy?: ICacheStrategy;
}): ClassDecorator {
    return (target: Function) => {
        const options = controllerOptions || {};
        const rc = GetRouteController(target);
        rc.roles = options.roles;
        rc.prefix = options.prefix;
        rc.authenticationStrategy = options.authenticationStrategy;
        rc.authorizationStrategy = options.authorizationStrategy;
        rc.cacheStrategy = options.cacheStrategy;
        SetRouteController(rc);
    }
}

/**
 *
 *
 * @param {Function} fn
 * @returns {IRouteController}
 */
function GetRouteController(fn: Function): IRouteController {
    return routeControllers.get(fn) || {
        routes: new Map<string, IRoute>(),
        controller: fn
    };
}

/**
 *
 *
 * @param {IRouteController} routeController
 */
function SetRouteController(routeController: IRouteController): void {
    routeControllers.set(routeController.controller, routeController);
}

/**
 *
 *
 * @param {Function} fn
 * @param {(string | symbol)} property
 * @returns {(IRoute | undefined)}
 */
function GetRoute(fn: Function, property: string | symbol): IRoute | undefined {
    /* istanbul ignore if */
    if(typeof property === 'symbol') {
        throw new WebExceptions.InvalidRouteDefinitionException('Unable to get a route for a symbol property');
    }
    return GetRouteController(fn).routes.get(property);
}

/**
 *
 *
 * @param {Function} fn
 * @param {IRoute} route
 */
function SetRoute(fn: Function, route: IRoute): void {
    const rc = GetRouteController(fn);
    rc.routes.set(route.action, route);
    SetRouteController(rc);
}

/**
 *
 *
 * @param {string} path
 * @param {HttpMethod} method
 * @returns {MethodDecorator}
 */
function RoutePath(path: string, method: HttpMethod): MethodDecorator {
    return (target: Object, property: string | symbol, descriptor: any) => {
        const route = GetRoute(target.constructor, property) || <IRoute>{};
        route.path = path;
        route.action = <string>property;
        route.method = method;
        SetRoute(target.constructor, route);
    }
}

/**
 *
 *
 * @export
 * @param {string} path
 * @returns {MethodDecorator}
 */
export function HttpGet(path: string): MethodDecorator {
    return RoutePath(path, 'GET');
}

/**
 *
 *
 * @export
 * @param {string} path
 * @returns {MethodDecorator}
 */
export function HttpPut(path: string): MethodDecorator {
    return RoutePath(path, 'PUT');
}

/**
 *
 *
 * @export
 * @param {string} path
 * @returns {MethodDecorator}
 */
export function HttpPost(path: string): MethodDecorator {
    return RoutePath(path, 'POST');
}

/**
 *
 *
 * @export
 * @param {string} path
 * @returns {MethodDecorator}
 */
export function HttpPatch(path: string): MethodDecorator {
    return RoutePath(path, 'PATCH');
}

/**
 *
 *
 * @export
 * @param {string} path
 * @returns {MethodDecorator}
 */
export function HttpDelete(path: string): MethodDecorator {
    return RoutePath(path, 'DELETE');
}

/**
 *
 *
 * @export
 * @param {string} path
 * @returns {MethodDecorator}
 */
export function HttpHead(path: string): MethodDecorator {
    return RoutePath(path, 'HEAD');
}

/**
 *
 *
 * @export
 * @param {string} path
 * @returns {MethodDecorator}
 */
export function HttpOptions(path: string): MethodDecorator {
    return RoutePath(path, 'OPTIONS');
}

/**
 *
 *
 * @export
 * @param {IAuthenticationStrategy} [strategy]
 * @returns {MethodDecorator}
 */
export function Authenticate(strategy?: IAuthenticationStrategy): MethodDecorator {
    return (target: Object, property: string | symbol, descriptor: any) => {
        const route = GetRoute(target.constructor, property) || <IRoute>{};
        route.authenticationStrategy = strategy || { AllowAnnonymous: false };
        SetRoute(target.constructor, route);
    }
}

/**
 *
 *
 * @export
 * @param {string[]} roles
 * @param {IAuthorizationStrategy} [strategy]
 * @returns {MethodDecorator}
 */
export function Authorize(roles: string[], strategy?: IAuthorizationStrategy): MethodDecorator {
    return (target: Object, property: string | symbol, descriptor: any) => {
        const route = GetRoute(target.constructor, property) || <IRoute>{};
        route.authorizationStrategy = strategy || {RoleStrategy: 'ANY'};
        route.roles = roles;
        SetRoute(target.constructor, route);
    }
}

/**
 *
 *
 * @export
 * @param {ICacheStrategy} [strategy]
 * @returns {MethodDecorator}
 */
export function Cache(strategy?: ICacheStrategy): MethodDecorator {
    return (target: Object, property: string | symbol, descriptor: any) => {
        const route = GetRoute(target.constructor, property) || <IRoute>{};
        route.cacheStrategy = strategy;
        SetRoute(target.constructor, route);
    }
}

/**
 *
 *
 * @export
 * @param {IRequestValidatable} validator
 * @returns {MethodDecorator}
 */
export function Validate(validator: IRequestValidatable): MethodDecorator {
    return (target: Object, property: string | symbol, descriptor: any) => {
        const route = GetRoute(target.constructor, property) || <IRoute>{};
        route.validator = validator;
        SetRoute(target.constructor, route);
    }
}