/**
 *
 *
 * @export
 * @interface IHttpResponse
 */
export interface IHttpResponse {
    /**
     *
     *
     * @param {number} code
     * @returns {this}
     * @memberof IHttpResponse
     */
    status(code: number): this;
    /**
     *
     *
     * @param {*} [data]
     * @returns {this}
     * @memberof IHttpResponse
     */
    send(data?: any): this;
}