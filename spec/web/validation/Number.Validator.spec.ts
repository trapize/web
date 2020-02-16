import 'reflect-metadata';
import { Validation } from '../../../src/web/validation';

const validator = {
    num: Validation.Number('num', 'Not a number'),
    min: Validation.Number('min').Min(-2.2),
    max: Validation.Number('max').Max(5.5),
    minWithMessage: Validation.Number('min').Min(-2.2, 'Min is -2.2'),
    maxWithMessage: Validation.Number('max').Max(5.5, 'Max is 5.5')
};

describe('Number Validator', () => {
    it('Should Validate', (done) => {
        const obj = {
            num: '134.2',
            min: -2,
            max: '4.5',
            minWithMessage: -1.2,
            maxWithMessage: '4.3'
        };

        Validation.Validate(validator, obj, (e, v) => {
            expect(e).toBeUndefined();
            expect(v).toBeDefined();
            done();
        });
    });

    it('Should be invalid', (done) => {
        const obj = {
            num: 'sdfsdf',
            min: -2.3,
            max: '5.6',
            minWithMessage: -2.7,
            maxWithMessage: '5.8'
        };

        Validation.Validate(validator, obj, (e, v) => {
            expect(e).toBeDefined();
            expect(v).toBeUndefined();
            done();
        });
    });
});