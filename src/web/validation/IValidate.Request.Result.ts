import { IValidationError } from './IValidation.Error';

/**
 *
 *
 * @export
 * @interface IValidateRequestResult
 */
export interface IValidateRequestResult {
    /**
     *
     *
     * @type {{
     *         body?: IValidationError[];
     *         params?: IValidationError[];
     *         query?: IValidationError[]
     *     }}
     * @memberof IValidateRequestResult
     */
    errors?: {
        body?: IValidationError[];
        params?: IValidationError[];
        query?: IValidationError[]
    };
    /**
     *
     *
     * @type {{[key: string]: any}}
     * @memberof IValidateRequestResult
     */
    body: {[key: string]: any};
    /**
     *
     *
     * @type {{[key: string]: any}}
     * @memberof IValidateRequestResult
     */
    params: {[key: string]: any};
    /**
     *
     *
     * @type {{[key: string]: any}}
     * @memberof IValidateRequestResult
     */
    query: {[key: string]: any};
}