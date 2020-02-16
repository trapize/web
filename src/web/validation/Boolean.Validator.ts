import { Validator } from './Validator';
import { IValidationError } from './IValidation.Error';

export class BooleanValidator extends Validator<any, boolean> {
    protected doValidate(value: any, callback: (e?: IValidationError, v?: boolean) => void): void {
        if(typeof value === 'boolean') {
            callback(undefined, value);
            return;
        } else if(typeof value === 'string') {
            const lower = value.toLowerCase();
            if(lower === 'y' || lower === 'true' || lower === '1') {
                callback(undefined, true);
                return;
            } else if(lower === 'n' || lower === 'false' || lower === '0') {
                callback(undefined, false);
                return;
            }
            
        } else if(typeof value === 'number') {
            if(value === 1) {
                callback(undefined, true);
                return;
            } else if(value === 0) {
                callback(undefined, false);
                return;
            }
        } 
        
        callback({name: this.name, errors: ['Invalid Boolean String']});
        
    }
}