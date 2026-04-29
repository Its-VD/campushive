import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("campushive_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const verifyOTP = (data) => API.post("/auth/verify-otp", data);
export const resendOTP = (data) => API.post("/auth/resend-otp", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

// Notes
export const getNotes = (params) => API.get("/notes", { params });
export const uploadNote = (formData) => API.post("/notes", formData);
export const deleteNote = (id) => API.delete(`/notes/${id}`);
export const likeNote = (id) => API.put(`/notes/${id}/like`);

// Chat
export const getMessages = (room) => API.get(`/chat/rooms/${room}`);
export const saveMessage = (data) => API.post("/chat/message", data);
export const deleteMessage = (id) => API.delete(`/chat/message/${id}`);

// Info
export const getInfoPosts = (params) => API.get("/info", { params });

// AI
export const aiChat = (data) => API.post("/ai/chat", data);
export const summarizeNote = (id, data) =>
  API.post(`/ai/summarize/${id}`, data);
export const askQuestion = (data) => API.post("/ai/ask", data);

export default API;
