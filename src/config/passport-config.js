import passport from 'passport';
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt'
import User from '../modules/users/model';
import {secret} from './index';

const  jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = secret;

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        const user = await User.findOne({_id: payload.id});

        if (user) {
            done(null, user);
        } else {
            done(null, false)
        }

    } catch (e) {
        return done(e, false);
    }
}));
