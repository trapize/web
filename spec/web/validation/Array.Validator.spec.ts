import 'reflect-metadata';
import { Validation } from '../../../src/web/validation';

const validator = {
    integer: Validation.Array('integer', 'integer'),
    float: Validation.Array('float', 'float'),
    string: Validation.Array('string', 'string'),
    boolean: Validation.Array('boolean', 'boolean'),
    date: Validation.Array('date', 'date'),
    min: Validation.Array('min', 'string').Min(2),
    max: Validation.Array('max', 'string').Max(2),
    minWithMessage: Validation.Array('min', 'string').Min(1, 'MinMaxMessage'),
    maxWithMessage: Validation.Array('max', 'string').Max(2, 'MinMaxMessage'),
    delimiter: Validation.Array('delimiter', 'string', '|'),
    wrapper: Validation.Array('wrapper', 'string', ',', ['{', '}']),
};

describe('Array Validator', () => {
    it('Should be valid', (done) => {
        const obj = {
            integer: '1,2,3,4',
            float: '1.2,3,5.4',
            string: 'any,thing,in,this',
            boolean: 'true,false,true',
            date: `${new Date().toDateString()},${new Date().toDateString()}`,
            min: '1,2',
            max: '1,2',
            minWithMessage: '1,2',
            maxWithMessage: '1,2',
            delimiter: '1|2|3|f|j',
            wrapper: '{1|f|g}'
        };

        Validation.Validate(validator, obj, (e, v) => {
            expect(e).toBeUndefined();
            expect(v).toBeDefined();
            done();
        });
    });

    it('Should be invalid', (done) => {
        const obj = {
            integer: '1,2,3,d',
            float: '1.2,3,f',
            string: 'any,thing,in,this',
            boolean: 'true,false,true,not',
            date: `${new Date().toDateString()},${new Date().toDateString()},somethingelse`,
            min: '1',
            max: '1,2,3',
            minWithMessage: '1',
            maxWithMessage: '1,2,3',
            delimiter: '1|2|3|f|j',
            wrapper: '{1|f|g}'
        };
        Validation.Validate(validator, obj, (e, v) => {
            expect(e).toBeDefined();
            expect(v).toBeUndefined();
            done();
        });
    })
})