import { connect, Document, model, Schema } from 'mongoose';

/**
 * Tutorial for Mongoose type safety:
 * https://medium.com/@agentwhs/complete-guide-for-typescript-for-mongoose-for-node-js-8cc0a7e470c1
 */

// TODO: Would the [connect-mongo package](https://www.npmjs.com/package/connect-mongo) be useful?

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    name: string;
    dateOfBirth: Date;
    profile: null | {
        status: string;
        gender: string;
        bio: string;
        loc: {
            city: string;
            state: string;
        };
        religion: string;
        sexualOrientation: string;
        politicalAlignment: string;
    };
    prefs: null | {
        absolutes: {
            age: {
                min: number;
                max: number;
            };
            rent: {
                min: number;
                max: number;
            };
            sameSex: boolean;
            smoking: boolean;
            pets: boolean;
        };
        major: {
            clean: string;
            commonSpaces: string;
            guests: string;
            noise: string;
            sleep: string;
        };
        tags: {
            art: boolean;
            children: boolean;
            college: boolean;
            cooking: boolean;
            coolHouse: boolean;
            drinking: boolean;
            fashion: boolean;
            fullTimeJob: boolean;
            greekLife: boolean;
            gym: boolean;
            indoors: boolean;
            listeningToMusic: boolean;
            movies: boolean;
            outdoors: boolean;
            partTimeJob: boolean;
            partying: boolean;
            performingMusic: boolean;
            photography: boolean;
            plants: boolean;
            playingSports: boolean;
            reading: boolean;
            roadTrips: boolean;
            shopping: boolean;
            studying: boolean;
            theatre: boolean;
            tvShows: boolean;
            videoGames: boolean;
            warmHouse: boolean;
            watchingSports: boolean;
            writing: boolean;
        };
    };
}

// Full schema for model definition
const UserSchema = new Schema(
    {
        email: String,
        passwordHash: String,
        name: String,
        dateOfBirth: { type: Date, required: true },
        profile: {
            required: false,
            type: {
                status: { type: String, required: true },
                gender: { type: String, required: true },
                bio: { type: String, required: false },
                loc: {
                    required: true,
                    type: {
                        city: { type: String, required: true },
                        state: { type: String, required: true },
                    },
                },
                religion: { type: String, required: false },
                sexualOrientation: { type: String, required: false },
                politicalAlignment: { type: String, required: false },
            },
        },
        prefs: {
            required: false,
            type: {
                absolutes: {
                    required: true,
                    type: {
                        age: {
                            required: true,
                            type: {
                                min: { type: Number, required: true },
                                max: { type: Number, required: true },
                            },
                        },
                        rent: {
                            required: true,
                            type: {
                                min: { type: Number, required: true },
                                max: { type: Number, required: true },
                            },
                        },
                        sameSex: { type: Boolean, required: true },
                        smoking: { type: Boolean, required: true },
                        pets: { type: Boolean, required: true },
                    },
                },
                major: {
                    required: true,
                    type: {
                        clean: { type: String, required: true },
                        commonSpaces: { type: String, required: true },
                        guests: { type: String, required: true },
                        noise: { type: String, required: true },
                        sleep: { type: String, required: true },
                    },
                },
                tags: {
                    required: true,
                    type: {
                        art: { type: Boolean, required: true },
                        children: { type: Boolean, required: true },
                        college: { type: Boolean, required: true },
                        cooking: { type: Boolean, required: true },
                        coolHouse: { type: Boolean, required: true },
                        drinking: { type: Boolean, required: true },
                        fashion: { type: Boolean, required: true },
                        fullTimeJob: { type: Boolean, required: true },
                        greekLife: { type: Boolean, required: true },
                        gym: { type: Boolean, required: true },
                        indoors: { type: Boolean, required: true },
                        listeningToMusic: { type: Boolean, required: true },
                        movies: { type: Boolean, required: true },
                        outdoors: { type: Boolean, required: true },
                        partTimeJob: { type: Boolean, required: true },
                        partying: { type: Boolean, required: true },
                        performingMusic: { type: Boolean, required: true },
                        photography: { type: Boolean, required: true },
                        plants: { type: Boolean, required: true },
                        playingSports: { type: Boolean, required: true },
                        reading: { type: Boolean, required: true },
                        roadTrips: { type: Boolean, required: true },
                        shopping: { type: Boolean, required: true },
                        studying: { type: Boolean, required: true },
                        theatre: { type: Boolean, required: true },
                        tvShows: { type: Boolean, required: true },
                        videoGames: { type: Boolean, required: true },
                        warmHouse: { type: Boolean, required: true },
                        watchingSports: { type: Boolean, required: true },
                        writing: { type: Boolean, required: true },
                    },
                },
            },
        },
    },
    { collection: 'UserbaseB' },
);
export const User = model('User', UserSchema);

export const setupDatabase = () => connect(process.env.DATABASE_URL!);
