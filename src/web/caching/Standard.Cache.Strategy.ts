import { ICacheStrategy } from '../ICache.Strategy';
import { IHttpContext } from '../IHttp.Context';

export const StandardCacheStrategy: ICacheStrategy = {
    IsCacheable: true,
    GetKey: (ctx: IHttpContext) => {
        return `${ctx.Request.get('originalUrl')}`
    }
}