import { Response, Router } from 'express';
import { expressjwt, Request } from 'express-jwt';
import { IUser, User } from '../db';

type BasicUser = {
    id: string;
    name: string;
    age: number;
    percentage: number;
};

export const JWT_ALGORITHM = 'HS256';

export const apiRouter = Router();

apiRouter.use(expressjwt({ secret: process.env.JWT_SECRET!, algorithms: [JWT_ALGORITHM] }));

apiRouter.get('/users', async (_req: Request, res: Response) => {
    res.json(await User.find<IUser>());
});

apiRouter.get('/matches', async (_req: Request, res: Response) => {
    var user = await User.findById<IUser>('632dd93508fdd4a48cc94d18'); // replace with current user's ID, just a placeholder
    var allUsers = await User.find<IUser>();
    var potentialMatches: BasicUser[] = [];
    allUsers.forEach(getPercentage);
    function getPercentage(person: IUser, index: number) {
        var matchPercentage = 0;
        if (user && person && user.profile && person.profile && user.prefs && person.prefs) {
            var userID = user._id.toString();
            var personID = person._id.toString();
            const todaysDate = new Date();
            var userAge = todaysDate.getFullYear() - user.dateOfBirth.getFullYear();
            var personAge = todaysDate.getFullYear() - person.dateOfBirth.getFullYear();
            if (
                todaysDate.getMonth() - user.dateOfBirth.getMonth() < 0 ||
                (todaysDate.getMonth() - user.dateOfBirth.getMonth() == 0 &&
                    todaysDate.getDate() - user.dateOfBirth.getDate() < 0)
            ) {
                userAge--;
            }
            if (
                todaysDate.getMonth() - person.dateOfBirth.getMonth() < 0 ||
                (todaysDate.getMonth() - person.dateOfBirth.getMonth() == 0 &&
                    todaysDate.getDate() - person.dateOfBirth.getDate() < 0)
            ) {
                personAge--;
            }
            if (
                userID != personID &&
                user.profile.status != person.profile.status &&
                user.profile.loc.city == person.profile.loc.city &&
                user.profile.loc.state == person.profile.loc.state &&
                user.prefs.absolutes.smoking == person.prefs.absolutes.smoking &&
                user.prefs.absolutes.pets == person.prefs.absolutes.pets &&
                (user.prefs.absolutes.sameSex == false ||
                    user.profile.gender == person.profile.gender) &&
                (user.prefs.absolutes.rent.min ?? 0) <= person.prefs.absolutes.rent.max &&
                (user.prefs.absolutes.rent.max ?? 0) >= person.prefs.absolutes.rent.min &&
                userAge >= person.prefs.absolutes.age.min &&
                userAge <= person.prefs.absolutes.age.max &&
                (user.prefs.absolutes.age.min ?? 0) <= personAge &&
                (user.prefs.absolutes.age.max ?? 0) >= personAge
            ) {
                matchPercentage += 50;
                const userMajorInfluences = [
                    user.prefs.major.noise,
                    user.prefs.major.guests,
                    user.prefs.major.sleep,
                    user.prefs.major.commonSpaces,
                    user.prefs.major.clean,
                ];
                const personMajorInfluences = [
                    person.prefs.major.noise,
                    person.prefs.major.guests,
                    person.prefs.major.sleep,
                    person.prefs.major.commonSpaces,
                    person.prefs.major.clean,
                ];
                const userMinorInfluences = [
                    user.prefs.tags.videoGames,
                    user.prefs.tags.movies,
                    user.prefs.tags.tvShows,
                    user.prefs.tags.cooking,
                    user.prefs.tags.drinking,
                    user.prefs.tags.reading,
                    user.prefs.tags.writing,
                    user.prefs.tags.photography,
                    user.prefs.tags.art,
                    user.prefs.tags.theatre,
                    user.prefs.tags.performingMusic,
                    user.prefs.tags.listeningToMusic,
                    user.prefs.tags.college,
                    user.prefs.tags.fullTimeJob,
                    user.prefs.tags.partTimeJob,
                    user.prefs.tags.studying,
                    user.prefs.tags.greekLife,
                    user.prefs.tags.partying,
                    user.prefs.tags.gym,
                    user.prefs.tags.watchingSports,
                    user.prefs.tags.playingSports,
                    user.prefs.tags.shopping,
                    user.prefs.tags.fashion,
                    user.prefs.tags.indoors,
                    user.prefs.tags.outdoors,
                    user.prefs.tags.plants,
                    user.prefs.tags.warmHouse,
                    user.prefs.tags.coolHouse,
                    user.prefs.tags.roadTrips,
                    user.prefs.tags.children,
                ];
                const personMinorInfluences = [
                    person.prefs.tags.videoGames,
                    person.prefs.tags.movies,
                    person.prefs.tags.tvShows,
                    person.prefs.tags.cooking,
                    person.prefs.tags.drinking,
                    person.prefs.tags.reading,
                    person.prefs.tags.writing,
                    person.prefs.tags.photography,
                    person.prefs.tags.art,
                    person.prefs.tags.theatre,
                    person.prefs.tags.performingMusic,
                    person.prefs.tags.listeningToMusic,
                    person.prefs.tags.college,
                    person.prefs.tags.fullTimeJob,
                    person.prefs.tags.partTimeJob,
                    person.prefs.tags.studying,
                    person.prefs.tags.greekLife,
                    person.prefs.tags.partying,
                    person.prefs.tags.gym,
                    person.prefs.tags.watchingSports,
                    person.prefs.tags.playingSports,
                    person.prefs.tags.shopping,
                    person.prefs.tags.fashion,
                    person.prefs.tags.indoors,
                    person.prefs.tags.outdoors,
                    person.prefs.tags.plants,
                    person.prefs.tags.warmHouse,
                    person.prefs.tags.coolHouse,
                    person.prefs.tags.roadTrips,
                    person.prefs.tags.children,
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
                    name: person.name!,
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
