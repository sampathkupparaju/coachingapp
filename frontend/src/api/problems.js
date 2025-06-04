// frontend/src/api/problems.js
import axios from "axios";
import { jwtDecode }from "jwt-decode"; // You’ll need to install jwt-decode (npm i jwt-decode)

const API_BASE = process.env.REACT_APP_API_URL || "";

// Create an Axios instance:
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optionally, you might decode the token to grab the user’s email (subject) or other fields
export function getLoggedInUserEmail() {
  const token = localStorage.getItem("jwt-token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.sub; // subject is the email
  } catch (e) {
    return null;
  }
}

/**
 * Fetch the full list of problems.
 * GET /api/problems
 */
export const fetchAllProblems = () => {
  return api.get("/api/problems");
};

/**
 * Fetch all notes for a given user
 * GET /api/users/{userId}/notes
 */
export const fetchUserNotes = (userId) => {
  return api.get(`/api/users/${userId}/notes`);
};

/**
 * Update (or create) a note for a particular problem
 * PUT /api/users/{userId}/notes/{problemId}
 * Body: { note: "some text" }
 */
export const updateUserNote = (userId, problemId, note) => {
  return api.put(`/api/users/${userId}/notes/${problemId}`, { note });
};

export default api;
