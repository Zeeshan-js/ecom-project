import axios from "axios";
import { LocalStorage } from "../utils/index.js";

// Create an Axios instance for API requests
const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_SERVER_URI || 'http://localhost:3000'), // Add API version prefix
  withCredentials: true,
  timeout: 120000,
});

// Add an interceptor to set authorization header with user token before requests
apiClient.interceptors.request.use(
  function (config) {
    const token = LocalStorage.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      LocalStorage.clear();
      window.location.href = '/login';
    }
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

const orderProduct = (productId,data) => {
  return apiClient.post(`/order/make/${productId}`, data);
};

const orderStatus = (orderId) => {
  return apiClient.get(`/order/${orderId}/status`);
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
  removeCartItem,
  orderStatus
};
