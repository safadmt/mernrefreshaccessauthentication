import mongoose from 'mongoose';
import { appConfig } from './appConfig.js';

/**
 * Configure and connect to MongoDB
 */
export const configureDb = async () => {
  try {
    await mongoose.connect(appConfig.mongoUrl);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};
