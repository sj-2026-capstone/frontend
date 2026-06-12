// ── 대시보드 ──
export const mockFactoryLines = [
  { id: "A", name: "A 라인", status: "alarm", inspectionId: 50, defectCount: 3, lastEventAt: "14:32:05" },
  { id: "B", name: "B 라인", status: "normal", inspectionId: null, defectCount: 0, lastEventAt: "14:31:50" },
  { id: "C", name: "C 라인", status: "wait", inspectionId: null, defectCount: 0, lastEventAt: "14:30:58" },
  { id: "D", name: "D 라인", status: "normal", inspectionId: null, defectCount: 0, lastEventAt: "14:29:44" },
];

export const kpiData = [
  { label: "총 검사 수", value: "1,247", change: "12%", changeDir: "up", sub: "vs 지난주 대비", icon: "fact_check", accent: false },
  { label: "불량률", value: "4.2%", change: "0.8%", changeDir: "down", sub: "공정 안정성 향상", icon: "error_outline", accent: false },
  { label: "금일 검사", value: "52", change: "건", changeDir: null, sub: "실시간 집계 중", icon: "today", accent: false },
  { label: "금일 불량", value: "3", change: "건", changeDir: null, sub: "즉시 확인 필요", icon: "report", accent: true },
];

export const defectTrendData = [
  { date: "3/17", value: 5.8 },
  { date: "3/18", value: 5.2 },
  { date: "3/19", value: 5.5 },
  { date: "3/20", value: 4.7 },
  { date: "3/21", value: 4.9 },
  { date: "3/22", value: 4.5 },
  { date: "3/23", value: 4.2 },
];

export const actionStatus = {
  total: 18,
  pending: 5,
  inProgress: 4,
  resolved: 13,
};

export const linePerformance = [
  { line: "A 라인", rate: 5.1, width: "51%" },
  { line: "B 라인", rate: 3.2, width: "32%" },
  { line: "C 라인", rate: 4.8, width: "48%" },
];

// ── 실시간 모니터링 ──
export const cameraFeeds = [
  { id: "LINE-A", line: "A라인", lineName: "A라인 조립", status: "alarm",  fps: 30, image: "/defects/defect-original.jpg",  time: "14:32:05", inspectionId: 50 },
  { id: "LINE-B", line: "B라인", lineName: "B라인 용접", status: "normal", fps: 30, image: "/parts/frame-exterior-normal.jpg", time: "14:32:05", inspectionId: null },
  { id: "LINE-B-TRANSFER", line: "B라인", lineName: "물류 이송",  status: "normal", fps: 28, image: "/parts/frame-normal.png",  time: "14:32:05", inspectionId: null },
  { id: "LINE-C", line: "C라인", lineName: "최종 검사",  status: "normal", fps: 30, image: "/parts/frame-normal.png",     time: "14:32:05", inspectionId: null },
];

export const recentDetections = [
  {
    inspectionId: 50, time: "2026.06.03 20:57", line: "C라인", part: "도어", status: "defect",
    image: "/defects/defect-original.jpg",
  },
  {
    time: "14:31:50", line: "B라인", part: "범퍼", status: "normal",
    image: "/parts/bumper-normal.jpg",
  },
  {
    time: "14:31:42", line: "B라인", part: "헤드램프", status: "normal",
    image: "/parts/headlamp-normal.jpg",
  },
  {
    time: "14:31:12", line: "B라인", part: "프레임", status: "normal",
    image: "/parts/frame-normal.png",
  },
  {
    time: "14:30:58", line: "C라인", part: "카울커버", status: "normal",
    image: "/parts/cowl-normal.jpg",
  },
];

// ── 검사 이력 ──
export const inspectionHistory = [
  { id: 50, partId: "INSP-50", date: "2026.06.03 20:57", part: "카울커버", status: "defect", actionStatus: "UNRESOLVED", line: "C라인" },
  { id: 49, partId: "INSP-49", date: "2026.05.17 10:30", part: "라디에이터 그릴", status: "normal", line: "C라인" },
  { id: 48, partId: "INSP-48", date: "2026.05.17 10:29", part: "테일 램프", status: "normal", line: "C라인" },
  { id: 47, partId: "INSP-47", date: "2026.05.17 10:28", part: "휀더", status: "defect", actionStatus: "UNRESOLVED", line: "C라인" },
  { id: 46, partId: "INSP-46", date: "2026.05.17 10:28", part: "도어", status: "normal", line: "C라인" },
  { id: 45, partId: "INSP-45", date: "2026.05.16 10:27", part: "범퍼", status: "normal", line: "C라인" },
  { id: 44, partId: "INSP-44", date: "2026.05.16 10:27", part: "헤드램프", status: "defect", actionStatus: "RESOLVED", line: "C라인" },
  { id: 43, partId: "INSP-43", date: "2026.05.16 10:26", part: "프레임", status: "normal", line: "C라인" },
  { id: 42, partId: "INSP-42", date: "2026.05.16 10:25", part: "카울커버", status: "normal", line: "C라인" },
  { id: 41, partId: "INSP-41", date: "2026.05.15 10:25", part: "라디에이터 그릴", status: "normal", line: "C라인" },
  { id: 40, partId: "INSP-40", date: "2026.05.15 10:24", part: "테일 램프", status: "resolved", actionStatus: "RESOLVED", line: "C라인" },
  { id: 39, partId: "INSP-39", date: "2026.05.15 10:24", part: "휀더", status: "normal", line: "C라인" },
  { id: 38, partId: "INSP-38", date: "2026.05.14 10:23", part: "도어", status: "normal", line: "C라인" },
  { id: 37, partId: "INSP-37", date: "2026.05.14 10:22", part: "범퍼", status: "normal", line: "C라인" },
  { id: 36, partId: "INSP-36", date: "2026.05.14 10:22", part: "헤드램프", status: "resolved", actionStatus: "RESOLVED", line: "C라인" },
  { id: 35, partId: "INSP-35", date: "2026.05.14 10:21", part: "프레임", status: "normal", line: "C라인" },
  { id: 247, partId: "DOOR-0247", date: "2026.03.28 14:30", part: "도어",           status: "defect", actionStatus: "RESOLVED" },
  { id: 246, partId: "BUMP-0246", date: "2026.03.28 14:15", part: "범퍼",           status: "normal" },
  { id: 245, partId: "HEAD-0245", date: "2026.03.28 13:55", part: "헤드램프",       status: "normal" },
  { id: 244, partId: "FRAM-0244", date: "2026.03.28 13:20", part: "프레임",         status: "resolved", actionStatus: "RESOLVED" },
  { id: 243, partId: "COWL-0243", date: "2026.03.28 11:45", part: "카울커버",       status: "normal" },
  { id: 242, partId: "GRIL-0242", date: "2026.03.28 10:30", part: "라디에이터 그릴", status: "normal" },
  { id: 241, partId: "TAIL-0241", date: "2026.03.28 09:15", part: "테일 램프",      status: "normal" },
  { id: 240, partId: "FEND-0240", date: "2026.03.27 17:40", part: "휀더",           status: "resolved", actionStatus: "RESOLVED" },
];

// ── 실시간 알림 ──
export const alertsData = [
  { id: 1, title: "불량 부품 감지", desc: "A라인 - 도어 불량 감지", time: "2분 전", read: false, inspectionId: 247 },
  { id: 2, title: "불량 부품 감지", desc: "B라인 - 휀더 불량 감지", time: "15분 전", read: false, inspectionId: 240 },
  { id: 3, title: "불량 부품 감지", desc: "A라인 - 프레임 불량 감지", time: "32분 전", read: false, inspectionId: 244 },
  { id: 4, title: "불량 부품 감지", desc: "B라인 - 도어 불량 감지", time: "45분 전", read: false, inspectionId: null },
  { id: 5, title: "불량 부품 감지", desc: "C라인 - 카울커버 불량 감지", time: "1시간 전", read: false, inspectionId: null },
  { id: 6, title: "불량 부품 감지", desc: "C라인 - 커넥터 불량 감지", time: "2시간 전", read: true, inspectionId: null },
  { id: 7, title: "불량 부품 감지", desc: "A라인 - 라디에이터 그릴 불량 감지", time: "33시간 전", read: true, inspectionId: null },
];

// ── AI 공정 분석 ──
export const analysisPatterns = [
  {
    title: "A라인 야간조 00~02시 불량 집중",
    severity: "높음",
    severityColor: "bg-error/10 text-error",
    borderColor: "border-[#F59E0B]",
    desc: 'A라인 야간조의 00:00~02:00 구간에서 도어 패널 위치 편차와 힌지 체결 불량이 주간 평균 대비 <strong class="text-error font-bold">3.2배</strong> 증가했습니다.',
  },
  {
    title: "C라인 카울커버 체결 불량 증가",
    severity: "중간",
    severityColor: "bg-secondary-container/20 text-on-secondary-container",
    borderColor: "border-[#F59E0B]",
    desc: '최근 7일 기준 C라인에서 카울커버 고정핀 미삽입, 체결 토크 부족, 장착부 단차 불량이 평균 대비 <strong class="text-on-secondary-container font-bold">1.8배</strong> 증가했습니다.',
  },
  {
    title: "B라인 교대 전후 30분 정렬 불량 증가",
    severity: "관찰",
    severityColor: "bg-slate-100 text-slate-500",
    borderColor: "border-slate-300",
    desc: 'B라인 주야 교대 전후 30분 동안 범퍼와 헤드램프 장착 정렬 불량이 <strong class="text-primary font-bold">15%</strong> 증가하는 추세가 관측되었습니다.',
  },
];

export const analysisRecommendations = [
  {
    num: 1,
    title: "A라인 야간조 00시 품질 게이트 신설",
    desc: "00:00 전후 도어 패널 10대 샘플을 치수 측정 대상으로 지정하고, 힌지 체결 토크와 기준핀 마모 상태를 확인한 뒤 라인 리더 승인 전까지 해당 로트 출하를 보류하세요.",
  },
  {
    num: 2,
    title: "C라인 카울커버 장착 공정 집중 점검",
    desc: "카울커버 고정핀 삽입 상태, 체결 토크, 장착부 단차를 작업자 확인 항목으로 추가하고 불량 발생 로트는 재작업 구역으로 분리하세요. 동일 불량이 반복되면 고정 지그와 체결 공구를 설비보전 점검 대상으로 등록하세요.",
  },
  {
    num: 3,
    title: "B라인 교대 인수인계 체크리스트 표준화",
    desc: "교대 전후 30분 동안 범퍼와 헤드램프 장착 기준점, 토크 렌치 캘리브레이션, 부품 투입 순서를 2인 확인 항목으로 관리하고 불량 발생 로트는 즉시 격리 후 재검하세요.",
  },
];


// ── 검사 결과 상세 ──
export const inspectionDetails = {
  50: { line: "C라인", detectionMethod: "자동 감지", shift: "주간", workerName: "진성훈", originalImage: "/defects/defect-original.jpg", gradcamImage: "/defects/defect-gradcam.jpg" },
  49: { line: "C라인", detectionMethod: "자동 감지", shift: "주간", workerName: "진성훈", originalImage: "/parts/frame-normal.png", gradcamImage: "/parts/frame-normal.png" },
  48: { line: "C라인", detectionMethod: "자동 감지", shift: "주간", workerName: "진성훈", originalImage: "/parts/frame-normal.png", gradcamImage: "/parts/frame-normal.png" },
  47: { line: "C라인", detectionMethod: "자동 감지", shift: "주간", workerName: "진성훈", originalImage: "/parts/frame-normal.png", gradcamImage: "/parts/frame-normal.png" },
  46: { line: "C라인", detectionMethod: "자동 감지", shift: "주간", workerName: "진성훈", originalImage: "/parts/frame-normal.png", gradcamImage: "/parts/frame-normal.png" },
  45: { line: "C라인", detectionMethod: "자동 감지", shift: "주간", workerName: "진성훈", originalImage: "/parts/frame-normal.png", gradcamImage: "/parts/frame-normal.png" },
  44: { line: "C라인", detectionMethod: "자동 감지", shift: "주간", workerName: "진성훈", originalImage: "/parts/frame-normal.png", gradcamImage: "/parts/frame-normal.png" },
  43: { line: "C라인", detectionMethod: "자동 감지", shift: "주간", workerName: "진성훈", originalImage: "/parts/frame-normal.png", gradcamImage: "/parts/frame-normal.png" },
  42: { line: "C라인", detectionMethod: "자동 감지", shift: "주간", workerName: "진성훈", originalImage: "/parts/frame-normal.png", gradcamImage: "/parts/frame-normal.png" },
  41: { line: "C라인", detectionMethod: "자동 감지", shift: "주간", workerName: "진성훈", originalImage: "/parts/frame-normal.png", gradcamImage: "/parts/frame-normal.png" },
  40: { line: "C라인", detectionMethod: "자동 감지", shift: "주간", workerName: "진성훈", originalImage: "/parts/frame-normal.png", gradcamImage: "/parts/frame-normal.png" },
  39: { line: "C라인", detectionMethod: "자동 감지", shift: "주간", workerName: "진성훈", originalImage: "/parts/frame-normal.png", gradcamImage: "/parts/frame-normal.png" },
  38: { line: "C라인", detectionMethod: "자동 감지", shift: "주간", workerName: "진성훈", originalImage: "/parts/frame-normal.png", gradcamImage: "/parts/frame-normal.png" },
  37: { line: "C라인", detectionMethod: "자동 감지", shift: "주간", workerName: "진성훈", originalImage: "/parts/frame-normal.png", gradcamImage: "/parts/frame-normal.png" },
  36: { line: "C라인", detectionMethod: "자동 감지", shift: "주간", workerName: "진성훈", originalImage: "/parts/frame-normal.png", gradcamImage: "/parts/frame-normal.png" },
  35: { line: "C라인", detectionMethod: "자동 감지", shift: "주간", workerName: "진성훈", originalImage: "/parts/frame-normal.png", gradcamImage: "/parts/frame-normal.png" },
  247: {
    line: "B라인", detectionMethod: "자동 감지",
    shift: "야간",
    workerName: "김소희",
    originalImage: "/parts/frame-normal.png",
    gradcamImage: "/parts/frame-normal.png",
  },
  246: {
    line: "A라인", detectionMethod: "자동 감지",
    shift: "주간",
    workerName: "김철수",
    originalImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBn15iBsYKdCLrLLVIdMbRCahxvhkyT-jJAouuJavUAONbTlC81UcEl-Tp_ot8Ymk6kCUrzRF4nU2wLSkgQ7JDIsibGI_x3s2cDMxrcPyyU6OxNBvWdMGawJATRPNhQ4GpGfuPJ8GfNVpLDhGZHOPRv8UKQ6-uJX6aLFk5MObyx1Rk_3O3rpgfYExMRzWTu4Vo8GFO6p73RvLuJorDCK5G4TNd5zdTzL39RuxY8h3rqaio1SIIG0JM44W0GwFmGmqwZ9lFlhTC8Jq8",
    gradcamImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBn15iBsYKdCLrLLVIdMbRCahxvhkyT-jJAouuJavUAONbTlC81UcEl-Tp_ot8Ymk6kCUrzRF4nU2wLSkgQ7JDIsibGI_x3s2cDMxrcPyyU6OxNBvWdMGawJATRPNhQ4GpGfuPJ8GfNVpLDhGZHOPRv8UKQ6-uJX6aLFk5MObyx1Rk_3O3rpgfYExMRzWTu4Vo8GFO6p73RvLuJorDCK5G4TNd5zdTzL39RuxY8h3rqaio1SIIG0JM44W0GwFmGmqwZ9lFlhTC8Jq8",
  },
  245: {
    line: "B라인", detectionMethod: "자동 감지",
    shift: "주간",
    workerName: "대풍근",
    originalImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTsgMsao6Y0yFrryOjcI9n9z3IWvQW9JtZN1l0fRffoTt_ApywE4zL8WGxNzfXrcl5oLCwctAv6UsOf7qpnsQNAdM36OeaHa9wAuP8EM3MiT2_6eVEUR8AmY_p4fZfe_MQGY0Rrjv0zAYywaR9yMdJGNVUhvoFBHFvYZmgSpHKn_dH3Z47CIqLTITZvYW4r-K8o9vvy9mXow6BVt1NoqziIukFY2H4N5Z6zSuw7K4HWurSzy5Vl_CDUU7Ip3_ZnP7Es719gdbauJg",
    gradcamImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTsgMsao6Y0yFrryOjcI9n9z3IWvQW9JtZN1l0fRffoTt_ApywE4zL8WGxNzfXrcl5oLCwctAv6UsOf7qpnsQNAdM36OeaHa9wAuP8EM3MiT2_6eVEUR8AmY_p4fZfe_MQGY0Rrjv0zAYywaR9yMdJGNVUhvoFBHFvYZmgSpHKn_dH3Z47CIqLTITZvYW4r-K8o9vvy9mXow6BVt1NoqziIukFY2H4N5Z6zSuw7K4HWurSzy5Vl_CDUU7Ip3_ZnP7Es719gdbauJg",
  },
  244: {
    line: "A라인", detectionMethod: "자동 감지",
    shift: "야간",
    workerName: "신동주",
    originalImage: "/parts/frame-normal.png",
    gradcamImage: "/parts/frame-normal.png",
  },
  243: {
    line: "A라인", detectionMethod: "자동 감지",
    shift: "주간",
    workerName: "김철수",
    originalImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_TewelQ0qEhHYq_78uHst9o-oOdXrUDtZhNEyrEEHznO9C0eITWIQGb8uQ4UHNS08TJ_VPqYmdBqO9Uuabui8ktLvaUwRV_hdcBHG0gqhHmVYCzxZA9vMuOtK3gcPW6IkTPcK6slJprMCUHfWF-qneX_xuFRs8JsgzddKUygERVoCyrpqtotO9TjnJyzazzbXVpzMr0eFR43-tIr8dLUQMb-YdVEjX2E5T8pHrqB_TcBDckMn54N6r91W5Bzbz3jMd8M1jaqZFkc",
    gradcamImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_TewelQ0qEhHYq_78uHst9o-oOdXrUDtZhNEyrEEHznO9C0eITWIQGb8uQ4UHNS08TJ_VPqYmdBqO9Uuabui8ktLvaUwRV_hdcBHG0gqhHmVYCzxZA9vMuOtK3gcPW6IkTPcK6slJprMCUHfWF-qneX_xuFRs8JsgzddKUygERVoCyrpqtotO9TjnJyzazzbXVpzMr0eFR43-tIr8dLUQMb-YdVEjX2E5T8pHrqB_TcBDckMn54N6r91W5Bzbz3jMd8M1jaqZFkc",
  },
  242: {
    line: "B라인", detectionMethod: "자동 감지",
    shift: "주간",
    workerName: "대풍근",
    originalImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBidQTY-xjd-WNMe3bW_kV1VcGe2QDQEp2PQeFPC1bDyra_pQwbPdJU4iB4bIm8bOKXwxZxiVZzNZwnYQoJP59RqGw6ZwFWWmHMdxbC-xaAluTFoJfOex6hblZLlpUr3s7s-RqlKqI02vW0MBxKqqLHzxBuEqV-bvrAAAJzYxAcEjMvVu421TjsWJ5o3XtWJB7dNVtRPeN5E_5ymt3LarztdtISxLqSGob_kL98Xk51HOX_hxXVdvhtBDYPb5fZ6szQjWgU5oIyTR0",
    gradcamImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBidQTY-xjd-WNMe3bW_kV1VcGe2QDQEp2PQeFPC1bDyra_pQwbPdJU4iB4bIm8bOKXwxZxiVZzNZwnYQoJP59RqGw6ZwFWWmHMdxbC-xaAluTFoJfOex6hblZLlpUr3s7s-RqlKqI02vW0MBxKqqLHzxBuEqV-bvrAAAJzYxAcEjMvVu421TjsWJ5o3XtWJB7dNVtRPeN5E_5ymt3LarztdtISxLqSGob_kL98Xk51HOX_hxXVdvhtBDYPb5fZ6szQjWgU5oIyTR0",
  },
  241: {
    line: "C라인", detectionMethod: "자동 감지",
    shift: "야간",
    workerName: "김근호",
    originalImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCrio6VIQH55KPpKDA6VGgkF1jbxwYL_ILzzbCxWKNP4K4Zce5RVVUl4XPgSPU_aJnvmaP0NBUm1lydgJWR6VbBBTcKQ5IyExEfLFAqC5ntajZTikhE83De63Bzw0GCJ-wkVGg4lRhF2pk1DIlKt9nUQBSXW77TLCPN9vSWkvbNn3cBcyUF8aQYiNAgRnKOR0aESl--E2ZFxMRNPhc52DZqjNey7tYFQN_aiCLdEPVD1qKEc_gSIGAeOxUsJFLyVETFUl3X3StGrs",
    gradcamImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCrio6VIQH55KPpKDA6VGgkF1jbxwYL_ILzzbCxWKNP4K4Zce5RVVUl4XPgSPU_aJnvmaP0NBUm1lydgJWR6VbBBTcKQ5IyExEfLFAqC5ntajZTikhE83De63Bzw0GCJ-wkVGg4lRhF2pk1DIlKt9nUQBSXW77TLCPN9vSWkvbNn3cBcyUF8aQYiNAgRnKOR0aESl--E2ZFxMRNPhc52DZqjNey7tYFQN_aiCLdEPVD1qKEc_gSIGAeOxUsJFLyVETFUl3X3StGrs",
  },
  240: {
    line: "C라인", detectionMethod: "자동 감지",
    shift: "주간",
    workerName: "진성훈",
    originalImage: "/parts/frame-normal.png",
    gradcamImage: "/parts/frame-normal.png",
  },
};

// ── 계정 관리 ──
export const accountUsers = [
  { name: "김철수", userId: "kimcs",  role: "worker", line: "A라인", shift: "주간" },
  { name: "김소희", userId: "kimsh",  role: "worker", line: "B라인", shift: "야간" },
  { name: "안용준", userId: "anyj",   role: "admin",  line: "-",    shift: "-"   },
  { name: "진성훈", userId: "jinsh",  role: "worker", line: "C라인", shift: "주간" },
  { name: "신동주", userId: "shindj", role: "worker", line: "A라인", shift: "야간" },
  { name: "홍길동", userId: "daepg",  role: "worker", line: "B라인", shift: "주간" },
  { name: "김철수", userId: "kimej",  role: "admin",  line: "-",    shift: "-"   },
  { name: "김영희", userId: "kimgh",  role: "worker", line: "C라인", shift: "야간" },
];
