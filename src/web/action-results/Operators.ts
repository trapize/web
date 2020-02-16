import { OperatorFunction } from 'rxjs';
import { IHttpActionResult } from '../IHttp.Action.Result';
import { map } from 'rxjs/operators';

export function HttpActionResultOperator(resultFunction: (dataOrError?: any) => IHttpActionResult): OperatorFunction<any, IHttpActionResult> {
    return inputs$ => inputs$.pipe(
        map(value => resultFunction(value))
    );
}