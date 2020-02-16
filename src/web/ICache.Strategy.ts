import { IHttpContext } from './IHttp.Context';

export interface ICacheStrategy {
    /**
     *
     *
     * @type {boolean}
     * @memberof ICacheStrategy
     */
    /**
     *
     *
     * @type {boolean}
     * @memberof ICacheStrategy
     */
    IsCacheable: boolean;
    /**
     *
     *
     * @param {IHttpContext} context
     * @returns {string}
     * @memberof ICacheStrategy
     */
    GetKey(context: IHttpContext): string;
}