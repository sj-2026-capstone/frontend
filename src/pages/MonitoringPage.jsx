import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { cameraFeeds, recentDetections } from "../data/mockData";

// 모바일 상황판 카드 색상
const statusStyle = {
  alarm:  { border: "border-error",    badge: "bg-error/5 text-error",               ring: "ring-1 ring-error/30",  dot: null,                        icon: "report",  pulse: "animate-status-pulse" },
  normal: { border: "border-primary",   badge: "bg-primary/5 text-primary",                        ring: "",       dot: "bg-green-500",               icon: null,      pulse: "" },
  wait:   { border: "border-secondary", badge: "bg-secondary/5 text-secondary",       ring: "",                      dot: null,                        icon: "build",   pulse: "" },
};

export default function MonitoringPage() {
  const navigate = useNavigate();

  const totalOk = recentDetections.filter((d) => d.status === "normal").length;
  const totalNg = recentDetections.filter((d) => d.status === "defect").length;

  return (
    <div className="max-w-[1600px] mx-auto">

      {/* ════════════════════════════════════════
          모바일 전용 — 상황판 레이아웃
          ════════════════════════════════════════ */}
      <div className="md:hidden space-y-6">

        {/* 라인별 가동 현황 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline font-bold text-primary">라인별 가동 현황</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">System Live</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {cameraFeeds.map((cam) => {
              const s = statusStyle[cam.status] || statusStyle.normal;
              return (
                <div
                  key={cam.id}
                  className={`bg-surface-container-lowest rounded-xl p-3 shadow-sm ${s.ring} ${s.pulse} ${cam.status === "alarm" ? "cursor-pointer" : ""}`}
                  onClick={() => cam.status === "alarm" && cam.inspectionId && navigate(`/inspection/${cam.inspectionId}`)}
                >
                  {/* 헤더 */}
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[8px] font-black tracking-widest ${cam.status === "alarm" ? "text-error" : "text-slate-400"}`}>
                      {cam.id}
                    </span>
                    {s.icon ? (
                      <Icon name={s.icon} fill className={`text-xs ${cam.status === "alarm" ? "text-error" : "text-secondary"}`} />
                    ) : (
                      <span className={`w-2 h-2 ${s.dot} rounded-full animate-pulse`} />
                    )}
                  </div>

                  {/* 라인명 */}
                  <h3 className="text-xs font-bold text-primary mb-3">{cam.line}</h3>

                  {/* 상태 배지 */}
                  <div className={`flex flex-col items-center py-2 rounded-lg mb-2 ${s.badge}`}>
                    <span className="font-black text-[10px] uppercase">
                      {cam.status === "alarm" ? "ALARM" : cam.status === "wait" ? "WAIT" : "NORMAL"}
                    </span>
                    <span className="text-[10px] font-bold">
                      {cam.status === "alarm" ? "불량 감지" : cam.status === "wait" ? "점검 대기" : "정상 가동"}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        </section>


        {/* 최근 감지 내역 (컴팩트) */}
        <section className="space-y-3">
          <h2 className="font-headline font-bold text-primary">최근 감지 내역</h2>
          <div className="space-y-2">
            {recentDetections.slice(0, 5).map((det, i) => (
              <div
                key={i}
                className={`bg-surface-container-low p-2 rounded-lg flex items-center justify-between`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-surface-dim overflow-hidden flex-shrink-0">
                    <img className="w-full h-full object-cover" src={det.image} alt={det.part} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-primary">
                      {det.part} ({det.status === "defect" ? "NG" : "OK"})
                    </p>
                    <p className="text-[8px] text-on-surface-variant font-medium">{det.cam} | {det.time}</p>
                  </div>
                </div>
                <Icon name="chevron_right" className="text-on-surface-variant text-sm" />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ════════════════════════════════════════
          PC 전용 — 카메라 영상 피드 레이아웃
          ════════════════════════════════════════ */}
      <div className="hidden md:block">

        {/* 페이지 헤더 */}
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

        {/* 카메라 그리드 2x2 */}
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
              <img
                className={`w-full h-full object-cover ${cam.status === "alarm" ? "grayscale-[0.3]" : ""}`}
                src={cam.image}
                alt={`${cam.id} ${cam.line}`}
              />
              {cam.status === "alarm" && (
                <div className="absolute inset-0 glass-error flex items-center justify-center">
                  <div className="text-center">
                    <Icon name="warning" className="text-error text-5xl mb-2" fill />
                    <h3 className="text-white text-2xl font-black tracking-tighter">불량 감지</h3>
                  </div>
                </div>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                {cam.status === "alarm" ? (
                  <span className="px-2 py-1 bg-error text-white text-[10px] font-bold rounded">ALARM</span>
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
              <div className={`absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] font-mono tracking-wider ${cam.status === "alarm" ? "text-white/80" : "text-white/60"}`}>
                <span>FPS: {cam.fps} | 해상도: 1920x1080</span>
                {cam.status === "alarm" ? (
                  <span className="text-white/80">LIVE {cam.time}</span>
                ) : (
                  <span className="text-green-400">NORMAL STATUS</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 최근 감지 내역 (가로 스크롤) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Icon name="analytics" className="text-primary" />
              최근 감지 내역
            </h2>
            <a className="text-xs text-primary font-bold hover:underline" href="#">전체 보기</a>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {recentDetections.map((det, i) => (
              <div
                key={i}
                className={`min-w-[280px] bg-white rounded-xl p-4 border border-outline-variant/20 shadow-sm flex gap-4 items-center ${det.status === "normal" ? "opacity-80" : ""}`}
              >
                <div className="w-20 h-20 rounded-lg bg-surface-container-highest overflow-hidden flex-shrink-0 relative">
                  <img className="w-full h-full object-cover" src={det.image} alt={det.part} />
                  {det.status === "defect" && <div className="absolute inset-0 bg-error/10" />}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-on-surface-variant">{det.time} | {det.cam}</span>
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${det.status === "defect" ? "bg-error/10 text-error" : "bg-green-100 text-green-700"}`}>
                      {det.status === "defect" ? "불량" : "정상"}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-on-surface">{det.part}</h4>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-on-surface-variant">Confidence</span>
                    <span className={`text-xs font-black ${det.status === "defect" ? "text-error" : "text-primary"}`}>
                      {det.confidence}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
