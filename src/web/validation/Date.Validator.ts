import { Validator } from './Validator';
import { IValidationError } from './IValidation.Error';

/**
 *
 *
 * @export
 * @class DateValidator
 * @extends {(Validator<string|Date, Date>)}
 */
export class DateValidator extends Validator<string|Date, Date> {

    /**
     *
     *
     * @protected
     * @param {(string|Date)} value
     * @param {(e?: IValidationError, v?: Date) => void} callback
     * @memberof DateValidator
     */
    protected doValidate(value: string|Date, callback: (e?: IValidationError, v?: Date) => void): void {
        const date = value instanceof Date ? value : new Date(value);
        if(date.toString() === 'Invalid Date') {
            callback({name: this.name, errors: ['Invalid Date String']});
        } else {
            callback(undefined, date);
        }
    }
}