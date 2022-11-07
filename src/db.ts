import mongoose, { connect, model, ObjectId, Schema } from 'mongoose';

// TODO: Would the [connect-mongo package](https://www.npmjs.com/package/connect-mongo) be useful?

// Full schema for model definition
const userSchema = new Schema(
    {
        email: { type: String, required: true },
        passwordHash: { type: String, required: true },

        /* unsure if we need all of these to be required, or if that will cause an issue. i changed them in the hopes
    that it would solve an issue on index.ts, but alas it did not. sorry again, hopefully this is fine - Ryan*/
        _id: { type: mongoose.Types.ObjectId, required: true },
        name: { type: String, required: true },
        gender: { type: String, required: true },
        loc: {
            city: { type: String, required: true },
            state: { type: String, required: true },
        },
        status: { type: String, required: true },
        smoking: { type: Boolean, required: true },
        pets: { type: Boolean, required: true },
        sameSex: { type: Boolean, required: true },
        age: {
            min: { type: Number, required: true },
            max: { type: Number, required: true },
        },
        rent: {
            min: { type: Number, required: true },
            max: { type: Number, required: true },
        },
        noise: { type: String, required: true },
        guests: { type: String, required: true },
        sleep: { type: String, required: true },
        commonSpaces: { type: String, required: true },
        clean: { type: String, required: true },
        tags: {
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
        extraBoxes: {
            religion: String,
            sexualOrientation: String,
            politicalAlignment: String,
            transportation: String,
        },
        bio: String,
        DoB: { type: Date, required: true },
    },
    { collection: 'UserbaseC' },
);
export const User = model('user', userSchema);

// export const setupDatabase = () => connect('mongodb://localhost/bunkiez');
export const setupDatabase = () =>
    connect('mongodb+srv://ReadOnly:SecurePassword@bunkiesv1.jzrjtev.mongodb.net/BunkiezV1', {
        dbName: 'Generic_Bunkies',
    });

// Projection defines which fields from the doc the query will return
const userProjection = {
    _id: 1,
    name: 1,
    gender: 1,
    loc: 1,
    status: 1,
    smoking: 1,
    pets: 1,
    sameSex: 1,
    age: 1,
    rent: 1,
    noise: 1,
    guests: 1,
    sleep: 1,
    commonSpaces: 1,
    clean: 1,
    tags: 1,
    DoB: 1,
};
export const getUsers = () => User.find({}, userProjection);
