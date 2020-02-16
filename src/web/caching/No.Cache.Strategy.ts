import { ICacheStrategy } from '../ICache.Strategy';

export const NoCacheStrategy: ICacheStrategy = {
    IsCacheable: false,
    GetKey: () => ''
};