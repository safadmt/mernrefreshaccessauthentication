# 🔐 MERN Login System with Access & Refresh Tokens

This is a secure **authentication system** built with the MERN stack:  
MongoDB, Express.js, React.js, and Node.js.

It implements:
- 🔐 Access tokens (valid 15 min)
- 🔄 Refresh tokens (valid 7 days, in `httpOnly` cookies)
- ✅ Token rotation and blacklisting
- 🔐 Protected routes (frontend/backend)
- 🚪 Logout functionality
- 📦 Centralized Axios interceptor for auto token refresh

---

## 🧑‍💻 Features

- ✅ Register, Login, Logout
- ✅ Access/Refresh token handling with secure rotation
- ✅ Centralized Axios interceptor for token refresh
- ✅ Protected frontend routes using `React Router DOM`
- ✅ Tailwind CSS UI + Lucide icons
- ✅ Auto re-login + redirect to login on refresh failure

---

## 🧪 Backend API Endpoints

| Method | Endpoint              | Description                          |
|--------|-----------------------|--------------------------------------|
| POST   | `/api/auth/register`  | Register new user                    |
| POST   | `/api/auth/login`     | Login, returns access + refresh token|
| GET    | `/api/user`           | Get current user info (authenticate)   |
| GET    | `/api/user/getAll`    | Get all users  (authenticate)   |
| GET    | `/api/auth/refresh`   | Refresh access token                |
| POST   | `/api/auth/logout`    | Invalidate refresh token             |

> Refresh token is stored in a `httpOnly` cookie

---

## 💻 Frontend Pages

### 🧾 Register Page
- Fields: `email`, `username`, `password`, `confirmPassword`
- Validations and feedback using Tailwind
- Lucide icons for input fields
- On success: redirects to protected area

### 🔐 Login Page
- Fields: `email`, `password`
- On login:
  - `accessToken` saved in localStorage
  - Refresh token sent via `httpOnly` cookie
  - Redirect to protected page

### 🔒 Protected Page
- Calls `getUserDetails()` with access token
- If token fails, Axios interceptor tries to refresh
- Includes a **Logout** button:
  - Calls `/auth/logout`
  - Clears token and redirects to `/login`

### 📋 Users Table Page 
- Fetches all users via `/user/getAll`
- Uses protected Axios instance with auto-refresh
- Displays a **table** of:
  - `username`
  - `email`
- Tailwind styled table layout

---

## 🌐 Axios Interceptor Auth Handling

- Global Axios instance (`services/api.js`)
- Automatically appends `Authorization: Bearer <accessToken>` to requests
- Intercepts 401/403 responses:
  - Tries to refresh token using `/auth/refresh`
  - On success: retries original request
  - On failure: clears tokens and redirects to login


# Backend .env

- PORT=
- MONGO_URI=mongodb://localhost:27017/auth-db
- ACCESS_TOKEN_SECRET=youraccesstokensecret
 - REFRESH_TOKEN_SECRET=yourrefreshtokensecret
- ALLOWED_ORIGIN=http://localhost:5173
- NODE_ENV=development

# Frontend .env

VITE_API_URL=http://localhost:4000

## Getting started 

### Clone repository

git clone https://github.com/safadmt/mernrefreshaccessauthentication.git

cd mernrefreshaccessauthentication


### Set up Backend
cd server
npm install

### Set up .env file as shown above
npm start

### Set up Frontend

cd client
npm install

### Set up .env file as shown above
npm run dev


# If you found this useful, star ⭐ the repo and feel free to contribute!





