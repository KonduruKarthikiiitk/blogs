import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getProfile: () => api.get("/auth/me"),
  updateProfile: (profileData) => api.put("/auth/profile", profileData),
};

// Posts API
export const postsAPI = {
  getPosts: (params) => api.get("/posts", { params }),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (postData) => api.post("/posts", postData),
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
  deletePost: (id) => api.delete(`/posts/${id}`),
  likePost: (id) => api.post(`/posts/${id}/like`),
  addComment: (id, comment) =>
    api.post(`/posts/${id}/comments`, { content: comment }),
};

// Users API
export const usersAPI = {
  getUser: (id) => api.get(`/users/${id}`),
  getUserPosts: (id, params) => api.get(`/users/${id}/posts`, { params }),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  getUsers: (params) => api.get("/users", { params }),
  getStats: () => api.get("/users/stats/overview"),
};

// Upload API
export const uploadAPI = {
  uploadImage: (formData) =>
    api.post("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export default api;
