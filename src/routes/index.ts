import express, { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { getUsers } from '../db';
import { authorize } from '../middlewares';

// Get path of current file, directory, and the parent directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __parent = path.dirname(__dirname);

export const appRouter = Router();

appRouter.get('/', express.static(`${__parent}/public`));

appRouter.get('/auth', (_req: Request, res: Response) => {
    let token = jwt.sign({ data: 'demo-payload' }, 'demo-secret', { expiresIn: 20 });
    res.status(200).json({
        token,
        expiresIn: 20,
    });
});

appRouter.get('/users', authorize, async (_req: Request, res: Response) => {
    res.send(await getUsers());
});
