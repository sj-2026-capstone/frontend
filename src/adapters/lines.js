import { mockFactoryLines } from "../data/mockData";

const lineOrder = ["A", "B", "C", "D"];

export function linesResponseToFactoryLines(response, fallbackLines = mockFactoryLines) {
  const items = Array.isArray(response)
    ? response
    : response?.lines || response?.content || response?.items || [];

  if (!items.length) return fallbackLines;

  const normalized = items.map(normalizeLine).filter(Boolean);
  const byId = new Map(normalized.map((line) => [line.id, line]));

  return lineOrder.map((id) => byId.get(id) || fallbackLines.find((line) => line.id === id)).filter(Boolean);
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

export function normalizeLineId(value) {
  const text = String(value || "").toUpperCase();
  const numericId = Number(text);

  if (Number.isInteger(numericId) && numericId >= 1 && numericId <= lineOrder.length) {
    return lineOrder[numericId - 1];
  }

  if (lineOrder.includes(text)) return text;

  const match = text.match(/(?:^|[^A-Z])([A-D])(?:[^A-Z]|$)/);
  return match?.[1] || null;
}

function unwrapNotification(notification) {
  if (notification?.data && typeof notification.data === "object") return notification.data;
  if (notification?.payload && typeof notification.payload === "object") return notification.payload;
  return notification || {};
}

function pickLineIdFromNotification(notification) {
  const item = unwrapNotification(notification);
  const candidates = [
    item.lineCode,
    item.lineId,
    item.line,
    item.lineName,
    item.productionLine,
    item.targetLine,
    item.name,
    item.title,
    item.message,
    item.desc,
    item.description,
  ];

  for (const candidate of candidates) {
    const id = normalizeLineId(candidate);
    if (id) return id;
  }

  return null;
}

function pickInspectionId(notification) {
  const item = unwrapNotification(notification);
  return (
    item.latestInspectionId ||
    item.inspectionId ||
    item.latestDefectInspectionId ||
    item.defectInspectionId ||
    null
  );
}

function pickEventTime(notification) {
  const item = unwrapNotification(notification);
  const value = item.lastEventAt || item.createdAt || item.updatedAt || item.detectedAt || item.time || null;
  if (!value) return null;

  const text = String(value);
  const timeMatch = text.match(/T(\d{2}:\d{2}:\d{2})/);
  return timeMatch?.[1] || text;
}

function isDefectNotification(notification) {
  const item = unwrapNotification(notification);
  const type = String(item.notificationType || item.type || "").toUpperCase();
  return !type || type === "DEFECT_DETECTED";
}

function pickDefectCount(item, line) {
  const explicitCount = item.defectCount || item.todayDefectCount || item.alarmCount;
  if (explicitCount !== undefined && explicitCount !== null) return Number(explicitCount);
  if (line.status === "alarm") return Number(line.defectCount || 0);
  return Number(line.defectCount || 0) + 1;
}

export function applyLineAlarmNotification(lines, notification) {
  if (!isDefectNotification(notification)) return { lines, matched: false, ignored: true };

  const lineId = pickLineIdFromNotification(notification);
  if (!lineId) return { lines, matched: false };

  const item = unwrapNotification(notification);
  let matched = false;
  const nextLines = lines.map((line) => {
    if (line.id !== lineId) return line;

    matched = true;
    return {
      ...line,
      status: "alarm",
      inspectionId: pickInspectionId(item) || line.inspectionId,
      defectCount: pickDefectCount(item, line),
      lastEventAt: pickEventTime(item) || line.lastEventAt,
    };
  });

  return { lines: nextLines, matched };
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
