import { useEffect, useMemo, useState } from "react";
import Icon from "../components/Icon";

const analysisPatterns = [
  {
    title: "야간 교대조 A라인 불량 집중",
    severity: "높음",
    severityClass: "bg-error/10 text-error border-error/20",
    metric: "3.2배",
    desc: "22:00~02:00 구간의 도어 패널 검사에서 불량 감지 빈도가 주간 평균 대비 크게 증가했습니다.",
    signal: "야간 조명 편차, 작업자 피로도, 카메라 노출값이 함께 영향을 준 것으로 추정됩니다.",
  },
  {
    title: "월요일 오전 A라인 불량률 상승",
    severity: "주의",
    severityClass: "bg-amber-50 text-amber-700 border-amber-200",
    metric: "1.8배",
    desc: "매주 월요일 08:00~12:00 사이 A라인에서 표면 스크래치와 정렬 편차가 반복적으로 증가했습니다.",
    signal: "주말 이후 장비 워밍업과 첫 생산 배치 검수 절차를 함께 점검해야 합니다.",
  },
  {
    title: "C라인 감지 편차 완만한 증가",
    severity: "관찰",
    severityClass: "bg-slate-100 text-slate-600 border-slate-200",
    metric: "15%",
    desc: "최근 2주간 C라인 프레임 검사에서 정상/불량 경계값 근처의 판정 편차가 점진적으로 늘었습니다.",
    signal: "센서 보정 주기와 카메라 렌즈 오염 가능성을 확인하는 것이 좋습니다.",
  },
];

const analysisRecommendations = [
  {
    num: 1,
    title: "야간 A라인 작업 환경 점검",
    desc: "조명 밝기, 카메라 노출값, 작업 동선을 재점검하고 00시 이후 집중도 저하 구간에 짧은 장비 재확인 절차를 추가하세요.",
  },
  {
    num: 2,
    title: "월요일 첫 생산 전 사전 점검",
    desc: "월요일 첫 1시간 동안 시험 생산 샘플을 우선 검수하고, 주말 이후 장비 온도와 고정 지그 상태를 기록하세요.",
  },
  {
    num: 3,
    title: "C라인 센서 및 렌즈 보정",
    desc: "C라인 검사 카메라의 렌즈 오염, 초점, 센서 보정값을 확인하고 경계 판정 샘플을 재학습 후보로 분류하세요.",
  },
];

const processingSteps = [
  "최근 7일 검사 이력 수집",
  "라인/교대조별 불량 상관관계 계산",
  "반복 패턴 신뢰도 검증",
  "추천 조치 우선순위 산정",
];

const progressByStep = [18, 43, 72, 100];

export default function AiAnalysisPage() {
  const [analysisState, setAnalysisState] = useState("idle");
  const [activeStep, setActiveStep] = useState(0);
  const [visiblePatterns, setVisiblePatterns] = useState(0);
  const [visibleRecommendations, setVisibleRecommendations] = useState(0);

  const isProcessing = analysisState === "processing";
  const hasResults = analysisState === "done";
  const progress = isProcessing ? progressByStep[activeStep] : hasResults ? 100 : 0;

  const lastUpdatedAt = useMemo(
    () =>
      new Intl.DateTimeFormat("ko-KR", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date()),
    []
  );

  useEffect(() => {
    if (!isProcessing) return undefined;

    const timers = [
      setTimeout(() => setActiveStep(1), 3700),
      setTimeout(() => setActiveStep(2), 7400),
      setTimeout(() => setActiveStep(3), 11100),
      setTimeout(() => {
        setAnalysisState("done");
        setVisiblePatterns(0);
        setVisibleRecommendations(0);
      }, 15000),
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [isProcessing]);

  useEffect(() => {
    if (!hasResults) return undefined;

    const timers = [
      ...analysisPatterns.map((_, index) =>
        setTimeout(() => setVisiblePatterns(index + 1), 200 + index * 220)
      ),
      ...analysisRecommendations.map((_, index) =>
        setTimeout(
          () => setVisibleRecommendations(index + 1),
          900 + index * 220
        )
      ),
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [hasResults]);

  const handleStart = () => {
    setAnalysisState("processing");
    setActiveStep(0);
    setVisiblePatterns(0);
    setVisibleRecommendations(0);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="relative overflow-hidden rounded-xl bg-[#071B2E] p-6 text-white shadow-xl md:p-7">
        <div className="absolute inset-0 opacity-70 analysis-grid" />
        <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-cyan-300/12 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 backdrop-blur-md">
              <Icon name="auto_awesome" className="text-sm text-cyan-200" fill />
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-50">
                AI Process Intelligence
              </span>
            </div>
            <h2 className="font-headline text-3xl font-extrabold tracking-tight md:text-4xl">
              AI 공정 분석
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-blue-100/80 md:text-base">
              최근 검사 데이터를 기반으로 반복 불량 패턴을 찾고, 현장에서 바로 실행할 수 있는 개선 조치를 도출합니다.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                className="group inline-flex w-full items-center justify-center gap-3 rounded-lg bg-white px-6 py-3 text-sm font-extrabold text-primary shadow-lg transition-all hover:bg-cyan-50 hover:shadow-xl active:scale-95 disabled:cursor-wait disabled:bg-white/70 sm:w-auto"
                disabled={isProcessing}
                onClick={handleStart}
                type="button"
              >
                <Icon
                  name={isProcessing ? "sync" : hasResults ? "refresh" : "play_arrow"}
                  className={isProcessing ? "animate-spin" : "transition-transform group-hover:translate-x-0.5"}
                  fill={!isProcessing}
                />
                <span>{isProcessing ? "분석 중" : hasResults ? "다시 분석" : "분석 시작"}</span>
              </button>

              <div className="text-xs font-bold text-blue-100/60">
                최근 7일 데이터 기준 · 예상 소요 15초
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/20 p-4 backdrop-blur-md">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-cyan-100/70">
                Analysis Core
              </span>
              <span className="rounded bg-cyan-200/10 px-2 py-1 text-[10px] font-black text-cyan-100">
                {progress}%
              </span>
            </div>

            <div className="relative mb-4 flex h-28 items-center justify-center overflow-hidden rounded-lg border border-cyan-100/10 bg-[#04101E]">
              {hasResults ? (
                <Icon name="task_alt" className="relative z-10 text-5xl text-emerald-300" fill />
              ) : (
                <div className={`analysis-buffer ${isProcessing ? "analysis-buffer--active" : ""}`} aria-hidden="true">
                  {Array.from({ length: 12 }, (_, index) => (
                    <span key={index} style={{ "--buffer-index": index }} />
                  ))}
                </div>
              )}
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-200 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-4 space-y-2">
              {processingSteps.map((step, index) => (
                <div
                  key={step}
                  className={`flex items-center gap-2 text-xs font-bold transition-colors ${
                    index <= activeStep || hasResults ? "text-cyan-50" : "text-white/35"
                  }`}
                >
                  <Icon
                    name={index < activeStep || hasResults ? "check_circle" : index === activeStep ? "radio_button_checked" : "radio_button_unchecked"}
                    className={`text-sm ${index === activeStep && isProcessing ? "animate-pulse text-amber-200" : ""}`}
                    fill={index <= activeStep || hasResults}
                  />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3 border-b border-outline-variant/30 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="font-headline text-xl font-extrabold text-primary">분석 결과</h3>
          <p className="mt-1 text-sm text-slate-500">
            버튼을 누르면 패턴과 조치 사항이 순차적으로 생성됩니다.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Icon name="schedule" className="text-sm" />
          <span>{hasResults ? `${lastUpdatedAt} 완료` : "대기 중"}</span>
        </div>
      </div>

      {!hasResults && !isProcessing && (
        <section className="rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/5 text-primary">
            <Icon name="query_stats" className="text-3xl" />
          </div>
          <h4 className="mt-4 font-headline text-lg font-extrabold text-primary">
            분석을 시작할 준비가 되었습니다
          </h4>
          <p className="mt-2 text-sm text-slate-500">
            시작 버튼을 누르면 프로토타입 시연용 분석 진행 화면이 표시됩니다.
          </p>
        </section>
      )}

      {isProcessing && (
        <section className="grid gap-4 lg:grid-cols-3">
          {analysisPatterns.map((pattern, index) => (
            <div
              key={pattern.title}
              className="min-h-40 rounded-xl border border-surface-container-high bg-surface-container-lowest p-5 shadow-sm"
            >
              <div className="mb-4 h-3 w-24 animate-pulse rounded bg-surface-container-high" />
              <div className="mb-3 h-5 w-4/5 animate-pulse rounded bg-surface-container-high" />
              <div className="space-y-2">
                <div className="h-3 animate-pulse rounded bg-surface-container" />
                <div className="h-3 w-11/12 animate-pulse rounded bg-surface-container" />
                <div className="h-3 w-8/12 animate-pulse rounded bg-surface-container" />
              </div>
              <div className="mt-5 text-xs font-bold text-slate-400">
                후보 패턴 {index + 1} 분석 중
              </div>
            </div>
          ))}
        </section>
      )}

      {hasResults && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <section className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-surface-container-highest p-2 text-primary">
                <Icon name="content_paste_search" />
              </div>
              <h4 className="text-lg font-extrabold text-on-surface">발견된 주요 패턴</h4>
            </div>

            {analysisPatterns.map((pattern, index) => (
              <article
                key={pattern.title}
                className={`rounded-xl border bg-surface-container-lowest p-6 shadow-sm transition-all duration-300 ${
                  index < visiblePatterns
                    ? "translate-y-0 opacity-100"
                    : "translate-y-5 opacity-0"
                }`}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h5 className="font-headline text-base font-extrabold text-primary">
                      {pattern.title}
                    </h5>
                    <div className="mt-2 text-3xl font-black tracking-tight text-on-surface">
                      {pattern.metric}
                    </div>
                  </div>
                  <span className={`rounded border px-2 py-1 text-[10px] font-black uppercase tracking-wider ${pattern.severityClass}`}>
                    위험도 {pattern.severity}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">{pattern.desc}</p>
                <div className="mt-4 rounded-lg bg-surface-container-low px-4 py-3 text-xs font-bold leading-relaxed text-on-surface-variant">
                  {pattern.signal}
                </div>
              </article>
            ))}
          </section>

          <section className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-surface-container-highest p-2 text-primary">
                <Icon name="lightbulb" />
              </div>
              <h4 className="text-lg font-extrabold text-on-surface">추천 조치 사항</h4>
            </div>

            {analysisRecommendations.map((recommendation, index) => (
              <article
                key={recommendation.num}
                className={`relative overflow-hidden rounded-xl border border-emerald-100 bg-surface-container-lowest p-6 shadow-sm transition-all duration-300 ${
                  index < visibleRecommendations
                    ? "translate-x-0 opacity-100"
                    : "translate-x-5 opacity-0"
                }`}
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-emerald-400" />
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-black text-emerald-700">
                    {recommendation.num}
                  </div>
                  <div>
                    <h5 className="font-headline text-base font-extrabold text-primary">
                      {recommendation.title}
                    </h5>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {recommendation.desc}
                    </p>
                  </div>
                </div>
              </article>
            ))}

            <div
              className={`mt-2 flex items-center justify-between rounded-lg border border-primary/10 bg-primary/5 p-4 transition-all duration-300 ${
                visibleRecommendations === analysisRecommendations.length
                  ? "translate-y-0 opacity-100"
                  : "translate-y-3 opacity-0"
              }`}
            >
              <span className="text-xs font-bold text-primary/70">
                조치 사항을 PDF 리포트로 저장할 수 있습니다.
              </span>
              <button
                className="flex items-center gap-1 rounded px-2 py-1 text-xs font-black text-primary transition-colors hover:bg-white"
                type="button"
              >
                <Icon name="download" className="text-sm" />
                리포트 다운로드
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
