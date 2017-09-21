import mongoose from 'mongoose';

export default () => {

  const dbName = process.env.NODE_ENV.trim() !== 'test' ? 'pdrive' : 'pdriveMock';

  // use native promises
  mongoose.Promise = global.Promise;
  mongoose.connect(`mongodb://localhost/${dbName}`);
  mongoose.connection
    .once('open', () => {
      if (process.env.NODE_ENV.trim() !== 'test') {
        console.log('Database running')
      }
    })
    .on('error', err => console.error(err.message))
}