import { Validator } from './Validator';
import { IValidatable } from './IValidatable';
import { IValidationError } from './IValidation.Error';

/**
 *
 *
 * @export
 * @class ObjectValidator
 * @extends {Validator<any, any>}
 */
export class ObjectValidator extends Validator<any, any> {
    /**
     *Creates an instance of ObjectValidator.
     * @param {string} name
     * @param {IValidatable} validatable
     * @memberof ObjectValidator
     */
    public constructor(name: string, private validatable: IValidatable) {
        super(name);
    }

    /**
     *
     *
     * @protected
     * @param {*} value
     * @param {(e?: IValidationError, v?: any) => void} callback
     * @memberof ObjectValidator
     */
    protected doValidate(value: any, callback: (e?: IValidationError, v?: any) => void): void {
        Validator.Validate(this.validatable, value, (errors, retVal) => {
            if(errors) {
                callback({name: this.name, innerErrors: errors})
            } else {
                callback(undefined, retVal);
            }
        });
    }
}