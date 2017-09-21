import express from 'express';
import dbConfig from './config/db';
import middleware from './config/middleware';
import { FolderRoutes } from './modules';

const app = express();

// connecting to database
dbConfig();

// applying middleware
middleware(app);

// routes
app.use('/api', [FolderRoutes]);

process.env.PORT = 1134;

app.listen(process.env.PORT, err => {
  if (err)
    throw new Error(err);

  if (process.env.NODE_ENV.trim() !== 'test') {
    console.log('App started');
  }
})

export default app;