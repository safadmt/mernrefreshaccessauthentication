import dotenv from 'dotenv';
dotenv.config();

export const appConfig = {
    mongoUrl: process.env.MONGODB_URL || "",
    port: process.env.PORT || 5000,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || '',
    jwt_access_secret: process.env.JWT_ACCESS_SECRET || '',
    allowed_origin: process.env.ALLOWED_ORIGIN || '',
    node_env: process.env.NODE_ENV || 'development'
};