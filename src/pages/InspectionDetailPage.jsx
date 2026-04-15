import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { inspectionHistory, inspectionDetails } from "../data/mockData";

export default function InspectionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const inspection = inspectionHistory.find((i) => i.id === parseInt(id));
  const detail = inspectionDetails[parseInt(id)];

  if (!inspection || !detail) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-on-surface-variant">
        <Icon name="search_off" className="text-5xl text-outline" />
        <p className="font-headline font-bold text-lg">검사 데이터를 찾을 수 없습니다.</p>
        <button
          className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary-container transition-all"
          onClick={() => navigate("/history")}
        >
          검사 이력으로 돌아가기
        </button>
      </div>
    );
  }

  const isDefect = inspection.status === "defect";
  const isResolved = inspection.status === "resolved" && !cancelled;
  const effectivelyDefect = isDefect || (inspection.status === "resolved" && cancelled);

  const statusColor = effectivelyDefect ? "error" : isResolved ? "blue-600" : "green-600";

  return (
    <div className="max-w-3xl md:max-w-[1600px] mx-auto space-y-4 md:space-y-6">

      {/* ── 소스 정보 배너 ── */}
      <div className="bg-surface-container-low rounded-xl px-4 py-3 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Device Identity</span>
          <div className="flex items-center gap-2 text-[#1E3A5F] font-bold">
            <span>{detail.cam}</span>
            <span className="w-1 h-1 bg-outline-variant rounded-full" />
            <span>{detail.line}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Timestamp</span>
          <div className="text-sm font-medium text-on-surface">{inspection.date}</div>
        </div>
      </div>

      {/* ── 이미지 비교 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        {/* 원본 캡처 */}
        <div className="relative">
          <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full">
            <span className="text-[10px] font-bold text-white tracking-widest uppercase">원본 캡처</span>
          </div>
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-surface-container-high">
            <img
              src={detail.originalImage}
              alt="원본 부품 캡처 이미지"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Grad-CAM 분석 */}
        <div className="relative">
          <div className="absolute top-3 left-3 z-10 bg-primary/80 backdrop-blur-md px-3 py-1 rounded-full">
            <span className="text-[10px] font-bold text-white tracking-widest uppercase">Grad-CAM 분석</span>
          </div>
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-surface-container-high relative">
              <img
                src={detail.gradcamImage}
                alt="Grad-CAM 분석 이미지"
                className="w-full h-full object-cover"
              />
              {(effectivelyDefect || isResolved) && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-tr from-error/40 via-secondary-container/20 to-transparent pointer-events-none" />
                  <div className="absolute top-[45%] left-[60%] -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className="absolute inset-0 w-24 h-24 border-2 border-white/50 rounded-full animate-ping" />
                      <div className="w-12 h-12 border-4 border-white rounded-full flex items-center justify-center">
                        <span className="w-2 h-2 bg-white rounded-full" />
                      </div>
                      <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded shadow-lg text-xs font-bold text-error whitespace-nowrap">
                        결함 검출 영역
                      </div>
                    </div>
                  </div>
                </>
              )}
          </div>
        </div>
      </div>

      {/* ── 결과 카드 ── */}
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className={`text-[10px] font-black uppercase tracking-widest mb-1 block ${effectivelyDefect ? "text-error" : isResolved ? "text-blue-600" : "text-green-600"}`}>
              Inspection Status
            </span>
            <h2 className={`text-3xl font-extrabold ${effectivelyDefect ? "text-error" : isResolved ? "text-blue-600" : "text-green-600"}`}>
              {isResolved ? "조치완료" : effectivelyDefect ? "불량" : "정상"}
            </h2>
            <p className="text-lg font-bold text-on-surface mt-1">
              {effectivelyDefect ? detail.defectType : isResolved ? detail.defectType : "이상 없음"}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 ${
            effectivelyDefect ? "bg-error-container text-on-error-container" : isResolved ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
          }`}>
            <Icon name={effectivelyDefect ? "warning" : "check_circle"} className="text-sm" />
            {effectivelyDefect ? "Critical" : isResolved ? "Resolved" : "Normal"}
          </div>
        </div>

        {/* 신뢰도 바 */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">AI Confidence</span>
            <span className="text-2xl font-black text-[#022448]">{inspection.confidence}%</span>
          </div>
          <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${effectivelyDefect ? "bg-gradient-to-r from-error to-secondary-container" : "bg-primary"}`}
              style={{ width: `${inspection.confidence}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── 메타데이터 ── */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Technical Metadata</h3>
        <div className="bg-surface-container-low rounded-xl overflow-hidden">
          {[
            { label: "부품 ID",    value: inspection.partId },
            { label: "부품 종류",  value: inspection.part },
            { label: "감지 카메라", value: detail.cam },
            { label: "라인",       value: detail.line },
            { label: "캡처 시각",  value: inspection.date },
            { label: "불량 유형",  value: effectivelyDefect ? detail.defectType : "해당 없음" },
          ].map((item, i) => (
            <div
              key={item.label}
              className={`px-5 py-4 flex justify-between items-center ${i % 2 === 0 ? "bg-white/40" : ""}`}
            >
              <span className="text-sm font-medium text-on-surface-variant">{item.label}</span>
              <span className="text-sm font-bold text-[#022448]">{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 액션 버튼 ── */}
      <section className="flex flex-col md:flex-row flex-wrap gap-3 pt-4">
        <button
          className="w-full md:w-auto flex-1 md:flex-none bg-[#1E3A5F] text-white py-4 px-8 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform hover:bg-primary-container"
          onClick={() => navigate("/monitoring")}
        >
          <Icon name="analytics" />
          모니터링으로 돌아가기
        </button>
        <button
          className="w-full md:w-auto flex-1 md:flex-none border-2 border-outline-variant text-[#022448] py-4 px-8 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform hover:bg-surface-container"
          onClick={() => navigate("/history")}
        >
          <Icon name="history" />
          검사 이력 보기
        </button>
        {(effectivelyDefect || isResolved) && (
          <>
            <button
              disabled={confirmed || isResolved}
              className={`w-full md:w-auto flex-1 md:flex-none py-4 px-8 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                confirmed || isResolved
                  ? "bg-blue-100 text-blue-700 border-2 border-blue-300 cursor-default"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
              onClick={() => setConfirmed(true)}
            >
              <Icon name={confirmed || isResolved ? "check_circle" : "task_alt"} />
              {confirmed || isResolved ? "조치완료됨" : "조치완료"}
            </button>
            {(confirmed || isResolved) && (
              <button
                className="w-full md:w-auto border-2 border-outline-variant text-on-surface-variant py-4 px-8 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-surface-container transition-all active:scale-95"
                onClick={() => {
                  if (isResolved) setCancelled(true);
                  else setConfirmed(false);
                }}
              >
                <Icon name="cancel" />
                취소
              </button>
            )}
          </>
        )}
      </section>
    </div>
  );
}
