import 'reflect-metadata';
import { Validation } from '../../../src/web/validation';

const validator = {
    date: Validation.Date('date'),
    dateString: Validation.Date('dateString')
};

describe('Date Validation', () => {
    it('should validate', (done) => {
        const obj = {
            date: new Date(),
            dateString: new Date().toDateString()
        };

        Validation.Validate(validator, obj, (e, v) => {
            expect(e).toBeUndefined();
            expect(v).toBeDefined();
            done();
        });
    })

    it('should validate', (done) => {
        const obj = {
            date: {},
            dateString: 'Not a date string'
        };

        Validation.Validate(validator, obj, (e, v) => {
            expect(e).toBeDefined();
            expect(v).toBeUndefined();
            done();
        });
    })
})