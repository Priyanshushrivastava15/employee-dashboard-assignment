// src/config.js

// Automatically detect if we are running on localhost
const isLocal = window.location.hostname === 'localhost';

export const config = {
  // If local, use port 5000. If deployed, use your Render URL.
  // REPLACE 'your-app-name' below with your actual Render backend URL after deployment.
  API_URL: isLocal 
    ? 'http://localhost:5000/graphql' 
    : 'https://employee-management-backend.onrender.com/graphql', 
};