import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { cameraFeeds, recentDetections } from "../data/mockData";

export default function MonitoringPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Page Header */}
      <header className="mb-8 flex items-center gap-6">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon name="engineering" className="text-primary text-3xl" />
        </div>
        <div className="flex items-center gap-6">
          <h1 className="font-headline font-bold text-3xl text-on-surface">김철수</h1>
          <div className="w-px h-8 bg-outline-variant" />
          <h2 className="font-headline font-bold text-3xl text-primary">A라인</h2>
        </div>
      </header>

      {/* ── Camera Grid 2x2 ── */}
      <div className="grid grid-cols-2 gap-6 mb-10">
        {cameraFeeds.map((cam) => (
          <div
            key={cam.id}
            className={`relative aspect-video rounded-xl overflow-hidden bg-surface-container-highest group ${
              cam.status === "alarm"
                ? "border-4 border-error active-pulse cursor-pointer"
                : "border border-outline-variant/30"
            }`}
            onClick={() => cam.status === "alarm" && cam.inspectionId && navigate(`/inspection/${cam.inspectionId}`)}
          >
            {/* Camera image */}
            <img
              className={`w-full h-full object-cover ${
                cam.status === "alarm" ? "grayscale-[0.3]" : ""
              }`}
              src={cam.image}
              alt={`${cam.id} ${cam.line}`}
            />

            {/* Alarm overlay */}
            {cam.status === "alarm" && (
              <div className="absolute inset-0 glass-error flex items-center justify-center">
                <div className="text-center">
                  <Icon name="warning" className="text-error text-5xl mb-2" fill />
                  <h3 className="text-white text-2xl font-black tracking-tighter">
                    불량 감지
                  </h3>
                </div>
              </div>
            )}

            {/* Top-left badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              {cam.status === "alarm" ? (
                <span className="px-2 py-1 bg-error text-white text-[10px] font-bold rounded">
                  ALARM
                </span>
              ) : (
                <span className="px-2 py-1 bg-green-500 text-white text-[10px] font-bold rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  LIVE
                </span>
              )}
              <span className="px-2 py-1 bg-black/50 text-white text-[10px] font-bold rounded backdrop-blur">
                {cam.id} {cam.line}
              </span>
            </div>

            {/* Bottom info bar */}
            <div className={`absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] font-mono tracking-wider ${cam.status === "alarm" ? "text-white/80" : "text-white/60"}`}>
              <span>FPS: 30 | 해상도: 1920x1080</span>
              {cam.status === "alarm" ? (
                <span className="text-white/80">LIVE {cam.time}</span>
              ) : (
                <span className="text-green-400">NORMAL STATUS</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Recent Detections ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <Icon name="analytics" className="text-primary" />
            최근 감지 내역
          </h2>
          <a className="text-xs text-primary font-bold hover:underline" href="#">
            전체 보기
          </a>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {recentDetections.map((det, i) => (
            <div
              key={i}
              className={`min-w-[280px] bg-white rounded-xl p-4 border border-outline-variant/20 shadow-sm flex gap-4 items-center ${
                det.status === "normal" ? "opacity-80" : ""
              }`}
            >
              {/* Thumbnail */}
              <div className="w-20 h-20 rounded-lg bg-surface-container-highest overflow-hidden flex-shrink-0 relative">
                <img
                  className="w-full h-full object-cover"
                  src={det.image}
                  alt={det.part}
                />
                {det.status === "defect" && (
                  <div className="absolute inset-0 bg-error/10" />
                )}
              </div>

              {/* Info */}
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-on-surface-variant">
                    {det.time} | {det.cam}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                      det.status === "defect"
                        ? "bg-error/10 text-error"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {det.status === "defect" ? "불량" : "정상"}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-on-surface">{det.part}</h4>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant">Confidence</span>
                  <span
                    className={`text-xs font-black ${
                      det.status === "defect" ? "text-error" : "text-primary"
                    }`}
                  >
                    {det.confidence}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
