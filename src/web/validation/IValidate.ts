import { IValidationError } from './IValidation.Error';

/**
 *
 *
 * @export
 * @interface IValidate
 * @template Input
 * @template Output
 */
export interface IValidate<Input, Output = Input> {
    /**
     *
     *
     * @param {Input} valueString
     * @param {(errors?: IValidationError, value?: Output) => void} callback
     * @memberof IValidate
     */
    Validate(valueString: Input, callback: (errors?: IValidationError, value?: Output) => void): void
}