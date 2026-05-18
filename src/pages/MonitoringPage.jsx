import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import FactoryFloorMap from "../components/FactoryFloorMap";
import { USE_MOCK_API } from "../api/config";
import { getLines } from "../api/lines";
import { subscribeNotifications } from "../api/notifications";
import { applyLineAlarmNotification, linesResponseToFactoryLines, mockFactoryLineView } from "../adapters/lines";
import { recentDetections } from "../data/mockData";

const statusCopy = {
  alarm: {
    label: "불량",
    tone: "border-error/30 bg-error/5 text-error",
    dot: "bg-error",
    icon: "warning",
  },
  normal: {
    label: "정상",
    tone: "border-green-200 bg-green-50 text-green-700",
    dot: "bg-green-500",
    icon: "check_circle",
  },
  wait: {
    label: "대기",
    tone: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
    icon: "build",
  },
};

function LineStatusCard({ line, onSelect }) {
  const copy = statusCopy[line.status] || statusCopy.normal;
  const isClickable = line.status === "alarm" && line.inspectionId;

  return (
    <button
      type="button"
      className={`w-full rounded-lg border p-2.5 text-left shadow-sm transition-all ${
        copy.tone
      } ${isClickable ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md" : "cursor-default"}`}
      onClick={() => isClickable && onSelect(line)}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-70">생산 라인</p>
          <h3 className="mt-0.5 font-headline text-base font-extrabold tracking-tight text-on-surface">
            {line.name}
          </h3>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/80">
          <Icon name={copy.icon} fill={line.status === "alarm"} className="text-base" />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/75 px-2 py-0.5 text-[11px] font-black">
          <span className={`h-1.5 w-1.5 rounded-full ${copy.dot} ${line.status === "alarm" ? "animate-pulse" : ""}`} />
          {copy.label}
        </span>
        <span className="text-[11px] font-bold opacity-80">
          불량 {line.defectCount}건
        </span>
      </div>
      <p className="mt-2 text-[11px] font-semibold opacity-70">
        최근 이벤트: {line.lastEventAt || "-"}
      </p>
    </button>
  );
}

function DetectionStrip() {
  return (
    <section className="rounded-xl bg-surface-container-lowest p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-primary">
          <Icon name="analytics" className="text-base" />
          최근 감지 내역
        </h2>
        <span className="text-[11px] font-bold text-on-surface-variant">실시간</span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-1 no-scrollbar">
        {recentDetections.map((det, index) => (
          <div
            key={`${det.time}-${index}`}
            className="min-w-[250px] rounded-lg border border-outline-variant/20 bg-white p-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-surface-container-highest">
                <img className="h-full w-full object-cover" src={det.image} alt={det.part} />
                {det.status === "defect" && <div className="absolute inset-0 bg-error/15" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="truncate text-[11px] font-bold text-on-surface-variant">
                    {det.time} | {det.cam}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-black ${
                      det.status === "defect" ? "bg-error/10 text-error" : "bg-green-100 text-green-700"
                    }`}
                  >
                    {det.status === "defect" ? "불량" : "정상"}
                  </span>
                </div>
                <p className="truncate text-sm font-extrabold text-on-surface">{det.part}</p>
                <p className="mt-1 text-xs font-bold text-primary">신뢰도 {det.confidence}%</p>
              </div>
            </div>
          </div>
        ))}
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

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px]">
        <FactoryFloorMap lines={lines} onLineSelect={handleLineSelect} />

        <aside className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
          {lines.map((line) => (
            <LineStatusCard key={line.id} line={line} onSelect={handleLineSelect} />
          ))}
        </aside>
      </section>

      <DetectionStrip />
    </div>
  );
}
