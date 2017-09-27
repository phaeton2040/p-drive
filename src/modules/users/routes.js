import { Router } from 'express';
import {
    createUser,
    getUserInfo,
    loginUser
} from './controller';
import {verifyAuth} from '../../config/verifyAuth';

const routes = new Router();

// post
routes.post('/users/register', createUser);
routes.post('/users/login', loginUser);

// get
routes.get('/users/info', verifyAuth, getUserInfo);

// delete


export default routes;