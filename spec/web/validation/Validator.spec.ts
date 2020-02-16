import 'reflect-metadata';
import { Validator } from '../../../src/web/validation/Validator';
import { IValidationError } from '../../../src/web/validation/IValidation.Error';
import { Validation } from '../../../src/web/validation';

class TestValidator extends Validator<string,string> {
    public doValidate(input: string, callback: (e?: IValidationError, v?: string) => void): void {
        callback(undefined, input);
    }
}

const validation = {
    required: new TestValidator('required').Required('Required field is required'),
    optional: new TestValidator('optional'),
    integer: Validation.Integer('integer')
};

const requestValidator = {
    body: validation,
    query: validation,
    params: validation
};


describe('Validator', () => {
    it('Should Be invalid', (done) => {
        const obj = {};
        Validation.Validate(validation, obj, (errs?: IValidationError[], value?: {[key: string]: string}) => {
            expect(errs).toHaveLength(1);
            done();
        });
    });

    it('Should Be invalid', (done) => {
        const obj = {
            optional: 'some value'
        };
        Validation.Validate(validation, obj, (errs?: IValidationError[], value?: {[key: string]: string}) => {
            expect(errs).toHaveLength(1);
            done();
        });
    });

    it('Should Be valid', (done) => {
        const obj = {
            required: 'some value'
        };
        Validation.Validate(validation, obj, (errs?: IValidationError[], value?: {[key: string]: string}) => {
            expect(errs).toBeUndefined();
            expect(value).toBeDefined();
            expect(value?.required).toBe(obj.required);
            done();
        });
    });

    it('Should be an invalid request', async () => {
        const req = {
            body: {
                optional: 'optional'
            },
            params: {},
            query: {
                optional: 'optional'
            }
        };

        const res = await Validation.ValidateRequest(requestValidator, <any>req);
        expect(res.errors).toBeDefined();
        expect(res.errors?.body).toBeDefined();
        expect(res.errors?.params).toBeDefined();
        expect(res.errors?.query).toBeDefined();
    });
    
    it('Should be a valid request', async () => {
        const req = {
            body: {
                required: 'required',
                optional: 'optional',
                integer: '12'
            },
            params: {
                required: 'required',
                integer: 12
            },
            query: {
                required: 'required',
                optional: 'optional',
                integer: '12'
            }
        };

        const res = await Validation.ValidateRequest(requestValidator, <any>req);
        expect(res.errors).toBeUndefined();
        expect(res.body).toBeDefined();
        expect(res.params).toBeDefined();
        expect(res.query).toBeDefined();
        expect(req.body.integer).toBe(12);
        expect(req.query.integer).toBe(12);
        expect(req.query.integer).toBe(12);
        expect(typeof req.body.integer).toBe('number');
        expect(typeof req.query.integer).toBe('number');
        expect(typeof req.query.integer).toBe('number');
    });

    it('Should be a valid request', async () => {
        const req = {
            body: {
            },
            params: {
            },
            query: {
            }
        };

        const res = await Validation.ValidateRequest({}, <any>req);
        expect(res.errors).toBeUndefined();
        expect(res.body).toBeDefined();
        expect(res.params).toBeDefined();
        expect(res.query).toBeDefined();
    });
})