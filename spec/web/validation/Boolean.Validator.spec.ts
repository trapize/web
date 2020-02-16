import 'reflect-metadata';
import { BooleanValidator } from '../../../src/web/validation/Boolean.Validator';

const validator = new BooleanValidator('name');

describe('Boolean Validator', () => {
    it('Should be true', (done) => {
        validator.Validate('y', (e,v) => {
            expect(e).toBeUndefined();
            expect(v).toBe(true);
            done();
        });
    } );

    it('Should be true', (done) => {
        validator.Validate('Y', (e,v) => {
            expect(e).toBeUndefined();
            expect(v).toBe(true);
            done();
        });
    } );

    it('Should be true', (done) => {
        validator.Validate('true', (e,v) => {
            expect(e).toBeUndefined();
            expect(v).toBe(true);
            done();
        });
    } );

    it('Should be true', (done) => {
        validator.Validate('TRuE', (e,v) => {
            expect(e).toBeUndefined();
            expect(v).toBe(true);
            done();
        });
    } );

    it('Should be true', (done) => {
        validator.Validate(true, (e,v) => {
            expect(e).toBeUndefined();
            expect(v).toBe(true);
            done();
        });
    } );

    it('Should be true', (done) => {
        validator.Validate('1', (e,v) => {
            expect(e).toBeUndefined();
            expect(v).toBe(true);
            done();
        });
    } );

    it('Should be true', (done) => {
        validator.Validate(1, (e,v) => {
            expect(e).toBeUndefined();
            expect(v).toBe(true);
            done();
        });
    } );
    
    it('Should be false', (done) => {
        validator.Validate(false, (e,v) => {
            expect(e).toBeUndefined();
            expect(v).toBe(false);
            done();
        });
    } );
    
    it('Should be false', (done) => {
        validator.Validate('n', (e,v) => {
            expect(e).toBeUndefined();
            expect(v).toBe(false);
            done();
        });
    } );
    
    it('Should be false', (done) => {
        validator.Validate('N', (e,v) => {
            expect(e).toBeUndefined();
            expect(v).toBe(false);
            done();
        });
    } );

    it('Should be false', (done) => {
        validator.Validate('false', (e,v) => {
            expect(e).toBeUndefined();
            expect(v).toBe(false);
            done();
        });
    } );

    
    it('Should be false', (done) => {
        validator.Validate('0', (e,v) => {
            expect(e).toBeUndefined();
            expect(v).toBe(false);
            done();
        });
    } );

    it('Should be false', (done) => {
        validator.Validate(0, (e,v) => {
            expect(e).toBeUndefined();
            expect(v).toBe(false);
            done();
        });
    } );

    it('should error', (done) => {
        validator.Validate(2, (e,v) => {
            expect(e).toBeDefined();
            expect(v).toBeUndefined();
            done();
        });
    });

    it('should error', (done) => {
        validator.Validate('3', (e,v) => {
            expect(e).toBeDefined();
            expect(v).toBeUndefined();
            done();
        });
    });

    it('should error', (done) => {
        validator.Validate(new Date(), (e,v) => {
            expect(e).toBeDefined();
            expect(v).toBeUndefined();
            done();
        });
    });
})