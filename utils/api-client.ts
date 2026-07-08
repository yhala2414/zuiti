import axios, { AxiosHeaders, type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { apiErrorCopy } from "@/config";

type ApiFailure = {
  ok: false;
  code: string;
  message: string;
  data?: unknown;
};

type ApiRequestConfig = InternalAxiosRequestConfig & {
  metadata?: {
    startedAt: number;
  };
};

const networkFailure: ApiFailure = {
  ok: false,
  code: "NETWORK_ERROR",
  message: apiErrorCopy.networkError,
};

function isApiFailure(data: unknown): data is ApiFailure {
  if (!data || typeof data !== "object") {
    return false;
  }

  const candidate = data as Partial<ApiFailure>;
  return candidate.ok === false && typeof candidate.code === "string" && typeof candidate.message === "string";
}

function normalizeAxiosError(error: AxiosError): ApiFailure {
  const responseData = error.response?.data;

  if (isApiFailure(responseData)) {
    return responseData;
  }

  return networkFailure;
}

export const apiClient = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const nextConfig = config as ApiRequestConfig;
  const headers = AxiosHeaders.from(nextConfig.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  nextConfig.headers = headers;
  nextConfig.metadata = {
    startedAt: Date.now(),
  };

  return nextConfig;
});

apiClient.interceptors.response.use(
  (response) => response.data ?? networkFailure,
  (error: AxiosError) => Promise.resolve(normalizeAxiosError(error)),
);

export function postJson<T>(url: string, payload: unknown): Promise<T> {
  return apiClient.post<unknown, T>(url, payload);
}
