import { useLocation } from "react-router-dom";
import Icon from "./Icon";

const titles = {
  "/dashboard": "품질 대시보드",
  "/monitoring": "실시간 모니터링",
  "/history": "검사 이력 조회",
  "/alerts": "실시간 알림",
  "/analysis": "AI 공정 분석",
  "/accounts": "계정 관리",
};

export default function Header() {
  const location = useLocation();

  // /inspection/:id 같은 동적 경로 처리
  const title =
    titles[location.pathname] ||
    (location.pathname.startsWith("/inspection") ? "검사 결과 상세" : "");

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 z-40 bg-white/70 backdrop-blur-md flex items-center justify-between px-8">
      <h1 className="font-headline text-2xl font-bold tracking-tight text-[#1E3A5F]">
        {title}
      </h1>

      <div className="flex items-center gap-4 text-[#1E3A5F]">
        {/* Notification bell */}
        <div className="relative cursor-pointer hover:opacity-70 transition-opacity">
          <Icon name="notifications" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border border-white" />
        </div>

        {/* Settings */}
        <Icon name="settings" className="cursor-pointer hover:opacity-70 transition-opacity" />

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden border border-surface-container-high">
          <img
            className="w-full h-full object-cover"
            alt="관리자 아바타"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcK43ST9gDxALIQO51hu-giw1vaxmyVKRn40F4174kbAWtpVCUnBR9_Jn0T-22mnzHdG3Kn56dr9yLGr8yYZgY3icwapjk_8cY6-ztanm0C7atq_DnytAxEK57jhTzFXfa_2RB9DBma9Z04CoWXZ8LHmDlT2XNAyfY3mA9n16Kr-eB3hOq0LvaYwMxeNMHlEttOTvrKOP-2s-IFFsGScBBhTgknq2PuOQZdcM2HazuGaL1WUKY23qI-xmipXsZFoZt2Oa3SWWehKY"
          />
        </div>
      </div>
    </header>
  );
}
