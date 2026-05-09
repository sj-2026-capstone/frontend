import { apiRequest } from "./client";

export function login(credentials) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function getMe() {
  return apiRequest("/api/auth/me");
}

export function changePassword(payload) {
  return apiRequest("/api/auth/password", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
