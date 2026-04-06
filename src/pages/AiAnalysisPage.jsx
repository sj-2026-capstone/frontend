import Icon from "../components/Icon";
import {
  analysisPatterns,
  analysisRecommendations,
} from "../data/mockData";

export default function AiAnalysisPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* 1. CTA Hero Card */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#022448] to-[#1E3A5F] p-10 text-white shadow-2xl">
        {/* Decorative */}
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <span className="material-symbols-outlined text-[240px]">auto_awesome</span>
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/5">
            <Icon name="bolt" className="text-sm text-secondary-fixed-dim" fill />
            <span className="text-[10px] font-bold tracking-widest uppercase">
              Autonomous Intelligence
            </span>
          </div>
          <h2 className="text-4xl font-extrabold font-headline mb-4 tracking-tight">
            AI 자율 공정 분석
          </h2>
          <p className="text-lg text-blue-100/80 leading-relaxed mb-8 font-body">
            축적된 검사 데이터를 AI가 분석하여 불량 패턴을 발견하고 공정 개선안을 제시합니다. 실시간 생산 효율을 극대화하세요.
          </p>
          <div className="flex items-center gap-6">
            <button className="group flex items-center gap-3 px-8 py-4 bg-white text-primary font-bold rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all active:scale-95">
              <span>분석 시작</span>
              <Icon name="arrow_forward" className="transition-transform group-hover:translate-x-1" />
            </button>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-blue-200/60 flex items-center gap-1">
                <Icon name="info" className="text-[14px]" />
                최근 30일 데이터 기준
              </span>
              <span className="text-xs text-blue-200/60">분석 소요시간 약 1~2분</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Section Header */}
      <div className="flex items-baseline justify-between border-b border-outline-variant/20 pb-4">
        <h3 className="text-xl font-bold text-primary font-headline">분석 결과</h3>
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Icon name="schedule" className="text-sm" />
          <span>2026-03-23 14:00 기준</span>
        </div>
      </div>

      {/* 3. Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: 발견된 주요 패턴 */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-surface-container-highest rounded-lg">
              <Icon name="content_paste_search" className="text-primary" />
            </div>
            <h4 className="font-bold text-lg text-on-surface">발견된 주요 패턴</h4>
          </div>

          {analysisPatterns.map((pat, i) => (
            <div
              key={i}
              className={`group bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex border-l-4 ${pat.borderColor}`}
            >
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <h5 className="font-bold text-primary text-base">{pat.title}</h5>
                  <span
                    className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider ${pat.severityColor}`}
                  >
                    심각도: {pat.severity}
                  </span>
                </div>
                <p
                  className="text-sm text-slate-600 leading-relaxed font-body"
                  dangerouslySetInnerHTML={{ __html: pat.desc }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Right: 추천 조치 사항 */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-surface-container-highest rounded-lg">
              <Icon name="lightbulb" className="text-primary" />
            </div>
            <h4 className="font-bold text-lg text-on-surface">추천 조치 사항</h4>
          </div>

          {analysisRecommendations.map((rec) => (
            <div
              key={rec.num}
              className="relative bg-surface-container-lowest rounded-xl shadow-sm border-l-4 border-emerald-500 p-6 flex items-start gap-4"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                {rec.num}
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-primary text-base mb-2">{rec.title}</h5>
                <p className="text-sm text-slate-600 leading-relaxed">{rec.desc}</p>
              </div>
            </div>
          ))}

          {/* PDF Download */}
          <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/10 flex items-center justify-between">
            <span className="text-xs text-primary/70 font-medium">
              조치 사항을 PDF 리포트로 저장하시겠습니까?
            </span>
            <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
              <Icon name="download" className="text-sm" />
              리포트 다운로드
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
