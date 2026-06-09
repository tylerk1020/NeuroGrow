// API base URL
// In development this points to your local backend.
// In production, set REACT_APP_API_URL in your frontend environment variables
// on Render (or wherever you deploy) to point to your live backend URL.
// e.g. https://neurogrow-api.onrender.com

const API = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export default API;
