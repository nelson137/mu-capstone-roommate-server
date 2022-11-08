import { Response } from 'express';

export const mockResponse = (): Response => {
    const res: Partial<Response> = {
        status: jest.fn((_code: number) => res as Response),
        json: jest.fn((_body?: any) => res as Response),
    };
    return res as Response;
};

export const buildErrors = (...errors: any[]) => ({
    errors: errors.map(data => (typeof data === 'string' ? { msg: data } : data)),
});
