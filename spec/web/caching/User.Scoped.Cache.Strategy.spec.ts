import 'reflect-metadata';
import { UserScopedCacheStrategy } from '../../../src/web/caching';

describe('User Scoped Cache Strategy', () => {
    it('Should get the key', () => {
        const ctx = {
            Request: {
                get: jest.fn().mockImplementation((...paths: string[]) => {
                    expect(paths).toHaveLength(1);
                    expect(paths[0]).toBe('originalUrl');
                    return 'https://domain.com/api/resource';
                })
            },
            User: {
                Id: 15332,
                Username: 'test',
                Roles: ['SiteUser']
            }
        };

        expect(UserScopedCacheStrategy.IsCacheable).toBe(true);
        expect(UserScopedCacheStrategy.GetKey(<any>ctx)).toBe('15332 - https://domain.com/api/resource');
    })
})