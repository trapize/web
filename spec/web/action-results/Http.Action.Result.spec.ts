import 'reflect-metadata';
import { HttpActionResult } from '../../../src/web';

describe('Http Action Result', () => {
    it('Should create an action result', () => {
        expect(HttpActionResult.Generic(200).code).toBe(200);
        expect(HttpActionResult.Success().code).toBe(200);
        expect(HttpActionResult.Created({}).code).toBe(201);
        expect(HttpActionResult.Accepted().code).toBe(202);
        expect(HttpActionResult.NoContent().code).toBe(204);

        expect(HttpActionResult.ClientError.BadRequest({}).code).toBe(400);
        expect(HttpActionResult.ClientError.Unauthorized().code).toBe(401);
        expect(HttpActionResult.ClientError.PaymentRequired().code).toBe(402);
        expect(HttpActionResult.ClientError.Forbidden().code).toBe(403);
        expect(HttpActionResult.ClientError.NotFound().code).toBe(404);
        expect(HttpActionResult.ClientError.MethodNotAllowed().code).toBe(405);
        expect(HttpActionResult.ClientError.Conflict().code).toBe(409);
        expect(HttpActionResult.ClientError.Gone().code).toBe(410);
        expect(HttpActionResult.ClientError.TooManyRequest().code).toBe(429);
        expect(HttpActionResult.ClientError.UnavailableForLegalReasons().code).toBe(451);

        expect(HttpActionResult.ServerError.InternalServerError().code).toBe(500);
        expect(HttpActionResult.ServerError.NotImplemented().code).toBe(501);
        expect(HttpActionResult.ServerError.ServiceUnavailable().code).toBe(503);

        expect(HttpActionResult.Create(200).code).toBe(200);
        expect(HttpActionResult.Create(200).code).toBe(200);
        expect(HttpActionResult.Create(201).code).toBe(201);
        expect(HttpActionResult.Create(202).code).toBe(202);
        expect(HttpActionResult.Create(204).code).toBe(204);
        expect(HttpActionResult.Create(400).code).toBe(400);
        expect(HttpActionResult.Create(401).code).toBe(401);
        expect(HttpActionResult.Create(402).code).toBe(402);
        expect(HttpActionResult.Create(403).code).toBe(403);
        expect(HttpActionResult.Create(404).code).toBe(404);
        expect(HttpActionResult.Create(405).code).toBe(405);
        expect(HttpActionResult.Create(409).code).toBe(409);
        expect(HttpActionResult.Create(410).code).toBe(410);
        expect(HttpActionResult.Create(429).code).toBe(429);
        expect(HttpActionResult.Create(451).code).toBe(451);
        expect(HttpActionResult.Create(500).code).toBe(500);
        expect(HttpActionResult.Create(501).code).toBe(501);
        expect(HttpActionResult.Create(503).code).toBe(503);
    });
});