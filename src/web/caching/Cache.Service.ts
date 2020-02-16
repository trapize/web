import { injectable, inject } from 'inversify';
import { ICacheService } from '../ICache.Service';
import { Core, IAppConfig, IMemoryCacheFactory, IMemoryCache } from '@trapize/core';

/**
 *
 *
 * @export
 * @class CacheService
 * @implements {ICacheService}
 */
@injectable()
export class CacheService implements ICacheService {
    /**
     *
     *
     * @private
     * @type {IMemoryCache}
     * @memberof CacheService
     */
    private cache: IMemoryCache;

    /**
     *Creates an instance of CacheService.
     * @param {IAppConfig} appConfig
     * @memberof CacheService
     */
    public constructor(
        @inject(Core.Configuration.IAppConfig) private appConfig: IAppConfig,
        @inject(Core.Runtime.IMemoryCacheFactory) factory: IMemoryCacheFactory
    ) {
        this.cache = factory.Create(this.appConfig.cacheOptions);
    }

    /**
     *
     *
     * @param {string} key
     * @returns {Promise<any>}
     * @memberof CacheService
     */
    public async get(key: string): Promise<any> {
        return this.cache.get(key);
    }    
    
    /**
     *
     *
     * @param {string} key
     * @param {*} value
     * @memberof CacheService
     */
    public set(key: string, value: any): void {
        this.cache.set(key, value);
    }
}