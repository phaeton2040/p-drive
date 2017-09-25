import express from 'express';
import middleware from './config/middleware';
import { FolderRoutes } from './modules';
import fs from 'fs';
import path from 'path';
import Busboy from 'busboy';
import { gfs } from './config/grid-fs-config';

const app = express();

// applying middleware
middleware(app);

// routes
app.use('/api', [FolderRoutes]);

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
                file: file._id,
                type: mtype
            });
        });
    });

    req.pipe(busboy);
});

app.get('/file/:file', async (req, res) => {
    const id = req.params.file;
    const readStream = gfs.createReadStream({_id: id});

    gfs.findOne({ _id: id}, function (err, file) {
        // console.log(file);
        const fileSize = file.length;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-")
            const start = parseInt(parts[0], 10)
            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize-1;
            const chunksize = (end-start)+1
            const data = gfs.createReadStream({_id: id}, {
                range: {
                    startPos: start,
                    endPos: end
                }
            });
            console.log(start, end, fileSize);
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': file.contentType,
            };
            res.writeHead(206, head);
            data.pipe(res);
        } else {
            res.set('Content-Type', file.contentType);
            readStream.pipe(res);
        }


    });

    readStream.on('error', err => {
        return res.json(err);
    });
});

app.get('/test', (req, res) => {
    res.sendFile(path.normalize(__dirname + '/../src/test.html'));
});

app.get('/video', function(req, res) {
    const p = __dirname + '/../test.mp4';
    const stat = fs.statSync(path.normalize(p));
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize-1
        const chunksize = (end-start)+1
        const file = fs.createReadStream(p, {start, end})
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(p).pipe(res)
    }
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