import user from "../models/user.js";
import TokenModel from "../models/token.js";
import { generateAccessToken, generateRefreshToken } from "../helpers/authHelpers.js";
import bcrypt from 'bcryptjs';
import { appConfig } from "../config/appConfig.js";
import jwt from 'jsonwebtoken';

/**
 * Handles registering a new user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
export const registerUser = async (req, res) => {
  const { email, password: plainTextPassword, username } = req.body;

  console.log(req.body, 'req body in register user');

  // Check if required values exist
  if (!email || !plainTextPassword || !username) {
    return res.status(400).json({ error: 'Email, password, and username are required' });
  }

  // Check if values are strings
  if (
    typeof email !== 'string' ||
    typeof plainTextPassword !== 'string' ||
    typeof username !== 'string'
  ) {
    return res.status(400).json({ error: 'Email, password, and username must be strings' });
  }

  // Check if values are non-empty strings
  if (!email.trim() || !plainTextPassword.trim() || !username.trim()) {
    return res.status(400).json({ error: 'Email, password, and username cannot be empty' });
  }

  try {
    // Check if the user already exists
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(plainTextPassword, 10);

    // Create the new user
    const newUser = new user({ email, password: hashedPassword, username });
    await newUser.save();

    // Generate tokens
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Save refresh token in DB
    await TokenModel.create({ token: refreshToken });

    res.status(201).json({
      message: 'User registered successfully',
      accessToken,
      username,
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ error: 'Failed to register user' });
  }
};


/**
 * Handles logging in a user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
    if(!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  // Check that the email and password are strings
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password must be strings' });
  }

  // Check that the email and password are not empty
  if (!email.trim() || !password.trim()) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find the user with the given email
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check that the password is valid
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Generate an access token and a refresh token
    const accessToken = generateAccessToken(existingUser);
    const refreshToken = generateRefreshToken(existingUser);

    // Set the refresh token as a cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // Set to true in production,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    console.log(refreshToken, 'refreshToken')

    // Save the refresh token in the database
    await TokenModel.create({ token: refreshToken });
    console.log(accessToken, 'accessToken')
    res.status(200).json({ accessToken, message: 'User logged in successfully' ,username: existingUser.username});
  } catch (error) {
    console.error('Error logging in user:', error.message);
    res.status(500).json({ error: "Failed to log in user" });
  }
}

/**
 * Handles logging out a user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
export const logoutUser = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    // Invalidate the user's refresh token (implementation depends on your token strategy)
    // Delete the refresh token from the database
    await TokenModel.deleteOne({ token });
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error('Error logging out user:', error.message);
    res.status(500).json({ error: "Failed to log out user" });
  }
}

/**
 * Refreshes an access token if the refresh token is valid.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
export const refreshAccessToken = async (req, res) => {
  console.log('Refreshing access token', req.cookies.refreshToken);
  const token = req.cookies.refreshToken;

  // Check if the token is present
  if (!token) return res.sendStatus(401);

  try {
    // Check if the token exists in the database
    const exists = await TokenModel.findOne({ token });
    console.log(exists, 'exist ed token');
    if (!exists) return res.sendStatus(403);

    // Verify the token
    const payload = jwt.verify(token, appConfig.jwt_refresh_secret);
    console.log(payload, "jwt payload");

    // Invalidate the old token
    await TokenModel.deleteOne({ token });

    // Generate a new access token and refresh token
    const newAccessToken = generateAccessToken({ _id: payload.id });
    const newRefreshToken = generateRefreshToken({ _id: payload.id });

    // Save the new refresh token in the database
    await TokenModel.create({ token: newRefreshToken });

    // Set the new refresh token as a cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true, // Set to true in production,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.log(err, 'error in refresh token');
    res.sendStatus(403);
  }
};
