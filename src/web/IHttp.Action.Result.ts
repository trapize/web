/**
 *
 *
 * @export
 * @interface IHttpActionResult
 */
export interface IHttpActionResult {
    /**
     *
     *
     * @type {number}
     * @memberof IHttpActionResult
     */
    code: number;
    /**
     *
     *
     * @type {*}
     * @memberof IHttpActionResult
     */
    data?: any;
    /**
     *
     *
     * @type {*}
     * @memberof IHttpActionResult
     */
    error?: any;
}