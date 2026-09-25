import axios from "axios";

const api = axios.create({
  baseURL: "https://streak-up-frontend.onrender.com/",
});

export default api;
