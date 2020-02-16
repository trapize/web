import { IValidatable } from './IValidatable';
import { IValidationError } from './IValidation.Error';
import { IRequestValidatable } from './IRequest.Validatable';
import { IHttpRequest } from '../IHttp.Request';
import { IValidateRequestResult } from './IValidate.Request.Result';
import { IValidate } from './IValidate';

/**
 *
 *
 * @export
 * @abstract
 * @class Validator
 * @implements {IValidate<Input, Output>}
 * @template Input
 * @template Output
 */
export abstract class Validator<Input, Output = Input> implements IValidate<Input, Output> {

    /**
     *
     *
     * @static
     * @param {IValidatable} validator
     * @param {*} obj
     * @param {(error?: IValidationError[], values?: {[key: string]: any}) => void} callback
     * @memberof Validator
     */
    public static Validate(validator: IValidatable, obj: any, callback: (error?: IValidationError[], values?: {[key: string]: any}) => void): void {
        const errors: IValidationError[] = []
        const result: any = {};

        Object.getOwnPropertyNames(validator).forEach(prop => {
            validator[prop].Validate(obj[prop], (error, value) => {
                if(error) {
                    errors.push(error);
                } else {
                    result[prop] = value;
                }
            });
        });

        

        if(errors.length) {
            callback(errors);
        } else {
            callback(undefined, result);
        }
    }

    /**
     *
     *
     * @static
     * @param {IRequestValidatable} validator
     * @param {IHttpRequest} req
     * @returns {Promise<IValidateRequestResult>}
     * @memberof Validator
     */
    public static async ValidateRequest(validator: IRequestValidatable, req: IHttpRequest): Promise<IValidateRequestResult> {
        const result: IValidateRequestResult = <any>{};
        return (validator.params ? this.ValidatePromise(validator.params, req.params) : Promise.resolve({}))
            .catch(err => {
                result.errors = {
                    params: err
                };
                return Promise.resolve({});
            })
            .then(params => {
                result.params = params;
                return validator.query ? this.ValidatePromise(validator.query, req.query) : Promise.resolve({});
            })
            .catch(err => {
                result.errors = {
                    ...result.errors,
                    query: err
                };
                return Promise.resolve({});
            })
            .then(query => {
                result.query = query;
                return validator.body ? this.ValidatePromise(validator.body, req.body) : Promise.resolve({});
            })
            .catch(err => {
                result.errors = {
                    ...result.errors,
                    body: err
                };
                return Promise.resolve({});
            })
            .then(body => {
                result.body = body;
                return result;
            })
            .then(res => {
                if(!res.errors) {
                    Object.getOwnPropertyNames(res.body).forEach(key => {
                        req.body[key] = res.body[key];
                    });
                    Object.getOwnPropertyNames(res.query).forEach(key => {
                        req.query[key] = res.query[key];
                    });
                    Object.getOwnPropertyNames(res.params).forEach(key => {
                        req.params[key] = res.params[key];
                    });
                }
                
                return result;
            });
    }

    /**
     *
     *
     * @private
     * @static
     * @param {IValidatable} validator
     * @param {*} obj
     * @returns {Promise<{[key: string]: any}>}
     * @memberof Validator
     */
    private static ValidatePromise(validator: IValidatable, obj: any): Promise<{[key: string]: any}> {
        return new Promise<{[key: string]: any}>((resolve, reject) => {
            this.Validate(validator, obj, (err, values) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(values);
                }
            });
        });
    }

    /**
     *
     *
     * @protected
     * @type {boolean}
     * @memberof Validator
     */
    protected isRequired: boolean = false;
    /**
     *
     *
     * @protected
     * @type {string}
     * @memberof Validator
     */
    protected requiredMessage?: string;

    /**
     *Creates an instance of Validator.
     * @param {string} name
     * @memberof Validator
     */
    public constructor(protected name: string) {}

    /**
     *
     *
     * @param {string} [message]
     * @returns {this}
     * @memberof Validator
     */
    public Required(message?: string): this {
        this.isRequired = true;
        this.requiredMessage = message;
        return this;
    }

    /**
     *
     *
     * @param {Input} value
     * @param {(e?: IValidationError, v?: Output) => void} callback
     * @returns {void}
     * @memberof Validator
     */
    public Validate(value: Input, callback: (e?: IValidationError, v?: Output) => void): void {
        if(this.isRequired && (value === undefined || value === null)) {
            callback({name: this.name, errors: [this.requiredMessage || 'Required']});
            return;
        } else if(!this.isRequired && (value === undefined || value === null)) {
            callback(undefined, undefined);
            return;
        }
        this.doValidate(value, callback);
    }

    /**
     *
     *
     * @protected
     * @abstract
     * @param {Input} value
     * @param {(e?: IValidationError, v?: Output) => void} callback
     * @memberof Validator
     */
    protected abstract doValidate(value: Input, callback: (e?: IValidationError, v?: Output) => void): void;
}