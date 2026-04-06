import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Icon from "./Icon";

const workerNav = [
  { path: "/monitoring", icon: "monitoring", label: "실시간 모니터링" },
  { path: "/history", icon: "history", label: "검사 이력" },
];

const adminNav = [
  { path: "/dashboard", icon: "dashboard", label: "대시보드" },
  { path: "/history", icon: "history", label: "검사 이력" },
  { path: "/alerts", icon: "notifications", label: "알림" },
  { path: "/analysis", icon: "analytics", label: "AI 공정 분석" },
  { path: "/accounts", icon: "manage_accounts", label: "계정 관리" },
];

export default function Sidebar() {
  const location = useLocation();
  const { role } = useAuth();

  const navItems = role === "admin" ? adminNav : workerNav;
  const userName = role === "admin" ? "관리자" : "현장 근로자";
  const userSub = role === "admin" ? "Authorized Personnel" : "Field Worker";

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-[#1E3A5F] shadow-xl shadow-blue-900/20 z-50 flex flex-col justify-between p-4">
      <div>
        {/* Logo */}
        <div className="mb-10 px-2 flex flex-col gap-1">
          <span className="text-lg font-black tracking-tighter text-white uppercase">
            AI 품질 검사
          </span>
          <span className="text-xs font-medium text-[#8AA4CF] tracking-widest">
            DIGITAL FOREMAN
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 active:scale-95 ${
                  isActive
                    ? "bg-[#022448] text-white"
                    : "text-[#8AA4CF] hover:bg-[#022448]/50 hover:text-white"
                }`}
              >
                <Icon name={item.icon} />
                <span className="font-headline font-bold text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer User */}
      <div className="border-t border-white/10 pt-4 px-2">
        <div className="flex items-center gap-3 text-[#8AA4CF]">
          <Icon name="account_circle" className="text-3xl" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">{userName}</span>
            <span className="text-[10px] uppercase tracking-tighter">{userSub}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
