import { API_BASE_URL } from "./config";
import { apiRequest, toQuery } from "./client";

export function getNotifications(params) {
  return apiRequest(`/api/notifications${toQuery(params)}`);
}

export function getUnreadCount() {
  return apiRequest("/api/notifications/unread-count");
}

export function markNotificationRead(notificationId) {
  return apiRequest(`/api/notifications/${notificationId}/read`, {
    method: "PATCH",
  });
}

export function markAllNotificationsRead() {
  return apiRequest("/api/notifications/read-all", {
    method: "PATCH",
  });
}

export function subscribeNotifications(onNotification, onError) {
  const source = new EventSource(`${API_BASE_URL}/api/notifications/subscribe`);
  source.addEventListener("notification", (event) => {
    onNotification?.(JSON.parse(event.data));
  });
  source.onerror = onError || null;
  return source;
}
