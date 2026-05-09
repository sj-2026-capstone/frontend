export function inspectionListResponseToHistory(response) {
  const items = response?.items || response?.content || [];
  return items.map(inspectionResponseToHistoryRow);
}

export function inspectionResponseToHistoryRow(item) {
  return {
    id: item.inspectionId,
    partId: `INSP-${item.inspectionId}`,
    date: item.inspectedAt || item.createdAt || "-",
    part: item.defectDisplayName || item.defectType || "Inspection",
    status: mapInspectionStatus(item),
    confidence: item.confidence || 0,
  };
}

export function inspectionResponseToDetail(item) {
  return {
    cam: "-",
    line: item.lineName || item.lineCode || "-",
    detectionMethod: "Backend API",
    defectType: item.defectDisplayName || item.defectType || null,
    originalImage: item.imageUrl || "/parts/frame-normal.png",
    gradcamImage: item.imageUrl || "/parts/frame-normal.png",
  };
}

function mapInspectionStatus(item) {
  if (item.status === "DONE" && item.hasDefect) return "defect";
  if (item.status === "DONE") return "normal";
  if (item.status === "FAILED") return "defect";
  return item.status?.toLowerCase?.() || "normal";
}
