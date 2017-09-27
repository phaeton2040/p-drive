import bodyParser from 'body-parser';
import morgan from 'morgan';
import passport from 'passport';

export default app => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(passport.initialize());
    process.env.NODE_ENV.trim() !== 'test' && app.use(morgan('dev'));
}