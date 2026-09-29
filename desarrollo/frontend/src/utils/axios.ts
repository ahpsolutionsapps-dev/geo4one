import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import { JWT_HOST_API } from "@/configs/auth";

const axiosInstance = axios.create({
  baseURL: JWT_HOST_API,
  withCredentials: false,
  timeout: 10000,
});

const API_UNAVAILABLE_TOAST_ID = "api-unavailable";
const API_UNAVAILABLE_STATUS = new Set([502, 503, 504]);
const API_UNAVAILABLE_MESSAGE =
  "El servicio API no esta disponible. Intenta nuevamente en unos minutos.";

function isHtmlPayload(value: string): boolean {
  const raw = value.trim();
  return raw.startsWith("<!DOCTYPE") || raw.startsWith("<html") || /<[^>]+>/.test(raw);
}

function resolveErrorMessage(error: AxiosError): string {
  if (isApiUnavailableError(error)) {
    return API_UNAVAILABLE_MESSAGE;
  }

  const data = error.response?.data as
    | { message?: unknown }
    | string
    | undefined;

  const contentType = String(error.response?.headers?.["content-type"] || "");

  if (typeof data === "string" && (contentType.includes("text/html") || isHtmlPayload(data))) {
    return "No fue posible completar la solicitud.";
  }

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

function isApiUnavailableError(error: AxiosError): boolean {
  const status = error.response?.status;

  if (status && API_UNAVAILABLE_STATUS.has(status)) {
    return true;
  }

  return !error.response;
}

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (isApiUnavailableError(error)) {
      toast.error(API_UNAVAILABLE_MESSAGE, {
        id: API_UNAVAILABLE_TOAST_ID,
      });
    }

    return Promise.reject(new Error(resolveErrorMessage(error)));
  }
);

export default axiosInstance;
