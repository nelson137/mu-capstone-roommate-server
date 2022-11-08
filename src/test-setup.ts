import { Chance } from 'chance';

export default () => {
    process.env.JWT_SECRET = new Chance().string();
};
