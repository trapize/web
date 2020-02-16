import 'reflect-metadata';
import { Validation } from '../../../src/web/validation';

const validator = {
    anything: Validation.String('anything'),
    alpha: Validation.String('alpha').Alpha(),
    alphanumeric: Validation.String('alphanumerica').Alphanumeric(),
    double: Validation.String('Double').DoubleQuotes(),
    single: Validation.String('Single').SingleQuotes(),
    hyphen: Validation.String('hypen').Hypen(),
    whitespace: Validation.String('whitespace').Whitespace(),
    Upper: Validation.String('Upper').UpperCase(),
    Lower: Validation.String('Lower').LowerCase(),
    underscore: Validation.String('underscore').Underscore(),
    special: Validation.String('special').Special(',', '.'),
    pattern: Validation.String('pattern').Pattern(/^\w$/),
    blacklist: Validation.String('blacklist').Blacklist().SingleQuotes(),
    max: Validation.String('max').Max(5),
    min: Validation.String('min').Min(2),
    withMessage: Validation.String('withMessage', 'This failed the pattern').Hypen()
};

describe('String Validator', () => {
    it('Should be valid', (done) => {
        const obj = {
            anything: `anything can go here .lskd""'`,
            alpha: `onlyalpha`,
            alphanumeric: `onlya1phanumer1c`,
            double:`"`,
            single: `''`,
            hyphen: `-`,
            whitespace:`      `,
            Upper:`ONLYUPPER`,
            Lower:`onlylower`,
            underscore:`____`,
            special:`,.,...,,,.,.`,
            pattern:`onlyworDsMatchingThePattern_`,
            blacklist:`Anything except single quotes "_!23810`,
            max: 'abcde',
            min: 'abcde',
            withMessage: '-'
        };

        Validation.Validate(validator, obj, (e, v) => {
            expect(e).toBeUndefined();
            expect(v).toBeDefined();
            done();
        });
    });

    it('Should be invalid', (done) => {
        const obj = {
            anything: `anything can go here .lskd""'`,
            alpha: `onlyalpha12 `,
            alphanumeric: `onlya1phanumer1c this shouldnt`,
            double:`"wontwork"`,
            single: `'wont work'`,
            hyphen: `whoops-sey`,
            whitespace:`      haha`,
            Upper:`ONLYUPPERnotlower`,
            Lower:`onlylowerNOTUPPER`,
            underscore:`____ the point`,
            special:`,.,...,,,.,.something else`,
            pattern:`onlyworDsMatchingThePattern_ :[]{}`,
            blacklist:`Anything except 'single quotes' "_!23810`,
            max: 'abcdefghijklmnop',
            min: 'a',
            withMessage: 'Not a hyphen'
        };

        Validation.Validate(validator, obj, (e, v) => {
            expect(e).toBeDefined();
            expect(v).toBeUndefined();
            done();
        });
    });
})