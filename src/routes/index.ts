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

const ERR_LOGIN_INCORRECT = 'Username or password incorrect';

const passwordValidator = (value: any) =>
    typeof value === 'string' && Buffer.byteLength(value) <= 72;

export const appRouter = Router();

//appRouter.get('/', express.static(`${__parent}/public`));
const root = path.resolve(__parent, '..');
appRouter.get('/', express.static(`${root}/public`));

appRouter.post(
    '/register',
    body('name').notEmpty(),
    body('contactEmail').isEmail().normalizeEmail(),
    body('passwordPlaintext').custom(passwordValidator),
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

appRouter.get(
    '/auth',
    body('contactEmail').isEmail().normalizeEmail(),
    body('passwordPlaintext').custom(passwordValidator),
    guardValidation,
    async (req: Request, res: Response) => {
        const errLogin = () => res.status(401).json({ errors: [{ msg: ERR_LOGIN_INCORRECT }] });

        const user = await User.findOne({ contactEmail: req.body.contactEmail })
            .select('passwordHash')
            .exec();
        if (!user) return errLogin();

        const passwordMatches = await bcrypt.compare(
            req.body.passwordPlaintext,
            user.passwordHash!,
        );
        if (!passwordMatches) return errLogin();

        const payload = { userId: user.id as string };
        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: 20 });
        console.log('[/auth] authorize user', user.id);
        return res.status(200).json({ token, expiresIn: 20 });
    },
);

appRouter.get('/users', authorize, async (_req: Request, res: Response) => {
    res.send(await getUsers());
});

appRouter.get('/matches', async (_req: Request, res: Response) => {
    res.send(await getUsers()); // continue here with matching algorithm
});
