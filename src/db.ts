import { connect, model, Schema } from 'mongoose';

// TODO: Would the [connect-mongo package](https://www.npmjs.com/package/connect-mongo) be useful?

// Full schema for model definition
const userSchema = new Schema({
    contactEmail: { type: String, required: true },
    passwordHash: { type: String, required: true },

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
        min: Boolean,
        max: Boolean,
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
        writing: Boolean,
        photography: Boolean,
        plants: Boolean,
    },
    extraBoxes: {
        religion: String,
        transportation: String,
    },
    bio: String,
    DoB: Date,
});
export const User = model('user', userSchema);

export const setupDatabase = () => connect('mongodb://localhost/bunkiez');

// Projection defines which fields from the doc the query will return
const userProjection = { name: 1 };
export const getUsers = () => User.find({}, userProjection);
