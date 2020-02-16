import { injectable, inject } from 'inversify';
import { ICacheService } from '../ICache.Service';
import  NodeCache  from 'node-cache';
import { Core, IAppConfig } from '@trapize/core';

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
     * @type {NodeCache}
     * @memberof CacheService
     */
    private cache: NodeCache;

    /**
     *Creates an instance of CacheService.
     * @param {IAppConfig} appConfig
     * @memberof CacheService
     */
    public constructor(
        @inject(Core.Configuration.IAppConfig) private appConfig: IAppConfig
    ) {
        this.cache = new NodeCache(this.appConfig.cacheOptions);
    }

    /**
     *
     *
     * @param {string} key
     * @returns {Promise<any>}
     * @memberof CacheService
     */
    public async get(key: string): Promise<any> {
        this.cache.ttl(key);
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