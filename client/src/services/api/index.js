import axios from 'axios'

const api_url = import.meta.env.VITE_API_URL

const API = axios.create({
    baseURL: api_url + '/api',
    withCredentials: true
})
API.interceptors.request.use((config)=> {
  const token = localStorage.getItem("accessToken");
  if(token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
})


/**
 * Refreshes the access token by making a GET request to the refresh endpoint.
 * This request includes credentials for authentication.
 * 
 * @returns {Promise<Object>} The response from the server.
 */
export const refreshAccessToken = async () => {
  // Make a GET request to the refresh endpoint with credentials
  return await axios.get(`${api_url}/api/auth/refresh`, { withCredentials: true });
};

/**
 * Redirects the user to the login page.
 * 
 * This function is used as a global error handler for the Axios instance.
 * When the user is not authenticated and tries to access a protected route,
 * the server will return a 401 Unauthorized response. This response is
 * caught by the error interceptor, which then redirects the user to the
 * login page.
 */
const redirectToLogin = () => {
  // Use the History API to redirect the user to the login page.
  // This approach is better than using `window.location.href` because
  // it doesn't cause a full page reload.
  window.history.pushState({}, '', '/login');
  // Dispatch a popstate event to trigger the React Router route change.
  window.dispatchEvent(new PopStateEvent('popstate'));
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log('Error response:', error.config);
    const status = error.response?.status;

    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await refreshAccessToken(); // should return new access token
        const newAccessToken = res.data.accessToken;
        console.log('New access token:', newAccessToken);
        localStorage.setItem('accessToken', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return API(originalRequest); // retry original request
      } catch (refreshErr) {
        console.error('Token refresh failed. Redirecting to login.');
        localStorage.removeItem('accessToken');
        redirectToLogin() // Redirect to login page
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export const loginUser = async (userData) => API.post('/auth/login', userData)

export const logoutUser = async (token) => API.post('/auth/logout')

export const registerUser = async (userData) => API.post('/auth/register', userData)

export const getAllUsers = async () => API.get('/user/getAll')

export const getUserDetails = async () => API.get('/user')

