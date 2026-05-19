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
  const result = getInspectionResult(item);
  const defectType = item.defectDisplayName || result.defectDisplayName || formatDefectType(item.defectType || result.defectType);
  const line = item.lineName || item.lineCode || item.lineId || "-";

  return {
    id: inspectionId,
    partId: item.partId || item.partCode || `INSP-${inspectionId ?? "-"}`,
    date: item.inspectedAt || item.completedAt || item.updatedAt || item.createdAt || "-",
    line,
    part: defectType || "정상",
    status: mapInspectionStatus(item),
    rawStatus: item.status || "-",
    confidence: normalizeConfidence(item.confidence ?? result.confidence ?? result.score ?? result.probability),
  };
}

export function inspectionResponseToDetail(item) {
  const result = getInspectionResult(item);
  const defectType = item.defectDisplayName || result.defectDisplayName || formatDefectType(item.defectType || result.defectType);
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
    detectionMethod: "Backend API",
    defectType,
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
  const hasDefect =
    item.hasDefect === true ||
    result.hasDefect === true ||
    Boolean(item.defectType || result.defectType);

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

function normalizeConfidence(value) {
  const confidence = Number(value || 0);
  if (!Number.isFinite(confidence)) return 0;
  return confidence > 0 && confidence <= 1 ? Math.round(confidence * 1000) / 10 : confidence;
}

function formatDefectType(value) {
  if (!value) return null;

  const labels = {
    SCRATCH: "스크래치",
    DENT: "찌그러짐",
    CRACK: "균열",
    CONTAMINATION: "오염",
    MISSING_PART: "부품 누락",
    DIMENSION_ERROR: "치수 오류",
  };
  const key = String(value).toUpperCase();
  return labels[key] || value;
}
