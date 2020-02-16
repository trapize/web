import { IHttpRequest } from './IHttp.Request';
import express from 'express';
import { HttpMethod } from './Http.Method';

/**
 *
 *
 * @export
 * @class ExpressRequest
 * @implements {IHttpRequest}
 */
export class ExpressRequest implements IHttpRequest {
    /**
     *
     *
     * @memberof ExpressRequest
     */
    public uuid = '';

    /**
     *Creates an instance of ExpressRequest.
     * @param {express.Request} req
     * @memberof ExpressRequest
     */
    public constructor(private req: express.Request) {}

    /**
     *
     *
     * @readonly
     * @type {{[key: string]: any}}
     * @memberof ExpressRequest
     */
    public get body(): {[key: string]: any} {
        return this.req.body;
    }

    /**
     *
     *
     * @readonly
     * @type {{[key: string]: any}}
     * @memberof ExpressRequest
     */
    public get query(): {[key: string]: any} {
        return this.req.query;
    }

    /**
     *
     *
     * @readonly
     * @type {{[key: string]: any}}
     * @memberof ExpressRequest
     */
    public get params(): {[key: string]: any} {
        return this.req.params;
    }

    /**
     *
     *
     * @readonly
     * @type {HttpMethod}
     * @memberof ExpressRequest
     */
    public get method(): HttpMethod {
        return <HttpMethod>this.req.method.toUpperCase();
    }

    /**
     *
     *
     * @param {...string[]} keys
     * @returns {(any | undefined)}
     * @memberof ExpressRequest
     */
    public get(...keys: string[]): any | undefined {
        return keys.reduce((val: any, key: string) => val?.[key], this.req);
    }
}