import express from 'express';
import middleware from './config/middleware';
import { FolderRoutes, UserRoutes } from './modules';
import path from 'path';
import Busboy from 'busboy';
import { gfs } from './config/grid-fs-config';

const app = express();

// applying middleware
middleware(app);

// routes
app.use('/api', [FolderRoutes, UserRoutes]);

//temporary routes for uploading files
app.get('/upload', (req, res) => {
    res.sendFile(path.normalize(__dirname + '/../src/upload.html'));
});

app.post('/upload', (req, res) => {

    let file, mtype, writable;
    const busboy = new Busboy({ headers: req.headers });

    busboy.on('file', (fieldName, fileStream, fileName, encoding, mimetype) => {
        console.log(fieldName, fileName, encoding, mimetype);

        writable = gfs.createWriteStream({
            mode: 'w',
            content_type: mimetype,
            filename: fileName
        });

        writable.on('error', (err) => {
            console.log('GridFS error ' + err);
        });

        fileStream.pipe(writable);

        fileStream.on('end', () => {
            console.log('Busboy filestream finished with ' + fileName);
            file = fileName;
            mtype = mimetype;
        });
    });

    busboy.on('finish', () => {
        console.log('Busboy finished');
        writable.on('close', file => {
            console.log('GridFS finished with ' + file.filename);
            res.json({
                ok: true,
                fileId: file._id,
                type: mtype
            });
        });
    });

    req.pipe(busboy);
});

app.get('/file/:id', async (req, res) => {
    const {id} = req.params;

    gfs.findOne({ _id: id}, (err, file) => {
        const readStream = gfs.createReadStream({_id: id});

        readStream.on('error', err => {
            return res.json(err);
        });

        res.writeHead(200, {
            'Content-Type': file.contentType
        });

        readStream.pipe(res);
    });
});

app.get('/video/:id', function(req, res) {
    const {id} = req.params;

    gfs.findOne({
        _id: id
    }, (err, file) => {
        if (err) {
            return res.status(400).send({
                err: err
            });
        }
        if (!file) {
            return res.status(404).send({
                err: 'File not found'
            });
        }

        if (req.headers['range']) {
            const parts = req.headers['range'].replace(/bytes=/, "").split("-");
            const partialStart = parts[0];
            const partialEnd = parts[1];

            const start = parseInt(partialStart, 10);
            const end = partialEnd ? parseInt(partialEnd, 10) : file.length - 1;
            const chunkSize = (end - start) + 1;

            res.writeHead(206, {
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Range': 'bytes ' + start + '-' + end + '/' + file.length,
                'Content-Type': file.contentType
            });

            gfs.createReadStream({
                _id: file._id,
                range: {
                    startPos: start,
                    endPos: end
                }
            }).pipe(res);
        } else {
            res.header('Content-Length', file.length);
            res.header('Content-Type', file.contentType);

            gfs.createReadStream({
                _id: file._id
            }).pipe(res);
        }
    });
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