import axios from "axios";

// define the base url for the api
let isCloud = true;
const baseURL = isCloud
  ? "https://pettycash-manager-be.onrender.com/api/v1/"
  : `http://localhost:3333/api/v1/`;

// define the instance
const authInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

//define the formData instanse
const formDataInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// define the protected instance
const protectedInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// define the interceptor for the protected instance
protectedInstance.interceptors.request.use((config) => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// export the instances
export default { authInstance, protectedInstance, baseURL };
