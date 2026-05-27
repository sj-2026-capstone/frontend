# 프론트엔드 명세

## 프로젝트 개요

이 저장소는 AI 기반 자동차 부품 검사 시스템의 프론트엔드 애플리케이션이다. React, Vite, Tailwind CSS, react-router-dom을 사용한다.

현재 코드는 백엔드 API 연동을 기본 전제로 두고, 필요할 때 `VITE_USE_MOCK_API=true`로 기존 mock 화면을 유지할 수 있게 구성되어 있다. API 응답은 화면 컴포넌트에서 직접 다루지 않고 `src/adapters/`에서 화면용 데이터 shape로 변환한다.

## 실행 스크립트

- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션 빌드
- `npm run lint`: ESLint 검사
- `npm run preview`: 빌드 결과 미리보기

## 환경 변수

`.env.example`의 현재 기본값은 API 모드다.

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_USE_MOCK_API=false
```

- `VITE_USE_MOCK_API=false`: 백엔드 API 호출을 사용한다.
- `VITE_USE_MOCK_API=true`: 기존 mock 데이터와 역할 선택 로그인을 사용한다.
- 실제 `.env` 파일은 커밋하지 않고, 필요할 때 `.env.example`을 복사해 사용한다.

## API 연동 구조

API 호출 코드는 `src/api/`에 둔다.

- `client.js`: fetch 기반 공통 클라이언트, API URL 정규화, 공통 헤더, 토큰 주입, `CommonResponse<T>` 처리
- `config.js`: `VITE_API_BASE_URL`, `VITE_USE_MOCK_API`, localStorage 인증 키 관리
- `auth.js`: 로그인, 내 정보 조회, 비밀번호 변경
- `accounts.js`: 계정 목록, 상세, 생성, 수정, 상태 변경, 요약, loginId 중복 확인
- `lines.js`: 라인 목록과 라인 상세 조회
- `shifts.js`: 교대조 목록, 상세, 배정 조회
- `inspections.js`: 검사 목록, 상세, 상태 조회, 불량 유형 보고와 조치 완료 처리, 분석 시작
- `notifications.js`: 알림 목록, 미확인 개수, 읽음 처리, 전체 읽음, SSE 구독
- `dashboard.js`: 관리자 대시보드 통합 조회

공통 클라이언트는 백엔드의 `{ success, message, data }` 응답에서 `data`를 반환한다. 저장된 토큰이 있으면 `Authorization: Bearer <token>` 헤더를 자동으로 붙이고, ngrok 개발 환경을 위해 `ngrok-skip-browser-warning: true` 헤더를 함께 보낸다. 네트워크 오류나 API 오류는 `Error`로 변환해 화면에 전달한다.

## Adapter 규칙

API 응답은 화면에서 직접 쓰지 않고 `src/adapters/`에서 기존 화면이 기대하는 shape로 변환한다.

- `adapters/accounts.js`: 계정 목록 응답을 `name`, `userId`, `role`, `line`, `shift` row 형태로 변환
- `adapters/dashboard.js`: `summary`, `actionSummary`, `defectRateTrend`, `lineDefectRates`를 KPI, 추이, 조치 현황, 라인별 불량률 형태로 변환한다. 조치 현황은 `total`, `unresolvedCount`, `resolvedCount`, `completionRate`를 우선 사용한다.
- `adapters/inspections.js`: 검사 목록/상세 응답을 이력 row와 상세 화면 데이터로 변환하고, 백엔드 이미지 경로를 API base URL 기준으로 정규화한다. 검사 결과(`status`, `hasDefect`), 조치 상태(`actionStatus`), 작업자가 보고한 불량 유형(`defectType`)은 별도 필드로 유지한다.
- `adapters/lines.js`: 라인 응답을 A-D 공장 도면 라인 상태로 변환하고, 알림 이벤트로 특정 라인을 alarm 상태로 갱신
- `adapters/notifications.js`: 알림 목록 응답을 `alertsData`와 호환되는 형태로 변환

이 규칙은 기존 화면 구조와 스타일 변경을 최소화하면서 API 응답 변경 영향을 어댑터에 모으기 위한 기준이다.

## 인증 상태

`src/contexts/AuthContext.jsx`는 `role`, `login`, `logout` 인터페이스를 유지하면서 API 인증 상태를 함께 관리한다.

- `accessToken`: 백엔드 로그인 성공 시 받은 토큰
- `user`: 로그인 사용자 정보
- `role`: 보호 라우트와 로그인 후 이동에 사용하는 역할 값
- `isAuthenticated`: 토큰 존재 여부
- `isMockApi`: 현재 mock/API 모드 여부

mock 모드에서는 역할 선택 로그인으로 동작한다. API 모드에서는 로그인 폼의 ID/PW를 `loginId/password`로 보내 `POST /api/auth/login`을 호출한다. 로그인 성공 값은 localStorage에 저장해 새로고침 후에도 유지한다.

## 화면별 연동 상태

- 로그인: mock 모드에서는 worker/admin 역할 선택, API 모드에서는 백엔드 로그인 호출 후 admin은 `/dashboard`, 그 외 역할은 `/monitoring`으로 이동
- 대시보드: `GET /api/dashboard`로 KPI, 최근 7일 불량률 추이, 조치 현황, 라인별 불량률을 표시한다. `actionSummary`는 전체 불량, 미처리, 조치 완료, 처리율로 표시한다. 불량률 추이는 SVG 기반 고해상도 라인 차트로 그리며 축 눈금, 평균선, 값 라벨, 면 그래디언트를 함께 표시한다.
- 실시간 모니터링: `GET /api/lines`로 라인 상태를 조회하고, 공장 도면 대신 검사 영상 피드형 화면으로 A라인 도어, B라인 범퍼, C라인 프레임 검사 영상을 표시한다. `GET /api/inspections?page=0&size=50&status=DONE` 결과에서 최근 불량 감지 내역을 compact 패널로 함께 표시한다.
- 실시간 모니터링 알림 반영: `GET /api/notifications/subscribe` SSE를 구독하고 `notification` 이벤트가 불량 감지 알림이면 해당 라인을 alarm 상태로 갱신한다. 알림에서 라인을 식별하지 못하면 라인 목록을 다시 조회한다.
- 검사 상세: `GET /api/inspections/:inspectionId`로 원본 이미지, AI 분석 이미지, 부품/라인/불량 유형 메타데이터를 표시한다. confidence 값은 화면에 표시하지 않는다. 불량 검사에서는 작업자가 불량 유형을 선택한 뒤 보고 제출 버튼을 누르면 `PATCH /api/inspections/:inspectionId/action`에 `{ defectType }`을 함께 보내고, 성공 시 화면 상태를 조치완료로 갱신한다.
- 검사 이력: `GET /api/inspections`를 페이지네이션, 라인, 상태 필터와 함께 호출한다. 상태 필터 값은 `PENDING`, `PROCESSING`, `DONE`, `FAILED`를 사용한다. 응답의 `actionStatus`가 `UNRESOLVED`면 미처리, `RESOLVED`면 조치완료로 표시한다.
- 알림: `GET /api/notifications`, `GET /api/notifications/unread-count`, `PATCH /api/notifications/:id/read`, `PATCH /api/notifications/read-all`을 사용한다. 전체/미확인/확인완료 탭을 제공한다.
- 계정 관리: 계정 목록, 계정 요약, 라인, 교대조를 함께 조회한다. 계정 생성 폼은 필수값, 비밀번호 8자 이상, 비밀번호 확인, 작업자 라인/교대조 선택을 검증한다.
- 계정 생성: `POST /api/admin/accounts`에 `userName`, `loginId`, `email`, `phone`, `password`, `confirmPassword`, `role`, `lineId`, `shiftId`를 보낸다. `GET /api/admin/accounts/login-id/availability?loginId=...`로 loginId 중복 확인을 수행한다.
- AI 공정 분석: 현재는 `src/data/mockData.js`의 분석 패턴과 추천 조치 데이터를 사용한다.

API 실패 시 앱 전체가 흰 화면으로 죽지 않도록, 연결된 화면 상단에 오류 메시지를 표시한다. 화면에 따라 API 모드에서는 빈 목록을 표시하거나, mock 모드에서만 mock 데이터를 사용한다.

## 라우트

- `/login`: 로그인
- `/dashboard`: 관리자 대시보드
- `/monitoring`: 실시간 모니터링
- `/inspection/:id`: 검사 상세
- `/history`: 검사 이력
- `/alerts`: 알림
- `/analysis`: AI 공정 분석
- `/accounts`: 계정 관리
- `*`: `/login`으로 리다이렉트



검증할 때 우선 확인할 범위:

- `npm run lint`
- `npm run build`
- Inspection status treats backend `hasDefect` as the defect signal. When `status` is `DONE` and `hasDefect` is true, the inspection is displayed as a defect.
- Inspection detail backend-origin images are loaded through `apiBlobRequest` before rendering so requests can include `ngrok-skip-browser-warning: true`.
- The detail page renders object URLs for fetched images and falls back to the original URL if the Blob load fails.
- Monitoring camera mode uses local image sequences under `public/cctv/door`, `public/cctv/bumper`, and `public/cctv/frame`; `FactoryFloorMap` rotates frames every few seconds and applies alarm styling/click-through when a line is in alarm state.
- API 모드에서 `POST /api/auth/login` 후 토큰 저장 및 역할별 이동
- `/api/lines`, `/api/inspections`, `/api/notifications/subscribe`, `/api/dashboard`, `/api/admin/accounts`, `/api/shifts` 호출
- Field worker real-time defect notification flow has been manually confirmed.
- Admin dashboard subscribes to the same notification SSE and shows a top defect alert panel when a defect notification is received. The old manual alert demo button has been removed.
- Monitoring recent defect detections use inspection image URLs instead of a hard-coded mock thumbnail. If the list response does not include an image, the page fetches the recent defect inspection details and uses the same original image shown on `/inspection/:id`; mock mode also links defect detections to `inspectionDetails[inspectionId].originalImage`.
- Inspection detail defect reports use defect type options collected from `C:\Users\dydwn\Desktop\Capstone\차 부품 정상 불량\새 폴더` subfolder names. The current options are `스크래치`, `외관손상`, `단차`, `장착불량`, `고정핀`, `연계`, `유격`, `체결`, `실링`, `외관`, `헤밍`, `홀`, `외관 손상`.
- Next manual verification target is the admin flow: `/dashboard`, `/accounts`, `/analysis`, `/alerts`, and shared `/history`.
- mock 모드에서 worker/admin 로그인과 주요 화면이 기존 mock 데이터로 열리는지 확인
