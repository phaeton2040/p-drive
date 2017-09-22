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

    let file, mtype;
    const busboy = new Busboy({ headers: req.headers });

    busboy.on('file', (fieldName, fileStream, fileName, encoding, mimetype) => {
        console.log(fieldName, fileName, encoding, mimetype);
        // const writable = fs.createWriteStream(path.normalize(__dirname + '/../uploads/' + fileName));
        const writable = gfs.createWriteStream({
            mode: 'w',
            content_type: mimetype,
            filename: fileName
        });

        writable.on('close', file => {
           console.log('GridFS finished with ' + file.filename);
            res.json({
                ok: true,
                file: file.filename,
                type: mtype
            })
        });

        writable.on('error', (err) => {
            console.log('GridFS error ' + err);
        });

        fileStream.pipe(writable);

        fileStream.on('end', function () {
            console.log('Busboy filestream finished with ' + fileName);
            file = fileName;
            mtype = mimetype;
        });
    });

    busboy.on('finish', () => {
       console.log('Busboy finished');
    });

    req.pipe(busboy);
});

app.get('/file/:file', async (req, res) => {
   const file = req.params.file;
   const readStream = gfs.createReadStream({filename: file});

   readStream.on('error', err => {
      return res.json(err);
   });

   return readStream.pipe(res);
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