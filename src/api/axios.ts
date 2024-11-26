import axios from 'axios';

const apiClient = axios.create({
  baseURL: "http://localhost:8000",
});

// Attach Authorization header to all requests if token exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration in responses
apiClient.interceptors.response.use(
  (response) => response, // Pass successful responses directly
  (error) => {
    if (error.response && error.response.data.detail === "Token expirado") {
      // Clear token from localStorage
      localStorage.removeItem('token');

      // Redirect to login page
      window.location.href = "/login"; // Adjust this path based on your routing setup
    }

    // Reject the promise for other errors
    return Promise.reject(error);
  }
);

export default apiClient;
