import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8800/api", // Backend's base URL
});

export default instance;
