# AgentGo Creative Frontend

AI 기반 이미지 생성 및 편집 플랫폼의 프론트엔드입니다.
대시보드, 템플릿 빌더, 이미지 에디터, DAM(Digital Asset Management) 화면으로 구성됩니다.

---

## 전체 시스템 구조

```
[Frontend (본 레포)]  →  [Backend]  →  [AI Service]  →  [Google Gemini API]
     :5173                 :8000          :8080
```

- **Frontend** (본 레포): React + TypeScript 기반 SPA
- **Backend** (`ai-creative-backend`): FastAPI 기반 REST API, PostgreSQL 데이터 관리
- **AI Service** (`AgentGo-Creative-MVP`): Gemini 기반 이미지 생성·변환 처리

---

## 기술 스택

| 분류       | 라이브러리           | 버전    |
| ---------- | -------------------- | ------- |
| Framework  | React + TypeScript   | 19      |
| Build Tool | Vite                 | 7.3.1   |
| Canvas     | Konva + react-konva  | 10.2.0  |
| State      | Zustand              | 5.0.11  |
| Routing    | react-router-dom     | 7.13.0  |
| Styling    | Tailwind CSS v4      | 4.1.18  |
| UI         | Radix UI + shadcn/ui | —       |
| Icons      | Lucide React         | 0.563.0 |

---

## 시작하기

### 사전 요구사항

- Node.js 20+
- npm

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# 린트
npm run lint
```

### 환경변수 (`.env`)

```env
VITE_API_URL=http://localhost:8000
VITE_DAM_USE_DEV_DUMMY=true
```

---

## 화면 구성

| 경로        | 페이지        | 인증   | 설명                           |
| ----------- | ------------- | ------ | ------------------------------ |
| `/login`    | LoginPage     | 불필요 | 이메일/비밀번호 로그인         |
| `/`         | DashboardPage | 필요   | 최근 프로젝트, 즐겨찾기 템플릿 |
| `/template` | TemplatePage  | 필요   | AI 이미지 생성 설정            |
| `/editor`   | EditorPage    | 필요   | 캔버스 기반 이미지 편집기      |
| `/dam`      | DAMPage       | 필요   | 디지털 에셋 관리               |
| `/*`        | —             | —      | `/login`으로 리다이렉트        |

---

## 주요 기능

### 대시보드 (`/`)

- 최근 프로젝트 목록 사이드바 (접기/펼치기)
- 즐겨찾기 템플릿 목록
- "Create Now" 버튼 → 에디터 이동
- 유저카드 (로그아웃, DAM 이동)

### 템플릿 빌더 (`/template`)

- 이미지 업로드
- 타겟 키워드 설정 (최대 5개 + 프리셋)
- 컨셉/프롬프트 텍스트 입력
- 사이즈 선택 (1:1, 4:5, 16:9, 9:16)
- 레퍼런스 이미지 업로드 (최대 10개)
- AI 이미지 생성 (폴링: 30회, 2초 간격)
- 생성 완료 시 에디터로 자동 이동
- 실패/타임아웃 시 인라인 오류 메시지 표시

### 이미지 에디터 (`/editor`)

#### 캔버스

- 이미지 업로드 시 원본 비율 유지, 정중앙 렌더링
- Pan/Zoom 지원
- 브레드크럼 네비게이션

#### 편집 도구

| 도구              | 기능                                      |
| ----------------- | ----------------------------------------- |
| 선택 (Mouse)      | 클릭 선택 + 드래그 캔버스 이동 (pan)      |
| 펜                | 굵기/색상 선택, 자유 드로잉               |
| 지우개            | 굵기 조절, 지우기                         |
| 도형 (Diagram)    | 16가지 도형 추가                          |
| 객체 선택 (Shape) | 바운딩박스 / 라소(자유형) 다중 선택       |
| 텍스트            | 폰트/크기/스타일/색상/정렬/특수문자(72개) |

#### 텍스트 옵션

- 외곽선 (색상/굵기)
- 그림자 (방향/거리/불투명도/흐림)
- 세로쓰기
- 글자 간격, 줄높이, 스케일
- 글머리기호 (없음/순번/점)

#### 단축키

- `Ctrl+Z`: 실행 취소 (Undo)
- `Ctrl+Y` / `Ctrl+Shift+Z`: 다시 실행 (Redo)
- `Delete` / `Backspace`: 선택 객체 삭제

#### 작업이력

- 최대 20개 저장
- 클릭으로 해당 시점 복원

#### AI 프롬프트

- 텍스트 프롬프트 입력
- 레퍼런스 이미지 최대 10개 첨부

### DAM (`/dam`)

- 폴더 트리 사이드바 (고정 폴더 + 동적 폴더)
- Grid / List View 전환
- 파일 타입 아이콘 (이미지/영상/PDF/ZIP 등)
- 컨텍스트 메뉴: 상세정보, 다운로드, 이름 변경, 권한 설정, 복사, 삭제
- 에셋 상세 모달: 미리보기 + Asset Information(Basic/Advanced/Tags/Workfront) 편집
- 필터: 파일 유형 / 사용자 / 날짜 (DatePicker)
- 에셋 업로드 모달: 파일 업로드 + Asset Information(메타데이터) 입력
- 검색 기능
- 고급 필터: 상태/파일 타입/MIME 타입
- 권한 설정 모달: 접근 레벨 추가/변경/삭제 UI
- 업로드 AI 분석 영역: 진행률 + Category/Value/Reason 테이블
- 상세 정보 Tags 탭: Reason 툴팁 UI
- My Workspace: 업무 탭/테이블 + 상세 드로어 + 상태 변경
- Collections: 컬렉션 배너 + 공유 링크 생성
- Rich Media: 비디오 속도 오버레이 + Smart Crop 비율 프리셋
- Creative 연계 패널: 우측 미니 그리드 + Drag payload
- 개발환경(`npm run dev`)에서는 DAM API가 더미 데이터로 동작 (`VITE_DAM_USE_DEV_DUMMY=false`로 실서버 호출 전환 가능)

---

## 프로젝트 구조

```
src/
├── assets/                     # SVG 아이콘 및 정적 리소스
├── commons/
│   ├── components/            # 여러 feature에서 재사용하는 공용 UI
│   ├── types/                 # 공통 API/도메인 타입
│   └── utils/                 # 토큰, 폰트, 이미지 헬퍼 등
├── components/
│   └── ui/                    # shadcn/ui 컴포넌트 (이동/수정 금지 대상)
├── features/
│   ├── auth/
│   │   ├── api/
│   │   ├── constants/
│   │   ├── queries/
│   │   └── types.ts
│   ├── dam/
│   │   ├── api/
│   │   ├── components/
│   │   └── types.ts
│   ├── dashboard/
│   │   └── components/
│   ├── editor/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── utils/
│   │   └── types.ts
│   ├── project/
│   │   ├── api/
│   │   ├── queries/
│   │   └── types.ts
│   └── template/
│       ├── api/
│       ├── components/
│       ├── constants/
│       ├── hooks/
│       ├── queries/
│       ├── utils/
│       └── types.ts
├── lib/
│   ├── queryClient.ts         # React Query QueryClient
│   └── utils.ts               # shadcn/ui util (cn)
├── pages/                      # 라우트 단위 페이지 컴포넌트
├── providers/
│   └── QueryProvider.tsx      # QueryClientProvider 래퍼
├── router/
│   └── index.tsx              # BrowserRouter + protected routes
├── services/
│   └── axiosInstance.ts       # 공용 axios 인스턴스
├── App.tsx                    # AppRouter 연결
├── main.tsx                   # React DOM 진입점
└── index.css                  # 글로벌 스타일 + Tailwind 테마
```

### 구조 원칙

- `pages`는 페이지 조합만 담당하고 실제 화면 로직은 `features/*`에서 가져옵니다.
- 공통으로 재사용되는 컴포넌트/유틸/타입만 `commons/*`에 둡니다.
- `components/ui`와 `lib/utils.ts`는 shadcn/ui 영역으로 유지합니다.
- API 호출은 각 feature의 `api`, 서버 상태는 `queries`, 로컬 상태는 `store` 또는 hook으로 분리합니다.

---

## 아키텍처

### 라우팅

- `src/router/index.tsx`에서 React Router v7 라우트를 관리합니다.
- 로그인 이외의 라우트는 `PrivateRoute`로 보호합니다.
- 인증된 라우트에는 `Layout`이 공통 래퍼로 적용됩니다.
- Query Parameters로 에디터 브레드크럼 정보를 전달합니다.

### 상태 관리

- React Query: 서버 상태 캐싱/동기화
- Zustand: 에디터 색상 히스토리 (최근 7색)
- Canvas: `forwardRef + useImperativeHandle` 기반 로컬 상태 제어
- `EditorPage`에서 history, canvas image 여부, 선택 텍스트 상태를 상위에서 조정합니다.

### API 통신

- 모든 HTTP 요청은 `src/services/axiosInstance.ts`를 사용합니다.
- Bearer 토큰을 자동 포함합니다.
- 401 응답 시 refresh token 재발급을 시도합니다.
- refresh 실패 시 토큰을 정리하고 로그인 흐름으로 복귀합니다.
- 파일 업로드는 `FormData` 기반으로 처리합니다.

### React Query 규칙

- QueryClient는 `src/lib/queryClient.ts`에 있습니다.
- Query Provider는 `src/providers/QueryProvider.tsx`에서 앱 전체에 주입합니다.
- Query Hook은 각 feature의 `queries/` 아래에서 관리합니다.
- Query Key는 feature 단위 prefix를 사용합니다. 예: `['project', 'recent']`
- 신규 Query/Mutation은 feature `api/` 함수와 1:1로 연결하는 것을 기본 규칙으로 합니다.

### 캔버스 구현

- Konva Stage + 멀티 레이어 (선, 도형, 텍스트, 배경)
- 스냅샷/복원 패턴 기반 Undo/Redo
- 선택 도구 활성화 시 Pan 지원

### Import 규칙

- 경로 별칭은 `@/* -> src/*`를 사용합니다.
- feature 내부에서도 깊은 상대경로보다 `@/features/...`, `@/commons/...` import를 우선합니다.
- shadcn 컴포넌트 import는 `@/components/ui/*`를 유지합니다.

---

## Docker 실행

```bash
# 빌드 (VITE_API_URL을 빌드 인자로 전달)
docker build --build-arg VITE_API_URL=http://localhost:8000 -t agentgo-front .

# 실행 (nginx로 정적 파일 서빙, 포트 80)
docker run -d -p 3000:80 agentgo-front
```

> Dockerfile은 멀티 스테이지 빌드 (Node → nginx)를 사용합니다.

---

## 개발 현황

| 항목                                                                   | 상태   |
| ---------------------------------------------------------------------- | ------ |
| 로그인 (JWT 인증)                                                      | 완료   |
| 대시보드 (프로젝트/템플릿)                                             | 완료   |
| 템플릿 빌더 (AI 생성)                                                  | 완료   |
| 이미지 에디터 (캔버스/도구/이력)                                       | 완료   |
| DAM (폴더/에셋/검색/필터/권한/Asset Information/Workspace/Collections) | 진행중 |
| API 서비스 레이어                                                      | 완료   |
| 테스트                                                                 | 미착수 |

---

## 보안 참고사항

- 로그인은 실제 백엔드 API를 통해서만 처리됩니다 (개발용 우회 없음).
- API 호출 중 401 응답 수신 시 토큰이 자동 삭제되고 로그인 화면으로 리다이렉트됩니다.
- blob URL(`base64ToBlobUrl`) 사용 후에는 반드시 `revokeBlobUrl(url)`을 호출하여 메모리를 해제해야 합니다.
