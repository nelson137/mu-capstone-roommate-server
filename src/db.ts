import { connect, model, Schema } from 'mongoose';

// TODO: Would the [connect-mongo package](https://www.npmjs.com/package/connect-mongo) be useful?

// Full schema for model definition
const userSchema = new Schema(
    {
        email: { type: String, required: true },
        passwordHash: { type: String, required: true },

        name: String,
        gender: String,
        loc: {
            city: String,
            state: String,
        },
        status: String,
        smoking: String,
        pets: String,
        sameSex: Boolean,
        age: {
            min: Number,
            max: Number,
        },
        rent: {
            min: Number,
            max: Number,
        },
        noise: String,
        guests: String,
        sleep: String,
        commonSpaces: String,
        clean: String,
        tags: {
            videoGames: Boolean,
            movies: Boolean,
            tvShows: Boolean,
            cooking: Boolean,
            drinking: Boolean,
            reading: Boolean,
            writing: Boolean,
            photography: Boolean,
            art: Boolean,
            theatre: Boolean,
            performingMusic: Boolean,
            listeningToMusic: Boolean,
            college: Boolean,
            fullTimeJob: Boolean,
            partTimeJob: Boolean,
            studying: Boolean,
            greekLife: Boolean,
            partying: Boolean,
            gym: Boolean,
            watchingSports: Boolean,
            playingSports: Boolean,
            shopping: Boolean,
            fashion: Boolean,
            indoors: Boolean,
            outdoors: Boolean,
            plants: Boolean,
            warmHouse: Boolean,
            coolHouse: Boolean,
            roadTrips: Boolean,
            children: Boolean,
        },
        extraBoxes: {
            religion: String,
            sexualOrientation: String,
            politicalAlignment: String,
            transportation: String,
        },
        bio: String,
        DoB: Date,
    },
    { collection: 'UserbaseC' },
);
export const User = model('user', userSchema);

// export const setupDatabase = () => connect('mongodb://localhost/bunkiez');
export const setupDatabase = () =>
    connect('mongodb+srv://GenericUser:Bunkiez@bunkiesv1.jzrjtev.mongodb.net/BunkiesV1', {
        dbName: 'Generic_Bunkies',
    });

// Projection defines which fields from the doc the query will return
const userProjection = {
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
