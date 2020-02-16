import 'reflect-metadata';
import { StandardCacheStrategy } from '../../../src/web/caching';

describe('Standard Cache Strategy', () => {
    it('Should get the key', () => {
        const ctx = {
            Request: {
                get: jest.fn().mockImplementation((...paths: string[]) => {
                    expect(paths).toHaveLength(1);
                    expect(paths[0]).toBe('originalUrl');
                    return 'https://domain.com/api/resource';
                })
            }
        };

        expect(StandardCacheStrategy.IsCacheable).toBe(true);
        expect(StandardCacheStrategy.GetKey(<any>ctx)).toBe('https://domain.com/api/resource');
    });
});