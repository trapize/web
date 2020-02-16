import { ICacheStrategy } from '../ICache.Strategy';
import { IHttpContext } from '../IHttp.Context';

export const UserScopedCacheStrategy: ICacheStrategy = {
    IsCacheable: true,
    GetKey: (ctx: IHttpContext) => {
        return `${ctx.User.Id} - ${ctx.Request.get('originalUrl')}`
    }
}