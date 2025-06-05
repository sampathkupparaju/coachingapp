// frontend/src/api/problems.js
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Ensure this is installed: npm i jwt-decode or yarn add jwt-decode

// REACT_APP_API_URL should be your backend's base URL, e.g., http://localhost:8080
// The "/api" part will be appended to specific calls as per your backend controllers.
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Create an Axios instance for API calls
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add the JWT token to an Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Utility function to get the email from the JWT token's subject.
 * This is primarily for frontend display if the /me endpoint doesn't return it.
 * @returns {string|null} Email or null if token is invalid/not found.
 */
export function getLoggedInUserEmailFromToken() { // Renamed to be specific
  const token = localStorage.getItem("jwt-token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.sub; // 'sub' (subject) usually holds the email/username
  } catch (e) {
    console.error("Error decoding JWT:", e);
    // Potentially clear invalid token here if needed, though App.js handles this on /me failure
    return null;
  }
}

/**
 * Logs in a user.
 * POST /api/auth/login
 * Expects backend to return { token, userId }
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} The login response data.
 */
export const loginUser = (email, password) => {
  return apiClient.post("/api/auth/login", { email, password });
};

/**
 * Verifies the current user's token and fetches minimal user info.
 * GET /api/auth/me
 * Expects backend to return { userId, email (if implemented) }
 * Your backend /me currently returns LoginResponse(null, user.getId())
 * For email display, ideally, backend /me should also return user.getEmail()
 * @returns {Promise<Object>} User data.
 */
export const verifyCurrentUser = () => {
  return apiClient.get("/api/auth/me");
};

/**
 * Fetch the full list of problems.
 * GET /api/problems
 * @returns {Promise<Array>} A list of problem objects.
 */
export const fetchAllProblems = () => {
  return apiClient.get("/api/problems");
};

/**
 * Fetch all notes for a given user.
 * GET /api/users/{userId}/notes (from ProblemNoteController.java)
 * @param {string|number} userId The ID of the user.
 * @returns {Promise<Object>} An object mapping problem IDs (as strings) to note strings.
 */
export const fetchUserNotes = (userId) => {
  if (!userId) {
    return Promise.reject(new Error("User ID is required to fetch notes."));
  }
  return apiClient.get(`/api/users/${userId}/notes`);
};

/**
 * Update (or create) a note for a particular problem for a given user.
 * PUT /api/users/{userId}/notes/{problemId} (from ProblemNoteController.java)
 * @param {string|number} userId The ID of the user.
 * @param {string|number} problemId The ID of the problem.
 * @param {string} noteText The text content of the note.
 * @returns {Promise<Object>} The response from the server.
 */
export const updateUserNote = (userId, problemId, noteText) => {
  if (!userId || !problemId) {
    return Promise.reject(new Error("User ID and Problem ID are required to update a note."));
  }
  return apiClient.put(`/api/users/${userId}/notes/${problemId}`, { note: noteText });
};

/**
 * Toggle the 'isSolved' flag for a given problem.
 * PUT /api/problems/{problemId}/solve
 * @param {string|number} problemId The ID of the problem.
 * @returns {Promise<Object>} The updated problem object (containing 'solved' and 'starred' fields).
 */
export const toggleProblemSolved = (problemId) => {
  if (!problemId) {
    return Promise.reject(new Error("Problem ID is required to toggle solve status."));
  }
  return apiClient.put(`/api/problems/${problemId}/solve`, {});
};

/**
 * Toggle the 'isStarred' flag for a given problem.
 * PUT /api/problems/{problemId}/star
 * @param {string|number} problemId The ID of the problem.
 * @returns {Promise<Object>} The updated problem object (containing 'solved' and 'starred' fields).
 */
export const toggleProblemStarred = (problemId) => {
  if (!problemId) {
    return Promise.reject(new Error("Problem ID is required to toggle star status."));
  }
  return apiClient.put(`/api/problems/${problemId}/star`, {});
};
