import axios from "axios";

// Use Render backend URL
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true, // optional, if cookies needed
});

export default API;
