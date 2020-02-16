import { IValidatable } from './IValidatable';

/**
 *
 *
 * @export
 * @interface IRequestValidatable
 */
export interface IRequestValidatable {
    /**
     *
     *
     * @type {IValidatable}
     * @memberof IRequestValidatable
     */
    params?: IValidatable;
    /**
     *
     *
     * @type {IValidatable}
     * @memberof IRequestValidatable
     */
    query?: IValidatable;
    /**
     *
     *
     * @type {IValidatable}
     * @memberof IRequestValidatable
     */
    body?: IValidatable;
}