import axios, { AxiosError, AxiosResponse } from "axios";
import { JWT_HOST_API } from "@/configs/auth";

const axiosInstance = axios.create({
  baseURL: JWT_HOST_API,
  withCredentials: false,
  timeout: 10000,
});

function resolveErrorMessage(error: AxiosError): string {
  const data = error.response?.data as
    | { message?: unknown }
    | string
    | undefined;

  if (typeof data === "string" && data.trim() !== "") {
    return data;
  }

  if (
    data &&
    typeof data === "object" &&
    "message" in data &&
    typeof data.message === "string" &&
    data.message.trim() !== ""
  ) {
    return data.message;
  }

  return error.message || "Something went wrong";
}

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => Promise.reject(new Error(resolveErrorMessage(error)))
);

export default axiosInstance;
