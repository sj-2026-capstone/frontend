import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import FactoryFloorMap from "../components/FactoryFloorMap";
import { USE_MOCK_API } from "../api/config";
import { getLines } from "../api/lines";
import { subscribeNotifications } from "../api/notifications";
import { applyLineAlarmNotification, linesResponseToFactoryLines, mockFactoryLineView } from "../adapters/lines";
import { recentDetections } from "../data/mockData";

function isDefectDetection(det) {
  const status = String(det.status || "").toLowerCase();
  return ["defect", "alarm", "ng", "fail", "failed"].some((token) => status.includes(token));
}

function detectionTimeValue(det) {
  const raw = String(det.detectedAt || det.createdAt || det.time || "");
  const parsed = Date.parse(raw);
  if (!Number.isNaN(parsed)) return parsed;

  const match = raw.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!match) return 0;

  const [, hour, minute, second = "0"] = match;
  return Number(hour) * 3600 + Number(minute) * 60 + Number(second);
}

function DetectionStrip() {
  const defectDetections = recentDetections
    .filter(isDefectDetection)
    .sort((a, b) => detectionTimeValue(b) - detectionTimeValue(a))
    .slice(0, 5);

  return (
    <section className="rounded-xl bg-surface-container-lowest p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-primary">
          <Icon name="analytics" className="text-base" />
          최근 감지 내역
        </h2>
        <span className="text-[11px] font-bold text-on-surface-variant">실시간</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {defectDetections.map((det, index) => (
          <div
            key={`${det.time}-${index}`}
            className="rounded-lg border border-outline-variant/20 bg-white p-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-surface-container-highest">
                <img className="h-full w-full object-cover" src={det.image} alt={det.part} />
                <div className="absolute inset-0 bg-error/15" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="truncate text-[11px] font-bold text-on-surface-variant">
                    {det.time} | {det.cam}
                  </span>
                  <span className="rounded bg-error/10 px-1.5 py-0.5 text-[10px] font-black text-error">
                    불량
                  </span>
                </div>
                <p className="truncate text-sm font-extrabold text-on-surface">{det.part}</p>
                <p className="mt-1 text-xs font-bold text-primary">신뢰도 {det.confidence}%</p>
              </div>
            </div>
          </div>
        ))}
        {!defectDetections.length && (
          <div className="rounded-lg border border-dashed border-outline-variant/40 bg-white/70 p-4 text-center text-xs font-bold text-on-surface-variant">
            최근 불량 감지 내역이 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}

export default function MonitoringPage() {
  const navigate = useNavigate();
  const [lines, setLines] = useState(() => mockFactoryLineView());
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
        if (!ignore) setLines(linesResponseToFactoryLines(data));
      })
      .catch((err) => {
        if (!ignore) {
          setApiError(err.message);
          setLines(mockFactoryLineView());
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
          const nextLines = linesResponseToFactoryLines(data);
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

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <FactoryFloorMap lines={lines} onLineSelect={handleLineSelect} />
        <DetectionStrip />
      </section>
    </div>
  );
}
