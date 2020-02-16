import { Validator } from './Validator';
import { IValidationError } from './IValidation.Error';
import { Numbers } from '@trapize/core';

/**
 *
 *
 * @export
 * @class ArrayValidator
 * @extends {Validator<string, any[]>}
 */
export class ArrayValidator extends Validator<string, any[]> {
    /**
     *
     *
     * @private
     * @type {number}
     * @memberof ArrayValidator
     */
    private max?: number;
    /**
     *
     *
     * @private
     * @type {string}
     * @memberof ArrayValidator
     */
    private maxMessage?: string;
    /**
     *
     *
     * @private
     * @type {number}
     * @memberof ArrayValidator
     */
    private min?: number;
    /**
     *
     *
     * @private
     * @type {string}
     * @memberof ArrayValidator
     */
    private minMessage?: string;

    /**
     *Creates an instance of ArrayValidator.
     * @param {string} name
     * @param {('integer' | 'float' | 'string' | 'boolean' | 'date')} type
     * @param {string} [delimiter=',']
     * @param {[string,string]} [wrappers]
     * @memberof ArrayValidator
     */
    public constructor(
        name: string, 
        private type: 'integer' | 'float' | 'string' | 'boolean' | 'date', 
        private delimiter: string = ',',
        private wrappers?: [string,string]
    ) {
        super(name);
    }

    /**
     *
     *
     * @param {number} num
     * @param {string} [message]
     * @returns {this}
     * @memberof ArrayValidator
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
     * @memberof ArrayValidator
     */
    public Min(num: number, message?: string): this {
        this.min = num;
        this.minMessage = message;
        return this;
    }

    /**
     *
     *
     * @protected
     * @param {string} value
     * @param {(e?: IValidationError, v?: any[]) => void} callback
     * @returns {void}
     * @memberof ArrayValidator
     */
    protected doValidate(value: string, callback: (e?: IValidationError, v?: any[]) => void): void {
        

        if(this.wrappers) {
            value = value.replace(new RegExp('/^' + this.wrappers[0] + '/'), '').replace(new RegExp('/' + this.wrappers[1] + '$/'), '');
        }
        
        const array = value.split(this.delimiter).map(v => {
            if(this.type === 'integer') {
                return Numbers.TryToInt(v);
            } else if(this.type === 'float') {
                return Numbers.TryToFloat(v);
            } else if(this.type === 'boolean') {
                return v === 'true' ? true : v === 'false' ? false : undefined;
            } else if(this.type === 'date') {
                return new Date(v);
            }

            return v;
        });
        const errors: string[] = [];
        if(this.min && array.length < this.min) {
            errors.push(this.minMessage || 'Array too short');
        } 

        if(this.max && array.length > this.max) {
            errors.push(this.maxMessage || 'Array too long');
        }

        array.forEach(v => {
            if(v instanceof Date && v.toString() === 'Invalid Date' && !errors.includes('Invalid value in array: Invalid Date')) {
                errors.push('Invalid value in array: Invalid Date');
            } else if(v === undefined && !errors.includes('Invalid value in array: Invalid ' + this.type)) {
                errors.push('Invalid value in array: Invalid ' + this.type);
            }
        });

        if(errors.length) {
            callback({name: this.name, errors: errors});
            return;
        }

        return callback(undefined, array);
    }
}