import axios from "axios";
const api = axios.create({
  baseURL: "https://streak-up.onrender.com",
});

export default api;