import { apiRequest, toQuery } from "./client";

export function getShifts() {
  return apiRequest("/api/shifts");
}

export function getShift(shiftId) {
  return apiRequest(`/api/shifts/${shiftId}`);
}

export function getShiftAssignments(date) {
  return apiRequest(`/api/shifts/assignments${toQuery({ date })}`);
}
