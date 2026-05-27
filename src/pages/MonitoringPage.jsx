import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import FactoryFloorMap from "../components/FactoryFloorMap";
import { USE_MOCK_API } from "../api/config";
import { getLines } from "../api/lines";
import { getInspection, getInspections } from "../api/inspections";
import { subscribeNotifications } from "../api/notifications";
import { applyLineAlarmNotification, linesResponseToFactoryLines, mockFactoryLineView } from "../adapters/lines";
import { inspectionPageResponseToHistoryPage, inspectionResponseToDetail } from "../adapters/inspections";
import { inspectionDetails, recentDetections } from "../data/mockData";

const FALLBACK_DETECTION_IMAGE = "/parts/frame-normal.png";

function isDefectDetection(det) {
  const status = String(det.status || "").toLowerCase();
  return ["defect", "alarm", "ng", "fail", "failed"].some((token) => status.includes(token));
}

function detectionTimeValue(det) {
  const raw = String(det.detectedAt || det.createdAt || det.date || det.time || "");
  const parsed = Date.parse(raw);
  if (!Number.isNaN(parsed)) return parsed;

  const match = raw.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!match) return 0;

  const [, hour, minute, second = "0"] = match;
  return Number(hour) * 3600 + Number(minute) * 60 + Number(second);
}

function formatDetectionTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function inspectionRowsToDetections(rows) {
  return rows.map((row) => ({
    id: row.id,
    time: formatDetectionTime(row.date),
    date: row.date,
    line: row.line || "-",
    part: row.part || "불량",
    status: row.status,
    image: row.image || "",
  }));
}

function mockDetectionsWithInspectionImages() {
  return recentDetections.map((det) => {
    const detail = det.inspectionId ? inspectionDetails[det.inspectionId] : null;

    return {
      ...det,
      id: det.inspectionId,
      line: det.line || detail?.line || "-",
      image: det.inspectionId ? detail?.originalImage || "" : det.image,
    };
  });
}

function getRecentDefectDetections(detections) {
  return detections
    .filter(isDefectDetection)
    .sort((a, b) => detectionTimeValue(b) - detectionTimeValue(a))
    .slice(0, 5);
}

function DetectionStrip({ detections, compact = false }) {
  const defectDetections = getRecentDefectDetections(detections);
  const visibleDetections = compact ? defectDetections.slice(0, 3) : defectDetections;

  return (
    <section
      className={
        compact
          ? "cctv-detection-panel rounded-lg border border-outline-variant/20 bg-white/95 p-3 shadow-sm"
          : "rounded-xl bg-surface-container-lowest p-4 shadow-sm"
      }
    >
      <div className={compact ? "mb-3 flex items-center justify-between" : "mb-4 flex items-center justify-between"}>
        <h2 className={`flex items-center gap-2 font-black uppercase tracking-wider text-primary ${compact ? "text-xs" : "text-sm"}`}>
          <Icon name="analytics" className="text-base" />
          최근 감지 내역
        </h2>
        <span className="text-[11px] font-bold text-on-surface-variant">실시간</span>
      </div>
      <div className={compact ? "space-y-2" : "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5"}>
        {visibleDetections.map((det, index) => (
          <div
            key={`${det.id || det.time}-${index}`}
            className={`rounded-lg border border-outline-variant/20 bg-white shadow-sm ${compact ? "p-2" : "p-3"}`}
          >
            <div className="flex items-center gap-3">
              <div className={`relative flex-shrink-0 overflow-hidden rounded-lg bg-surface-container-highest ${compact ? "h-11 w-11" : "h-14 w-14"}`}>
                <img className="h-full w-full object-cover" src={det.image || FALLBACK_DETECTION_IMAGE} alt={det.part} />
                <div className="absolute inset-0 bg-error/15" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="truncate text-[11px] font-bold text-on-surface-variant">
                    {detectionMetaText(det)}
                  </span>
                  <span className="rounded bg-error/10 px-1.5 py-0.5 text-[10px] font-black text-error">
                    불량
                  </span>
                </div>
                <p className="truncate text-sm font-extrabold text-on-surface">{det.part}</p>
              </div>
            </div>
          </div>
        ))}
        {!defectDetections.length && (
          <div className={`rounded-lg border border-dashed border-outline-variant/40 bg-white/70 text-center text-xs font-bold text-on-surface-variant ${compact ? "p-3" : "p-4"}`}>
            최근 불량 감지 내역이 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}

function detectionMetaText(det) {
  return [det.time, det.line].filter((item) => item && item !== "-").join(" | ") || "-";
}

export default function MonitoringPage() {
  const navigate = useNavigate();
  const [lines, setLines] = useState(() => (USE_MOCK_API ? mockFactoryLineView() : []));
  const [detections, setDetections] = useState(() => (USE_MOCK_API ? mockDetectionsWithInspectionImages() : []));
  const linesRef = useRef(lines);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  useEffect(() => {
    if (USE_MOCK_API) return;

    let ignore = false;

    getLines()
      .then((data) => {
        if (!ignore) setLines(linesResponseToFactoryLines(data, []));
      })
      .catch((err) => {
        if (!ignore) {
          setApiError(err.message);
          setLines([]);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (USE_MOCK_API) return;

    let ignore = false;

    getInspections({ page: 0, size: 50, status: "DONE" })
      .then(async (data) => {
        if (ignore) return;

        const pageData = inspectionPageResponseToHistoryPage(data, {
          number: 0,
          size: 50,
        });
        const nextDetections = inspectionRowsToDetections(pageData.rows);
        const recentDefects = getRecentDefectDetections(nextDetections);
        const missingImageDefects = recentDefects.filter((det) => det.id && !det.image);

        if (!missingImageDefects.length) {
          setDetections(nextDetections);
          return;
        }

        const imageEntries = await Promise.all(
          missingImageDefects.map((det) =>
            getInspection(det.id)
              .then((detail) => [det.id, inspectionResponseToDetail(detail).originalImage])
              .catch(() => null)
          )
        );
        if (ignore) return;

        const imageByInspectionId = new Map(imageEntries.filter(Boolean));
        setDetections(
          nextDetections.map((det) =>
            imageByInspectionId.has(det.id)
              ? { ...det, image: imageByInspectionId.get(det.id) }
              : det
          )
        );
      })
      .catch((err) => {
        if (!ignore) {
          setApiError(err.message);
          setDetections([]);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (USE_MOCK_API) return;

    let ignore = false;

    const syncLines = () => {
      getLines()
        .then((data) => {
          if (ignore) return;
          const nextLines = linesResponseToFactoryLines(data, []);
          linesRef.current = nextLines;
          setLines(nextLines);
        })
        .catch((err) => {
          if (!ignore) setApiError(err.message);
        });
    };

    const source = subscribeNotifications(
      (notification) => {
        const result = applyLineAlarmNotification(linesRef.current, notification);

        if (result.ignored) return;

        if (result.matched) {
          linesRef.current = result.lines;
          setLines(result.lines);
          return;
        }

        syncLines();
      },
      () => {
        if (!ignore) setApiError("실시간 알림 연결이 끊겼습니다. 재연결을 시도합니다.");
      }
    );

    return () => {
      ignore = true;
      source.close();
    };
  }, []);

  const handleLineSelect = (line) => {
    if (line.status === "alarm" && line.inspectionId) {
      navigate(`/inspection/${line.inspectionId}`);
    }
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      {apiError && (
        <div className="rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm font-medium text-error">
          {apiError} 로컬 라인 데이터를 표시합니다.
        </div>
      )}

      <FactoryFloorMap lines={lines} onLineSelect={handleLineSelect}>
        <DetectionStrip detections={detections} compact />
      </FactoryFloorMap>
    </div>
  );
}
