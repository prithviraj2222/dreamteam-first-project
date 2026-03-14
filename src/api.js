import axios from "axios";

const api = axios.create({
  baseURL: "https://dreamteam-first-project-backend.onrender.com",
});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default api;
