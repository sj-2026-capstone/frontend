import { apiRequest, toQuery } from "./client";

export function getAccounts(params) {
  return apiRequest(`/api/admin/accounts${toQuery(params)}`);
}

export function getAccount(userId) {
  return apiRequest(`/api/admin/accounts/${userId}`);
}

export function createAccount(payload) {
  return apiRequest("/api/admin/accounts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAccount(userId, payload) {
  return apiRequest(`/api/admin/accounts/${userId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function updateAccountStatus(userId, status) {
  return apiRequest(`/api/admin/accounts/${userId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function getAccountSummary() {
  return apiRequest("/api/admin/accounts/summary");
}

export function checkLoginIdAvailability(loginId) {
  return apiRequest(`/api/admin/accounts/login-id/availability${toQuery({ loginId })}`);
}
