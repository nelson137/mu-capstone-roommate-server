import { Chance } from 'chance';
import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { buildErrors, mockResponse } from 'src/test-utils';
import supertest from 'supertest';
import { authorize, guardValidation } from '.';

const chance = new Chance();

describe('authorize', () => {
    let request: Partial<Request>;
    let response: Response;
    const next: NextFunction = jest.fn();

    beforeEach(() => {
        request = {
            headers: {},
        };
        response = mockResponse();
    });

    it('should return 401 when there is no authorization header', () => {
        authorize(request as Request, response, next);

        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.json).toHaveBeenCalledWith(buildErrors('no token'));
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when the authorization header is invalid', () => {
        request.headers!.authorization = chance.string();

        authorize(request as Request, response, next);

        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.json).toHaveBeenCalledWith(buildErrors('invalid token'));
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when the auth token is invalid', () => {
        request.headers!.authorization = 'Bearer ' + chance.string();

        authorize(request as Request, response, next);

        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.json).toHaveBeenCalledWith(buildErrors('JsonWebTokenError: jwt malformed'));
        expect(next).not.toHaveBeenCalled();
    });

    it('should not return anything and call the next middleware when the auth token is valid', () => {
        const token = jwt.sign({}, process.env.JWT_SECRET!);
        request.headers!.authorization = 'Bearer ' + token;

        authorize(request as Request, response, next);

        expect(next).toHaveBeenCalled();
    });
});

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
