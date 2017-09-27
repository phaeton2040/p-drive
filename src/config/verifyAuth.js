import passport from 'passport';
import './passport-config';

export const verifyAuth = passport.authenticate('jwt', {session: false});