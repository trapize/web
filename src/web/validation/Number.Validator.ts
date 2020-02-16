import { Validator } from './Validator';
import { IValidationError } from './IValidation.Error';
import { Numbers } from '@trapize/core';

/**
 *
 *
 * @export
 * @class NumberValidator
 * @extends {(Validator<number|string, number>)}
 */
export class NumberValidator extends Validator<number|string, number> {
    /**
     *
     *
     * @private
     * @type {number}
     * @memberof NumberValidator
     */
    private max?: number;
    /**
     *
     *
     * @private
     * @type {string}
     * @memberof NumberValidator
     */
    private maxMessage?: string;
    /**
     *
     *
     * @private
     * @type {number}
     * @memberof NumberValidator
     */
    private min?: number;
    /**
     *
     *
     * @private
     * @type {string}
     * @memberof NumberValidator
     */
    private minMessage?: string;

    /**
     *Creates an instance of NumberValidator.
     * @param {string} name
     * @param {string} [NaNMessage='Value is invalid: Not a number']
     * @memberof NumberValidator
     */
    public constructor(name: string, private NaNMessage: string = 'Value is invalid: Not a number') {
        super(name);
    }

    /**
     *
     *
     * @param {(number|string)} valueString
     * @returns {(number | undefined)}
     * @memberof NumberValidator
     */
    public tryParse(valueString: number|string): number | undefined {
        return typeof valueString === 'number' ? valueString : Numbers.TryToFloat(valueString);
    }

    /**
     *
     *
     * @param {number} num
     * @param {string} [message]
     * @returns {this}
     * @memberof NumberValidator
     */
    public Max(num: number, message?: string): this {
        this.max = num;
        this.maxMessage = message;
        return this;
    }
    
    /**
     *
     *
     * @param {number} num
     * @param {string} [message]
     * @returns {this}
     * @memberof NumberValidator
     */
    public Min(num: number, message?: string): this {
        this.min = num;
        this.minMessage = message
        return this;
    }

    /**
     *
     *
     * @protected
     * @param {(number|string)} valueString
     * @param {(e?: IValidationError, v?: number) => void} callback
     * @returns {void}
     * @memberof NumberValidator
     */
    protected doValidate(valueString: number|string, callback: (e?: IValidationError, v?: number) => void): void {
        
        const errors: string[] = [];
        const value = this.tryParse(valueString);
        if(value === undefined) {
            errors.push(this.NaNMessage);
            callback({name: this.name, errors: errors});
            return;
        }
        if(this.max && value > this.max) {
            errors.push(this.maxMessage || `Value too large`);
        }

        if(this.min !== undefined && value < this.min) {
            errors.push(this.minMessage || 'Value is too small');
        }
        
        if(errors.length > 0) {
            callback({name: this.name, errors: errors});
            return;
        }
        callback(undefined, value);
    }
}
