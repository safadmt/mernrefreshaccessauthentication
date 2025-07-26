# 🔐 MERN Login System with Access & Refresh Tokens

This is a secure **authentication system** built with the MERN stack:  
MongoDB, Express.js, React.js, and Node.js.

It implements:
- 🔐 Access tokens (valid 15 min)
- 🔄 Refresh tokens (valid 7 days, in `httpOnly` cookies)
- ✅ Token rotation and blacklisting
- 🔐 Protected routes (frontend/backend)
- 🚪 Logout functionality

---

## 🧑‍💻 Features

- ✅ Register, Login, Logout
- ✅ Access/Refresh token handling
- ✅ Secure refresh token rotation
- ✅ Protected frontend routes using `React Router DOM`
- ✅ Tailwind CSS UI + Lucide icons
- ✅ Axios-based API service layer
- ✅ Auto token refresh and re-login logic


## 🧪 Backend API Endpoints

| Method | Endpoint           | Description                          |
|--------|--------------------|--------------------------------------|
| POST   | `/api/register`    | Register new user                    |
| POST   | `/api/login`       | Login, return access + refresh token|
| GET    | `/api/user`        | Get current user info (protected)   |
| POST   | `/api/refresh-token` | Refresh access token                |
| POST   | `/api/logout`      | Invalidate refresh token             |

> Refresh token is stored in a `httpOnly` cookie

## 💻 Frontend Pages

### 🧾 Register Page
- Input fields: `email`, `username`, `password`, `confirmPassword`
- Validations with error messages
- Styled using **Tailwind CSS**
- Lucide icons used for input icons and toggles

### 🔐 Login Page
- Fields: `email`, `password`
- On success, stores `accessToken` in localStorage and sets refresh cookie
- Redirects to protected page

### 🔒 Protected Page
- Uses `getUserDetails()` API call with access token
- If access token fails (401/403), it automatically tries to refresh it
- Includes Logout button that:
  - Calls `logoutUser()`
  - Clears tokens and redirects to login

- Server .env
PORT=
MONGO_URI=mongodb://localhost:27017/auth-db
ACCESS_TOKEN_SECRET=youraccesstokensecret
REFRESH_TOKEN_SECRET=yourrefreshtokensecret
ALLOWED_ORIGIN = 
NODE_ENV = 

- Fronted .env

VITE_API_URL = 