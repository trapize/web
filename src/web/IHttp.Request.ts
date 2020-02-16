import { HttpMethod } from './Http.Method';

/**
 *
 *
 * @export
 * @interface IHttpRequest
 */
export interface IHttpRequest {
    /**
     *
     *
     * @type {{[key: string]: any}}
     * @memberof IHttpRequest
     */
    readonly body: {[key: string]: any};
    /**
     *
     *
     * @type {{[key: string]: any}}
     * @memberof IHttpRequest
     */
    readonly query: {[key: string]: any};
    /**
     *
     *
     * @type {{[key: string]: any}}
     * @memberof IHttpRequest
     */
    readonly params: {[key: string]: any};
    /**
     *
     *
     * @type {HttpMethod}
     * @memberof IHttpRequest
     */
    readonly method: HttpMethod;
    /**
     *
     *
     * @type {string}
     * @memberof IHttpRequest
     */
    uuid: string;
    /**
     *
     *
     * @param {...string[]} keys
     * @returns {(any | undefined)}
     * @memberof IHttpRequest
     */
    get(...keys: string[]): any | undefined;
}