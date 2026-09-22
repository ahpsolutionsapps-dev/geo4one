import axios, { AxiosError, AxiosResponse } from "axios";
import { JWT_HOST_API } from "@/configs/auth";

const axiosInstance = axios.create({
  baseURL: JWT_HOST_API,
  withCredentials: false,
  timeout: 10000,
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) =>
    Promise.reject(error.response?.data || "Something went wrong")
);

export default axiosInstance;
