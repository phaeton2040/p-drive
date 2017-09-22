import mongoose from 'mongoose';
import Grid from 'gridfs-stream';
import dbConfig from './db';

// connecting to database
dbConfig();

export const gfs = new Grid(mongoose.connection.db, mongoose.mongo);