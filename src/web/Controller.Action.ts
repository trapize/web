import { Observable } from 'rxjs';
import { IHttpActionResult } from './IHttp.Action.Result';

export type ControllerAction = () => Observable<IHttpActionResult> | Promise<IHttpActionResult> | IHttpActionResult;