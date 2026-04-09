// ── 대시보드 ──
export const kpiData = [
  { label: "총 검사 수", value: "1,247", change: "12%", changeDir: "up", sub: "vs 지난주 대비", icon: "fact_check", accent: false },
  { label: "불량률", value: "4.2%", change: "0.8%", changeDir: "down", sub: "공정 안정성 향상", icon: "error_outline", accent: false },
  { label: "금일 검사", value: "52", change: "건", changeDir: null, sub: "실시간 집계 중", icon: "today", accent: false },
  { label: "금일 불량", value: "3", change: "건", changeDir: null, sub: "즉시 확인 필요", icon: "report", accent: true },
];

export const defectTrendData = [
  { date: "3/17", value: 150 },
  { date: "3/18", value: 120 },
  { date: "3/19", value: 140 },
  { date: "3/20", value: 80 },
  { date: "3/21", value: 100 },
  { date: "3/22", value: 90 },
  { date: "3/23", value: 70 },
];

export const actionStatus = {
  total: 18,
  pending: 5,
  inProgress: 4,
  resolved: 9,
};

export const linePerformance = [
  { line: "A 라인", rate: 5.1, width: "51%" },
  { line: "B 라인", rate: 3.2, width: "32%" },
  { line: "C 라인", rate: 4.8, width: "48%" },
];

// ── 실시간 모니터링 ──
export const cameraFeeds = [
  { id: "CAM-01", line: "A라인", lineName: "A라인 조립", status: "alarm",  confidence: 94.2, fps: 30, image: "/parts/frame-sealing-defect.jpg",  time: "14:32:05", inspectionId: 247 },
  { id: "CAM-02", line: "B라인", lineName: "B라인 용접", status: "normal", confidence: 99.8, fps: 30, image: "/parts/frame-exterior-normal.jpg", time: "14:32:05", inspectionId: null },
  { id: "CAM-03", line: "B라인", lineName: "물류 이송",  status: "normal", confidence: 98.5, fps: 28, image: "/parts/frame-hemming-normal.png",  time: "14:32:05", inspectionId: null },
  { id: "CAM-04", line: "C라인", lineName: "최종 검사",  status: "normal", confidence: 99.1, fps: 30, image: "/parts/frame-hole-normal.jpg",     time: "14:32:05", inspectionId: null },
];

export const recentDetections = [
  {
    time: "14:32:05", cam: "CAM-01", part: "도어", status: "defect", confidence: 94.2,
    image: "/parts/door-scratch.jpg",
  },
  {
    time: "14:31:50", cam: "CAM-02", part: "범퍼", status: "normal", confidence: 99.1,
    image: "/parts/bumper-normal.jpg",
  },
  {
    time: "14:31:42", cam: "CAM-02", part: "헤드램프", status: "normal", confidence: 98.8,
    image: "/parts/headlamp-normal.jpg",
  },
  {
    time: "14:31:12", cam: "CAM-03", part: "프레임", status: "normal", confidence: 99.5,
    image: "/parts/frame-normal.png",
  },
  {
    time: "14:30:58", cam: "CAM-04", part: "카울커버", status: "normal", confidence: 97.9,
    image: "/parts/cowl-normal.jpg",
  },
];

// ── 검사 이력 ──
export const inspectionHistory = [
  { id: 247, partId: "DOOR-0247", date: "2026.03.28 14:30", part: "도어", status: "defect",   confidence: 94.2, inspector: "김관리" },
  { id: 246, partId: "BUMP-0246", date: "2026.03.28 14:15", part: "범퍼", status: "normal",   confidence: 98.1, inspector: "이검수" },
  { id: 245, partId: "HEAD-0245", date: "2026.03.28 13:55", part: "헤드램프", status: "normal",   confidence: 96.5, inspector: "박공정" },
  { id: 244, partId: "FRAM-0244", date: "2026.03.28 13:20", part: "프레임", status: "resolved", confidence: 87.5, inspector: "최품질" },
  { id: 243, partId: "COWL-0243", date: "2026.03.28 11:45", part: "카울커버", status: "normal",   confidence: 99.2, inspector: "김관리" },
  { id: 242, partId: "GRIL-0242", date: "2026.03.28 10:30", part: "라디에이터 그릴", status: "normal",   confidence: 97.8, inspector: "이검수" },
  { id: 241, partId: "TAIL-0241", date: "2026.03.28 09:15", part: "테일 램프", status: "normal",   confidence: 95.4, inspector: "박공정" },
  { id: 240, partId: "FEND-0240", date: "2026.03.27 17:40", part: "휀더", status: "resolved", confidence: 91.3, inspector: "최품질" },
];

// ── 실시간 알림 ──
export const alertsData = [
  { id: 1, title: "불량 부품 감지", desc: "A라인 - 도어 스크래치 | 담당자: 김관리", time: "2분 전", read: false, inspectionId: 247 },
  { id: 2, title: "불량 부품 감지", desc: "B라인 - 휀더 단차 | 담당자: 최품질", time: "15분 전", read: false, inspectionId: 240 },
  { id: 3, title: "불량 부품 감지", desc: "A라인 - 프레임 헤밍 | 담당자: 최품질", time: "32분 전", read: false, inspectionId: 244 },
  { id: 4, title: "불량 부품 감지", desc: "B라인 - 도어 외관손상 | 담당자: 이검수", time: "45분 전", read: false, inspectionId: null },
  { id: 5, title: "불량 부품 감지", desc: "C라인 - 카울커버 고정핀 | 담당자: 박공정", time: "1시간 전", read: false, inspectionId: null },
  { id: 6, title: "불량 부품 감지", desc: "C라인 - 커넥터 유격 | 담당자: 이검수", time: "2시간 전", read: true, inspectionId: null },
  { id: 7, title: "불량 부품 감지", desc: "A라인 - 라디에이터 그릴 단차 | 담당자: 김관리", time: "33시간 전", read: true, inspectionId: null },
];

// ── AI 공정 분석 ──
export const analysisPatterns = [
  {
    title: "야간 교대조 도어 스크래치 집중",
    severity: "높음",
    severityColor: "bg-error/10 text-error",
    borderColor: "border-[#F59E0B]",
    desc: 'A라인 야간 시간대(22:00~02:00)에 도어 스크래치 불량이 주간 대비 <strong class="text-error font-bold">3.2배</strong> 집중 발생하고 있습니다.',
  },
  {
    title: "월요일 오전 프레임 헤밍 불량 상승",
    severity: "중간",
    severityColor: "bg-secondary-container/20 text-on-secondary-container",
    borderColor: "border-[#F59E0B]",
    desc: '매주 월요일 오전(08:00~12:00) 프레임 헤밍 불량률이 주간 평균 대비 <strong class="text-on-secondary-container font-bold">1.8배</strong> 높은 수치를 기록하고 있습니다.',
  },
  {
    title: "C라인 휀더 단차 불량 점진적 증가",
    severity: "관찰",
    severityColor: "bg-slate-100 text-slate-500",
    borderColor: "border-slate-300",
    desc: '최근 2주간 C라인 휀더 단차 불량이 주당 <strong class="text-primary font-bold">15%씩</strong> 증가하는 추세가 관측되었습니다.',
  },
];

export const analysisRecommendations = [
  {
    num: 1,
    title: "야간 A라인 도어 작업 환경 개선",
    desc: "조명 밝기 점검 및 도어 패널 취급 절차 재교육을 권장합니다. 특히 00시 이후 작업자 집중도 저하로 인한 스크래치 발생을 줄이기 위한 휴게 시스템 재정비가 필요합니다.",
  },
  {
    num: 2,
    title: "월요일 오전 프레임 헤밍 사전 점검 도입",
    desc: "주말 이후 헤밍 장비 정밀도 저하 가능성을 고려하여 월요일 첫 1시간 장비 영점 조정 및 시험 헤밍 프로세스 도입을 강력히 권장합니다.",
  },
  {
    num: 3,
    title: "C라인 휀더 단차 교정 장비 점검",
    desc: "단차 불량 증가 추세가 C라인 지그 고정 장치의 미세 마모와 관련될 가능성이 82%로 분석되었습니다. 지그 및 클램핑 시스템의 긴급 정밀 점검을 권장합니다.",
  },
];


// ── 검사 결과 상세 ──
export const inspectionDetails = {
  247: {
    cam: "CAM-02", line: "B라인", detectionMethod: "자동 감지",
    defectType: "스크래치 (Scratch)",
    originalImage: "/parts/door-scratch.jpg",
    gradcamImage: "/parts/door-scratch.jpg",
  },
  246: {
    cam: "CAM-03", line: "A라인", detectionMethod: "자동 감지",
    defectType: null,
    originalImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBn15iBsYKdCLrLLVIdMbRCahxvhkyT-jJAouuJavUAONbTlC81UcEl-Tp_ot8Ymk6kCUrzRF4nU2wLSkgQ7JDIsibGI_x3s2cDMxrcPyyU6OxNBvWdMGawJATRPNhQ4GpGfuPJ8GfNVpLDhGZHOPRv8UKQ6-uJX6aLFk5MObyx1Rk_3O3rpgfYExMRzWTu4Vo8GFO6p73RvLuJorDCK5G4TNd5zdTzL39RuxY8h3rqaio1SIIG0JM44W0GwFmGmqwZ9lFlhTC8Jq8",
    gradcamImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBn15iBsYKdCLrLLVIdMbRCahxvhkyT-jJAouuJavUAONbTlC81UcEl-Tp_ot8Ymk6kCUrzRF4nU2wLSkgQ7JDIsibGI_x3s2cDMxrcPyyU6OxNBvWdMGawJATRPNhQ4GpGfuPJ8GfNVpLDhGZHOPRv8UKQ6-uJX6aLFk5MObyx1Rk_3O3rpgfYExMRzWTu4Vo8GFO6p73RvLuJorDCK5G4TNd5zdTzL39RuxY8h3rqaio1SIIG0JM44W0GwFmGmqwZ9lFlhTC8Jq8",
  },
  245: {
    cam: "CAM-04", line: "B라인", detectionMethod: "자동 감지",
    defectType: null,
    originalImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTsgMsao6Y0yFrryOjcI9n9z3IWvQW9JtZN1l0fRffoTt_ApywE4zL8WGxNzfXrcl5oLCwctAv6UsOf7qpnsQNAdM36OeaHa9wAuP8EM3MiT2_6eVEUR8AmY_p4fZfe_MQGY0Rrjv0zAYywaR9yMdJGNVUhvoFBHFvYZmgSpHKn_dH3Z47CIqLTITZvYW4r-K8o9vvy9mXow6BVt1NoqziIukFY2H4N5Z6zSuw7K4HWurSzy5Vl_CDUU7Ip3_ZnP7Es719gdbauJg",
    gradcamImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTsgMsao6Y0yFrryOjcI9n9z3IWvQW9JtZN1l0fRffoTt_ApywE4zL8WGxNzfXrcl5oLCwctAv6UsOf7qpnsQNAdM36OeaHa9wAuP8EM3MiT2_6eVEUR8AmY_p4fZfe_MQGY0Rrjv0zAYywaR9yMdJGNVUhvoFBHFvYZmgSpHKn_dH3Z47CIqLTITZvYW4r-K8o9vvy9mXow6BVt1NoqziIukFY2H4N5Z6zSuw7K4HWurSzy5Vl_CDUU7Ip3_ZnP7Es719gdbauJg",
  },
  244: {
    cam: "CAM-01", line: "A라인", detectionMethod: "자동 감지",
    defectType: "헤밍 (Hemming)",
    originalImage: "/parts/frame-hemming.jpg",
    gradcamImage: "/parts/frame-hemming.jpg",
  },
  243: {
    cam: "CAM-02", line: "A라인", detectionMethod: "자동 감지",
    defectType: null,
    originalImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_TewelQ0qEhHYq_78uHst9o-oOdXrUDtZhNEyrEEHznO9C0eITWIQGb8uQ4UHNS08TJ_VPqYmdBqO9Uuabui8ktLvaUwRV_hdcBHG0gqhHmVYCzxZA9vMuOtK3gcPW6IkTPcK6slJprMCUHfWF-qneX_xuFRs8JsgzddKUygERVoCyrpqtotO9TjnJyzazzbXVpzMr0eFR43-tIr8dLUQMb-YdVEjX2E5T8pHrqB_TcBDckMn54N6r91W5Bzbz3jMd8M1jaqZFkc",
    gradcamImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_TewelQ0qEhHYq_78uHst9o-oOdXrUDtZhNEyrEEHznO9C0eITWIQGb8uQ4UHNS08TJ_VPqYmdBqO9Uuabui8ktLvaUwRV_hdcBHG0gqhHmVYCzxZA9vMuOtK3gcPW6IkTPcK6slJprMCUHfWF-qneX_xuFRs8JsgzddKUygERVoCyrpqtotO9TjnJyzazzbXVpzMr0eFR43-tIr8dLUQMb-YdVEjX2E5T8pHrqB_TcBDckMn54N6r91W5Bzbz3jMd8M1jaqZFkc",
  },
  242: {
    cam: "CAM-03", line: "B라인", detectionMethod: "자동 감지",
    defectType: null,
    originalImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBidQTY-xjd-WNMe3bW_kV1VcGe2QDQEp2PQeFPC1bDyra_pQwbPdJU4iB4bIm8bOKXwxZxiVZzNZwnYQoJP59RqGw6ZwFWWmHMdxbC-xaAluTFoJfOex6hblZLlpUr3s7s-RqlKqI02vW0MBxKqqLHzxBuEqV-bvrAAAJzYxAcEjMvVu421TjsWJ5o3XtWJB7dNVtRPeN5E_5ymt3LarztdtISxLqSGob_kL98Xk51HOX_hxXVdvhtBDYPb5fZ6szQjWgU5oIyTR0",
    gradcamImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBidQTY-xjd-WNMe3bW_kV1VcGe2QDQEp2PQeFPC1bDyra_pQwbPdJU4iB4bIm8bOKXwxZxiVZzNZwnYQoJP59RqGw6ZwFWWmHMdxbC-xaAluTFoJfOex6hblZLlpUr3s7s-RqlKqI02vW0MBxKqqLHzxBuEqV-bvrAAAJzYxAcEjMvVu421TjsWJ5o3XtWJB7dNVtRPeN5E_5ymt3LarztdtISxLqSGob_kL98Xk51HOX_hxXVdvhtBDYPb5fZ6szQjWgU5oIyTR0",
  },
  241: {
    cam: "CAM-04", line: "C라인", detectionMethod: "자동 감지",
    defectType: null,
    originalImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCrio6VIQH55KPpKDA6VGgkF1jbxwYL_ILzzbCxWKNP4K4Zce5RVVUl4XPgSPU_aJnvmaP0NBUm1lydgJWR6VbBBTcKQ5IyExEfLFAqC5ntajZTikhE83De63Bzw0GCJ-wkVGg4lRhF2pk1DIlKt9nUQBSXW77TLCPN9vSWkvbNn3cBcyUF8aQYiNAgRnKOR0aESl--E2ZFxMRNPhc52DZqjNey7tYFQN_aiCLdEPVD1qKEc_gSIGAeOxUsJFLyVETFUl3X3StGrs",
    gradcamImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCrio6VIQH55KPpKDA6VGgkF1jbxwYL_ILzzbCxWKNP4K4Zce5RVVUl4XPgSPU_aJnvmaP0NBUm1lydgJWR6VbBBTcKQ5IyExEfLFAqC5ntajZTikhE83De63Bzw0GCJ-wkVGg4lRhF2pk1DIlKt9nUQBSXW77TLCPN9vSWkvbNn3cBcyUF8aQYiNAgRnKOR0aESl--E2ZFxMRNPhc52DZqjNey7tYFQN_aiCLdEPVD1qKEc_gSIGAeOxUsJFLyVETFUl3X3StGrs",
  },
  240: {
    cam: "CAM-01", line: "C라인", detectionMethod: "자동 감지",
    defectType: "단차 (Gap)",
    originalImage: "/parts/fender-gap.jpg",
    gradcamImage: "/parts/fender-gap.jpg",
  },
};

// ── 계정 관리 ──
export const accountUsers = [
  { name: "김철수", userId: "kimcs",  role: "worker", status: "active",   line: "A라인", shift: "주간" },
  { name: "김소희", userId: "kimsh",  role: "worker", status: "active",   line: "B라인", shift: "야간" },
  { name: "안용준", userId: "anyj",   role: "admin",  status: "active",   line: "-",    shift: "-"   },
  { name: "진성훈", userId: "jinsh",  role: "worker", status: "active",   line: "C라인", shift: "주간" },
  { name: "신동주", userId: "shindj", role: "worker", status: "active",   line: "A라인", shift: "야간" },
  { name: "대풍근", userId: "daepg",  role: "worker", status: "active",   line: "B라인", shift: "주간" },
  { name: "김은지", userId: "kimej",  role: "admin",  status: "active",   line: "-",    shift: "-"   },
  { name: "김근호", userId: "kimgh",  role: "worker", status: "inactive", line: "C라인", shift: "야간" },
];
