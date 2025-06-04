import axios from "axios";
import { LocalStorage } from "../utils/index.js";

// Create an Axios instance for API requests
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  withCredentials: true,
  timeout: 120000,
});

// Add an interceptor to set authorization header with user token before requests
apiClient.interceptors.request.use(
  function (config) {
    // Retrieve user token from local storage
    const token = LocalStorage.get("token");
    // Set authorization header with bearer token
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// API functions for different actions
const userLogin = (data) => {
  return apiClient.post("/user/login", data);
};

const userRegister = (data) => {
  return apiClient.post("/user/register", data);
};

const logoutUser = () => {
  return apiClient.post("/user/logout");
};

const getCart = () => {
  return apiClient.get("/cart");
};

const getAllProductItems = () => {
  return apiClient.get("/product");
};

const getProduct = (productId) => {
  return apiClient.get(`/product/${productId}`);
};

const uploadProduct = (formData) => {
  return apiClient.post("/product/upload", formData);
};

const orderProduct = () => {
  return apiClient.post();
};

const addItemInCart = (productId, quantity) => {
  return apiClient.post(`/cart/items/${productId}`, { quantity });
};

const removeCartItem = (productId) => {
  return apiClient.delete(`cart/${productId}`)
}

export {
  userLogin,
  userRegister,
  logoutUser,
  getCart,
  uploadProduct,
  getProduct,
  getAllProductItems,
  orderProduct,
  addItemInCart,
  removeCartItem
};
