import { Router } from 'express';
import {
    createFolder,
    editFolder,
    getAllFolders,
    getFolder,
    getFolderByPath,
    removeFolder
} from './controller';
import {verifyAuth} from '../../config/verifyAuth';

const routes = new Router();

// post
routes.post('/folders', verifyAuth, createFolder);
routes.post('/folders/:id', verifyAuth, editFolder);

// get
routes.get('/folders', verifyAuth, getAllFolders);
routes.get('/folders/path', verifyAuth, getFolderByPath);
routes.get('/folders/:id', verifyAuth, getFolder);

// delete
routes.delete('/folders', verifyAuth, removeFolder);


export default routes;