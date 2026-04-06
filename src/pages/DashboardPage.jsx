import { useState } from "react";
import Icon from "../components/Icon";
import {
  kpiData,
  defectTrendData,
  actionStatus,
  linePerformance,
} from "../data/mockData";

export default function DashboardPage() {
  const [showAlert, setShowAlert] = useState(false);

  return (
    <>
      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi) => (
          <div
            key={kpi.label}
            className={`bg-surface-container-lowest p-6 rounded-lg shadow-sm ${
              kpi.accent ? "border-l-4 border-error" : ""
            }`}
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
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-headline text-xl font-bold tracking-tight text-primary">
              불량률 추이 (최근 7일)
            </h2>
            <p className="text-sm text-slate-500">일별 품질 지표 변동 현황</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-[#022448] rounded-full" />
              <span>불량률 (%)</span>
            </div>
          </div>
        </div>

        <div className="h-64 flex items-end gap-1 relative pt-4">
          {/* Grid lines */}
          <div className="absolute inset-0 border-b border-surface-container flex flex-col justify-between opacity-50">
            <div className="border-t border-surface-container w-full h-0" />
            <div className="border-t border-surface-container w-full h-0" />
            <div className="border-t border-surface-container w-full h-0" />
            <div className="border-t border-surface-container w-full h-0" />
          </div>

          {/* SVG Line */}
          <svg
            className="absolute inset-0 w-full h-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 700 200"
          >
            <path
              d="M0,150 L100,120 L200,140 L300,80 L400,100 L500,90 L600,110 L700,70"
              fill="none"
              stroke="#1E3A5F"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
            />
            {[
              [0, 150], [100, 120], [200, 140], [300, 80],
              [400, 100], [500, 90], [600, 110], [700, 70],
            ].map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill="#1E3A5F" />
            ))}
          </svg>

          {/* Date labels */}
          <div className="absolute bottom-[-24px] w-full flex justify-between px-2 text-[10px] font-bold text-slate-400">
            {defectTrendData.map((d) => (
              <span key={d.date}>{d.date}</span>
            ))}
          </div>
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
            {actionStatus.pending > 0 && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-error/10 text-error text-[11px] font-bold rounded-full">
                <Icon name="warning" className="text-xs" />
                미처리 {actionStatus.pending}건
              </span>
            )}
          </div>

          {/* 전체 진행률 바 */}
          <div className="mb-6">
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
              <span>전체 조치율</span>
              <span className="text-primary">{Math.round((actionStatus.resolved / actionStatus.total) * 100)}%</span>
            </div>
            <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden flex">
              <div
                className="h-full bg-primary rounded-l-full transition-all"
                style={{ width: `${(actionStatus.resolved / actionStatus.total) * 100}%` }}
              />
              <div
                className="h-full bg-blue-300"
                style={{ width: `${(actionStatus.inProgress / actionStatus.total) * 100}%` }}
              />
            </div>
            <div className="flex gap-4 mt-2 text-[10px] font-bold text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary inline-block" />조치 완료</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-300 inline-block" />조치 중</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-surface-container-high inline-block" />미처리</span>
            </div>
          </div>

          {/* 3개 상태 카드 */}
          <div className="grid grid-cols-3 gap-4 mt-auto">
            <div className="bg-error/5 border border-error/20 rounded-xl p-4 text-center">
              <Icon name="report" className="text-error text-2xl mb-1" />
              <div className="font-headline text-2xl font-extrabold text-error">{actionStatus.pending}</div>
              <div className="text-[11px] font-bold text-error/70 mt-0.5">미처리</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <Icon name="engineering" className="text-blue-500 text-2xl mb-1" />
              <div className="font-headline text-2xl font-extrabold text-blue-600">{actionStatus.inProgress}</div>
              <div className="text-[11px] font-bold text-blue-400 mt-0.5">조치 중</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <Icon name="check_circle" className="text-green-600 text-2xl mb-1" />
              <div className="font-headline text-2xl font-extrabold text-green-600">{actionStatus.resolved}</div>
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
            {linePerformance.map((lp) => (
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
        <div>Last Updated: 2024.03.23 14:00</div>
      </footer>

      {/* ── Alert Toast ── */}
      {!showAlert && (
        <button
          onClick={() => setShowAlert(true)}
          className="fixed bottom-8 right-8 bg-error text-white px-4 py-2 rounded-lg shadow-lg text-sm font-bold hover:bg-red-700 transition-colors z-50"
        >
          <Icon name="warning" className="text-sm mr-1 align-middle" />
          알림 시연
        </button>
      )}

      {showAlert && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className="bg-primary-container px-6 py-4 rounded-xl shadow-[0px_12px_32px_rgba(2,36,72,0.25)] border border-white/10 flex items-center gap-4">
            <span className="w-3 h-3 bg-error rounded-full animate-pulse" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-on-primary-container uppercase tracking-widest">
                New Alert
              </span>
              <p className="text-sm font-semibold text-on-primary-container">
                새로운 불량 감지: A라인 엔진 부품 — 지금 확인하기
              </p>
            </div>
            <button
              className="ml-4 p-1 hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setShowAlert(false)}
            >
              <Icon name="close" className="text-lg text-on-primary-container" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
