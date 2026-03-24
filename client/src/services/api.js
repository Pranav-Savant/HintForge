import axios from "axios"
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const analyzeCode=(payload)=>API.post('/analyze',payload)
export const getHistory = () => API.get("/api/history");
export const login=(payload)=>API.post("/auth/login",payload);
export const signup=(payload)=>API.post("/auth/signup",payload);
export const checkAuth = () => API.get("/auth/isAuth");
export const logout = () => API.post("/auth/logout");

export default API;