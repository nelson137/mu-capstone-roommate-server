import bcrypt from 'bcrypt';
import express, { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { getUsers, User } from '../db';
import { authorize, guardValidation } from '../middlewares';

// Get path of current file, directory, and the parent directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __parent = path.dirname(__dirname);

const SALT_ROUNDS = 10;

export const appRouter = Router();

appRouter.get('/', express.static(`${__parent}/public`));

appRouter.post(
    '/register',
    body('name').notEmpty(),
    body('contactEmail').isEmail().normalizeEmail(),
    body('passwordPlaintext').custom(
        value => typeof value === 'string' && Buffer.byteLength(value) <= 72,
    ),
    guardValidation,
    async (req: Request, res: Response) => {
        const newUserDoc = new User({
            name: req.body.name,
            contactEmail: req.body.contactEmail,
            passwordHash: await bcrypt.hash(req.body.passwordPlaintext, SALT_ROUNDS),
        });
        const newUser = await newUserDoc.save();
        console.log('[/register] created user', newUser.id);
        res.status(201).end();
    },
);

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
