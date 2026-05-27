import { apiRequest, toQuery } from "./client";

export function getInspections(params) {
  return apiRequest(`/api/inspections${toQuery(params)}`);
}

export function getInspection(inspectionId) {
  return apiRequest(`/api/inspections/${inspectionId}`);
}

export function getInspectionStatus(inspectionId) {
  return apiRequest(`/api/inspections/${inspectionId}/status`);
}

export function completeInspectionAction(inspectionId) {
  return apiRequest(`/api/inspections/${inspectionId}/action`, {
    method: "PATCH",
  });
}

export function startInspectionAnalysis(inspectionId) {
  return apiRequest(`/api/inspections/${inspectionId}/analyze`, {
    method: "POST",
  });
}
