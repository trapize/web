/**
 *
 *
 * @export
 * @interface IValidationError
 */
export interface IValidationError {
    /**
     *
     *
     * @type {string}
     * @memberof IValidationError
     */
    name: string;
    /**
     *
     *
     * @type {string[]}
     * @memberof IValidationError
     */
    errors?: string[];
    /**
     *
     *
     * @type {IValidationError[]}
     * @memberof IValidationError
     */
    innerErrors?: IValidationError[];
}