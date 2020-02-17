import 'reflect-metadata';
import { CacheService } from '../../../src/web/caching/Cache.Service';

const cache = {
    get: jest.fn(),
    set: jest.fn()
};

const factory = {
    Create: jest.fn().mockReturnValue(cache)
};

beforeEach(() => {
    cache.get.mockReset();
    cache.set.mockReset();
    factory.Create.mockClear();
});

describe('Caching Service', () => {
    it('Should cache', async () => {
        const key = 'key';
        const value = 'value';

        const service = new CacheService(<any>{cacheOptions: {stdTTL: 10}}, factory);
        cache.get.mockReturnValue(Promise.resolve(undefined));
        const val1 = await service.get(key);
        expect(val1).toBeUndefined();
        service.set(key, value);
        cache.get.mockReturnValue(Promise.resolve(value));
        const val2 = await service.get(key);
        expect(val2).toBe('value');
    })
});