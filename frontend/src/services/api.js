import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.0.187:8080", // seu IP do backend
});

export default api;