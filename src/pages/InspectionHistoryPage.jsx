import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { USE_MOCK_API } from "../api/config";
import { getInspections } from "../api/inspections";
import { getLines } from "../api/lines";
import { inspectionPageResponseToHistoryPage } from "../adapters/inspections";
import { inspectionHistory } from "../data/mockData";

const PAGE_SIZE = 20;

const STATUS_OPTIONS = [
  { value: "", label: "전체" },
  { value: "PENDING", label: "대기" },
  { value: "PROCESSING", label: "분석중" },
  { value: "DONE", label: "완료" },
  { value: "FAILED", label: "실패" },
];

export default function InspectionHistoryPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState(() => (USE_MOCK_API ? inspectionHistory : []));
  const [lineOptions, setLineOptions] = useState([]);
  const [filters, setFilters] = useState({ lineId: "", status: "" });
  const [page, setPage] = useState({
    number: 0,
    size: PAGE_SIZE,
    totalElements: USE_MOCK_API ? inspectionHistory.length : 0,
    totalPages: USE_MOCK_API ? Math.max(1, Math.ceil(inspectionHistory.length / PAGE_SIZE)) : 1,
  });
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (USE_MOCK_API) return;

    let ignore = false;

    getLines()
      .then((data) => {
        if (!ignore) setLineOptions(lineResponseToOptions(data));
      })
      .catch(() => {
        if (!ignore) setLineOptions([]);
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (USE_MOCK_API) return;

    let ignore = false;
    const params = {
      page: page.number,
      size: page.size,
      lineId: filters.lineId,
      status: filters.status,
    };

    getInspections(params)
      .then((data) => {
        if (ignore) return;

        const nextPage = inspectionPageResponseToHistoryPage(data, {
          number: page.number,
          size: page.size,
        });
        setRows(nextPage.rows);
        setPage(nextPage.page);
        setApiError("");
      })
      .catch((err) => {
        if (!ignore) {
          setRows([]);
          setApiError(err.message);
        }
      });

    return () => {
      ignore = true;
    };
  }, [filters.lineId, filters.status, page.number, page.size]);

  const paginationItems = getPaginationItems(page.number, page.totalPages);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage((prev) => ({ ...prev, number: 0 }));
  };

  const goToPage = (nextPage) => {
    const boundedPage = Math.min(Math.max(nextPage, 0), page.totalPages - 1);
    if (boundedPage === page.number) return;
    setPage((prev) => ({ ...prev, number: boundedPage }));
  };

  const handleReset = () => {
    setFilters({ lineId: "", status: "" });
    setPage((prev) => ({ ...prev, number: 0 }));
  };

  return (
    <div className="space-y-6">
      {apiError && (
        <div className="rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm font-medium text-error">
          {apiError}
        </div>
      )}

      <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-xs font-bold text-outline uppercase tracking-wider">
              라인
            </label>
            <select
              className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary transition-all"
              value={filters.lineId}
              onChange={(e) => updateFilter("lineId", e.target.value)}
            >
              <option value="">전체</option>
              {lineOptions.map((line) => (
                <option key={line.value} value={line.value}>
                  {line.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-outline uppercase tracking-wider">
              검사 상태
            </label>
            <select
              className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary transition-all"
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-4 flex gap-3">
            <button
              className="px-6 py-2.5 border border-outline-variant text-on-surface-variant font-medium rounded-lg hover:bg-surface-container-high transition-all active:scale-[0.98]"
              onClick={handleReset}
            >
              초기화
            </button>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-low border-b border-surface-container-highest">
                <th className="hidden md:table-cell px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">검사 번호</th>
                <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">검사 ID</th>
                <th className="hidden md:table-cell px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">검사 시각</th>
                <th className="hidden md:table-cell px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">라인</th>
                <th className="hidden md:table-cell px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">결과</th>
                <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">조치 유무</th>
                <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider text-center">상세</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="hidden md:table-cell px-6 py-4 text-sm font-medium text-on-surface-variant">{row.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">{row.partId}</td>
                  <td className="hidden md:table-cell px-6 py-4 text-sm">{formatDate(row.date)}</td>
                  <td className="hidden md:table-cell px-6 py-4 text-sm">{row.line}</td>
                  <td className="hidden md:table-cell px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${resultClassName(row.status)}`}>
                      {resultLabel(row.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {actionStatusLabel(row.actionStatus || row.status) && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${actionStatusClassName(row.actionStatus || row.status)}`}>
                        {actionStatusLabel(row.actionStatus || row.status)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      className="text-secondary font-bold text-xs hover:underline decoration-2 underline-offset-4"
                      onClick={() => navigate(`/inspection/${row.id}`)}
                    >
                      상세보기
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="px-6 py-10 text-center text-sm text-outline" colSpan={7}>
                    조회된 검사 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-surface-container">
          <div className="flex-grow flex justify-center order-2 md:order-1">
            <nav className="flex items-center gap-1">
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-all disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => goToPage(page.number - 1)}
                disabled={page.number === 0}
              >
                <Icon name="chevron_left" className="text-sm" />
              </button>
              {paginationItems.map((item, index) =>
                item === "ellipsis" ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-outline">
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm ${
                      item === page.number
                        ? "bg-primary text-on-primary font-bold"
                        : "hover:bg-surface-container-high font-medium"
                    }`}
                    onClick={() => goToPage(item)}
                  >
                    {item + 1}
                  </button>
                )
              )}
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-all disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => goToPage(page.number + 1)}
                disabled={page.number >= page.totalPages - 1}
              >
                <Icon name="chevron_right" className="text-sm" />
              </button>
            </nav>
          </div>
          <div className="text-sm font-medium text-outline order-1 md:order-2">
            총 <span className="text-on-surface font-bold">{page.totalElements.toLocaleString()}</span>건
          </div>
        </div>
      </section>
    </div>
  );
}

function lineResponseToOptions(response) {
  const items = Array.isArray(response)
    ? response
    : response?.content || response?.items || response?.lines || response?.data || [];

  return items
    .map((line) => {
      const value = line.lineId ?? line.id ?? line.lineCode ?? line.code;
      if (value === undefined || value === null || value === "") return null;
      return {
        value: String(value),
        label: line.lineName || line.name || line.lineCode || `Line ${value}`,
      };
    })
    .filter(Boolean);
}

function resultLabel(status) {
  if (status === "defect" || status === "resolved") return "불량";
  if (status === "normal") return "정상";
  return "-";
}

function resultClassName(status) {
  if (status === "defect" || status === "resolved") return "bg-error-container text-on-error-container";
  if (status === "normal") return "bg-green-100 text-green-700";
  return "bg-surface-container-high text-on-surface-variant";
}

function actionStatusLabel(actionStatus) {
  if (actionStatus === "UNRESOLVED" || actionStatus === "defect") return "미처리";
  if (actionStatus === "RESOLVED" || actionStatus === "resolved") return "조치완료";
  return "";
}

function actionStatusClassName(actionStatus) {
  return actionStatus === "UNRESOLVED" || actionStatus === "defect"
    ? "bg-error-container text-on-error-container"
    : "bg-blue-100 text-blue-700";
}

function formatDate(value) {
  if (!value || value === "-") return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getPaginationItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index);
  }

  const items = new Set([0, totalPages - 1, currentPage]);

  if (currentPage > 0) items.add(currentPage - 1);
  if (currentPage < totalPages - 1) items.add(currentPage + 1);

  const sorted = [...items].sort((a, b) => a - b);
  return sorted.flatMap((item, index) => {
    if (index === 0) return [item];
    return item - sorted[index - 1] > 1 ? ["ellipsis", item] : [item];
  });
}
