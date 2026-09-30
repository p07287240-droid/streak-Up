import axios from "axios";

const api = axios.create({
  baseURL: "https://streak-up-backend.onrender.com",
});

export default api;
