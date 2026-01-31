import axios from "axios";

// Use environment variable for backend URL if provided
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: `${BASE_URL}/api`, // ✅ use the BASE_URL variable
  withCredentials: true,      // optional, only if cookies needed
});

export default API;
