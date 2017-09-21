import bodyParser from 'body-parser';
import morgan from 'morgan';

export default app => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  process.env.NODE_ENV.trim() !== 'test' && app.use(morgan('dev'));
}