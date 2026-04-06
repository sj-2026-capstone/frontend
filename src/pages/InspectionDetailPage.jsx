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

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Source Info Header Bar */}
      <div className="bg-primary rounded-xl px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-6 text-white font-medium tracking-wide text-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">videocam</span>
            {detail.cam}
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div>{detail.line}</div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            {inspection.date}
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs text-white font-bold">
          <span className="w-2 h-2 rounded-full bg-blue-300 animate-pulse" />
          {detail.detectionMethod}
        </div>
      </div>

      {/* Image Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 원본 캡처 */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
          <div className="p-4 border-b border-surface-container flex justify-between items-center bg-surface-container-low/50">
            <h3 className="font-headline font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">photo_camera</span>
              원본 캡처
            </h3>
            <span className="bg-primary text-on-primary text-[10px] px-2 py-0.5 rounded-lg font-bold">
              {detail.cam}
            </span>
          </div>
          <div className="relative aspect-video bg-surface-container">
            <img
              src={detail.originalImage}
              alt="원본 부품 캡처 이미지"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Grad-CAM 분석 */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
          <div className="p-4 border-b border-surface-container flex justify-between items-center bg-surface-container-low/50">
            <h3 className="font-headline font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-xl">analytics</span>
              Grad-CAM 분석
            </h3>
            <div className="flex gap-2">
              <span className="bg-blue-100 text-primary text-[10px] px-2 py-0.5 rounded-lg font-bold">
                AI 분석 활성
              </span>
            </div>
          </div>
          <div className="relative aspect-video bg-surface-container">
            <img
              src={detail.gradcamImage}
              alt="Grad-CAM 분석 이미지"
              className="w-full h-full object-cover"
            />
            {(effectivelyDefect || isResolved) && (
              <>
                {/* Heatmap Overlay */}
                <div className="absolute inset-0 heatmap-overlay mix-blend-multiply opacity-80" />
                {/* Defect Marker */}
                <div className="absolute top-[45%] left-[60%] -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="absolute inset-0 w-24 h-24 border-2 border-white/50 rounded-full animate-ping" />
                    <div className="w-12 h-12 border-4 border-white rounded-full flex items-center justify-center">
                      <span className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded shadow-lg text-xs font-bold text-error whitespace-nowrap border border-white/50">
                      결함 검출 영역
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Result Summary */}
      <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          {/* Status Badge */}
          <div className="flex flex-col items-center justify-center text-center">
            <div
              className={`w-32 h-32 rounded-full flex items-center justify-center mb-4 shadow-xl ${
                effectivelyDefect
                  ? "bg-error shadow-error/30"
                  : isResolved
                  ? "bg-blue-600 shadow-blue-600/30"
                  : "bg-green-600 shadow-green-600/30"
              }`}
            >
              {isResolved ? (
                <span className="font-headline text-2xl font-extrabold text-white text-center leading-tight">
                  조치<br />완료
                </span>
              ) : (
                <span className="font-headline text-3xl font-extrabold text-white">
                  {effectivelyDefect ? "불량" : "정상"}
                </span>
              )}
            </div>
            <div className={`font-bold text-lg ${effectivelyDefect ? "text-error" : isResolved ? "text-blue-600" : "text-green-600"}`}>
              {effectivelyDefect ? "Defect Detected" : isResolved ? "Action Completed" : "No Defect Found"}
            </div>
          </div>

          {/* Details Column 1 */}
          <div className="space-y-6">
            {/* Confidence */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-on-surface-variant text-sm font-medium">신뢰도</span>
                <span className="text-primary font-bold">{inspection.confidence}%</span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${inspection.confidence}%` }}
                />
              </div>
            </div>
            {/* Defect Type */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-surface-container border border-surface-container-highest rounded-lg">
                <span className="material-symbols-outlined text-on-surface-variant">
                  {effectivelyDefect ? "report_problem" : "check_circle"}
                </span>
              </div>
              <div>
                <div className="text-xs text-on-surface-variant font-medium">불량 유형</div>
                <div className="font-headline font-bold text-on-surface">
                  {effectivelyDefect ? detail.defectType : "해당 없음"}
                </div>
              </div>
            </div>
          </div>

          {/* Details Column 2 */}
          <div className="hidden md:block space-y-6 border-l border-surface-container pl-12">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-surface-container border border-surface-container-highest rounded-lg">
                <span className="material-symbols-outlined text-on-surface-variant">sensors</span>
              </div>
              <div>
                <div className="text-xs text-on-surface-variant font-medium">감지 카메라</div>
                <div className="font-bold text-on-surface">{detail.cam} | {detail.line}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-surface-container border border-surface-container-highest rounded-lg">
                <span className="material-symbols-outlined text-on-surface-variant">schedule</span>
              </div>
              <div>
                <div className="text-xs text-on-surface-variant font-medium">캡처 시각</div>
                <div className="font-bold text-on-surface">{inspection.date}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 pb-4">
        <button
          className="px-8 py-4 bg-primary text-on-primary rounded-xl font-bold flex items-center gap-2 hover:bg-primary-container transition-all active:scale-95 shadow-lg shadow-primary/10"
          onClick={() => navigate("/monitoring")}
        >
          <Icon name="arrow_back" />
          모니터링으로 돌아가기
        </button>
        <button
          className="px-8 py-4 border-2 border-primary text-primary bg-surface-container-lowest rounded-xl font-bold flex items-center gap-2 hover:bg-surface-container transition-all active:scale-95"
          onClick={() => navigate("/history")}
        >
          <Icon name="manage_search" />
          검사 이력 보기
        </button>
        {(effectivelyDefect || isResolved) && (
          <>
            <button
              disabled={confirmed || isResolved}
              className={`px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg ${
                confirmed || isResolved
                  ? "bg-blue-100 text-blue-700 border-2 border-blue-300 cursor-default"
                  : "bg-green-600 text-white hover:bg-green-700 shadow-green-600/20"
              }`}
              onClick={() => setConfirmed(true)}
            >
              <Icon name={confirmed || isResolved ? "check_circle" : "task_alt"} />
              {confirmed || isResolved ? "조치완료됨" : "조치완료"}
            </button>
            {(confirmed || isResolved) && (
              <button
                className="px-8 py-4 border-2 border-outline-variant text-on-surface-variant bg-surface-container-lowest rounded-xl font-bold flex items-center gap-2 hover:bg-surface-container transition-all active:scale-95"
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
      </div>
    </div>
  );
}
