import 'reflect-metadata';
import { IHttpActionResult } from '../../../src/web';
import { ActionResult } from '../../../src/web/action-results/Action.Result';
import { IsObjectable } from '@trapize/core';


describe('Action Results', () => {
    it('Should work with undefined data and error', () => {
        const result: IHttpActionResult = new ActionResult(204);
        expect(result.code).toBe(204);
        expect(result.data).toBeUndefined();
        expect(result.error).toBeUndefined();

        expect(IsObjectable(result)).toBe(true);
        if(IsObjectable(result)) {
            const json = result.ToJSON();
            expect(json.code).toBe(204);
            expect(json.data).toBeUndefined();
            expect(json.error).toBeUndefined();
        }

        const json = JSON.parse(JSON.stringify(result));
        expect(json.code).toBe(204);
        expect(json.data).toBeUndefined();
        expect(json.error).toBeUndefined();
    });

    it('Should work with non-objectifiable data and error', () => {
        const data = {
            value: 'this'
        };

        const error = {
            value: 'this'
        };

        const code = 200;

        const result: IHttpActionResult = new ActionResult(code, data, error);
        expect(result.code).toBe(200);
        expect(result.data).toBeDefined();
        expect(result.error).toBeDefined();
        expect(result.data?.value).toBe('this');
        expect(result.error?.value).toBe('this');

        expect(IsObjectable(result)).toBe(true);
        if(IsObjectable(result)) {
            const json = result.ToJSON();
            expect(json.code).toBe(200);
            expect(json.error).toBeDefined();
            expect(json.data).toBeDefined();
            expect(json.data.value).toBe('this');
            expect(json.error.value).toBe('this');
        }

        const json = JSON.parse(JSON.stringify(result));
        expect(json.code).toBe(200);
        expect(json.error).toBeDefined();
        expect(json.data).toBeDefined();
        expect(json.data.value).toBe('this');
        expect(json.error.value).toBe('this');

    });
    it('Should objectify the data and error', () => {
        const data = {
            ToJSON: jest.fn().mockReturnValue({value: 'this'})
        };

        const error = {
            ToJSON: jest.fn().mockReturnValue({value: 'this'})
        };

        const code = 200;

        const result: IHttpActionResult = new ActionResult(code, data, error);
        expect(result.code).toBe(200);
        expect(result.data).toBeDefined();
        expect(result.error).toBeDefined();
        expect(result.data?.value).toBe('this');
        expect(result.error?.value).toBe('this');

        expect(IsObjectable(result)).toBe(true);
        if(IsObjectable(result)) {
            const json = result.ToJSON();
            expect(json.code).toBe(200);
            expect(json.error).toBeDefined();
            expect(json.data).toBeDefined();
            expect(json.data.value).toBe('this');
            expect(json.error.value).toBe('this');
        }

        const json = JSON.parse(JSON.stringify(result));
        expect(json.code).toBe(200);
        expect(json.error).toBeDefined();
        expect(json.data).toBeDefined();
        expect(json.data.value).toBe('this');
        expect(json.error.value).toBe('this');
        
    });

    it('Should objectify the data array and error', () => {
        const data = [{value: 'this'}];

        const error = {
            ToJSON: jest.fn().mockReturnValue({value: 'this'})
        };

        const code = 200;

        const result: IHttpActionResult = new ActionResult(code, data, error);
        expect(result.code).toBe(200);
        expect(result.data).toBeDefined();
        expect(result.error).toBeDefined();
        expect(result.data).toHaveLength(1);
        expect(result.data?.[0].value).toBe('this');
        expect(result.error?.value).toBe('this');

        expect(IsObjectable(result)).toBe(true);
        if(IsObjectable(result)) {
            const json = result.ToJSON();
            expect(json.code).toBe(200);
            expect(json.error).toBeDefined();
            expect(json.data).toBeDefined();
            expect(json.data[0].value).toBe('this');
            expect(json.error.value).toBe('this');
        }

        const json = JSON.parse(JSON.stringify(result));
        expect(json.code).toBe(200);
        expect(json.error).toBeDefined();
        expect(json.data).toBeDefined();
        expect(json.data[0].value).toBe('this');
        expect(json.error.value).toBe('this');
        
    });

    it('Should objectify the data array and error', () => {
        const data = [{
            ToJSON: jest.fn().mockReturnValue({value: 'this'})
        }];

        const error = {
            ToJSON: jest.fn().mockReturnValue({value: 'this'})
        };

        const code = 200;

        const result: IHttpActionResult = new ActionResult(code, data, error);
        expect(result.code).toBe(200);
        expect(result.data).toBeDefined();
        expect(result.error).toBeDefined();
        expect(result.data).toHaveLength(1);
        expect(result.data?.[0].value).toBe('this');
        expect(result.error?.value).toBe('this');

        expect(IsObjectable(result)).toBe(true);
        if(IsObjectable(result)) {
            const json = result.ToJSON();
            expect(json.code).toBe(200);
            expect(json.error).toBeDefined();
            expect(json.data).toBeDefined();
            expect(json.data[0].value).toBe('this');
            expect(json.error.value).toBe('this');
        }

        const json = JSON.parse(JSON.stringify(result));
        expect(json.code).toBe(200);
        expect(json.error).toBeDefined();
        expect(json.data).toBeDefined();
        expect(json.data[0].value).toBe('this');
        expect(json.error.value).toBe('this');
        
    });
})