import { connect, model, Schema } from 'mongoose';

// TODO: Would the [connect-mongo package](https://www.npmjs.com/package/connect-mongo) be useful?

// Full schema for model definition
const userSchema = new Schema({
    // adjust with all json fields
    contactEmail: { type: String, required: true },
    passwordHash: { type: String, required: true },

    _id: {
        $oid: String,
    },
    name: String,
    gender: String,
    loc: {
        city: String,
        state: String,
    },
    status: String,
    smoking: Boolean,
    pets: Boolean,
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
    DoB: Date, // not sure if Date is a type in JSON, will investigate further soon
});
export const User = model('user', userSchema);

// export const setupDatabase = () => connect('mongodb://localhost/bunkiez');
export const setupDatabase = () => connect('mongodb://127.0.0.1/bunkiez');

// Projection defines which fields from the doc the query will return
const userProjection = { name: 1 }; // add all fields needed for comparisons
export const getUsers = () => User.find({}, userProjection);
