import {
  actionStatus,
  defectTrendData,
  kpiData,
  linePerformance,
} from "../data/mockData";

export function dashboardResponseToView(response, fallback = {}) {
  const summary = response?.summary || {};
  const actionSummary = response?.actionSummary || {};

  const inspectionChange = Number(summary.totalInspectionChangeRate || 0);
  const defectRateChange = Number(summary.defectRateChange || 0);

  return {
    kpis: [
      {
        ...kpiData[0],
        value: formatCount(summary.totalInspectionCount),
        change: formatPercent(Math.abs(inspectionChange)),
        changeDir: changeDirection(inspectionChange),
        sub: "recent 7 days vs previous 7 days",
      },
      {
        ...kpiData[1],
        value: formatPercent(summary.defectRate),
        change: formatPercent(Math.abs(defectRateChange)),
        changeDir: changeDirection(defectRateChange, true),
        sub: "recent 7 days vs previous 7 days",
      },
      {
        ...kpiData[2],
        value: formatCount(summary.todayInspectionCount),
        change: "items",
        changeDir: null,
        sub: "today",
      },
      {
        ...kpiData[3],
        value: formatCount(summary.todayDefectCount),
        change: "items",
        changeDir: null,
        sub: "today",
      },
    ],
    defectTrendData: response?.defectRateTrend?.length
      ? response.defectRateTrend.map((item) => ({
          date: formatDateLabel(item.date),
          value: Number(item.defectRate || 0),
        }))
      : fallback.defectTrendData ?? defectTrendData,
    actionStatus: {
      total: Number(actionSummary.total || 0),
      pending: Number(actionSummary.unresolvedCount ?? actionSummary.pendingCount ?? 0),
      inProgress: Number(actionSummary.inProgressCount || 0),
      resolved: Number(actionSummary.resolvedCount ?? actionSummary.completedCount ?? 0),
      completionRate: Number(actionSummary.completionRate || 0),
    },
    linePerformance: response?.lineDefectRates?.length
      ? response.lineDefectRates.map((item) => {
          const rate = Number(item.defectRate || 0);
          return {
            line: item.lineName || item.lineCode || "-",
            rate,
            width: `${Math.min(Math.max(rate, 0), 100)}%`,
          };
        })
      : fallback.linePerformance ?? linePerformance,
    lastUpdatedAt: response?.lastUpdatedAt || null,
  };
}

export function mockDashboardView() {
  return {
    kpis: kpiData,
    defectTrendData,
    actionStatus,
    linePerformance,
    lastUpdatedAt: null,
  };
}

function changeDirection(value, lowerIsBetter = false) {
  if (value === 0) return null;
  if (lowerIsBetter) return value < 0 ? "down" : "up";
  return value > 0 ? "up" : "down";
}

function formatCount(value) {
  return Number(value || 0).toLocaleString();
}

function formatPercent(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}

function formatDateLabel(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getMonth() + 1}/${date.getDate()}`;
}
