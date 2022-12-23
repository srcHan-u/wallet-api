import mongoose from 'mongoose';
import { URI } from './URI';

export const connect = (location = URI) => {
    mongoose.connect(location);
    const db = mongoose.connection;
    db.on('error', (err) => console.log('connection error:', err));
    db.once('open', () => console.log('Connected to cwdb!'));
  };

  




