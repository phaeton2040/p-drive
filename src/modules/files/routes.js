import { Router } from 'express';
import {
    getFile,
    getVideo,
    uploadFile
} from './controller';
import {verifyAuth} from '../../config/verifyAuth';

const routes = new Router();

// post
routes.post('/files/upload', verifyAuth, uploadFile);

// get
routes.get('/file/:id', getFile);
routes.get('/video/:id', getVideo);

export default routes;