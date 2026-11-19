import axios from "axios";

const API_BASE_URL = "https://jpk-202611-pa-i7a.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

export function getErrorMessage(error) {
  if (error.response) {
    return `the server responded with ${error.response.status}`;
  }
  if (error.code === `ECONNABORTED`) {
    return `the request timed out`;
  }
  return `Could not reach the server, please try again later`;
}

export default api;
