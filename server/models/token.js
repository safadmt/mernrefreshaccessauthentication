import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  token: String,
  createdAt: { type: Date, default: Date.now, expires: '7d' } // Token expires after 7 days
});

export default mongoose.model('TokenModel', tokenSchema);
