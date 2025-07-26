import jwt from 'jsonwebtoken';
import { appConfig } from '../config/appConfig.js';

export const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, appConfig.jwt_access_secret, { expiresIn: '15m' });
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, appConfig.jwt_refresh_secret, { expiresIn: '1d' });
};