import 'reflect-metadata';
import { NoCacheStrategy } from '../../../src/web/caching/No.Cache.Strategy';

describe('No Cache Strategy', () => {
    it('Should not allow caching', () => {
        expect(NoCacheStrategy.IsCacheable).toBe(false);
        expect(NoCacheStrategy.GetKey(<any>{})).toBe('');
    });
});