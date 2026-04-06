import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { inspectionHistory } from "../data/mockData";

export default function InspectionHistoryPage() {
  const navigate = useNavigate();
  const [resultFilter, setResultFilter] = useState("전체");
  const [partFilter, setPartFilter] = useState("전체");

  const statusMap = { "불량": "defect", "정상": "normal", "조치 완료": "resolved" };
  const filtered = inspectionHistory.filter((row) => {
    if (resultFilter !== "전체") {
      if (row.status !== statusMap[resultFilter]) return false;
    }
    if (partFilter !== "전체" && row.part !== partFilter) return false;
    return true;
  });

  const handleReset = () => {
    setResultFilter("전체");
    setPartFilter("전체");
  };

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 items-end">
          {/* Date Range */}
          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-outline uppercase tracking-wider">
              검사 기간
            </label>
            <div className="relative">
              <input
                className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary transition-all"
                placeholder="시작일 ~ 종료일"
                type="text"
              />
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-outline text-sm">
                calendar_today
              </span>
            </div>
          </div>

          {/* Result Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-outline uppercase tracking-wider">
              판정 결과
            </label>
            <select
              className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary appearance-none transition-all"
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
            >
              <option>전체</option>
              <option>정상</option>
              <option>불량</option>
              <option>조치 완료</option>
            </select>
          </div>

          {/* Part Type Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-outline uppercase tracking-wider">
              부품 종류
            </label>
            <select
              className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary appearance-none transition-all"
              value={partFilter}
              onChange={(e) => setPartFilter(e.target.value)}
            >
              <option>전체</option>
              <option>도어</option>
              <option>범퍼</option>
              <option>헤드램프</option>
              <option>프레임</option>
              <option>카울커버</option>
              <option>라디에이터 그릴</option>
              <option>테일 램프</option>
              <option>휀더</option>
              <option>루프사이드</option>
              <option>배선</option>
              <option>커넥터</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="lg:col-span-2 flex gap-3">
            <button className="flex-grow bg-primary hover:bg-primary-container text-on-primary font-bold py-2.5 px-6 rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              <Icon name="search" className="text-sm" />
              조회
            </button>
            <button
              className="px-6 py-2.5 border border-outline-variant text-on-surface-variant font-medium rounded-lg hover:bg-surface-container-high transition-all active:scale-[0.98]"
              onClick={handleReset}
            >
              초기화
            </button>
          </div>
        </div>
      </section>

      {/* Data Table */}
      <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-low border-b border-surface-container-highest">
                <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">번호</th>
                <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">부품 ID</th>
                <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">검사일시</th>
                <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">부품 종류</th>
                <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">판정 결과</th>
                <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">담당자</th>
                <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider text-center">상세</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">{row.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">{row.partId}</td>
                  <td className="px-6 py-4 text-sm">{row.date}</td>
                  <td className="px-6 py-4 text-sm">{row.part}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        row.status === "defect"
                          ? "bg-error-container text-on-error-container"
                          : row.status === "resolved"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {row.status === "defect" ? "불량" : row.status === "resolved" ? "조치 완료" : "정상"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{row.inspector}</td>
                  <td className="px-6 py-4 text-center">
                    {(row.status === "defect" || row.status === "resolved") && (
                      <button
                        className="text-secondary font-bold text-xs hover:underline decoration-2 underline-offset-4"
                        onClick={() => navigate(`/inspection/${row.id}`)}
                      >
                        [상세보기]
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-surface-container">
          <div className="flex-grow flex justify-center order-2 md:order-1">
            <nav className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-all">
                <Icon name="chevron_left" className="text-sm" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-on-primary font-bold text-sm">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-sm font-medium">
                2
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-sm font-medium">
                3
              </button>
              <span className="px-2 text-outline">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-sm font-medium">
                12
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-all">
                <Icon name="chevron_right" className="text-sm" />
              </button>
            </nav>
          </div>
          <div className="text-sm font-medium text-outline order-1 md:order-2">
            총 <span className="text-on-surface font-bold">247</span>건
          </div>
        </div>
      </section>
    </div>
  );
}
