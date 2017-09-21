import { Router } from 'express';
import {
    createFolder,
    editFolder,
    getAllFolders,
    getFolder,
    getFolderByPath,
    removeFolder
} from './controller';

const routes = new Router();

// post
routes.post('/folders', createFolder);
routes.post('/folders/:id', editFolder);

// get
routes.get('/folders', getAllFolders);
routes.get('/folders/:id', getFolder);
routes.get('/:path(*)', getFolderByPath);

// delete
routes.delete('/folders', removeFolder);


export default routes;