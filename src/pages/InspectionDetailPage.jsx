import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { API_BASE_URL, USE_MOCK_API } from "../api/config";
import { apiBlobRequest } from "../api/client";
import { completeInspectionAction, getInspection } from "../api/inspections";
import { inspectionResponseToDetail, inspectionResponseToHistoryRow } from "../adapters/inspections";
import { inspectionHistory, inspectionDetails } from "../data/mockData";

export default function InspectionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [apiRecord, setApiRecord] = useState(null);
  const [apiError, setApiError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [imageSources, setImageSources] = useState({
    originalImageUrl: "",
    gradcamImageUrl: "",
    originalImage: "",
    gradcamImage: "",
  });

  useEffect(() => {
    if (USE_MOCK_API) return;

    let ignore = false;

    getInspection(id)
      .then((data) => {
        if (!ignore) {
          setApiRecord({
            inspection: inspectionResponseToHistoryRow(data),
            detail: inspectionResponseToDetail(data),
          });
        }
      })
      .catch((err) => {
        if (!ignore) setApiError(err.message);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  const mockInspection = USE_MOCK_API ? inspectionHistory.find((i) => i.id === parseInt(id)) : null;
  const mockDetail = USE_MOCK_API ? inspectionDetails[parseInt(id)] : null;
  const inspection = apiRecord?.inspection || mockInspection;
  const detail = apiRecord?.detail || mockDetail;
  const originalImage = detail?.originalImage || "";
  const gradcamImage = detail?.gradcamImage || "";
  const originalImageNeedsApiHeaders = shouldLoadWithApiHeaders(originalImage);
  const gradcamImageNeedsApiHeaders = shouldLoadWithApiHeaders(gradcamImage);
  const displayedOriginalImage =
    imageSources.originalImageUrl === originalImage
      ? imageSources.originalImage
      : originalImageNeedsApiHeaders
        ? ""
        : originalImage;
  const displayedGradcamImage =
    imageSources.gradcamImageUrl === gradcamImage
      ? imageSources.gradcamImage
      : gradcamImageNeedsApiHeaders
        ? ""
        : gradcamImage;

  useEffect(() => {
    if (!originalImageNeedsApiHeaders && !gradcamImageNeedsApiHeaders) {
      return undefined;
    }

    let ignore = false;
    const objectUrls = [];

    async function resolveImageSource(url, shouldLoad) {
      if (!shouldLoad) return url;

      const blob = await apiBlobRequest(url);
      const objectUrl = URL.createObjectURL(blob);
      objectUrls.push(objectUrl);
      return objectUrl;
    }

    Promise.all([
      resolveImageSource(originalImage, originalImageNeedsApiHeaders),
      resolveImageSource(gradcamImage, gradcamImageNeedsApiHeaders),
    ])
      .then(([nextOriginalImage, nextGradcamImage]) => {
        if (ignore) {
          [nextOriginalImage, nextGradcamImage].forEach((url) => {
            if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
          });
          return;
        }

        setImageSources({
          originalImageUrl: originalImage,
          gradcamImageUrl: gradcamImage,
          originalImage: nextOriginalImage,
          gradcamImage: nextGradcamImage,
        });
      })
      .catch(() => undefined);

    return () => {
      ignore = true;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [originalImage, gradcamImage, originalImageNeedsApiHeaders, gradcamImageNeedsApiHeaders]);

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

  const isDefect =
    inspection.status === "defect" ||
    inspection.status === "resolved" ||
    inspection.actionStatus === "UNRESOLVED" ||
    inspection.actionStatus === "RESOLVED";
  const isResolved = (confirmed || inspection.actionStatus === "RESOLVED" || inspection.status === "resolved") && !cancelled;
  const effectivelyDefect = isDefect && !isResolved;
  const resultText = isDefect || isResolved ? "불량 감지" : "이상 없음";

  const handleCompleteAction = async () => {
    if (USE_MOCK_API) {
      setConfirmed(true);
      return;
    }

    setActionLoading(true);
    try {
      await completeInspectionAction(id);
      setApiRecord((prev) =>
        prev
          ? {
              ...prev,
              inspection: {
                ...prev.inspection,
                actionStatus: "RESOLVED",
              },
            }
          : prev
      );
      setConfirmed(true);
      setCancelled(false);
      setApiError("");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-3xl md:max-w-[1600px] mx-auto space-y-4 md:space-y-6">
      {apiError && (
        <div className="rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm font-medium text-error">
          {apiError}
        </div>
      )}

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
            {displayedOriginalImage && (
              <img
                src={displayedOriginalImage}
                alt="원본 부품 캡처 이미지"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Grad-CAM 분석 */}
        <div className="relative">
          <div className="absolute top-3 left-3 z-10 bg-primary/80 backdrop-blur-md px-3 py-1 rounded-full">
            <span className="text-[10px] font-bold text-white tracking-widest uppercase">Grad-CAM 분석</span>
          </div>
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-surface-container-high relative">
              {displayedGradcamImage && (
                <img
                  src={displayedGradcamImage}
                  alt="Grad-CAM 분석 이미지"
                  className="w-full h-full object-cover"
                />
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
              {resultText}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 ${
            effectivelyDefect ? "bg-error-container text-on-error-container" : isResolved ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
          }`}>
            <Icon name={effectivelyDefect ? "warning" : "check_circle"} className="text-sm" />
            {effectivelyDefect ? "Critical" : isResolved ? "Resolved" : "Normal"}
          </div>
        </div>

      </div>

      {/* ── 메타데이터 ── */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Technical Metadata</h3>
        <div className="bg-surface-container-low rounded-xl overflow-hidden">
          {[
            { label: "부품 ID",    value: inspection.partId },
            { label: "라인",       value: detail.line },
            { label: "교대조",     value: detail.shift },
            { label: "근무자 이름", value: detail.workerName },
            { label: "캡처 시각",  value: inspection.date },
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
              disabled={actionLoading || confirmed || isResolved}
              className={`w-full md:w-auto flex-1 md:flex-none py-4 px-8 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                actionLoading || confirmed || isResolved
                  ? "bg-blue-100 text-blue-700 border-2 border-blue-300 cursor-default"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
              onClick={handleCompleteAction}
            >
              <Icon name={confirmed || isResolved ? "check_circle" : "task_alt"} />
              {actionLoading ? "처리 중" : confirmed || isResolved ? "조치완료됨" : "조치완료"}
            </button>
            {USE_MOCK_API && (confirmed || isResolved) && (
              <button
                className="w-full md:w-auto border-2 border-outline-variant text-on-surface-variant py-4 px-8 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-surface-container transition-all active:scale-95"
                onClick={() => {
                  setConfirmed(false);
                  setCancelled(inspection.status === "resolved" || inspection.actionStatus === "RESOLVED");
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

function shouldLoadWithApiHeaders(url) {
  if (!url || !/^https?:\/\//.test(url)) return false;

  try {
    return new URL(url).origin === new URL(API_BASE_URL).origin;
  } catch {
    return false;
  }
}
