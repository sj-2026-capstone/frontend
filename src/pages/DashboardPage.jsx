import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { USE_MOCK_API } from "../api/config";
import { getDashboard } from "../api/dashboard";
import { subscribeNotifications } from "../api/notifications";
import { dashboardResponseToView, mockDashboardView } from "../adapters/dashboard";

const TREND_CHART = {
  width: 760,
  height: 300,
  top: 28,
  right: 34,
  bottom: 48,
  left: 54,
};

function formatTrendRate(value) {
  const rounded = Number(value || 0);
  return `${rounded >= 10 ? rounded.toFixed(0) : rounded.toFixed(1)}%`;
}

function buildSmoothPath(points) {
  if (!points.length) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  return points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;

    const previous = points[index - 1];
    const controlX = (previous.x + point.x) / 2;
    return `${path} C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
  }, "");
}

function buildTrendChart(items) {
  const plotWidth = TREND_CHART.width - TREND_CHART.left - TREND_CHART.right;
  const plotHeight = TREND_CHART.height - TREND_CHART.top - TREND_CHART.bottom;
  const plotBottom = TREND_CHART.height - TREND_CHART.bottom;
  const values = items.map((item) => Number(item.value || 0));
  const maxValue = Math.max(...values, 0);
  const tickMax = Math.max(5, Math.ceil(maxValue / 5) * 5);

  const points = items.map((item, index) => {
    const value = Number(item.value || 0);
    const x = items.length === 1
      ? TREND_CHART.left + plotWidth / 2
      : TREND_CHART.left + (plotWidth / (items.length - 1)) * index;
    const y = plotBottom - (value / tickMax) * plotHeight;

    return { ...item, value, x, y };
  });

  const linePath = buildSmoothPath(points);
  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${plotBottom} L ${points[0].x} ${plotBottom} Z`
    : "";
  const ticks = Array.from({ length: 5 }, (_, index) => {
    const value = tickMax - (tickMax / 4) * index;
    return {
      value,
      y: TREND_CHART.top + (plotHeight / 4) * index,
    };
  });
  const average = values.length
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : 0;
  const averageY = plotBottom - (average / tickMax) * plotHeight;

  return { areaPath, average, averageY, linePath, points, ticks };
}

function unwrapNotification(notification) {
  if (notification?.data && typeof notification.data === "object") return notification.data;
  if (notification?.payload && typeof notification.payload === "object") return notification.payload;
  return notification || {};
}

function pickText(...values) {
  const value = values.find((item) => item !== undefined && item !== null && String(item).trim());
  return value === undefined || value === null ? "-" : String(value).trim();
}

function isDefectNotification(notification) {
  const item = unwrapNotification(notification);
  const type = String(item.notificationType || item.type || "").toUpperCase();
  return !type || type === "DEFECT_DETECTED";
}

function normalizeDefectAlert(notification) {
  const item = unwrapNotification(notification);

  return {
    title: pickText(item.title, "신규 불량 감지"),
    message: pickText(item.message, item.desc, item.description, "관리자 확인이 필요한 불량이 감지되었습니다."),
    inspectionId: item.inspectionId || item.latestInspectionId || item.defectInspectionId || null,
    line: pickText(item.lineName, item.lineCode, item.lineId, item.line),
    part: pickText(item.partName, item.partCode, item.partId, item.productName, item.productId),
    defectType: pickText(item.defectType, item.defectName, item.defectDisplayName),
    camera: pickText(item.cameraName, item.cameraId, item.deviceId),
    detectedAt: pickText(item.detectedAt, item.createdAt, item.updatedAt, item.time),
  };
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [defectAlert, setDefectAlert] = useState(null);
  const [dashboard, setDashboard] = useState(() =>
    USE_MOCK_API
      ? mockDashboardView()
      : dashboardResponseToView({}, { defectTrendData: [], linePerformance: [] })
  );
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (USE_MOCK_API) return;

    let ignore = false;

    getDashboard()
      .then((data) => {
        if (!ignore) setDashboard(dashboardResponseToView(data, { defectTrendData: [], linePerformance: [] }));
      })
      .catch((err) => {
        if (!ignore) setApiError(err.message);
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (USE_MOCK_API) return;

    let ignore = false;
    const source = subscribeNotifications(
      (notification) => {
        if (ignore || !isDefectNotification(notification)) return;
        setDefectAlert(normalizeDefectAlert(notification));
      },
      (err) => {
        if (!ignore) setApiError(err.message);
      }
    );

    return () => {
      ignore = true;
      source.close();
    };
  }, []);

  const trendChart = useMemo(
    () => buildTrendChart(dashboard.defectTrendData),
    [dashboard.defectTrendData]
  );
  const actionTotal = Math.max(dashboard.actionStatus.total, 1);
  const actionCompletionRate = dashboard.actionStatus.completionRate || Math.round(
    (dashboard.actionStatus.resolved / actionTotal) * 100
  );
  const lastUpdatedAt = dashboard.lastUpdatedAt
    ? new Date(dashboard.lastUpdatedAt).toLocaleString()
    : "2024.03.23 14:00";

  return (
    <>
      {apiError && (
        <div className="mb-6 rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm font-medium text-error">
          {apiError}
        </div>
      )}

      {defectAlert && (
        <section className="mb-6 rounded-xl border border-error/20 bg-error/5 p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-error text-white">
                <Icon name="warning" />
              </div>
              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-extrabold text-error">{defectAlert.title}</h2>
                  <span className="rounded bg-error px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                    Defect
                  </span>
                </div>
                <p className="text-sm font-medium text-on-surface">{defectAlert.message}</p>
              </div>
            </div>

            <div className="flex gap-2 lg:justify-end">
              {defectAlert.inspectionId && (
                <button
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-primary-container"
                  onClick={() => navigate(`/inspection/${defectAlert.inspectionId}`)}
                  type="button"
                >
                  상세 보기
                </button>
              )}
              <button
                aria-label="알림 닫기"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-on-surface-variant transition-colors hover:bg-surface-container"
                onClick={() => setDefectAlert(null)}
                type="button"
              >
                <Icon name="close" className="text-lg" />
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            {[
              { label: "검사 ID", value: defectAlert.inspectionId || "-" },
              { label: "라인", value: defectAlert.line },
              { label: "부품", value: defectAlert.part },
              { label: "불량 유형", value: defectAlert.defectType },
              { label: "카메라", value: defectAlert.camera },
              { label: "감지 시각", value: defectAlert.detectedAt },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-white px-3 py-2">
                <div className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant">
                  {item.label}
                </div>
                <div className="mt-1 truncate text-sm font-bold text-on-surface" title={String(item.value)}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {dashboard.kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-surface-container-lowest p-6 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-on-surface-variant font-label uppercase tracking-wider">
                {kpi.label}
              </span>
              <Icon
                name={kpi.icon}
                className={
                  kpi.accent
                    ? "text-error"
                    : kpi.label === "불량률"
                    ? "text-tertiary-fixed-dim"
                    : "text-primary-fixed-dim"
                }
              />
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className={`font-headline text-3xl font-extrabold tracking-tight ${
                  kpi.accent
                    ? "text-error"
                    : kpi.label === "불량률"
                    ? "text-on-tertiary-container"
                    : ""
                }`}
              >
                {kpi.value}
              </span>
              {kpi.changeDir === "up" && (
                <span className="text-xs font-bold text-green-600 flex items-center">
                  <Icon name="trending_up" className="text-xs" />
                  {kpi.change}
                </span>
              )}
              {kpi.changeDir === "down" && (
                <span className="text-xs font-bold text-green-600 flex items-center">
                  <Icon name="trending_down" className="text-xs" />
                  {kpi.change}
                </span>
              )}
              {kpi.changeDir === null && (
                <span className={`text-xs font-bold ${kpi.accent ? "text-error" : "text-slate-400"}`}>
                  {kpi.change}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Line Chart: 불량률 추이 ── */}
      <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm mb-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-headline text-xl font-bold tracking-tight text-primary">
              불량률 추이 (최근 7일)
            </h2>
            <p className="text-sm text-slate-500">일별 품질 지표 변동 현황</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
            <div className="flex items-center gap-2 rounded-full bg-surface-container-low px-3 py-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#1E3A5F]" />
              <span>불량률</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-surface-container-low px-3 py-1.5">
              <span className="h-px w-5 border-t border-dashed border-[#C47A00]" />
              <span>평균 {formatTrendRate(trendChart.average)}</span>
            </div>
          </div>
        </div>

        <div className="mt-7">
          <svg
            aria-label="최근 7일 불량률 추이 그래프"
            className="h-[340px] w-full"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            viewBox={`0 0 ${TREND_CHART.width} ${TREND_CHART.height}`}
          >
            <defs>
              <linearGradient id="defectTrendFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#1E3A5F" stopOpacity="0.24" />
                <stop offset="100%" stopColor="#1E3A5F" stopOpacity="0" />
              </linearGradient>
              <filter id="defectTrendShadow" x="-8%" y="-20%" width="116%" height="150%">
                <feDropShadow dx="0" dy="7" floodColor="#0F2D4E" floodOpacity="0.14" stdDeviation="6" />
              </filter>
            </defs>

            {trendChart.ticks.map((tick) => (
              <g key={tick.value}>
                <line
                  stroke="#E6E8EB"
                  strokeDasharray={tick.value === 0 ? "0" : "4 8"}
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                  x1={TREND_CHART.left}
                  x2={TREND_CHART.width - TREND_CHART.right}
                  y1={tick.y}
                  y2={tick.y}
                />
                <text
                  className="fill-slate-400 text-[11px] font-bold"
                  textAnchor="end"
                  x={TREND_CHART.left - 14}
                  y={tick.y + 4}
                >
                  {formatTrendRate(tick.value)}
                </text>
              </g>
            ))}

            {trendChart.areaPath && (
              <path d={trendChart.areaPath} fill="url(#defectTrendFill)" />
            )}

            {trendChart.points.length > 0 && (
              <>
                <line
                  stroke="#C47A00"
                  strokeDasharray="6 7"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                  x1={TREND_CHART.left}
                  x2={TREND_CHART.width - TREND_CHART.right}
                  y1={trendChart.averageY}
                  y2={trendChart.averageY}
                />
                <text
                  className="fill-[#9A5F00] text-[11px] font-extrabold"
                  x={TREND_CHART.width - TREND_CHART.right - 4}
                  y={trendChart.averageY - 8}
                  textAnchor="end"
                >
                  평균 {formatTrendRate(trendChart.average)}
                </text>
              </>
            )}

            <path
              d={trendChart.linePath}
              fill="none"
              stroke="#1E3A5F"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3.5"
              filter="url(#defectTrendShadow)"
              vectorEffect="non-scaling-stroke"
            />

            {trendChart.points.map((point, index) => (
              <g key={`${point.date}-${index}`}>
                <circle cx={point.x} cy={point.y} fill="#FFFFFF" r="7" />
                <circle
                  cx={point.x}
                  cy={point.y}
                  fill="#1E3A5F"
                  r="4"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
                <text
                  className="fill-primary text-[12px] font-extrabold"
                  textAnchor="middle"
                  x={point.x}
                  y={point.y - 14}
                >
                  {formatTrendRate(point.value)}
                </text>
                <text
                  className="fill-slate-500 text-[11px] font-bold"
                  textAnchor="middle"
                  x={point.x}
                  y={TREND_CHART.height - 16}
                >
                  {point.date}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* ── Bottom: Donut + Bar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 조치 현황 요약 */}
        <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-headline text-lg font-bold tracking-tight text-primary">
                조치 현황 요약
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">금일 기준 불량 조치 진행 현황</p>
            </div>
            {dashboard.actionStatus.pending > 0 && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-error/10 text-error text-[11px] font-bold rounded-full">
                <Icon name="warning" className="text-xs" />
                미처리 {dashboard.actionStatus.pending}건
              </span>
            )}
          </div>

          {/* 전체 진행률 바 */}
          <div className="mb-6">
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
              <span>전체 조치율</span>
              <span className="text-primary">{actionCompletionRate}%</span>
            </div>
            <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden flex">
              <div
                className="h-full bg-primary rounded-l-full transition-all"
                style={{ width: `${(dashboard.actionStatus.resolved / actionTotal) * 100}%` }}
              />
            </div>
            <div className="flex gap-4 mt-2 text-[10px] font-bold text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary inline-block" />조치 완료</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-surface-container-high inline-block" />미처리</span>
            </div>
          </div>

          {/* 3개 상태 카드 */}
          <div className="grid grid-cols-3 gap-4 mt-auto">
            <div className="bg-surface-container-low border border-surface-container-high rounded-xl p-4 text-center">
              <Icon name="fact_check" className="text-primary text-2xl mb-1" />
              <div className="font-headline text-2xl font-extrabold text-primary">{dashboard.actionStatus.total}</div>
              <div className="text-[11px] font-bold text-on-surface-variant mt-0.5">전체 불량</div>
            </div>
            <div className="bg-error/5 border border-error/20 rounded-xl p-4 text-center">
              <Icon name="report" className="text-error text-2xl mb-1" />
              <div className="font-headline text-2xl font-extrabold text-error">{dashboard.actionStatus.pending}</div>
              <div className="text-[11px] font-bold text-error/70 mt-0.5">미처리</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <Icon name="check_circle" className="text-green-600 text-2xl mb-1" />
              <div className="font-headline text-2xl font-extrabold text-green-600">{dashboard.actionStatus.resolved}</div>
              <div className="text-[11px] font-bold text-green-500 mt-0.5">조치 완료</div>
            </div>
          </div>
        </div>

        {/* Bar: 라인별 불량률 */}
        <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm">
          <h3 className="font-headline text-lg font-bold tracking-tight text-primary mb-6">
            라인별 불량률
          </h3>
          <div className="flex flex-col gap-8">
            {dashboard.linePerformance.map((lp) => (
              <div key={lp.line} className="flex flex-col gap-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-sm font-bold text-primary">{lp.line}</span>
                  <span className="text-sm font-bold font-label">{lp.rate}%</span>
                </div>
                <div className="w-full h-3 bg-surface-container-low rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1E3A5F] rounded-full"
                    style={{ width: lp.width }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer Meta ── */}
      <footer className="mt-12 pt-8 border-t border-surface-container flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        <div>AI Factory Quality System v2.4.0</div>
        <div>Last Updated: {lastUpdatedAt}</div>
      </footer>
    </>
  );
}
