import 'reflect-metadata';
import { of } from 'rxjs';
import { HttpActionResult } from '../../../src/web';

describe('Http Action Result Operator', () => {
    it('Should map the result to the action', (done) => {
        of({id: 1}).pipe(
            HttpActionResult.Operator(HttpActionResult.Success)
        ).subscribe({
            next: res => {
                expect(res.code).toBe(200);
                expect(res.data.id).toBe(1);
                done();
            },
            error: done
        })
    });
})