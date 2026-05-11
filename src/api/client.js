import { API_BASE_URL, AUTH_STORAGE_KEY } from "./config";

function getAccessToken() {
  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored)?.accessToken : null;
  } catch {
    return null;
  }
}

function createApiError(message, details = {}) {
  const error = new Error(message);
  Object.assign(error, details);
  return error;
}

function createApiUrl(path) {
  return `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getAccessToken();

  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  headers.set("ngrok-skip-browser-warning", "true");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response;
  try {
    response = await fetch(createApiUrl(path), {
      ...options,
      headers,
    });
  } catch (cause) {
    throw createApiError("Backend server connection failed.", { cause });
  }

  const raw = await response.text();
  const payload = raw ? JSON.parse(raw) : null;

  if (!response.ok || payload?.success === false) {
    throw createApiError(payload?.message || "API request failed.", {
      status: response.status,
      code: payload?.code,
      payload,
    });
  }

  return payload?.data ?? null;
}

export function toQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });
  const suffix = query.toString();
  return suffix ? `?${suffix}` : "";
}
