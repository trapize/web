import { IHttpResponse } from './IHttp.Response';
import express from 'express';

/**
 *
 *
 * @export
 * @class ExpressResponse
 * @implements {IHttpResponse}
 */
export class ExpressResponse implements IHttpResponse {
    /**
     *Creates an instance of ExpressResponse.
     * @param {express.Response} res
     * @memberof ExpressResponse
     */
    public constructor(private res: express.Response) {}

    /**
     *
     *
     * @param {number} code
     * @returns {this}
     * @memberof ExpressResponse
     */
    public status(code: number): this {
        this.res.status(code);
        return this;
    }

    /**
     *
     *
     * @param {*} [data]
     * @returns {this}
     * @memberof ExpressResponse
     */
    public send(data?: any): this {
        this.res.send(data);
        return this;
    }
}