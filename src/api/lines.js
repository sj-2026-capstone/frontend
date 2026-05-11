import { apiRequest } from "./client";

export function getLines() {
  return apiRequest("/api/lines");
}

export function getLine(lineId) {
  return apiRequest(`/api/lines/${lineId}`);
}
