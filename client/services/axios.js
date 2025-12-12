import axios from 'axios';

// Base URL should point to your server's URL (Express backend)
const axiosInstance = axios.create({
  baseURL: 'http://10.0.2.2:3000', // Change this URL if you deploy the backend
  headers: {
    'Content-Type': 'application/json',
  },
});


export default axiosInstance;