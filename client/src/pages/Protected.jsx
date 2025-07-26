import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserDetails, logoutUser, refreshAccessToken } from '../services/api';

/**
 * The protected route component.
 * Fetches the user details from the API and renders the user profile page.
 * If the user is not logged in, redirects to the login page.
 * If the access token is invalid, refreshes it and retries the user fetch.
 * If the refresh token is invalid, clears the local storage and redirects to the login page.
 * If the user fetch fails, displays an error message.
 */
function Protected() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    /**
     * Fetches the user details from the API.
     * If the access token is invalid, refreshes it and retries the user fetch.
     */
    const fetchUser = async () => {
      try {
        const response = await getUserDetails(accessToken);
        setUserDetails(response.data?.data);
      } catch (error) {
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
          try {
            // Refresh the access token
            const { data } = await refreshAccessToken();
            localStorage.setItem('accessToken', data.accessToken);
            // Retry user fetch
            return fetchUser();
          } catch (refreshError) {
            // If the refresh token is invalid, clear the local storage and redirect to the login page
            localStorage.clear();
            navigate('/login');
          }
        }
      } finally {
        setIsUserLoading(false);
      }
    };

    if (!accessToken) {
      // If the user is not logged in, redirect to the login page
      return navigate('/login');
    }

    // Fetch the user details
    fetchUser();
  }, [navigate, accessToken]);

  /**
   * Handles the logout button click.
   * Logs out the user and redirects to the login page.
   */
  const handleLogout = async () => {
    try {
      await logoutUser(accessToken);
    } finally {
      // Clear the local storage and redirect to the login page
      localStorage.clear();
      navigate('/login');
    }
  };

  if (isUserLoading) {
    // If the user is still loading, display a loading message
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome, {userDetails?.username || 'User'}!
        </h1>
        <p className="text-gray-600 mb-6">
          Email: <span className="font-medium">{userDetails?.email}</span>
        </p>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Protected;
