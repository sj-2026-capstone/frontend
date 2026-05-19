import { useCallback, useEffect, useMemo, useState } from "react";
import Icon from "../components/Icon";
import {
  checkLoginIdAvailability,
  createAccount,
  getAccounts,
  getAccountSummary,
} from "../api/accounts";
import { USE_MOCK_API } from "../api/config";
import { getLines } from "../api/lines";
import { getShifts } from "../api/shifts";
import { accountListResponseToUsers } from "../adapters/accounts";
import { accountUsers } from "../data/mockData";

const initialForm = {
  userName: "",
  loginId: "",
  email: "",
  phone: "",
  password: "",
  passwordConfirm: "",
  role: "WORKER",
  lineId: "",
  shiftId: "",
};

const fallbackLines = [
  { lineId: 1, lineCode: "A", lineName: "A 라인" },
  { lineId: 2, lineCode: "B", lineName: "B 라인" },
  { lineId: 3, lineCode: "C", lineName: "C 라인" },
];

const fallbackShifts = [
  { shiftId: 1, shiftName: "주간", shiftType: "DAY" },
  { shiftId: 2, shiftName: "오후", shiftType: "EVENING" },
  { shiftId: 3, shiftName: "야간", shiftType: "NIGHT" },
];

function unwrapList(response, keys) {
  if (Array.isArray(response)) return response;
  for (const key of keys) {
    if (Array.isArray(response?.[key])) return response[key];
  }
  return [];
}

function normalizeLine(item) {
  const lineCode = item.lineCode || item.code || item.name || "";
  return {
    lineId: item.lineId ?? item.id,
    lineCode,
    lineName: item.lineName || item.name || `${lineCode} 라인`,
  };
}

function normalizeShift(item) {
  const shiftType = item.shiftType || item.type || "";
  const fallbackName =
    shiftType === "DAY" ? "주간" : shiftType === "EVENING" ? "오후" : shiftType === "NIGHT" ? "야간" : "교대조";

  return {
    shiftId: item.shiftId ?? item.id,
    shiftName: item.shiftName || item.name || fallbackName,
    shiftType,
  };
}

function createLocalUser(form, lines, shifts) {
  const line = lines.find((item) => String(item.lineId) === String(form.lineId));
  const shift = shifts.find((item) => String(item.shiftId) === String(form.shiftId));

  return {
    name: form.userName,
    userId: form.loginId,
    role: form.role.toLowerCase(),
    line: form.role === "ADMIN" ? "-" : line?.lineName || "-",
    shift: form.role === "ADMIN" ? "-" : shift?.shiftName || "-",
  };
}

export default function AccountManagementPage() {
  const [showPanel, setShowPanel] = useState(false);
  const [users, setUsers] = useState(() => (USE_MOCK_API ? accountUsers : []));
  const [summaryCount, setSummaryCount] = useState(() => (USE_MOCK_API ? accountUsers.length : 0));
  const [lines, setLines] = useState(() => (USE_MOCK_API ? fallbackLines : []));
  const [shifts, setShifts] = useState(() => (USE_MOCK_API ? fallbackShifts : []));
  const [form, setForm] = useState(initialForm);
  const [apiError, setApiError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingLoginId, setIsCheckingLoginId] = useState(false);
  const [loginIdStatus, setLoginIdStatus] = useState(null);

  const workerRole = form.role === "WORKER";

  const fetchAccounts = useCallback(async () => {
    const data = await getAccounts({ page: 0, size: 20 });
    const nextUsers = accountListResponseToUsers(data);
    setUsers(nextUsers);
    setSummaryCount(nextUsers.length);
  }, []);

  useEffect(() => {
    if (USE_MOCK_API) return;

    let ignore = false;

    async function loadAccountPage() {
      try {
        const [accountsData, summaryResult, linesResult, shiftsResult] = await Promise.allSettled([
          getAccounts({ page: 0, size: 20 }),
          getAccountSummary(),
          getLines(),
          getShifts(),
        ]);

        if (ignore) return;

        if (accountsData.status === "fulfilled") {
          const nextUsers = accountListResponseToUsers(accountsData.value);
          setUsers(nextUsers);
          setSummaryCount(nextUsers.length);
        } else {
          setApiError(accountsData.reason.message);
        }

        if (summaryResult.status === "fulfilled") {
          const total =
            summaryResult.value?.totalCount ??
            summaryResult.value?.totalAccounts ??
            summaryResult.value?.totalUserCount;
          if (Number.isFinite(Number(total))) setSummaryCount(Number(total));
        }

        if (linesResult.status === "fulfilled") {
          const nextLines = unwrapList(linesResult.value, ["items", "lines", "content"])
            .map(normalizeLine)
            .filter((item) => item.lineId !== undefined && item.lineId !== null);
          if (nextLines.length) setLines(nextLines);
        }

        if (shiftsResult.status === "fulfilled") {
          const nextShifts = unwrapList(shiftsResult.value, ["items", "shifts", "content"])
            .map(normalizeShift)
            .filter((item) => item.shiftId !== undefined && item.shiftId !== null);
          if (nextShifts.length) setShifts(nextShifts);
        }
      } catch (err) {
        if (!ignore) setApiError(err.message);
      }
    }

    loadAccountPage();

    return () => {
      ignore = true;
    };
  }, []);

  const roleCounts = useMemo(
    () => ({
      worker: users.filter((user) => user.role === "worker").length,
      admin: users.filter((user) => user.role === "admin").length,
    }),
    [users],
  );

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "role" && value === "ADMIN") {
        next.lineId = "";
        next.shiftId = "";
      }
      return next;
    });

    if (name === "loginId") setLoginIdStatus(null);
    setFormError("");
    setSuccessMessage("");
  };

  const closePanel = () => {
    if (isSubmitting) return;
    setShowPanel(false);
    setForm(initialForm);
    setFormError("");
    setSuccessMessage("");
    setLoginIdStatus(null);
  };

  const handleLoginIdCheck = async () => {
    const loginId = form.loginId.trim();
    if (!loginId) {
      setLoginIdStatus({ available: false, message: "로그인 ID를 입력해 주세요." });
      return;
    }

    if (USE_MOCK_API) {
      const exists = users.some((user) => user.userId === loginId);
      setLoginIdStatus({
        available: !exists,
        message: exists ? "이미 사용 중인 로그인 ID입니다." : "사용 가능한 로그인 ID입니다.",
      });
      return;
    }

    try {
      setIsCheckingLoginId(true);
      const result = await checkLoginIdAvailability(loginId);
      const available = Boolean(result?.available ?? result?.isAvailable);
      setLoginIdStatus({
        available,
        message: result?.message || (available ? "사용 가능한 로그인 ID입니다." : "이미 사용 중인 로그인 ID입니다."),
      });
    } catch (err) {
      setLoginIdStatus({ available: false, message: err.message });
    } finally {
      setIsCheckingLoginId(false);
    }
  };

  const validateForm = () => {
    if (!form.userName.trim()) return "이름을 입력해 주세요.";
    if (!form.loginId.trim()) return "로그인 ID를 입력해 주세요.";
    if (!form.password) return "초기 비밀번호를 입력해 주세요.";
    if (form.password.length < 8) return "초기 비밀번호는 8자 이상이어야 합니다.";
    if (form.password !== form.passwordConfirm) return "비밀번호 확인이 일치하지 않습니다.";
    if (workerRole && !form.lineId) return "작업자는 라인을 선택해야 합니다.";
    if (workerRole && !form.shiftId) return "작업자는 교대조를 선택해야 합니다.";
    return "";
  };

  const buildPayload = () => ({
    userName: form.userName.trim(),
    loginId: form.loginId.trim(),
    email: form.email.trim() || null,
    phone: form.phone.trim() || null,
    password: form.password,
    confirmPassword: form.passwordConfirm,
    role: form.role,
    lineId: workerRole ? Number(form.lineId) : null,
    shiftId: workerRole ? Number(form.shiftId) : null,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationMessage = validateForm();
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");
      setApiError("");

      if (USE_MOCK_API) {
        setUsers((prev) => [createLocalUser(form, lines, shifts), ...prev]);
        setSummaryCount((prev) => prev + 1);
      } else {
        await createAccount(buildPayload());
        await fetchAccounts();
      }

      setSuccessMessage("계정이 생성되었습니다. 최초 로그인 시 비밀번호 변경이 필요합니다.");
      setForm(initialForm);
      setLoginIdStatus(null);
      setShowPanel(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {apiError && (
        <div className="rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm font-medium text-error">
          {apiError}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {successMessage}
        </div>
      )}

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-xl border-b-2 border-primary bg-surface-container-lowest p-6 shadow-sm">
          <p className="mb-1 text-sm font-medium text-on-surface-variant">전체 계정</p>
          <h2 className="font-headline text-3xl font-extrabold text-primary">
            {summaryCount}
            <span className="ml-1 text-lg font-medium">명</span>
          </h2>
        </div>
        <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm">
          <p className="mb-1 text-sm font-medium text-on-surface-variant">작업자</p>
          <h2 className="font-headline text-3xl font-extrabold text-on-surface">{roleCounts.worker}</h2>
        </div>
        <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm">
          <p className="mb-1 text-sm font-medium text-on-surface-variant">관리자</p>
          <h2 className="font-headline text-3xl font-extrabold text-on-surface">{roleCounts.admin}</h2>
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-4 rounded-xl bg-surface-container-low p-4">
        <div className="relative min-w-[280px] flex-1">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            className="w-full border-0 border-b-2 border-outline-variant bg-surface-container-lowest py-2.5 pl-10 pr-4 text-sm transition-all focus:border-primary focus:ring-0"
            placeholder="이름 또는 로그인 ID 검색"
            type="text"
          />
        </div>
        <button
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-container"
          onClick={() => setShowPanel(true)}
          type="button"
        >
          <Icon name="person_add" className="text-sm" />
          계정 생성
        </button>
      </section>

      <section className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-highest/30">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">이름</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">로그인 ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">역할</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">라인</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">교대조</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={`${user.userId}-${user.name}`} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-on-surface">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{user.userId}</td>
                  <td className="px-6 py-4 text-sm">
                    {user.role === "admin" ? (
                      <span className="rounded bg-primary px-2 py-1 text-xs font-bold text-white">관리자</span>
                    ) : (
                      <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">작업자</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">{user.line}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{user.shift}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showPanel && (
        <div className="fixed inset-0 z-50 !mt-0 flex justify-end bg-black/30">
          <form
            className="flex h-full w-full max-w-[440px] animate-slide-in flex-col overflow-y-auto bg-white shadow-2xl"
            onSubmit={handleSubmit}
          >
            <div className="flex items-center justify-between border-b border-slate-100 bg-primary px-6 py-4 text-white">
              <div>
                <h2 className="font-headline text-xl font-black">계정 생성</h2>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-200">
                  Add New User Account
                </p>
              </div>
              <button className="text-white/70 hover:text-white" onClick={closePanel} type="button">
                <Icon name="close" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
              {formError && (
                <div className="rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-xs font-medium text-error">
                  {formError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="userName">
                  이름
                </label>
                <input
                  className="w-full border-0 border-b-2 border-outline-variant bg-surface-container-low px-3 py-2 text-sm transition-all focus:border-primary focus:ring-0"
                  id="userName"
                  name="userName"
                  onChange={updateForm}
                  placeholder="홍길동"
                  type="text"
                  value={form.userName}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="loginId">
                  로그인 ID
                </label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 border-0 border-b-2 border-outline-variant bg-surface-container-low px-3 py-2 text-sm transition-all focus:border-primary focus:ring-0"
                    id="loginId"
                    name="loginId"
                    onChange={updateForm}
                    placeholder="worker01"
                    type="text"
                    value={form.loginId}
                  />
                  <button
                    className="rounded bg-primary-container px-3 py-2 text-xs font-bold text-on-primary-container disabled:opacity-60"
                    disabled={isCheckingLoginId}
                    onClick={handleLoginIdCheck}
                    type="button"
                  >
                    {isCheckingLoginId ? "확인 중" : "중복 확인"}
                  </button>
                </div>
                {loginIdStatus && (
                  <p className={`text-[11px] font-medium ${loginIdStatus.available ? "text-emerald-600" : "text-error"}`}>
                    {loginIdStatus.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="email">
                  이메일 선택
                </label>
                <input
                  className="w-full border-0 border-b-2 border-outline-variant bg-surface-container-low px-3 py-2 text-sm transition-all focus:border-primary focus:ring-0"
                  id="email"
                  name="email"
                  onChange={updateForm}
                  placeholder="user@example.com"
                  type="email"
                  value={form.email}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="phone">
                  전화번호 선택
                </label>
                <input
                  className="w-full border-0 border-b-2 border-outline-variant bg-surface-container-low px-3 py-2 text-sm transition-all focus:border-primary focus:ring-0"
                  id="phone"
                  name="phone"
                  onChange={updateForm}
                  placeholder="010-1234-5678"
                  type="tel"
                  value={form.phone}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="password">
                    초기 비밀번호
                  </label>
                  <input
                    className="w-full border-0 border-b-2 border-outline-variant bg-surface-container-low px-3 py-2 text-sm transition-all focus:border-primary focus:ring-0"
                    id="password"
                    name="password"
                    onChange={updateForm}
                    placeholder="8자 이상"
                    type="password"
                    value={form.password}
                  />
                </div>
                <div className="space-y-1">
                  <label
                    className="text-xs font-bold uppercase tracking-wider text-on-surface-variant"
                    htmlFor="passwordConfirm"
                  >
                    비밀번호 확인
                  </label>
                  <input
                    className="w-full border-0 border-b-2 border-outline-variant bg-surface-container-low px-3 py-2 text-sm transition-all focus:border-primary focus:ring-0"
                    id="passwordConfirm"
                    name="passwordConfirm"
                    onChange={updateForm}
                    placeholder="다시 입력"
                    type="password"
                    value={form.passwordConfirm}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="role">
                  역할
                </label>
                <select
                  className="w-full border-0 border-b-2 border-outline-variant bg-surface-container-low px-3 py-2 text-sm transition-all focus:border-primary focus:ring-0"
                  id="role"
                  name="role"
                  onChange={updateForm}
                  value={form.role}
                >
                  <option value="WORKER">작업자</option>
                  <option value="ADMIN">관리자</option>
                </select>
              </div>

              {workerRole && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="lineId">
                      라인
                    </label>
                    <select
                      className="w-full border-0 border-b-2 border-outline-variant bg-surface-container-low px-3 py-2 text-sm transition-all focus:border-primary focus:ring-0"
                      id="lineId"
                      name="lineId"
                      onChange={updateForm}
                      value={form.lineId}
                    >
                      <option value="">선택</option>
                      {lines.map((line) => (
                        <option key={line.lineId} value={line.lineId}>
                          {line.lineName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="shiftId">
                      교대조
                    </label>
                    <select
                      className="w-full border-0 border-b-2 border-outline-variant bg-surface-container-low px-3 py-2 text-sm transition-all focus:border-primary focus:ring-0"
                      id="shiftId"
                      name="shiftId"
                      onChange={updateForm}
                      value={form.shiftId}
                    >
                      <option value="">선택</option>
                      {shifts.map((shift) => (
                        <option key={shift.shiftId} value={shift.shiftId}>
                          {shift.shiftName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="rounded-lg border border-primary/10 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <Icon name="info" className="text-xl text-primary" />
                  <p className="text-xs leading-relaxed text-primary">
                    생성된 계정은 최초 로그인 후 비밀번호 변경이 필요합니다. 작업자 계정은 라인과 교대조를 반드시
                    선택해야 합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                className="flex-1 rounded-lg bg-slate-200 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-300"
                onClick={closePanel}
                type="button"
              >
                취소
              </button>
              <button
                className="flex-[2] rounded-lg bg-primary py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "생성 중" : "계정 생성"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
