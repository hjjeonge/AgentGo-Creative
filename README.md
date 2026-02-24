# AgentGo Creative

AI 기반 이미지 생성 및 편집 플랫폼 프론트엔드입니다.
대시보드, 템플릿, 이미지 에디터, DAM(Digital Asset Management) 화면으로 구성됩니다.

---

## 기술 스택

| 분류 | 라이브러리 |
|------|-----------|
| 프레임워크 | React 18 + TypeScript + Vite |
| 캔버스 | Konva / react-konva |
| 상태관리 | Zustand |
| 스타일 | Tailwind CSS v4 |
| 라우팅 | react-router-dom |
| UI | Radix UI Select |

---

## 시작하기

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

---

## 화면 구성

| 경로 | 화면 |
|------|------|
| `/` | 로그인 |
| `/dashboard` | 대시보드 |
| `/template` | 템플릿 생성 |
| `/editor` | 이미지 에디터 |
| `/dam` | DAM (Digital Asset Management) |

> 테스트 계정: `cloit.genai@itcen.com` / `password`

---

## 구현 현황

### 대시보드
- 최근 프로젝트 목록 사이드바 (접기/펼치기)
- 즐겨찾기 템플릿 목록
- Create Now 버튼 → 에디터 이동
- 유저카드 (로그아웃, DAM 이동)

### 템플릿 (02)
- 이미지 업로드, 타겟 설정(최대 5개 + 직접 추가), 컨셉 입력, 사이즈 선택, 레퍼런스 업로드
- 필수 항목 미입력 시 버튼 비활성화

### 이미지 에디터 (03)

#### 캔버스
- 이미지 업로드 시 원본 비율 유지하며 정중앙 렌더링 (이미지 없을 때 플레이스홀더 표시)
- 브레드크럼 (홈 > 이미지 에디터)

#### 편집 도구
| 도구 | 기능 |
|------|------|
| 선택(mouse) | 클릭 선택 + 드래그로 캔버스 이동(pan) |
| 펜 | 굵기/색상 선택, 자유 드로잉 |
| 지우개 | 굵기 선택, 지우기 |
| 도형 선택(diagram) | 16가지 도형 추가 |
| 객체 선택(shape) | **정사형(바운딩박스)** / **자유형(라소)** 두 가지 모드, 영역 내 객체 다중 선택 |
| 텍스트 | 폰트/크기/스타일/색상/정렬/특수문자(72개) 편집 |

#### 편집 일반
- `Delete` / `Backspace`: 선택 객체 삭제 (다중 선택 포함)
- `Ctrl+Z`: 실행 취소 (Undo)
- `Ctrl+Y` / `Ctrl+Shift+Z`: 다시 실행 (Redo)

#### 텍스트 옵션
- 외곽선 (색상/굵기), 그림자 (방향/거리/불투명도/흐림), 세로쓰기
- 글자 간격, 줄높이, 스케일 조정
- 글머리기호 (없음/순번/점)

#### 작업이력
- 최대 20개 저장, 클릭으로 해당 작업 복원
- 20개 초과 시 alert

#### 프롬프트
- AI 이미지 생성 요청 텍스트 입력
- 레퍼런스 이미지 최대 10개 첨부 (카운터 n/10 표시, 10개 달성 시 버튼 비활성화)
- 입력값 없으면 전송 버튼 비활성화

### DAM (Digital Asset Management)
- 폴더 트리 사이드바 (고정 폴더 + 브레드크럼)
- Grid / List View 전환
- 파일 타입 아이콘 (이미지/영상/PDF 등)
- 컨텍스트 메뉴: 상세정보, 다운로드, 이름 변경, 복사, 삭제
- 에셋 상세 팝업: 미리보기(이미지/영상/PDF), 메타데이터 편집
- 필터: 파일 유형 / 사용자 / 날짜 (DatePicker)
- 에셋 추가 팝업: 파일 업로드 + 메타데이터 입력

---

## 폴더 구조

```
src/
  assets/          이미지/아이콘 리소스
  components/
    commons/       공용 컴포넌트 (ColorPicker, SwitchAccordion 등)
    dashboard/     대시보드 컴포넌트
    dam/           DAM 컴포넌트
    editor/        에디터 핵심 UI/로직
      Canvas.tsx         캔버스 상태 관리 (forwardRef)
      EditorCanvas.tsx   Konva Stage 렌더링
      Toolbar.tsx        편집 도구 선택 바
      TextEditor.tsx     텍스트 속성 편집 패널
      SpecialCharPopup.tsx  특수문자 입력 팝업
      Prompt.tsx         AI 프롬프트 입력
      HistoryPanel.tsx   작업이력 패널
    icons/         아이콘 컴포넌트
    ui/            UI 프리미티브
  pages/           라우팅 페이지
  store/           Zustand 전역 상태
  types/
    editor.ts      CanvasHandle / CanvasSnapshot / HistoryEntry 타입
  utils/           유틸리티 함수 (fontLoader 등)
feature list/      기능 명세 CSV
```

---

## 아키텍처 메모

- `Canvas`는 `forwardRef`로 `CanvasHandle` 노출 (`getSnapshot`, `restoreSnapshot`, `setBackgroundImage`, `hasImage`, `clearCanvas`)
- `EditorPage`가 history, hasCanvasImage 등 상태 관리 후 자식 컴포넌트에 전달
- 이미지 업로드 시 자연 크기 기반으로 Stage 크기 계산 (최대 영역 비율 유지)
- Undo/Redo는 `undoStack` / `redoStack` ref 배열로 관리 (lines, shapes, texts, backgroundImage 스냅샷)
- 선택 도구 pan: `Stage.draggable={activeTool === "mouse"}`, `getRelativePointerPosition()`으로 pan 오프셋 반영

---

## BE 연동 대기 항목 (Phase 2)

- 로그인 API / 로그아웃 API / 유저 프로필 조회
- 이미지 생성 요청 API
- 프로젝트 저장/조회 API
- 작업이력 서버 저장/조회
- 템플릿 목록 조회/추가/삭제 API
- DAM 전 항목 (현재 로컬 목업 데이터 사용)