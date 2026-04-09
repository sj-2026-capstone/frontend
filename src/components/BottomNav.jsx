import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Icon from "./Icon";

const workerNav = [
  { path: "/monitoring", icon: "sensors", label: "실시간 모니터링" },
  { path: "/history", icon: "history", label: "검사 이력" },
];

export default function BottomNav() {
  const location = useLocation();
  const { role } = useAuth();

  // worker 전용 (admin은 사이드바 사용)
  if (role !== "worker") return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-6 pb-4 pt-2 bg-white/80 backdrop-blur-md border-t border-slate-200/50 z-50 rounded-t-xl shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      {workerNav.map((item) => {
        const isActive =
          location.pathname.startsWith(item.path) ||
          (item.path === "/history" && location.pathname.startsWith("/inspection"));
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all active:scale-90 ${
              isActive
                ? "bg-[#1E3A5F] text-white"
                : "text-slate-500 hover:text-[#1E3A5F]"
            }`}
          >
            <Icon name={item.icon} fill={isActive} />
            <span className="font-headline text-[10px] font-bold uppercase tracking-widest mt-1">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
