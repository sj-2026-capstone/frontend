import { useEffect, useMemo, useState } from "react";

const ALARM_STILL_IMAGE = "/defects/defect-original.jpg";

const cctvImages = (group, count = 10) =>
  Array.from({ length: count }, (_, index) => `/cctv/${group}/${String(index + 1).padStart(2, "0")}.jpg`);

const feedTemplates = [
  {
    id: "CAM-1",
    lineId: "A",
    title: "도어 검사",
    location: "A라인 도어 검사",
    images: cctvImages("door"),
    fps: 30,
    resolution: "1920x1080",
    part: "도어",
    fallbackInspectionId: 50,
    offset: 0,
  },
  {
    id: "CAM-2",
    lineId: "B",
    title: "범퍼 검사",
    location: "B라인 범퍼 검사",
    images: cctvImages("bumper"),
    fps: 30,
    resolution: "1920x1080",
    part: "범퍼",
    offset: 1,
  },
  {
    id: "CAM-3",
    lineId: "C",
    title: "프레임 검사",
    location: "C라인 프레임 검사",
    images: cctvImages("frame"),
    fps: 28,
    resolution: "1920x1080",
    part: "프레임",
    offset: 2,
  },
];

const statusCopy = {
  alarm: {
    live: "ALARM",
    status: "DEFECT DETECTED",
    statusKo: "불량 감지",
    tone: "alarm",
  },
  normal: {
    live: "LIVE",
    status: "NORMAL STATUS",
    statusKo: "정상",
    tone: "normal",
  },
  wait: {
    live: "LIVE",
    status: "STANDBY",
    statusKo: "대기",
    tone: "wait",
  },
};

function getLineCode(line) {
  return String(line?.id || line?.code || "")
    .replace(/[^A-D]/gi, "")
    .slice(0, 1)
    .toUpperCase();
}

function getLiveClock(date) {
  return date.toLocaleTimeString("ko-KR", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function buildFeeds(lines, liveClock, frameSlot) {
  const byLine = new Map(lines.map((line) => [getLineCode(line), line]).filter(([code]) => code));

  return feedTemplates.map((template) => {
    const line = byLine.get(template.lineId);
    const status = line?.status || "normal";
    const copy = statusCopy[status] || statusCopy.normal;
    const images = template.images || [];
    const alarm = status === "alarm";
    const previewFrameSlot = Number(line?.previewFrameSlot);
    const previewImage =
      line?.previewImage && Number.isFinite(previewFrameSlot) && frameSlot >= previewFrameSlot
        ? line.previewImage
        : "";
    const imageOverride = line?.image || previewImage;
    const imageIndex = images.length ? (frameSlot + template.offset) % images.length : 0;

    return {
      ...template,
      line,
      copy,
      status,
      alarm,
      inspectionId: line?.inspectionId || template.fallbackInspectionId || null,
      defectCount: Number(line?.defectCount || 0),
      time: line?.lastEventAt || liveClock,
      image: imageOverride || (alarm ? ALARM_STILL_IMAGE : images[imageIndex]),
      frameNo: alarm || imageOverride ? 1 : imageIndex + 1,
      frameTotal: alarm || imageOverride ? 1 : images.length,
    };
  });
}

function FeedBadge({ feed }) {
  return (
    <div className="absolute left-3 top-3 z-20 flex max-w-[calc(100%-1.5rem)] items-center gap-2">
      <span className={`cctv-live-badge cctv-live-badge--${feed.copy.tone}`}>
        <span className="cctv-live-dot" />
        {feed.copy.live}
      </span>
      <span className="truncate rounded bg-black/70 px-2 py-1 text-[10px] font-black text-white shadow-sm">
        {feed.id}
      </span>
    </div>
  );
}

function CameraFeedCard({ feed, onSelect }) {
  const clickable = feed.alarm && feed.inspectionId;
  const Component = clickable ? "button" : "article";

  return (
    <Component
      type={clickable ? "button" : undefined}
      className={`cctv-feed-card cctv-feed-card--${feed.copy.tone} group relative block w-full overflow-hidden rounded-lg border bg-black text-left shadow-sm`}
      onClick={() => clickable && onSelect?.({ ...feed.line, inspectionId: feed.inspectionId })}
      aria-label={`${feed.location} ${feed.copy.statusKo}`}
    >
      <img
        className="cctv-video-image absolute inset-0 h-full w-full object-cover"
        src={feed.image}
        alt={`${feed.location} 검사 영상`}
        draggable="false"
      />
      <div className="cctv-video-vignette absolute inset-0" />
      <div className="cctv-video-noise absolute inset-0" />
      <div className="cctv-scanlines absolute inset-0" />

      {feed.alarm && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4">
          <div className="flex items-center gap-2 rounded bg-red-600/95 px-4 py-2 text-sm font-black text-white shadow-lg">
            <span className="material-symbols-outlined text-base" aria-hidden="true">
              warning
            </span>
            <span>불량 감지</span>
          </div>
        </div>
      )}

      <FeedBadge feed={feed} />

      {clickable && (
        <div className="pointer-events-none absolute right-3 top-3 z-20 rounded bg-red-600/90 px-2 py-1 text-[10px] font-black text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          상세 보기
        </div>
      )}
    </Component>
  );
}

export default function FactoryFloorMap({ lines, onLineSelect, children, timelineStartedAt }) {
  const [now, setNow] = useState(() => new Date());
  const [defaultStartedAt] = useState(() => Date.now());
  const startedAt = timelineStartedAt || defaultStartedAt;

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    [...feedTemplates.flatMap((feed) => feed.images), ALARM_STILL_IMAGE]
      .forEach((src) => {
        const image = new Image();
        image.src = src;
      });
  }, []);

  const liveClock = getLiveClock(now);
  const frameSlot = Math.max(0, Math.floor((now.getTime() - startedAt) / 3000));
  const feeds = useMemo(() => buildFeeds(lines, liveClock, frameSlot), [lines, liveClock, frameSlot]);
  const hasAlarm = feeds.some((feed) => feed.alarm);

  return (
    <section
      className={`cctv-monitor-shell rounded-xl border p-3 shadow-sm ${
        hasAlarm ? "border-error ring-4 ring-error/20 active-pulse" : "border-outline-variant/30"
      }`}
      aria-label="C 라인 / 진성훈 모니터링"
    >
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-primary/60">
            Inspection Live Feed
          </p>
          <h2 className="mt-0.5 text-base font-black text-primary">C 라인 / 진성훈</h2>
        </div>
        <div className="rounded bg-black/80 px-2.5 py-1.5 font-mono text-[11px] font-black text-emerald-300">
          {liveClock}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {feeds.map((feed) => (
          <CameraFeedCard key={feed.id} feed={feed} onSelect={onLineSelect} />
        ))}
        {children}
      </div>
    </section>
  );
}
