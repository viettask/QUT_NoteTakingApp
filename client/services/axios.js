// import and configure Axios for API requests
import axios from 'axios';

// Create an axios instance to configure default settings for all requests
const axiosInstance = axios.create({
  // Base URL should point to your backend server URL
  // For local development, use 'http://10.0.2.2:3000' for Android emulator or 'http://localhost:3000' for iOS simulator
  baseURL: 'http://10.0.2.2:3000', // Change this URL if you deploy the backend
  headers: {
    // Set default content type to JSON for all requests
    'Content-Type': 'application/json',
  },
});

// export the configured axios instance for use in other parts of the app
export default axiosInstance;