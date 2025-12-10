import axios from "axios";

const api = axios.create({
  baseURL: "http://10.110.12.19:8089", // seu IP do backend
});

export default api;