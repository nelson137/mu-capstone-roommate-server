import { Chance } from 'chance';
import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { buildErrors, mockResponse } from 'src/test-utils';
import supertest from 'supertest';
import { guardValidation } from '.';

const chance = new Chance();

describe('guardValidation', () => {
    let request: Partial<Request>;
    let response: Response;
    const next: NextFunction = jest.fn();

    beforeEach(() => {
        request = {
            headers: {},
        };
        response = mockResponse();
    });

    it('should return 400 and skip to the next route when there are errors', async () => {
        const app = express();

        const param = 'expectedParam';
        const controller = jest.fn();
        app.post('/', body(param).notEmpty(), guardValidation, controller);

        const res = await supertest(app).post('/');

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(buildErrors({ param, location: 'body', msg: 'Invalid value' }));
        expect(controller).not.toHaveBeenCalled();
    });

    it('should not return anything and call the next middleware when there are no errors', () => {
        guardValidation(request as Request, response, next);

        expect(response.status).not.toHaveBeenCalled();
        expect(response.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith();
    });
});
