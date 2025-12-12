// src/config.js

// Automatically detect if we are running on localhost
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const config = {
  // If local, use localhost. If deployed, use your LIVE Render Backend.
  API_URL: isLocal 
    ? 'http://localhost:5000/graphql' 
    : 'https://my-emp-api-123.onrender.com/graphql', 
};