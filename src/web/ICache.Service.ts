/**
 *
 *
 * @export
 * @interface ICacheService
 */
export interface ICacheService {
    /**
     *
     *
     * @param {string} key
     * @returns {Promise<any>}
     * @memberof ICacheService
     */
    get(key: string): Promise<any>;
    /**
     *
     *
     * @param {string} key
     * @param {*} value
     * @memberof ICacheService
     */
    set(key: string, value: any): void;
}