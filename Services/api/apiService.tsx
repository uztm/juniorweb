import { auth } from "@/lib/auth";
import axios from "axios";
// import { auth } from "@/lib/auth"; // adjust the path to where your `auth.getToken()` hook is defined

// export const BASE_URL = 'https://api.pdp.uz'

export const BASE_URL = "http://185.74.5.104:8080";

// --- 1. Axios instance ---
export const api = axios.create({
  baseURL: BASE_URL,
});

// --- 2. Request interceptor to attach token ---
api.interceptors.request.use(
  async (config) => {
    const token = await auth.getToken();
    // const token = "token";
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- 3. CRUD methods ---
export const crud = {
  loadAll: async (resource: any) => {
    const response = await api.get(`/${resource}`);
    return response.data;
  },

  loadAllById: async (resource: string, id: any) => {
    console.log(`Loading all items for resource: ${resource} with ID: ${id}`);
    const response = await api.get(`/${resource}/${id}`);
    return response.data;
  },

  create: async (resource: string, data: any) => {
    const response = await api.post(`/${resource}`, data);
    return response.data;
  },
};
