import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Icon from "../components/Icon";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState("worker");

  const handleLogin = (e) => {
    e.preventDefault();
    login(selectedRole);
    navigate(selectedRole === "admin" ? "/dashboard" : "/monitoring");
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <main className="flex-grow flex">
        {/* ── Left Pane: Hero Area ── */}
        <section className="hidden md:flex md:w-7/12 lg:w-3/5 hero-gradient relative overflow-hidden items-center justify-center p-16">
          {/* Decorative blurs */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary-container blur-3xl" />
            <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] rounded-full bg-surface-tint blur-3xl" />
          </div>

          <div className="relative z-10 max-w-2xl">
            {/* Badge */}
            <div className="mb-12 inline-flex items-center gap-3 px-4 py-2 glass-overlay rounded-full border border-white/10">
              <Icon name="precision_manufacturing" className="text-tertiary-fixed" fill />
              <span className="text-white/80 text-sm font-medium tracking-wide uppercase">
                캡스톤디자인 - 1조
              </span>
            </div>

            {/* Title */}
            <h1 className="font-headline text-5xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6">
              AI 기반
              <div>
                자동차부품 <br />
                품질 검사 시스템
              </div>
            </h1>

            <p className="font-body text-xl lg:text-2xl text-on-primary-container font-light leading-relaxed mb-12">
              AI 기반 자동차 부품 불량 검출 플랫폼
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-12">
              <div>
                <div className="text-tertiary-fixed text-3xl font-headline font-bold mb-1">99%</div>
                <div className="text-white/60 text-sm font-medium">검출 정확도</div>
              </div>
              <div>
                <div className="text-tertiary-fixed text-3xl font-headline font-bold mb-1">1s</div>
                <div className="text-white/60 text-sm font-medium">실시간 판독 속도</div>
              </div>
            </div>
          </div>

          {/* Background image */}
          <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay">
            <img
              alt="Industrial machinery"
              className="w-full h-full object-cover animate-ken-burns"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA33UzhmON7096wJ4GZh5tKka8O1_v0AYqzE6mLXxkYKELDu-Z_g0DCD9JcQUSayAE7l5_v2nwJOkZ_vkgMgSImOcleKEkMHtjeUA-UUJaG5OxOpFXG2yPTpEi6SJ8XqkgmJoAwfcbzJOoLjP-iylBn-sCL2HvWktV5U8wTLnCZs5J8K3Y71QdIwNAB0qlPBgksSU7QeOFlhSg5rEPbZlElGcBcaWo2aAAVZELMBCHcAYWo5tvCvqyVrk5smIuQMMxFnBej2YNFRQo"
            />
          </div>
        </section>

        {/* ── Right Pane: Login Form ── */}
        <section className="w-full md:w-5/12 lg:w-2/5 bg-surface flex items-center justify-center p-8 lg:p-24 relative">
          <div className="w-full max-w-md">
            {/* Mobile Branding */}
            <div className="md:hidden mb-12">
              <h2 className="font-headline text-2xl font-bold text-primary mb-2">
                AI 부품 품질 검사 시스템
              </h2>
              <div className="h-1 w-12 bg-tertiary-container" />
            </div>

            {/* Heading */}
            <div className="mb-10">
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">로그인</h2>
              <p className="text-on-surface-variant font-body">
                시스템 접속을 위해 계정 정보를 입력하세요.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleLogin}>
              {/* ID */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-primary/80 ml-1" htmlFor="username">
                  아이디
                </label>
                <div className="relative group">
                  <input
                    className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant px-4 py-4 text-on-surface placeholder:text-outline/50 focus:ring-0 focus:border-tertiary transition-colors"
                    id="username"
                    name="username"
                    placeholder="아이디를 입력하세요"
                    type="text"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline/50 group-focus-within:text-tertiary transition-colors">
                    person
                  </span>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-primary/80 ml-1" htmlFor="password">
                  비밀번호
                </label>
                <div className="relative group">
                  <input
                    className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant px-4 py-4 text-on-surface placeholder:text-outline/50 focus:ring-0 focus:border-tertiary transition-colors"
                    id="password"
                    name="password"
                    placeholder="비밀번호를 입력하세요"
                    type="password"
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/50 hover:text-primary transition-colors"
                    type="button"
                  >
                    <Icon name="visibility" />
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-primary/80 ml-1">역할 선택</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRole("worker")}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-200 ${
                      selectedRole === "worker"
                        ? "bg-primary text-white"
                        : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    <Icon name="engineering" className="text-base mr-1 align-middle" />
                    현장 근로자
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole("admin")}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-200 ${
                      selectedRole === "admin"
                        ? "bg-primary text-white"
                        : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    <Icon name="admin_panel_settings" className="text-base mr-1 align-middle" />
                    관리자
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20"
                    type="checkbox"
                  />
                  <span className="text-sm text-on-surface-variant group-hover:text-primary transition-colors">
                    로그인 상태 유지
                  </span>
                </label>
              </div>

              {/* Submit */}
              <button
                className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-lg hover:shadow-lg hover:shadow-primary/20 transform active:scale-[0.98] transition-all duration-200"
                type="submit"
              >
                로그인
              </button>
            </form>

            {/* Support */}
            <div className="mt-16 text-center">
              <p className="text-xs text-outline font-body mb-2">
                시스템 이용 중 문제가 발생했나요?
              </p>
              <button className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline">
                <Icon name="support_agent" className="text-sm" />
                기술 지원 센터 문의하기
              </button>
            </div>
          </div>

          {/* Version */}
          <div className="absolute bottom-0 right-0 p-8 text-[10px] text-outline/30 font-mono tracking-widest uppercase pointer-events-none">
            VER 2.4.0-PRC
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full py-6 mt-auto bg-slate-50 border-t border-surface-variant">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 w-full gap-4">
          <div className="text-xs font-medium text-slate-500">
            © 2026 코스피7000. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a className="text-xs font-medium text-slate-500 hover:text-blue-700 transition-opacity opacity-80 hover:opacity-100" href="#">
              이용약관
            </a>
            <a className="text-xs font-medium text-slate-500 hover:text-blue-700 transition-opacity opacity-80 hover:opacity-100" href="#">
              개인정보처리방침
            </a>
            <a className="text-xs font-medium text-slate-500 hover:text-blue-700 transition-opacity opacity-80 hover:opacity-100" href="#">
              고객지원
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
