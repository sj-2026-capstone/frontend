import { mockFactoryLines } from "../data/mockData";

const lineOrder = ["A", "B", "C", "D"];

export function linesResponseToFactoryLines(response) {
  const items = Array.isArray(response)
    ? response
    : response?.lines || response?.content || response?.items || [];

  if (!items.length) return mockFactoryLines;

  const normalized = items.map(normalizeLine).filter(Boolean);
  const byId = new Map(normalized.map((line) => [line.id, line]));

  return lineOrder.map((id) => byId.get(id) || mockFactoryLines.find((line) => line.id === id));
}

function normalizeLine(item) {
  const id = normalizeLineId(item.lineCode || item.code || item.id || item.lineId || item.name);
  if (!id) return null;

  return {
    id,
    name: item.lineName || item.name || `Line ${id}`,
    status: normalizeStatus(item.status || item.lineStatus || item.state),
    inspectionId:
      item.latestInspectionId ||
      item.inspectionId ||
      item.latestDefectInspectionId ||
      item.defectInspectionId ||
      null,
    defectCount: Number(item.defectCount || item.todayDefectCount || item.alarmCount || 0),
    lastEventAt: item.lastEventAt || item.updatedAt || item.lastInspectedAt || null,
  };
}

function normalizeLineId(value) {
  const text = String(value || "").toUpperCase();
  const numericId = Number(text);

  if (Number.isInteger(numericId) && numericId >= 1 && numericId <= lineOrder.length) {
    return lineOrder[numericId - 1];
  }

  if (lineOrder.includes(text)) return text;

  const match = text.match(/(?:^|[^A-Z])([A-D])(?:[^A-Z]|$)/);
  return match?.[1] || null;
}

function normalizeStatus(value) {
  const text = String(value || "").toUpperCase();

  if (["ALARM", "DEFECT", "ERROR", "NG", "FAILED", "FAIL"].some((token) => text.includes(token))) {
    return "alarm";
  }

  if (["WAIT", "PAUSE", "PAUSED", "MAINTENANCE", "IDLE", "STOP"].some((token) => text.includes(token))) {
    return "wait";
  }

  return "normal";
}

export function mockFactoryLineView() {
  return mockFactoryLines;
}
