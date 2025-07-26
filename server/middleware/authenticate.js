import jwt from'jsonwebtoken';
import { appConfig } from '../config/appConfig.js';

/**
 * Verify the access token for a protected route.

 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header is present
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(' ')[1];

  // Check if the token is present
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  // Verify the token
  jwt.verify(token, appConfig.jwt_access_secret, (err, user) => {
    if (err) {
      // If the token is invalid or expired, return a 403 status code
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Attach user info to the request
    req.user = user;

    // Continue to the protected route
    next();
  });
};

export default authenticateToken;
