import { Router } from 'express';
import {
    createUser
} from './controller';

const routes = new Router();

// post
routes.post('/users', createUser);

// get

// delete


export default routes;