import { useState } from "react";
import Icon from "../components/Icon";
import { accountUsers } from "../data/mockData";

export default function AccountManagementPage() {
  const [showPanel, setShowPanel] = useState(false);
  const [users, setUsers] = useState(accountUsers);

  const activeCount = users.filter((u) => u.status === "active").length;
  const inactiveCount = users.filter((u) => u.status === "inactive").length;

  const toggleStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.userId === userId
          ? { ...u, status: u.status === "active" ? "inactive" : "active" }
          : u
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex items-center justify-between border-b-2 border-primary">
          <div>
            <p className="text-on-surface-variant text-sm font-medium mb-1">전체 계정</p>
            <h2 className="text-3xl font-extrabold text-primary font-headline">
              {users.length}<span className="text-lg font-medium ml-1">명</span>
            </h2>
          </div>
          <div className="w-12 h-12 bg-primary-container/10 rounded-lg flex items-center justify-center text-primary">
            <Icon name="group" className="text-3xl" />
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex items-center justify-between border-b-2 border-emerald-600">
          <div>
            <p className="text-on-surface-variant text-sm font-medium mb-1">활성 계정</p>
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-extrabold text-primary font-headline">
                {activeCount}<span className="text-lg font-medium ml-1">명</span>
              </h2>
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
            <Icon name="how_to_reg" className="text-3xl" />
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex items-center justify-between border-b-2 border-slate-400">
          <div>
            <p className="text-on-surface-variant text-sm font-medium mb-1">비활성 계정</p>
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-extrabold text-primary font-headline">
                {inactiveCount}<span className="text-lg font-medium ml-1">명</span>
              </h2>
              <span className="w-2.5 h-2.5 bg-slate-300 rounded-full" />
            </div>
          </div>
          <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
            <Icon name="person_off" className="text-3xl" />
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-surface-container-low p-4 rounded-xl flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[280px] relative">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-sm transition-all"
            placeholder="이름 또는 아이디 검색"
            type="text"
          />
        </div>
        <div className="flex gap-4">
          <select className="bg-surface-container-lowest border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-sm px-4 py-2.5 min-w-[120px]">
            <option>상태: 전체</option>
            <option>활성</option>
            <option>비활성</option>
          </select>
          <select className="bg-surface-container-lowest border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-sm px-4 py-2.5 min-w-[140px]">
            <option>역할: 전체</option>
            <option>현장 근로자</option>
            <option>관리자</option>
          </select>
        </div>
        <button
          className="bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all font-semibold text-sm"
          onClick={() => setShowPanel(true)}
        >
          <Icon name="person_add" className="text-sm" />
          새 계정 등록
        </button>
      </section>

      {/* Data Table */}
      <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-highest/30 border-b border-outline-variant">
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">이름</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">아이디</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">역할</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">상태</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">라인</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">교대조</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr
                  key={u.userId}
                  className={`hover:bg-slate-50 transition-colors ${
                    u.status === "inactive" ? "bg-slate-50/50" : ""
                  }`}
                >
                  <td
                    className={`px-6 py-4 font-semibold ${
                      u.status === "inactive" ? "text-slate-400 line-through" : "text-on-surface"
                    }`}
                  >
                    {u.name}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm ${
                      u.status === "inactive" ? "text-slate-400 line-through" : "text-on-surface-variant"
                    }`}
                  >
                    {u.userId}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {u.role === "admin" ? (
                      <span className="bg-primary text-white px-2 py-1 rounded text-xs font-bold">
                        관리자
                      </span>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          u.status === "inactive"
                            ? "bg-slate-200 text-slate-500"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        현장 근로자
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {u.status === "active" ? (
                      <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 flex items-center w-fit gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        활성
                      </span>
                    ) : (
                      <span className="bg-slate-200 text-slate-500 px-3 py-1 rounded-full text-xs font-bold border border-slate-300 flex items-center w-fit gap-1.5">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                        비활성
                      </span>
                    )}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm font-medium ${
                      u.status === "inactive" ? "text-slate-400" : "text-on-surface-variant"
                    }`}
                  >
                    {u.line}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {u.shift === "-" ? (
                      <span className="text-slate-400">-</span>
                    ) : (
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        u.shift === "주간"
                          ? u.status === "inactive" ? "bg-slate-100 text-slate-400" : "bg-amber-50 text-amber-700"
                          : u.status === "inactive" ? "bg-slate-100 text-slate-400" : "bg-indigo-50 text-indigo-700"
                      }`}>
                        {u.shift}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="text-primary hover:bg-primary/5 px-2 py-1 rounded text-xs font-bold">
                      편집
                    </button>
                    <button
                      className={`hover:bg-opacity-5 px-2 py-1 rounded text-xs font-bold ${
                        u.status === "active"
                          ? "text-error hover:bg-error/5"
                          : "text-primary hover:bg-primary/5"
                      }`}
                      onClick={() => toggleStatus(u.userId)}
                    >
                      {u.status === "active" ? "비활성화" : "활성화"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-t border-slate-100">
          <p className="text-xs text-on-surface-variant font-medium">
            전체 {users.length}명 중 1-{users.length} 표시
          </p>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-white transition-colors">
              <Icon name="chevron_left" className="text-sm" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-white font-bold text-xs">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-on-surface hover:bg-white transition-colors text-xs font-bold">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-white transition-colors">
              <Icon name="chevron_right" className="text-sm" />
            </button>
          </div>
        </div>
      </section>

      {/* Slide Panel: 새 계정 등록 */}
      {showPanel && (
        <div className="fixed inset-0 z-50 flex justify-end !mt-0 bg-black/30">
          <div className="w-[420px] bg-white h-full shadow-2xl flex flex-col animate-slide-in overflow-y-auto">
            {/* Panel Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-primary text-white">
              <div>
                <h2 className="text-xl font-black font-headline">새 계정 등록</h2>
                <p className="text-blue-200 text-[10px] mt-0.5 uppercase tracking-widest font-bold">
                  Add New User Account
                </p>
              </div>
              <button
                className="text-white/70 hover:text-white"
                onClick={() => setShowPanel(false)}
              >
                <Icon name="close" />
              </button>
            </div>

            {/* Panel Form */}
            <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  이름
                </label>
                <input
                  className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 py-2 px-3 transition-all text-sm"
                  placeholder="성명을 입력하세요"
                  type="text"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  아이디
                </label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 py-2 px-3 transition-all text-sm"
                    placeholder="사용할 아이디"
                    type="text"
                  />
                  <button className="px-3 py-2 bg-primary-container text-on-primary-container text-xs font-bold rounded uppercase">
                    중복 확인
                  </button>
                </div>
                <p className="text-[10px] text-primary/60 font-medium">* 필수 확인 사항입니다.</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  비밀번호
                </label>
                <input
                  className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 py-2 px-3 transition-all text-sm"
                  placeholder="영문, 숫자 포함 8자 이상"
                  type="password"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  비밀번호 확인
                </label>
                <input
                  className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 py-2 px-3 transition-all text-sm"
                  placeholder="비밀번호 재입력"
                  type="password"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  역할 설정
                </label>
                <select className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 py-2 px-3 transition-all text-sm">
                  <option value="worker">현장 근로자</option>
                  <option value="manager">관리자</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    라인
                  </label>
                  <select className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 py-2 px-3 transition-all text-sm">
                    <option value="">선택</option>
                    <option value="A">A라인</option>
                    <option value="B">B라인</option>
                    <option value="C">C라인</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    교대조
                  </label>
                  <select className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 py-2 px-3 transition-all text-sm">
                    <option value="">선택</option>
                    <option value="주간">주간</option>
                    <option value="야간">야간</option>
                  </select>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                <div className="flex items-start gap-3">
                  <Icon name="info" className="text-primary text-xl" />
                  <p className="text-xs text-primary leading-relaxed">
                    <strong>알림:</strong> 계정 생성 즉시 해당 사용자에게 이메일 또는 문자 메시지로 임시 비밀번호가 발송됩니다. 초기 로그인 후 비밀번호 변경이 필수적입니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Panel Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex gap-3 bg-slate-50">
              <button
                className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition-colors text-sm"
                onClick={() => setShowPanel(false)}
              >
                취소
              </button>
              <button
                className="flex-[2] py-3 bg-primary hover:bg-primary-container text-white font-bold rounded-lg transition-all text-sm shadow-lg shadow-primary/20"
                onClick={() => setShowPanel(false)}
              >
                등록 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
