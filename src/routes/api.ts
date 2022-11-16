import { Response, Router } from 'express';
import { expressjwt, Request } from 'express-jwt';
import { getUsers, User } from '../db';

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
    res.send(await getUsers());
});

apiRouter.get('/matches', async (_req: Request, res: Response) => {
    var user = await User.findById('632dd93508fdd4a48cc94d18'); // replace with current user's ID, just a placeholder
    var allUsers = await getUsers();
    var potentialMatches: BasicUser[] = [];
    allUsers.forEach(getPercentage);
    function getPercentage(person: typeof user, index: number) {
        var matchPercentage = 0;
        if (user && person && user.profile && person.profile) {
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
                user.profile.smoking == person.profile.smoking &&
                user.profile.pets == person.profile.pets &&
                (user.profile.sameSex == false || user.profile.gender == person.profile.gender) &&
                (user.profile.rent.min ?? 0) <= person.profile.rent.max &&
                (user.profile.rent.max ?? 0) >= person.profile.rent.min &&
                userAge >= person.profile.age.min &&
                userAge <= person.profile.age.max &&
                (user.profile.age.min ?? 0) <= personAge &&
                (user.profile.age.max ?? 0) >= personAge
            ) {
                matchPercentage += 50;
                const userMajorInfluences = [
                    user.profile.noise,
                    user.profile.guests,
                    user.profile.sleep,
                    user.profile.commonSpaces,
                    user.profile.clean,
                ];
                const personMajorInfluences = [
                    person.profile.noise,
                    person.profile.guests,
                    person.profile.sleep,
                    person.profile.commonSpaces,
                    person.profile.clean,
                ];
                const userMinorInfluences = [
                    user.profile.tags.videoGames,
                    user.profile.tags.movies,
                    user.profile.tags.tvShows,
                    user.profile.tags.cooking,
                    user.profile.tags.drinking,
                    user.profile.tags.reading,
                    user.profile.tags.writing,
                    user.profile.tags.photography,
                    user.profile.tags.art,
                    user.profile.tags.theatre,
                    user.profile.tags.performingMusic,
                    user.profile.tags.listeningToMusic,
                    user.profile.tags.college,
                    user.profile.tags.fullTimeJob,
                    user.profile.tags.partTimeJob,
                    user.profile.tags.studying,
                    user.profile.tags.greekLife,
                    user.profile.tags.partying,
                    user.profile.tags.gym,
                    user.profile.tags.watchingSports,
                    user.profile.tags.playingSports,
                    user.profile.tags.shopping,
                    user.profile.tags.fashion,
                    user.profile.tags.indoors,
                    user.profile.tags.outdoors,
                    user.profile.tags.plants,
                    user.profile.tags.warmHouse,
                    user.profile.tags.coolHouse,
                    user.profile.tags.roadTrips,
                    user.profile.tags.children,
                ];
                const personMinorInfluences = [
                    person.profile.tags.videoGames,
                    person.profile.tags.movies,
                    person.profile.tags.tvShows,
                    person.profile.tags.cooking,
                    person.profile.tags.drinking,
                    person.profile.tags.reading,
                    person.profile.tags.writing,
                    person.profile.tags.photography,
                    person.profile.tags.art,
                    person.profile.tags.theatre,
                    person.profile.tags.performingMusic,
                    person.profile.tags.listeningToMusic,
                    person.profile.tags.college,
                    person.profile.tags.fullTimeJob,
                    person.profile.tags.partTimeJob,
                    person.profile.tags.studying,
                    person.profile.tags.greekLife,
                    person.profile.tags.partying,
                    person.profile.tags.gym,
                    person.profile.tags.watchingSports,
                    person.profile.tags.playingSports,
                    person.profile.tags.shopping,
                    person.profile.tags.fashion,
                    person.profile.tags.indoors,
                    person.profile.tags.outdoors,
                    person.profile.tags.plants,
                    person.profile.tags.warmHouse,
                    person.profile.tags.coolHouse,
                    person.profile.tags.roadTrips,
                    person.profile.tags.children,
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
