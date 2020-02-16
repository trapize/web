import 'reflect-metadata';
import { Validation } from '../../../src/web/validation';

const validator = {
    num: Validation.Integer('num', 'Not a number'),
    min: Validation.Integer('min').Min(-2),
    max: Validation.Integer('max').Max(5),
    minWithMessage: Validation.Integer('min').Min(-2, 'Min is -2'),
    maxWithMessage: Validation.Integer('max').Max(5, 'Max is 5')
};

describe('Number Validator', () => {
    it('Should Validate', (done) => {
        const obj = {
            num: '134.2',
            min: -2,
            max: '4',
            minWithMessage: -1,
            maxWithMessage: '4'
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
            min: -5,
            max: '6.1',
            minWithMessage: -3,
            maxWithMessage: '6'
        };

        Validation.Validate(validator, obj, (e, v) => {
            expect(e).toBeDefined();
            expect(v).toBeUndefined();
            done();
        });
    });
});