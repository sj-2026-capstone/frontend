import { API_BASE_URL } from "../api/config";

export function inspectionListResponseToHistory(response) {
  const items = getInspectionItems(response);
  return items.map(inspectionResponseToHistoryRow);
}

export function inspectionPageResponseToHistoryPage(response, fallback = {}) {
  const rows = inspectionListResponseToHistory(response);
  const pageInfo = response?.pageInfo || response?.page || response?.pagination || {};
  const totalElements =
    response?.totalElements ??
    response?.totalCount ??
    response?.total ??
    response?.count ??
    pageInfo?.totalElements ??
    pageInfo?.totalCount ??
    pageInfo?.total ??
    fallback.totalElements ??
    rows.length;
  const size =
    response?.size ??
    response?.pageSize ??
    pageInfo?.size ??
    pageInfo?.pageSize ??
    fallback.size ??
    rows.length;
  const totalPages =
    response?.totalPages ??
    pageInfo?.totalPages ??
    (size > 0 ? Math.ceil(totalElements / size) : 1);
  const number =
    response?.number ??
    response?.page ??
    response?.pageNumber ??
    pageInfo?.number ??
    pageInfo?.page ??
    pageInfo?.pageNumber ??
    fallback.number ??
    0;

  return {
    rows,
    page: {
      number: Math.max(0, Number(number) || 0),
      size: Math.max(1, Number(size) || 1),
      totalElements: Math.max(0, Number(totalElements) || 0),
      totalPages: Math.max(1, Number(totalPages) || 1),
    },
  };
}

export function inspectionResponseToHistoryRow(item) {
  const inspectionId = item.inspectionId ?? item.id;
  const status = mapInspectionStatus(item);
  const line = item.lineName || item.lineCode || item.lineId || "-";

  return {
    id: inspectionId,
    partId: item.partId || item.partCode || `INSP-${inspectionId ?? "-"}`,
    date: item.inspectedAt || item.completedAt || item.updatedAt || item.createdAt || "-",
    line,
    part: status === "defect" || status === "failed" ? "불량" : "정상",
    status,
    rawStatus: item.status || "-",
  };
}

export function inspectionResponseToDetail(item) {
  const result = getInspectionResult(item);
  const originalImage =
    item.originalImageUrl ||
    item.imageUrl ||
    item.frameImageUrl ||
    result.originalImageUrl ||
    result.imageUrl;
  const gradcamImage =
    item.gradCamImageUrl ||
    item.gradcamImageUrl ||
    item.resultImageUrl ||
    result.gradCamImageUrl ||
    result.gradcamImageUrl ||
    result.resultImageUrl ||
    result.heatmapImageUrl ||
    item.imageUrl;

  return {
    cam: item.cameraId || item.cameraName || item.deviceId || "-",
    line: item.lineName || item.lineCode || "-",
    shift: pickText(item.shiftName, item.shift?.shiftName, item.shift?.name, result.shiftName, result.shift?.shiftName, result.shift?.name) || "-",
    workerName:
      pickText(
        item.workerName,
        item.operatorName,
        item.inspectorName,
        item.userName,
        item.worker?.userName,
        item.worker?.name,
        item.user?.userName,
        item.user?.name,
        result.workerName,
        result.operatorName,
        result.inspectorName,
        result.userName
      ) || "-",
    detectionMethod: "Backend API",
    originalImage: resolveBackendImageUrl(originalImage) || "/parts/frame-normal.png",
    gradcamImage: resolveBackendImageUrl(gradcamImage) || "/parts/frame-normal.png",
  };
}

function resolveBackendImageUrl(path) {
  if (!path) return path;
  let imagePath = String(path);

  try {
    imagePath = new URL(imagePath).pathname;
  } catch {
    // Keep relative paths as-is.
  }

  return `${API_BASE_URL.replace(/\/$/, "")}/${imagePath.replace(/^\//, "")}`;
}

function getInspectionItems(response) {
  if (Array.isArray(response)) return response;

  return (
    response?.content ||
    response?.items ||
    response?.inspections ||
    response?.results ||
    response?.list ||
    response?.data?.content ||
    response?.data?.items ||
    response?.data?.inspections ||
    []
  );
}

function mapInspectionStatus(item) {
  const status = String(item.status || "").toUpperCase();
  const result = getInspectionResult(item);
  const hasDefect = item.hasDefect === true || result.hasDefect === true;

  if (status === "DONE" && hasDefect) return "defect";
  if (status === "DONE") return "normal";
  if (status === "FAILED") return "failed";
  if (status === "PROCESSING") return "processing";
  if (status === "PENDING") return "pending";
  return status.toLowerCase() || "normal";
}

function getInspectionResult(item) {
  return item.result || item.analysisResult || item.inspectionResult || item.frameResult || item.aiResult || {};
}

function pickText(...values) {
  const value = values.find((item) => typeof item === "string" && item.trim());
  return value?.trim() || null;
}
