import { connect, model, Schema } from 'mongoose';

// TODO: Would the [connect-mongo package](https://www.npmjs.com/package/connect-mongo) be useful?

// Full schema for model definition
const userSchema = new Schema(
    {
        email: String,
        passwordHash: String,
        name: String,
        dateOfBirth: { type: Date, required: true },
        profile: {
            required: false,
            type: {
                gender: { type: String, required: true },
                loc: {
                    required: true,
                    type: {
                        city: { type: String, required: true },
                        state: { type: String, required: true },
                    },
                },
                status: { type: String, required: true },
                smoking: { type: Boolean, required: true },
                pets: { type: Boolean, required: true },
                sameSex: { type: Boolean, required: true },
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
                noise: { type: String, required: true },
                guests: { type: String, required: true },
                sleep: { type: String, required: true },
                commonSpaces: { type: String, required: true },
                clean: { type: String, required: true },
                tags: {
                    required: true,
                    type: {
                        videoGames: { type: Boolean, required: true },
                        movies: { type: Boolean, required: true },
                        tvShows: { type: Boolean, required: true },
                        cooking: { type: Boolean, required: true },
                        drinking: { type: Boolean, required: true },
                        reading: { type: Boolean, required: true },
                        writing: { type: Boolean, required: true },
                        photography: { type: Boolean, required: true },
                        art: { type: Boolean, required: true },
                        theatre: { type: Boolean, required: true },
                        performingMusic: { type: Boolean, required: true },
                        listeningToMusic: { type: Boolean, required: true },
                        college: { type: Boolean, required: true },
                        fullTimeJob: { type: Boolean, required: true },
                        partTimeJob: { type: Boolean, required: true },
                        studying: { type: Boolean, required: true },
                        greekLife: { type: Boolean, required: true },
                        partying: { type: Boolean, required: true },
                        gym: { type: Boolean, required: true },
                        watchingSports: { type: Boolean, required: true },
                        playingSports: { type: Boolean, required: true },
                        shopping: { type: Boolean, required: true },
                        fashion: { type: Boolean, required: true },
                        indoors: { type: Boolean, required: true },
                        outdoors: { type: Boolean, required: true },
                        plants: { type: Boolean, required: true },
                        warmHouse: { type: Boolean, required: true },
                        coolHouse: { type: Boolean, required: true },
                        roadTrips: { type: Boolean, required: true },
                        children: { type: Boolean, required: true },
                    },
                },
                extraBoxes: {
                    required: true,
                    type: {
                        religion: { type: String, required: false },
                        sexualOrientation: { type: String, required: false },
                        politicalAlignment: { type: String, required: false },
                        transportation: { type: String, required: false },
                    },
                },
                bio: { type: String, required: false },
            },
        },
    },
    { collection: 'UserbaseC' },
);
export const User = model('user', userSchema);

export const setupDatabase = () => connect(process.env.DATABASE_URL!);

// Projection defines which fields from the doc the query will return
const userProjection = {
    email: 1,
    name: 1,
    dateOfBirth: 1,
    profile: 1,
};
export const getUsers = () => User.find({}, userProjection);
