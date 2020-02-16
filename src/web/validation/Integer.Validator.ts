import { NumberValidator } from './Number.Validator';
import { Numbers } from '@trapize/core';

/**
 *
 *
 * @export
 * @class IntegerValidator
 * @extends {NumberValidator}
 */
export class IntegerValidator extends NumberValidator {
    /**
     *
     *
     * @param {(number|string)} valueString
     * @returns {(number | undefined)}
     * @memberof IntegerValidator
     */
    public tryParse(valueString: number|string): number | undefined {
        return typeof valueString === 'number' ? valueString : Numbers.TryToInt(valueString);
    }
}