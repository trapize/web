import 'reflect-metadata';
import { CacheService } from '../../../src/web/caching/Cache.Service';

describe('Caching Service', () => {
    it('Should cache', async () => {
        const key = 'key';
        const value = 'value';

        const service = new CacheService(<any>{cacheOptions: {stdTTL: 10}});
        const val1 = await service.get(key);
        expect(val1).toBeUndefined();
        service.set(key, value);
        const val2 = await service.get(key);
        expect(val2).toBe('value');
    })
});