import { StringValidator } from './String.Validator';
import { NumberValidator } from './Number.Validator';
import { IntegerValidator } from './Integer.Validator';
import { ObjectValidator } from './Object.Validator';
import { IValidatable } from './IValidatable';
import { Validator } from './Validator';
import { IValidationError } from './IValidation.Error';
import { IHttpRequest } from '../IHttp.Request';
import { IRequestValidatable } from './IRequest.Validatable';
import { DateValidator } from './Date.Validator';
import { ArrayValidator } from './Array.Validator';
import { BooleanValidator } from './Boolean.Validator';

export const Validation = Object.freeze({
    String: (name: string, message?: string) => new StringValidator(name, message),
    Number: (name: string, message?: string) => new NumberValidator(name, message),
    Integer: (name: string, message?: string) => new IntegerValidator(name, message),
    Object: (name: string, validatable: IValidatable) => new ObjectValidator(name, validatable),
    Date: (name: string) => new DateValidator(name),
    Boolean: (name: string) => new BooleanValidator(name),
    Array: (name: string, type: 'integer' | 'float' | 'string' | 'boolean' | 'date', delimiter?: string, wrappers?: [string,string]) => new ArrayValidator(name, type, delimiter, wrappers),
    Validate: (validatable: IValidatable, obj: any, callback: (error?: IValidationError[], value?: any) => void) => Validator.Validate(validatable, obj, callback),
    ValidateRequest: (validator: IRequestValidatable, req: IHttpRequest) => Validator.ValidateRequest(validator, req)
});