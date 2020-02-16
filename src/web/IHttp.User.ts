/**
 *
 *
 * @export
 * @interface IHttpUser
 */
export interface IHttpUser {
    /**
     *
     *
     * @type {number}
     * @memberof IHttpUser
     */
    Id: number;
    /**
     *
     *
     * @type {string}
     * @memberof IHttpUser
     */
    Username: string;
    /**
     *
     *
     * @type {string[]}
     * @memberof IHttpUser
     */
    Roles: string[];
}