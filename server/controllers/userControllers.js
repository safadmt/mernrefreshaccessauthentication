import User from '../models/user.js';

/**
 * Retrieves a user by ID from the database and sends it in the response.
 * @param {Object} req - The request object, containing user information.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
export const getUser = async (req, res) => {
  try {
    // Extract user ID from the request
    const userId = req.user.id;

    // Find the user by ID and exclude the password from the response
    const user = await User.findById(userId).select('-password');

    // If the user is not found, send a 404 response
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the user data in the response with a 200 status
    res.status(200).json({ data: user });
  } catch (error) {
    // Log the error and send a 500 response for server errors
    console.error('Error fetching user:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}
