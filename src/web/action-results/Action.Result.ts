import { IHttpActionResult } from '../IHttp.Action.Result';
import { IsObjectable } from '@trapize/core';

/**
 *
 *
 * @export
 * @class ActionResult
 * @implements {IHttpActionResult}
 */
export class ActionResult implements IHttpActionResult {
    /**
     *
     *
     * @type {*}
     * @memberof ActionResult
     */
    public data?: any;
    /**
     *
     *
     * @type {*}
     * @memberof ActionResult
     */
    public error?: any;
    
    /**
     *Creates an instance of ActionResult.
     * @param {number} code
     * @param {*} [data]
     * @param {*} [error]
     * @memberof ActionResult
     */
    public constructor(public code: number, data?: any, error?: any) {
        this.data = IsObjectable(data) ? data.ToJSON() : Array.isArray(data) ? data.map(d => IsObjectable(d) ? d.ToJSON() : d) : data;
        this.error = IsObjectable(error) ? error.ToJSON() : error;
    }

    /**
     *
     *
     * @returns {{[key: string]: any}}
     * @memberof ActionResult
     */
    public ToJSON(): {[key: string]: any} {
        return {
            code: this.code,
            data: this.data,
            error: this.error
        };
    }
}
