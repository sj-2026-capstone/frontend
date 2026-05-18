import { API_BASE_URL, AUTH_STORAGE_KEY } from "./config";
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

function getAccessToken() {
  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored)?.accessToken : null;
  } catch {
    return null;
  }
}

function parseNotificationEvent(data, onNotification, onError) {
  try {
    onNotification?.(JSON.parse(data));
  } catch (cause) {
    onError?.(cause);
  }
}

function parseSseChunk(chunk, onEvent) {
  const lines = chunk.split(/\r?\n/);
  let eventName = "message";
  const dataLines = [];

  lines.forEach((line) => {
    if (line.startsWith("event:")) {
      eventName = line.slice(6).trim();
    }

    if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trimStart());
    }
  });

  if (dataLines.length) {
    onEvent(eventName, dataLines.join("\n"));
  }
}

export function subscribeNotifications(onNotification, onError) {
  let closed = false;
  let retryTimer = null;
  let controller = null;
  const baseUrl = API_BASE_URL.replace(/\/$/, "");

  const connect = async () => {
    controller = new AbortController();
    const headers = new Headers({ "ngrok-skip-browser-warning": "true" });
    const token = getAccessToken();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    try {
      const response = await fetch(`${baseUrl}/api/notifications/subscribe`, {
        headers,
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error("Notification stream connection failed.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (!closed) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split(/\r?\n\r?\n/);
        buffer = chunks.pop() || "";

        chunks.forEach((chunk) => {
          parseSseChunk(chunk, (eventName, data) => {
            if (eventName === "notification") {
              parseNotificationEvent(data, onNotification, onError);
            }
          });
        });
      }
    } catch (cause) {
      if (!closed && cause.name !== "AbortError") {
        onError?.(cause);
      }
    }

    if (!closed) {
      retryTimer = window.setTimeout(connect, 3000);
    }
  };

  connect();

  return {
    close: () => {
      closed = true;
      controller?.abort();
      if (retryTimer) window.clearTimeout(retryTimer);
    },
  };
}
