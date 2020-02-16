import { IValidate } from './IValidate';

/**
 *
 *
 * @export
 * @interface IValidatable
 */
export interface IValidatable {
    [key: string]: IValidate<any>;
}