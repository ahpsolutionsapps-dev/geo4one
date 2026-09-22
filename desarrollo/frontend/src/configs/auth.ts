const apiUrl =
  (import.meta.env.VITE_API_URL as string | undefined)?.trim() ||
  "http://localhost:3048";

export const JWT_HOST_API: string = apiUrl;
