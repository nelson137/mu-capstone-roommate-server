import bcrypt from 'bcrypt';
import express, { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../db';
import { guardValidation } from '../middlewares';
import { apiRouter, JWT_ALGORITHM } from './api';

// Get path of current file, directory, and the parent directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __parent = path.dirname(__dirname);

const SALT_ROUNDS = 10;

const ERR_LOGIN_INCORRECT = 'Username or password incorrect';

const passwordValidator = (value: any) =>
    typeof value === 'string' && Buffer.byteLength(value) <= 72;

const generateToken = (userId: string) =>
    jwt.sign({ userId }, process.env.JWT_SECRET!, { algorithm: JWT_ALGORITHM, expiresIn: '1h' });

export const appRouter = Router();

//appRouter.get('/', express.static(`${__parent}/public`));
const root = path.resolve(__parent, '..');
appRouter.get('/', express.static(`${root}/public`));

appRouter.post(
    '/register',
    body('email').isEmail().normalizeEmail(),
    body('passwordPlaintext').custom(passwordValidator),
    body('name').notEmpty(),
    body('dateOfBirth').isDate(),
    guardValidation,
    async (req: Request, res: Response) => {
        const { email, passwordPlaintext, name, dateOfBirth } = req.body;
        const newUser = await User.create({
            email,
            passwordHash: await bcrypt.hash(passwordPlaintext, SALT_ROUNDS),
            name,
            dateOfBirth,
        });

        const token = generateToken(newUser.id);

        console.log('[/register] created user', newUser.id);
        res.status(201).json({ token });
    },
);

appRouter.post(
    '/auth',
    body('email').isEmail().normalizeEmail(),
    body('passwordPlaintext').custom(passwordValidator),
    guardValidation,
    async (req: Request, res: Response) => {
        const errLogin = () => res.status(401).json({ errors: [{ msg: ERR_LOGIN_INCORRECT }] });

        const { email, passwordPlaintext } = req.body;

        const user = await User.findOne({ email }).select('passwordHash').exec();
        if (!user) return errLogin();

        const passwordMatches = await bcrypt.compare(passwordPlaintext, user.passwordHash!);
        if (!passwordMatches) return errLogin();

        const token = generateToken(user.id as string);

        console.log('[/auth] authorize user', user.id);
        return res.status(200).json({ token });
    },
);

appRouter.use('/api', apiRouter);
