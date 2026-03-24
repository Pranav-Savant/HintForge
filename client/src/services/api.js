import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

export const analyzeCode=(payload)=>API.post('/analyze',payload)
export const getHistory = () => API.get("/api/history");
export const login=(payload)=>API.post("/auth/login",payload);
export const signup=(payload)=>API.post("/auth/signup",payload);
export const checkAuth = () => API.get("/auth/isAuth");

export default API;