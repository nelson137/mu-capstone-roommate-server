import bcrypt from 'bcrypt';
import express, { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { getUsers, User } from '../db';
import { authorize, guardValidation } from '../middlewares';

type BasicUser = {
    id: string;
    name: string;
    age: number;
    percentage: number;
};

// Get path of current file, directory, and the parent directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __parent = path.dirname(__dirname);

const SALT_ROUNDS = 10;

const ERR_LOGIN_INCORRECT = 'Username or password incorrect';

const passwordValidator = (value: any) =>
    typeof value === 'string' && Buffer.byteLength(value) <= 72;

const generateToken = (userId: string) =>
    jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: 20 });

export const appRouter = Router();

//appRouter.get('/', express.static(`${__parent}/public`));
const root = path.resolve(__parent, '..');
appRouter.get('/', express.static(`${root}/public`));

appRouter.post(
    '/register',
    body('name').notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('passwordPlaintext').custom(passwordValidator),
    guardValidation,
    async (req: Request, res: Response) => {
        const { name, email, passwordPlaintext } = req.body;
        const newUserDoc = new User({
            name,
            email,
            passwordHash: await bcrypt.hash(passwordPlaintext, SALT_ROUNDS),
        });
        const newUser = await newUserDoc.save();

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

appRouter.get('/users', authorize, async (_req: Request, res: Response) => {
    res.send(await getUsers());
});

// add "authorize" as an argument before "async" in the future
appRouter.get('/matches', async (_req: Request, res: Response) => {
    var user = await User.findById('632dd93508fdd4a48cc94d18'); // replace with current user's ID, just a placeholder
    var allUsers = await getUsers();
    var potentialMatches: BasicUser[] = [];
    allUsers.forEach(getPercentage);
    function getPercentage(person: any, index: number) {
        var matchPercentage = 0;
        if (
            user &&
            person &&
            user.loc &&
            person.loc &&
            user.loc.city &&
            person.loc.city &&
            user.loc.state &&
            person.loc.state &&
            user.smoking != null &&
            person.smoking != null &&
            user.pets != null &&
            person.pets != null &&
            user.sameSex != null &&
            person.sameSex != null &&
            user.rent &&
            person.rent &&
            user.rent.min != null &&
            person.rent.min != null &&
            user.rent.max &&
            person.rent.max &&
            user.age &&
            person.age &&
            user.age.min &&
            person.age.min &&
            user.age.max &&
            person.age.max &&
            user.noise &&
            person.noise &&
            user.guests &&
            person.guests &&
            user.sleep &&
            person.sleep &&
            user.commonSpaces &&
            person.commonSpaces &&
            user.clean &&
            person.clean &&
            user.tags &&
            person.tags &&
            user.DoB &&
            person.DoB
        ) {
            var userID = user._id.toString();
            var personID = person._id.toString();
            const todaysDate = new Date();
            var userAge = todaysDate.getFullYear() - user.DoB.getFullYear();
            var personAge = todaysDate.getFullYear() - person.DoB.getFullYear();
            if (
                todaysDate.getMonth() - user.DoB.getMonth() < 0 ||
                (todaysDate.getMonth() - user.DoB.getMonth() == 0 &&
                    todaysDate.getDate() - user.DoB.getDate() < 0)
            ) {
                userAge--;
            }
            if (
                todaysDate.getMonth() - person.DoB.getMonth() < 0 ||
                (todaysDate.getMonth() - person.DoB.getMonth() == 0 &&
                    todaysDate.getDate() - person.DoB.getDate() < 0)
            ) {
                personAge--;
            }
            if (
                userID != personID &&
                user.status != person.status &&
                user.loc.city == person.loc.city &&
                user.loc.state == person.loc.state &&
                user.smoking == person.smoking &&
                user.pets == person.pets &&
                (user.sameSex == false || user.gender == person.gender) &&
                user.rent.min <= person.rent.max &&
                user.rent.max >= person.rent.min &&
                userAge >= person.age.min &&
                userAge <= person.age.max &&
                user.age.min <= personAge &&
                user.age.max >= personAge
            ) {
                matchPercentage += 50;
                const userMajorInfluences = [
                    user.noise,
                    user.guests,
                    user.sleep,
                    user.commonSpaces,
                    user.clean,
                ];
                const personMajorInfluences = [
                    person.noise,
                    person.guests,
                    person.sleep,
                    person.commonSpaces,
                    person.clean,
                ];
                const userMinorInfluences = [
                    user.tags.videoGames,
                    user.tags.movies,
                    user.tags.tvShows,
                    user.tags.cooking,
                    user.tags.drinking,
                    user.tags.reading,
                    user.tags.writing,
                    user.tags.photography,
                    user.tags.art,
                    user.tags.theatre,
                    user.tags.performingMusic,
                    user.tags.listeningToMusic,
                    user.tags.college,
                    user.tags.fullTimeJob,
                    user.tags.partTimeJob,
                    user.tags.studying,
                    user.tags.greekLife,
                    user.tags.partying,
                    user.tags.gym,
                    user.tags.watchingSports,
                    user.tags.playingSports,
                    user.tags.shopping,
                    user.tags.fashion,
                    user.tags.indoors,
                    user.tags.outdoors,
                    user.tags.plants,
                    user.tags.warmHouse,
                    user.tags.coolHouse,
                    user.tags.roadTrips,
                    user.tags.children,
                ];
                const personMinorInfluences = [
                    person.tags.videoGames,
                    person.tags.movies,
                    person.tags.tvShows,
                    person.tags.cooking,
                    person.tags.drinking,
                    person.tags.reading,
                    person.tags.writing,
                    person.tags.photography,
                    person.tags.art,
                    person.tags.theatre,
                    person.tags.performingMusic,
                    person.tags.listeningToMusic,
                    person.tags.college,
                    person.tags.fullTimeJob,
                    person.tags.partTimeJob,
                    person.tags.studying,
                    person.tags.greekLife,
                    person.tags.partying,
                    person.tags.gym,
                    person.tags.watchingSports,
                    person.tags.playingSports,
                    person.tags.shopping,
                    person.tags.fashion,
                    person.tags.indoors,
                    person.tags.outdoors,
                    person.tags.plants,
                    person.tags.warmHouse,
                    person.tags.coolHouse,
                    person.tags.roadTrips,
                    person.tags.children,
                ];
                for (let i = 0; i < userMajorInfluences.length; i++) {
                    if (userMajorInfluences[i] == personMajorInfluences[i]) {
                        matchPercentage += 8;
                    } else if (
                        userMajorInfluences[i] == 'sometimes' ||
                        personMajorInfluences[i] == 'sometimes'
                    ) {
                        matchPercentage += 4;
                    }
                }
                for (let j = 0; j < userMinorInfluences.length; j++) {
                    if (userMinorInfluences[j] && personMinorInfluences[j]) {
                        matchPercentage += 2;
                    }
                }
                const matchToAdd: BasicUser = {
                    id: personID,
                    name: person.name,
                    age: personAge,
                    percentage: matchPercentage,
                };
                potentialMatches.push(matchToAdd);
            }
        }
    }
    for (let a = 0; a < potentialMatches.length; a++) {
        for (let b = a + 1; b < potentialMatches.length; b++) {
            if (potentialMatches[b].percentage > potentialMatches[a].percentage) {
                let tempUser = potentialMatches[a];
                potentialMatches[a] = potentialMatches[b];
                potentialMatches[b] = tempUser;
            }
        }
    }
    res.send(potentialMatches);
});
