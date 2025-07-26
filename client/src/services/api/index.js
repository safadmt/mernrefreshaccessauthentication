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
export const loginUser = async (userData) => API.post('/auth/login', userData)
export const logoutUser = async (token) => API.post('/auth/logout')

export const registerUser = async (userData) => API.post('/auth/register', userData)

export const refreshAccessToken = async () => API.get('/auth/refresh')

export const getUserDetails = async () => API.get('/user')

