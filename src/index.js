import express from 'express';
import middleware from './config/middleware';
import { FolderRoutes, UserRoutes, FileRoutes } from './modules';
import path from 'path';

const app = express();

// applying middleware
middleware(app);

// routes
app.use('/api', [FolderRoutes, UserRoutes, FileRoutes]);

//temporary routes for uploading files
app.get('/upload', (req, res) => {
    res.sendFile(path.normalize(__dirname + '/../src/upload.html'));
});

process.env.PORT = 1134;

app.listen(process.env.PORT, err => {
    if (err)
        throw new Error(err);

    if (process.env.NODE_ENV.trim() !== 'test') {
        console.log('App started');
    }
})

export default app;