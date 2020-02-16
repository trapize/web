import 'reflect-metadata';
import { Validation } from '../../../src/web/validation';

const validator = {
    obj: Validation.Object('obj', {
        string: Validation.String('blacklist').Blacklist().SingleQuotes(),
        integer: Validation.Integer('integer').Required()
    })
};

describe('Object Validator', () => {
    it('Should validate', (done) => {
        const parent = {
            obj: {
                string: 'nothing with single quotes',
                integer: 123
            }
        };

        Validation.Validate(validator, parent, (e, v) => {
            expect(e).toBeUndefined();
            expect(v).toBeDefined();
            done();
        });
    });

    it('Should be invalid', (done) => {
        const parent = {
            obj: {
                string: `nothing with 'single quotes'`
            }
        };

        Validation.Validate(validator, parent, (e, v) => {
            expect(e).toBeDefined();
            expect(v).toBeUndefined();
            done();
        });
    });
})