import passport from 'passport';
import LocalStrategy from 'passport-local'
import mongoose from 'mongoose';

passport.use(new LocalStrategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]'
}, function(email, password, done) {
    const User = mongoose.model('User');

    User.findOne({email: email}).then(function(user){
        if(!user || !user.validPassword(password)){
            return done(null, false, {errors: {'email or password': 'is invalid'}});
        }

        return done(null, user);
    }).catch(done);
}));