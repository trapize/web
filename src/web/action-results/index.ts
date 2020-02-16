import { IHttpActionResult } from '../IHttp.Action.Result';
import { ActionResult } from './Action.Result';
import { HttpActionResultOperator } from './Operators';

export const HttpActionResult = Object.freeze({
    Generic: (code: number, data?: any, error?: any): IHttpActionResult => new ActionResult(code, data, error),
    Success: (data?: any): IHttpActionResult => new ActionResult(200, data),
    Created: (data: any): IHttpActionResult => new ActionResult(201, data),
    Accepted: (): IHttpActionResult => new ActionResult(202),
    NoContent: (): IHttpActionResult => new ActionResult(204),
    ClientError: Object.freeze({
        BadRequest:(error: any): IHttpActionResult => new ActionResult(400, undefined, error),
        Unauthorized:(error?: any): IHttpActionResult => new ActionResult(401, undefined, error),
        PaymentRequired:(error?: any): IHttpActionResult => new ActionResult(402, undefined, error),
        Forbidden:(error?: any): IHttpActionResult => new ActionResult(403, undefined, error),
        NotFound:(error?: any): IHttpActionResult => new ActionResult(404, undefined, error),
        MethodNotAllowed:(error?: any): IHttpActionResult => new ActionResult(405, undefined, error),
        Conflict:(error?: any): IHttpActionResult => new ActionResult(409, undefined, error),
        Gone:(error?: any): IHttpActionResult => new ActionResult(410, undefined, error),
        TooManyRequest:(error?: any): IHttpActionResult => new ActionResult(429, undefined, error),
        UnavailableForLegalReasons:(error?: any): IHttpActionResult => new ActionResult(451, undefined, error),
    }),
    ServerError: Object.freeze({
        InternalServerError:(error?: any): IHttpActionResult => new ActionResult(500, undefined, error),
        NotImplemented:(error?: any): IHttpActionResult => new ActionResult(501, undefined, error),
        ServiceUnavailable:(error?: any): IHttpActionResult => new ActionResult(503, undefined, error),
    }),
    Operator: HttpActionResultOperator,
    Create: (code: number, dataOrError?: any): IHttpActionResult => {
        switch(code) {
            case 200: {
                return HttpActionResult.Success(dataOrError); 
            }
            case 201: {
                return HttpActionResult.Created(dataOrError);
            }
            case 202: {
                return HttpActionResult.Accepted();
            }
            case 204: {
                return HttpActionResult.NoContent();
            }
            case 400: {
                return HttpActionResult.ClientError.BadRequest(dataOrError);
            }
            case 401: {
                return HttpActionResult.ClientError.Unauthorized(dataOrError);
            }
            case 402: {
                return HttpActionResult.ClientError.PaymentRequired(dataOrError);
            }
            case 403: {
                return HttpActionResult.ClientError.Forbidden(dataOrError);
            }
            case 404: {
                return HttpActionResult.ClientError.NotFound(dataOrError);
            }
            case 405: {
                return HttpActionResult.ClientError.MethodNotAllowed(dataOrError);
            }
            case 409: {
                return HttpActionResult.ClientError.Conflict(dataOrError);
            }
            case 410: {
                return HttpActionResult.ClientError.Gone(dataOrError);
            }
            case 429: {
                return HttpActionResult.ClientError.TooManyRequest(dataOrError);
            }
            case 451: {
                return HttpActionResult.ClientError.UnavailableForLegalReasons(dataOrError);
            }
            case 500: {
                return HttpActionResult.ServerError.InternalServerError(dataOrError);
            }
            case 501: {
                return HttpActionResult.ServerError.NotImplemented(dataOrError);
            }
            case 503: {
                return HttpActionResult.ServerError.ServiceUnavailable(dataOrError);
            }
            default: {
                return HttpActionResult.Generic(code, code < 300 && code > 199 ? dataOrError : undefined, code < 200 || code > 299 ? dataOrError : undefined);
            }
        }
    }
});